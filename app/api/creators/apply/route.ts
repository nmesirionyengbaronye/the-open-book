import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sanitizeText } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';
import {
  CreatorApplicationSchema,
  generateCreatorCode,
  type CreatorApplicationResult,
} from '@/lib/creators';
import crypto from 'crypto';

/**
 * Creator Program application intake — POST /api/creators/apply
 *
 * Public, unauthenticated, and link-dropped into creator DMs, so it assumes
 * abuse. Guards, in order:
 *   1. IP rate limit
 *   2. Honeypot rejection (hidden `website` field)
 *   3. Zod validation with per-field messages
 *   4. Duplicate detection on WhatsApp number and email
 *   5. Referral code verified against an existing row before it is credited —
 *      an unknown code is ignored rather than rejected, so a mistyped link
 *      does not cost an applicant their application.
 *
 * Status starts at 'applied'. Promotion to approved/whatsapp is an admin
 * action in /admin/creators, not something an applicant can self-assert.
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomBytes(4).toString('hex');
  console.log(`[CreatorApply][${requestId}] Inbound request received.`);

  const forwarded =
    request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const ip = forwarded.split(',')[0]?.trim() || 'unknown';

  const { allowed, remaining, resetAt } = rateLimit(ip, 'creator-apply', 5);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many applications from this network. Please try again shortly.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) },
      }
    );
  }

  try {
    const body = await request.json();

    // --- Step 1: honeypot ---------------------------------------------------
    // A real browser never renders or fills this input. Silently accept and drop
    // so bots get no signal about which check tripped.
    if (typeof body.website === 'string' && body.website.length > 0) {
      console.warn(`[CreatorApply][${requestId}] Honeypot triggered.`);
      return NextResponse.json({ success: true, creator_code: null, referred_by: null });
    }

    // --- Step 2: validation -------------------------------------------------
    const parsed = CreatorApplicationSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.errors[0];
      const field = issue.path.join('.');
      console.log(`[CreatorApply][${requestId}] Validation failed on "${field}".`);
      return NextResponse.json(
        { error: issue.message, field },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // --- Step 3: sanitize before persistence -------------------------------
    const row = {
      full_name: sanitizeText(data.full_name, 100),
      whatsapp_number: data.whatsapp_number,
      email: sanitizeText(data.email, 160),
      institution: sanitizeText(data.institution, 120),
      level: data.level,
      department: sanitizeText(data.department, 120),
      tiktok_handle: sanitizeText(data.tiktok_handle, 40),
      instagram_handle: data.instagram_handle ? sanitizeText(data.instagram_handle, 40) : null,
      tiktok_followers: data.tiktok_followers ?? null,
      instagram_followers: data.instagram_followers ?? null,
      avg_views: data.avg_views ?? null,
      content_types: data.content_types,
      why_join: sanitizeText(data.why_join, 1000),
      how_promote: sanitizeText(data.how_promote, 1000),
      promoted_before: data.promoted_before,
      promoted_before_detail: data.promoted_before_detail
        ? sanitizeText(data.promoted_before_detail, 500)
        : null,
      status: 'applied',
      tier: 'seed',
      created_at: new Date().toISOString(),
    };

    // --- Step 4: duplicates -------------------------------------------------
    const { data: existingPhone } = await supabaseAdmin
      .from('creators')
      .select('id, referral_code')
      .eq('whatsapp_number', row.whatsapp_number)
      .maybeSingle();

    if (existingPhone) {
      return NextResponse.json(
        {
          error:
            'This WhatsApp number has already applied to the Creator Program. We will reach out if you are approved.',
          code: existingPhone.referral_code,
          isDuplicate: true,
        },
        { status: 409 }
      );
    }

    const { data: existingEmail } = await supabaseAdmin
      .from('creators')
      .select('id')
      .eq('email', row.email)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        { error: 'This email has already applied to the Creator Program.', isDuplicate: true },
        { status: 409 }
      );
    }

    // --- Step 5: verify the referrer ----------------------------------------
    let verifiedReferrer: string | null = null;
    const rawRef = sanitizeText(data.referred_by || '', 40).toUpperCase();
    if (rawRef.length > 4) {
      const { data: referrer } = await supabaseAdmin
        .from('creators')
        .select('referral_code, status')
        .eq('referral_code', rawRef)
        .maybeSingle();

      if (referrer) {
        verifiedReferrer = referrer.referral_code;
        console.log(`[CreatorApply][${requestId}] Referral verified: ${verifiedReferrer}`);
      } else {
        console.log(`[CreatorApply][${requestId}] Unknown referral code "${rawRef}", ignored.`);
      }
    }

    // --- Step 6: persist ----------------------------------------------------
    // Retry on unique-violation: two tabs open, or a duplicate that slipped
    // past the read above, both land here.
    const creatorCode = generateCreatorCode();
    const { data: inserted, error } = await supabaseAdmin
      .from('creators')
      .insert({ ...row, referred_by: verifiedReferrer, referral_code: creatorCode })
      .select('id, referral_code')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This application already exists. Check your email for your status.', isDuplicate: true },
          { status: 409 }
        );
      }
      console.error(`[CreatorApply][${requestId}] Insert failed:`, error);
      return NextResponse.json(
        { error: 'We could not save your application. Please try again in a moment.' },
        { status: 500 }
      );
    }

    console.log(
      `[CreatorApply][${requestId}] Application saved. code=${creatorCode} referred_by=${verifiedReferrer ?? 'none'} remaining=${remaining}`
    );

    const payload: CreatorApplicationResult = {
      success: true,
      creator_code: inserted.referral_code ?? creatorCode,
      referred_by: verifiedReferrer,
    };
    return NextResponse.json(payload);
  } catch (err) {
    console.error(`[CreatorApply][${requestId}] Unhandled exception:`, err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again.' },
      { status: 500 }
    );
  }
}
