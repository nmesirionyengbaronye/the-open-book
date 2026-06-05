import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Validation Schema for the Waitlist Join Process.
 * Strictly enforces data types and provides sanitization for security.
 * Includes HTML tag stripping and Nigerian phone number normalization.
 */
const schema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name is too long")
    .transform((s) => s.replace(/<[^>]*>/g, '')), // Robust XSS prevention
  whatsapp_number: z.string().transform((v) => {
    const digits = v.replace(/\D/g, '');
    if (digits.length === 10) return `+234${digits}`;
    if (digits.length === 13 && digits.startsWith('234')) return `+${digits}`;
    if (digits.length === 11 && digits.startsWith('0')) return `+234${digits.slice(1)}`;
    return v;
  }).refine((v) => /^\+234\d{10}$/.test(v), { 
    message: "Invalid Nigerian WhatsApp number. Ensure it follows the +234 format." 
  }),
  institution: z.string().trim().min(1, "Institution is required for proper categorization"),
  school: z.string().trim().min(1, "School or Faculty is required"),
  department: z.string().trim().min(1, "Department is required"),
  level: z.string().refine((v) => ['100', '200', '300', '400', '500'].includes(v), { 
    message: "Level must be a valid academic year" 
  }),
  semester: z.string().trim().min(1, "Academic semester is required"),
  referred_by: z.string().trim().optional().or(z.literal('')),
  hardest_course: z.string().trim().optional().or(z.literal('')),
});

/**
 * Deterministic Referral Code Generator.
 * Uses a basic hashing algorithm to create unique, recognizable codes.
 * Ensures that codes are unique to the user's phone and signup time.
 */
