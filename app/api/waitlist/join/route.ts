import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { sanitizeText, sanitizeAlphanumeric } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';

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
 * Generates a cryptographically random referral code.
 * Format: UNI-XXXXXX where X is hex.
 */
function generateReferralCode(): string {
  const bytes = crypto.randomBytes(3);
  const hex = bytes.toString('hex').toUpperCase();
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

  // Rate limit by IP + action
  const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const ip = forwarded.split(',')[0]?.trim() || 'unknown';
  const { allowed, remaining, resetAt } = rateLimit(ip, 'join', 5);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many signups. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const body = await request.json();
    
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
      return NextResponse.json({ error: "Your name is required and must be at least 2 characters." }, { status: 400 });
    }
    
    if (!whatsapp_number || typeof whatsapp_number !== 'string') {
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
      return NextResponse.json({ error: "Please use a valid Nigerian WhatsApp number (e.g. 08012345678)." }, { status: 400 });
    }

    // --- Step 1b: Duplicate and device fingerprinting ---
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const deviceFingerprint = crypto
      .createHash('sha256')
      .update(`${userAgent}:${ip}`)
      .digest('hex')
      .slice(0, 16);

    // Check for duplicate phone numbers
    const { data: existingByPhone } = await supabaseAdmin
      .from('waitlist')
      .select('id, referral_code, position, created_at')
      .eq('whatsapp_number', normalizedWhatsApp)
      .maybeSingle();

    if (existingByPhone) {
      return NextResponse.json({
        error: "This WhatsApp number is already registered on our waitlist.",
        code: existingByPhone.referral_code,
        position: existingByPhone.position,
        isDuplicate: true
      }, { status: 409 });
    }

    // Check for duplicate device fingerprint
    const { data: existingByDevice } = await supabaseAdmin
      .from('waitlist')
      .select('id, referral_code')
      .eq('device_fingerprint', deviceFingerprint)
      .maybeSingle();

    if (existingByDevice) {
      console.warn(`[JoinAPI][${requestId}] Duplicate device detected: ${deviceFingerprint}`);
      return NextResponse.json({
        error: "Multiple accounts from the same device are not allowed.",
        code: existingByDevice.referral_code
      }, { status: 409 });
    }

    // Check for suspicious IP activity
    const { count: ipCount } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip);

    if ((ipCount || 0) >= 3) {
      console.warn(`[JoinAPI][${requestId}] Suspicious IP activity: ${ip} has ${ipCount} accounts`);
      return NextResponse.json({
        error: "Too many signups from this network. Contact support if this is an error."
      }, { status: 429 });
    }
    
    // Sanitize text inputs to strip control characters and dangerous sequences.
    const safeFullName = sanitizeText(full_name, 100);
    const safeInstitution = sanitizeText(institution, 120);
    const safeSchool = sanitizeText(school, 120);
    const safeDepartment = sanitizeText(department, 120);
    const safeSemester = sanitizeText(semester, 50);
    const safeReferredBy = sanitizeAlphanumeric(referred_by, 20);
    const safeHardestCourse = sanitizeText(hardest_course, 120);
    
    // --- Step 2: Zod Schema Verification ---
    const parsed = schema.safeParse({
      full_name: safeFullName,
      whatsapp_number: normalizedWhatsApp,
      institution: safeInstitution,
      school: safeSchool,
      department: safeDepartment,
      level: String(level || ''),
      semester: safeSemester,
      referred_by: safeReferredBy,
      hardest_course: safeHardestCourse,
    });

    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
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
    // Use a retry loop to handle concurrent signups safely.
    let newPosition = 0;
    let maxPosData: { position: number } | null = null;
    let verifiedReferrer: string | null = null;
    let verifiedReferrerId: string | null = null;
    if (validData.referred_by && validData.referred_by.length > 3) {
      const { data: referrerRecord } = await supabaseAdmin
        .from('waitlist')
        .select('id, referral_code')
        .eq('referral_code', validData.referred_by)
        .maybeSingle();
      
      if (referrerRecord) {
        verifiedReferrer = referrerRecord.referral_code;
        verifiedReferrerId = referrerRecord.id;
        console.log(`[JoinAPI][${requestId}] Referral verified: ${verifiedReferrer}`);
      } else {
        console.log(`[JoinAPI][${requestId}] Referral code provided but not found: ${validData.referred_by}`);
      }
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await supabaseAdmin
        .from('waitlist')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(`[JoinAPI][${requestId}] Failed to fetch max position:`, error);
        return NextResponse.json({ error: 'System congestion. Please try again.' }, { status: 500 });
      }

      const candidate = (data?.position || 0) + 1;

      const { error: insertError } = await supabaseAdmin
        .from('waitlist')
        .insert({
          full_name: safeFullName,
          whatsapp_number: normalizedWhatsApp,
          institution: safeInstitution,
          school_code: safeSchool,
          department_code: safeDepartment,
          level: validData.level,
          semester: safeSemester,
          referral_code: generateReferralCode(),
          referred_by: verifiedReferrer,
          position: candidate,
          hardest_course: safeHardestCourse || null,
          device_fingerprint: deviceFingerprint,
          ip_address: ip,
        });

      if (!insertError) {
        newPosition = candidate;
        break;
      }

      // If position conflict, retry with a fresh read.
      if (attempt === 2) {
        console.error(`[JoinAPI][${requestId}] Failed to assign position after retries:`, insertError);
        return NextResponse.json({ error: 'Failed to secure your spot. Please try again.' }, { status: 500 });
      }
      await new Promise((r) => setTimeout(r, 50 * (attempt + 1)));
    }

    const { data: insertedUser, error: insertError } = await supabaseAdmin
      .from('waitlist')
      .select('id, referral_code')
      .eq('whatsapp_number', normalizedWhatsApp)
      .maybeSingle();

    // --- Step 5: Database Persistence ---
    if (!insertedUser) {
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
          
          console.log(`[JoinAPI][${requestId}] Referrer rewarded. New position: ${upgradedPosition}`);
        }
      } catch {
        // Log but don't fail the primary signup if the reward logic hits a snag
      }
    }

    // --- Step 6b: Record the referral relationship for the gamified rewards engine ---
    if (verifiedReferrerId && insertedUser.id) {
      try {
        await supabaseAdmin
          .from('referrals')
          .insert({
            referrer_id: verifiedReferrerId,
            referred_id: insertedUser.id,
            status: 'pending',
          });
      } catch {
        // non-critical
      }
    }

    console.log(`[JoinAPI][${requestId}] Registration successful. User at position ${newPosition}`);
    return NextResponse.json({ 
      success: true, 
      referral_code: insertedUser.referral_code, 
      position: newPosition 
    });

  } catch (err) {
    console.error(`[JoinAPI][${requestId}] Unhandled exception:`, err);
    return NextResponse.json({ error: "Internal system error. Please contact Uni UI support." }, { status: 500 });
  }
}
