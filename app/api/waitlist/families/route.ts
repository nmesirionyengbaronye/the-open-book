import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';
import {
  FamilyWaitlistSchema,
  sanitizeFamilyRow,
} from '@/lib/waitlist-types';

/**
 * Family / parent waitlist — POST /api/waitlist/families
 *
 * Additive: writes rows with waitlist_type = 'family' into the SAME
 * `waitlist` table. Queue position is scoped per waitlist_type so families
 * do not compete with students.
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomBytes(4).toString('hex');
  console.log(`[FamWaitlist][${requestId}] Inbound family request.`);

  const forwarded =
    request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const ip = forwarded.split(',')[0]?.trim() || 'unknown';

  const { allowed, remaining, resetAt } = rateLimit(ip, 'fam-join', 5);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const body = await request.json();

    if (typeof body.website === 'string' && body.website.length > 0) {
      return NextResponse.json({ success: true, position: null });
    }

    const parsed = FamilyWaitlistSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.errors[0];
      const field = issue.path.join('.');
      console.log(`[FamWaitlist][${requestId}] Validation failed on "${field}".`);
      return NextResponse.json({ error: issue.message, field }, { status: 400 });
    }
    const data = parsed.data;

    const row = sanitizeFamilyRow(data);

    // duplicate check (within family waitlist) on phone + email
    const { data: existingByPhone } = await supabaseAdmin
      .from('waitlist')
      .select('id, position')
      .eq('waitlist_type', 'family')
      .eq('whatsapp_number', row.whatsapp_number)
      .maybeSingle();

    const { data: existingByEmail } = await supabaseAdmin
      .from('waitlist')
      .select('id, position')
      .eq('waitlist_type', 'family')
      .eq('email', row.email)
      .maybeSingle();

    if (existingByPhone) {
      return NextResponse.json(
        { error: 'This phone number is already on the family waitlist.', position: existingByPhone.position, isDuplicate: true },
        { status: 409 }
      );
    }
    if (existingByEmail) {
      return NextResponse.json(
        { error: 'This email is already on the family waitlist.', position: existingByEmail.position, isDuplicate: true },
        { status: 409 }
      );
    }

    // per-type position
    const { data: maxRow, error: posError } = await supabaseAdmin
      .from('waitlist')
      .select('position')
      .eq('waitlist_type', 'family')
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (posError) {
      console.error(`[FamWaitlist][${requestId}] Position fetch error:`, posError);
      return NextResponse.json({ error: 'System congestion. Please try again.' }, { status: 500 });
    }

    const position = (maxRow?.position ?? 0) + 1;

    // optional referral
    let referred_by: string | null = null;
    const ref = (body.referred_by as string | undefined)?.trim();
    if (ref && ref.length > 3) {
      const { data: referrer } = await supabaseAdmin
        .from('waitlist')
        .select('id')
        .eq('referral_code', ref)
        .maybeSingle();
      if (referrer) referred_by = ref;
    }

    const { error: insertError } = await supabaseAdmin.from('waitlist').insert({
      waitlist_type: 'family',
      full_name: row.full_name,
      email: row.email,
      whatsapp_number: row.whatsapp_number,
      relationship: row.relationship,
      child_count: row.child_count,
      child_linked: row.child_linked,
      child_detail: row.child_detail,
      interests: row.interests,
      referral_code: generateReferralCode(),
      referred_by,
      position,
      status: 'pending',
      verification_status: 'unverified',
      device_fingerprint: crypto
        .createHash('sha256')
        .update(`${request.headers.get('user-agent') || 'unknown'}:${ip}`)
        .digest('hex')
        .slice(0, 16),
      ip_address: ip,
    });

    if (insertError) {
      console.error(`[FamWaitlist][${requestId}] Insert failed:`, insertError);
      return NextResponse.json({ error: 'Failed to submit your request. Please try again.' }, { status: 500 });
    }

    // reward referrer within their own queue
    if (referred_by) {
      try {
        const { data: refRow } = await supabaseAdmin
          .from('waitlist')
          .select('waitlist_type, position')
          .eq('referral_code', referred_by)
          .maybeSingle();
        if (refRow) {
          const upgraded = Math.max(1, (refRow.position ?? 0) - 5);
          await supabaseAdmin
            .from('waitlist')
            .update({ position: upgraded })
            .eq('referral_code', referred_by)
            .eq('waitlist_type', refRow.waitlist_type);
        }
      } catch {
        /* non-critical */
      }
    }

    console.log(`[FamWaitlist][${requestId}] OK — family at position ${position}.`);
    return NextResponse.json({ success: true, position, waitlist_type: 'family' });
  } catch (err) {
    console.error(`[FamWaitlist][${requestId}] Unhandled error:`, err);
    return NextResponse.json({ error: 'Internal system error. Please contact Uni UI support.' }, { status: 500 });
  }
}

function generateReferralCode(): string {
  return `UNI-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}
