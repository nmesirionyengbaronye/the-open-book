import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { BADGES, getEarnedBadges } from '@/lib/referral';
import { normalizeWhatsApp } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const rawCode = request.nextUrl.searchParams.get('code');
    const phone = request.nextUrl.searchParams.get('phone');

    let lookupCode = rawCode?.trim();
    if (!lookupCode && phone) {
      const normalized = normalizeWhatsApp(phone);
      if (!normalized) {
        return NextResponse.json({ error: 'Invalid WhatsApp number format' }, { status: 400 });
      }
      const { data: byPhone, error: phoneError } = await supabaseAdmin
        .from('waitlist')
        .select('referral_code')
        .eq('whatsapp_number', normalized)
        .maybeSingle();

      if (phoneError || !byPhone) {
        return NextResponse.json({ error: 'No account found for that WhatsApp number' }, { status: 404 });
      }
      lookupCode = byPhone.referral_code;
    }

    if (!lookupCode || lookupCode.length < 3) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    const { data: referrer, error: referrerError } = await supabaseAdmin
      .from('waitlist')
      .select('referral_code, full_name, position, created_at, institution, school_code, department_code')
      .eq('referral_code', lookupCode)
      .maybeSingle();

    if (referrerError || !referrer) {
      return NextResponse.json({ error: 'Referral code not found' }, { status: 404 });
    }

    const { data: allReferrals, error: referralsError } = await supabaseAdmin
      .from('waitlist')
      .select('referred_by')
      .eq('referred_by', referrer.referral_code);

    if (referralsError) {
      console.error('Failed to load referrals for stats:', referralsError);
    }

    const referralCount = (allReferrals || []).length;

    const { data: allEntries, error: allError } = await supabaseAdmin
      .from('waitlist')
      .select('referral_code');

    if (allError) {
      console.error('Failed to load waitlist for rank computation:', allError);
    }

    const counts = new Map<string, number>();
    (allEntries || []).forEach((e: any) => {
      if (e.referral_code) {
        counts.set(e.referral_code, (counts.get(e.referral_code) || 0) + 1);
      }
    });

    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const rank = sorted.findIndex(([c]) => c === referrer.referral_code) + 1;

    const { count: totalWaitlist } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    const ctx = {
      referralCount,
      rank: rank > 0 ? rank : null,
      totalWaitlist: totalWaitlist || 0,
    };

    const badges = getEarnedBadges(ctx);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://waitlist.uniui.com.ng';
    const referralLink = `${baseUrl}/?ref=${referrer.referral_code}`;

    return NextResponse.json({
      referralCode: referrer.referral_code,
      fullName: referrer.full_name,
      position: referrer.position,
      referralCount,
      rank,
      totalWaitlist: totalWaitlist || 0,
      badges,
      referralLink,
      institution: referrer.institution || null,
      school: referrer.school_code || null,
      department: referrer.department_code || null,
    });
  } catch (e) {
    console.error('Unhandled error in referral stats:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
