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
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { full_name, whatsapp_number, institution, school, department, level, semester, referred_by, hardest_course, recommendation } = parsed.data;

    const { data: existing } = await supabaseAdmin
      .from('waitlist')
      .select('referral_code, position')
      .eq('whatsapp_number', whatsapp_number)
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
    const referral_code = generateReferralCode(whatsapp_number, Date.now());

    let verifiedReferredBy = null;
    if (referred_by && referred_by.length > 0) {
      const { data: referrer } = await supabaseAdmin
        .from('waitlist')
        .select('referral_code')
        .eq('referral_code', referred_by)
        .single();
      if (referrer) verifiedReferredBy = referred_by;
    }

    const { error } = await supabaseAdmin.from('waitlist').insert({
      full_name: full_name.trim(),
      whatsapp_number: whatsapp_number.trim(),
      institution: institution.trim(),
      school_code: school.trim(),
      department_code: department.trim(),
      level,
      semester,
      referral_code,
      referred_by: verifiedReferredBy,
      position,
      hardest_course: hardest_course || null,
      recommendation: recommendation || null,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, referral_code, position });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}