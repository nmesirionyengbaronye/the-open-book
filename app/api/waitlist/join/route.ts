import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

const schema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(100).transform((s) => s.replace(/<[^>]*>/g, '')),
  whatsapp_number: z.string().transform((v) => {
    const digits = v.replace(/\D/g, '');
    if (digits.length === 10) return `+234${digits}`;
    if (digits.length === 13 && digits.startsWith('234')) return `+${digits}`;
    if (digits.length === 11 && digits.startsWith('0')) return `+234${digits.slice(1)}`;
    return v;
  }).refine((v) => /^\+234\d{10}$/.test(v), { message: "Invalid Nigerian WhatsApp number" }),
  institution: z.string().trim().min(1, "Institution is required"),
  school: z.string().trim().min(1, "School/Faculty required"),
  department: z.string().trim().min(1, "Department required"),
  level: z.string().refine((v) => v === '200' || v === '300', { message: "Level must be 200 or 300" }),
  semester: z.string().trim().min(1, "Semester required"),
  referred_by: z.string().trim().optional().or(z.literal('')),
  hardest_course: z.string().trim().optional().or(z.literal('')),
  recommendation: z.string().trim().optional().or(z.literal('')),
});

function generateReferralCode(phone: string, timestamp: number): string {
  const combined = phone + timestamp;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).slice(0, 6).toUpperCase().padStart(6, '0');
  return `UNI-${hex}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received body:', body);
    
    // Validate each field individually to provide more specific error messages
    const { full_name, whatsapp_number, institution, school, department, level, semester, referred_by, hardest_course, recommendation } = body;
    
    // Validate full_name
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      console.log('Validation failed: full_name must be at least 2 characters');
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }
    
    // Validate whatsapp_number format
    if (!whatsapp_number || typeof whatsapp_number !== 'string') {
      console.log('Validation failed: whatsapp_number must be a string');
      return NextResponse.json({ error: "Invalid WhatsApp number format" }, { status: 400 });
    }
    
    // Normalize and validate WhatsApp number
    let normalizedWhatsApp = null;
    // Handle the number - it might already be in +234 format from frontend
    const cleanDigits = whatsapp_number.replace(/\D/g, '');
    if (cleanDigits.length === 10) {
      normalizedWhatsApp = `+234${cleanDigits}`;
    } else if (cleanDigits.length === 13 && cleanDigits.startsWith('234')) {
      normalizedWhatsApp = `+${cleanDigits}`;
    } else if (cleanDigits.length === 11 && cleanDigits.startsWith('0')) {
      normalizedWhatsApp = `+234${cleanDigits.slice(1)}`;
    } else if (/^\+234\d{10}$/.test(whatsapp_number)) {
      // Already properly formatted
      normalizedWhatsApp = whatsapp_number;
    }
    
    if (!normalizedWhatsApp || !/^\+234\d{10}$/.test(normalizedWhatsApp)) {
      console.log('Validation failed: Invalid Nigerian WhatsApp number format');
      return NextResponse.json({ error: "Invalid Nigerian WhatsApp number format. Use format like 08012345678" }, { status: 400 });
    }
    
    // Validate institution
    if (!institution || typeof institution !== 'string' || institution.trim().length === 0) {
      console.log('Validation failed: institution is required');
      return NextResponse.json({ error: "Institution is required" }, { status: 400 });
    }
    
    // Validate school
    if (!school || typeof school !== 'string' || school.trim().length === 0) {
      console.log('Validation failed: school is required');
      return NextResponse.json({ error: "School/Faculty is required" }, { status: 400 });
    }
    
    // Validate department
    if (!department || typeof department !== 'string' || department.trim().length === 0) {
      console.log('Validation failed: department is required');
      return NextResponse.json({ error: "Department is required" }, { status: 400 });
    }
    
    // Validate level
    if (!level || typeof level !== 'string' || (level !== '200' && level !== '300')) {
      console.log('Validation failed: level must be 200 or 300');
      return NextResponse.json({ error: "Level must be 200 or 300" }, { status: 400 });
    }
    
    // Validate semester
    if (!semester || typeof semester !== 'string' || (semester !== '1st' && semester !== '2nd')) {
      console.log('Validation failed: semester must be 1st or 2nd');
      return NextResponse.json({ error: "Semester must be 1st or 2nd" }, { status: 400 });
    }
    
    // Validate optional fields
    if (referred_by !== undefined && referred_by !== null && typeof referred_by !== 'string') {
      console.log('Validation failed: referred_by must be a string if provided');
      return NextResponse.json({ error: "Referred by must be a string" }, { status: 400 });
    }
    
    if (hardest_course !== undefined && hardest_course !== null && typeof hardest_course !== 'string') {
      console.log('Validation failed: hardest_course must be a string if provided');
      return NextResponse.json({ error: "Hardest course must be a string" }, { status: 400 });
    }
    
    if (recommendation !== undefined && recommendation !== null && typeof recommendation !== 'string') {
      console.log('Validation failed: recommendation must be a string if provided');
      return NextResponse.json({ error: "Recommendation must be a string" }, { status: 400 });
    }
    
    // If we got here, all basic validations passed, now use Zod for final validation
    const parsed = schema.safeParse({
      full_name: full_name.trim(),
      whatsapp_number: normalizedWhatsApp, // Use the normalized version
      institution: institution.trim(),
      school: school.trim(),
      department: department.trim(),
      level,
      semester,
      referred_by: referred_by?.trim() || '',
      hardest_course: hardest_course?.trim() || '',
      recommendation: recommendation?.trim() || '',
    });

    if (!parsed.success) {
      // Log detailed validation errors
      console.log('Zod validation errors:', parsed.error.errors);
      parsed.error.errors.forEach(err => {
        console.log(`Field "${err.path.join('.')}": ${err.message}`);
      });
      
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    // Use the validated data from Zod
    const { data: existing } = await supabaseAdmin
      .from('waitlist')
      .select('referral_code, position')
      .eq('whatsapp_number', parsed.data.whatsapp_number)
      .single();

    if (existing) {
      return NextResponse.json({
        error: "This number is already on the waitlist",
        code: existing.referral_code,
        position: existing.position
      }, { status: 409 });
    }

    const { count } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    const position = (count || 0) + 1;
    const referral_code = generateReferralCode(parsed.data.whatsapp_number, Date.now());

    let verifiedReferredBy = null;
    if (parsed.data.referred_by && parsed.data.referred_by.length > 0) {
      const { data: referrer } = await supabaseAdmin
        .from('waitlist')
        .select('referral_code')
        .eq('referral_code', parsed.data.referred_by)
        .single();
      if (referrer) verifiedReferredBy = parsed.data.referred_by;
    }

    const { error } = await supabaseAdmin.from('waitlist').insert({
      full_name: parsed.data.full_name.trim(),
      whatsapp_number: parsed.data.whatsapp_number.trim(),
      institution: parsed.data.institution.trim(),
      school_code: parsed.data.school.trim(),
      department_code: parsed.data.department.trim(),
      level: parsed.data.level,
      semester: parsed.data.semester,
      referral_code,
      referred_by: verifiedReferredBy,
      position,
      hardest_course: parsed.data.hardest_course || null,
      recommendation: parsed.data.recommendation || null,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Boost referrer's position by 5 places
    if (verifiedReferredBy) {
      const { data: referrerData, error: referrerError } = await supabaseAdmin
        .from('waitlist')
        .select('position')
        .eq('referral_code', verifiedReferredBy)
        .single();
      
      if (!referrerError && referrerData) {
        const newPosition = Math.max(1, (referrerData.position || 0) - 5);
        await supabaseAdmin
          .from('waitlist')
          .update({ position: newPosition })
          .eq('referral_code', verifiedReferredBy);
      }
    }

    return NextResponse.json({ success: true, referral_code, position });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}