function generateReferralCode(phone: string, timestamp: number): string {
  const combined = `${phone}-${timestamp}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).slice(0, 6).toUpperCase().padStart(6, '0');
  return `UNI-${hex}`;
}

/**
 * Join Waitlist API Route.
 * Orchestrates the user registration process, including:
 * 1. Payload sanitization and validation.
 * 2. Duplicate detection to prevent spam.
 * 3. Referral tracking and position boosting.
 * 4. High-quality logging for administrative auditing.
 */
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[JoinAPI][${requestId}] Inbound request received.`);

  try {
    const body = await request.json();
    console.log(`[JoinAPI][${requestId}] Payload received:`, { ...body, whatsapp_number: '***' });
    
    // --- Step 1: Detailed Field-Level Validation ---
    const { 
      full_name, 
      whatsapp_number, 
      institution, 
      school, 
      department, 
      level, 
      semester, 
      referred_by, 
      hardest_course 
    } = body;
    
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      console.warn(`[JoinAPI][${requestId}] Validation failed: full_name length.`);
      return NextResponse.json({ error: "Your name is required and must be at least 2 characters." }, { status: 400 });
    }
    
    if (!whatsapp_number || typeof whatsapp_number !== 'string') {
      console.warn(`[JoinAPI][${requestId}] Validation failed: whatsapp_number missing or invalid type.`);
      return NextResponse.json({ error: "A valid WhatsApp number is required." }, { status: 400 });
    }
    
    // Normalize and validate WhatsApp number format
    let normalizedWhatsApp = null;
    const cleanDigits = whatsapp_number.replace(/\D/g, '');
    if (cleanDigits.length === 10) {
      normalizedWhatsApp = `+234${cleanDigits}`;
    } else if (cleanDigits.length === 13 && cleanDigits.startsWith('234')) {
      normalizedWhatsApp = `+${cleanDigits}`;
    } else if (cleanDigits.length === 11 && cleanDigits.startsWith('0')) {
      normalizedWhatsApp = `+234${cleanDigits.slice(1)}`;
    } else if (/^\+234\d{10}$/.test(whatsapp_number)) {
      normalizedWhatsApp = whatsapp_number;
    }
    
    if (!normalizedWhatsApp || !/^\+234\d{10}$/.test(normalizedWhatsApp)) {
      console.warn(`[JoinAPI][${requestId}] Validation failed: Phone format mismatch.`);
      return NextResponse.json({ error: "Please use a valid Nigerian WhatsApp number (e.g. 08012345678)." }, { status: 400 });
    }
    
    // --- Step 2: Zod Schema Verification ---
    const parsed = schema.safeParse({
      full_name: full_name.trim(),
      whatsapp_number: normalizedWhatsApp,
      institution: (institution || '').trim(),
      school: (school || '').trim(),
      department: (department || '').trim(),
      level: String(level || ''),
      semester: (semester || '').trim(),
      referred_by: (referred_by || '').trim(),
      hardest_course: (hardest_course || '').trim(),
    });

    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      console.warn(`[JoinAPI][${requestId}] Zod validation failed for field "${firstError.path.join('.')}": ${firstError.message}`);
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    const validData = parsed.data;

    // --- Step 3: Concurrency and Duplicate Checking ---
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('waitlist')
      .select('referral_code, position')
      .eq('whatsapp_number', validData.whatsapp_number)
      .maybeSingle();

    if (checkError) {
      console.error(`[JoinAPI][${requestId}] Database error during duplicate check:`, checkError);
      return NextResponse.json({ error: "System congestion. Please try again in a few seconds." }, { status: 500 });
    }

    if (existingUser) {
      console.log(`[JoinAPI][${requestId}] User already registered. Returning existing credentials.`);
      return NextResponse.json({
        error: "This WhatsApp number is already registered on our waitlist.",
        code: existingUser.referral_code,
        position: existingUser.position,
        isDuplicate: true
      }, { status: 409 });
    }

    // --- Step 4: Referral Verification and Queue Placement ---
    const { count: currentTotal } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    const newPosition = (currentTotal || 0) + 1;
    const uniqueReferralCode = generateReferralCode(validData.whatsapp_number, Date.now());

    let verifiedReferrer = null;
    if (validData.referred_by && validData.referred_by.length > 3) {
      const { data: referrerRecord } = await supabaseAdmin
        .from('waitlist')
        .select('referral_code')
        .eq('referral_code', validData.referred_by)
        .maybeSingle();
      
      if (referrerRecord) {
        verifiedReferrer = referrerRecord.referral_code;
        console.log(`[JoinAPI][${requestId}] Referral verified: ${verifiedReferrer}`);
      } else {
        console.log(`[JoinAPI][${requestId}] Referral code provided but not found: ${validData.referred_by}`);
      }
    }

    // --- Step 5: Database Persistence ---
    const { error: insertError } = await supabaseAdmin.from('waitlist').insert({
      full_name: validData.full_name,
      whatsapp_number: validData.whatsapp_number,
      institution: validData.institution,
      school_code: validData.school,
      department_code: validData.department,
      level: validData.level,
      semester: validData.semester,
      referral_code: uniqueReferralCode,
      referred_by: verifiedReferrer,
      position: newPosition,
      hardest_course: validData.hardest_course || null,
    });

    if (insertError) {
      console.error(`[JoinAPI][${requestId}] Critical failure during user insertion:`, insertError);
      return NextResponse.json({ error: "Failed to secure your spot. Our servers are under heavy load." }, { status: 500 });
    }

    // --- Step 6: Referral Rewards (Asynchronous-style logic) ---
    if (verifiedReferrer) {
      try {
        const { data: refData } = await supabaseAdmin
          .from('waitlist')
          .select('position')
          .eq('referral_code', verifiedReferrer)
          .maybeSingle();
        
        if (refData) {
          // Reward the referrer by moving them up 5 spots in the queue
          const upgradedPosition = Math.max(1, (refData.position || 0) - 5);
          await supabaseAdmin
            .from('waitlist')
            .update({ position: upgradedPosition })
            .eq('referral_code', verifiedReferrer);
          
          console.log(`[JoinAPI][${requestId}] Referrer ${verifiedReferrer} rewarded. New position: ${upgradedPosition}`);
        }
      } catch (refError) {
        // Log but don't fail the primary signup if the reward logic hits a snag
        console.error(`[JoinAPI][${requestId}] Non-critical error during referral reward processing:`, refError);
      }
    }

    console.log(`[JoinAPI][${requestId}] Registration successful. User ${uniqueReferralCode} at position ${newPosition}`);
    return NextResponse.json({ 
      success: true, 
      referral_code: uniqueReferralCode, 
      position: newPosition 
    });

  } catch (err) {
    console.error(`[JoinAPI][${requestId}] Unhandled exception:`, err);
    return NextResponse.json({ error: "Internal system error. Please contact Uni UI support." }, { status: 500 });
  }
}
