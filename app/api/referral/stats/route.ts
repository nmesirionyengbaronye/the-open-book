import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getEarnedBadges } from '@/lib/referral';
import { normalizeWhatsApp } from '@/lib/validation';
import { getRankedReferrers } from '@/lib/referral-counts';
import { sanitizeLike } from '@/lib/sanitize';

export async function GET(request: NextRequest) {
  try {
    const rawCode = request.nextUrl.searchParams.get('code');
    const phone = request.nextUrl.searchParams.get('phone');

    let lookupCode = sanitizeLike(rawCode?.trim(), 20);
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
      .select('id, referral_code, full_name, position, created_at, institution, school_code, department_code')
      .eq('referral_code', lookupCode)
      .maybeSingle();

    if (referrerError || !referrer) {
      return NextResponse.json({ error: 'Referral code not found' }, { status: 404 });
    }

    // Canonical count + rank from the single shared board, so this endpoint,
    // the Telegram profile, the badges and both leaderboards always agree.
    const board = await getRankedReferrers();
    const idx = board.findIndex((r) => r.userId === referrer.id);
    const referralCount = idx >= 0 ? board[idx].count : 0;
    const rank = idx >= 0 ? idx + 1 : null;

    // "Joined via your link" — the raw subset, without the admin bonus.
    const { count: joinedCount } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', referrer.referral_code);

    const { count: totalWaitlist } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    const ctx = {
      referralCount,
      rank,
      totalWaitlist: totalWaitlist || 0,
    };

    const badges = getEarnedBadges(ctx);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://waitlist.uniui.com.ng';
    const referralLink = `${baseUrl}/?ref=${referrer.referral_code}`;

    const inviteParam = request.nextUrl.searchParams.get('invites');
    const streakParam = request.nextUrl.searchParams.get('streak');

    let invites: { full_name: string; created_at: string }[] = [];
    if (inviteParam === '1' && lookupCode) {
      const { data: inviteRows, error: inviteError } = await supabaseAdmin
        .from('waitlist')
        .select('full_name, created_at')
        .eq('referred_by', lookupCode)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!inviteError && inviteRows) {
        invites = inviteRows.map((row: any) => ({
          full_name: row.full_name || 'A friend',
          created_at: row.created_at,
        }));
      }
    }

    let streak = 0;
    if (streakParam === '1' && lookupCode) {
      const { data: streakRows, error: streakError } = await supabaseAdmin
        .from('waitlist')
        .select('created_at')
        .eq('referred_by', lookupCode)
        .order('created_at', { ascending: true });

      if (!streakError && streakRows && streakRows.length > 0) {
        const uniqueDays = new Set(
          streakRows.map((row: any) => {
            const d = new Date(row.created_at);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          })
        );
        streak = uniqueDays.size;
      }
    }

    return NextResponse.json({
      referralCode: referrer.referral_code,
      fullName: referrer.full_name,
      position: referrer.position,
      referralCount,
      joinedCount: joinedCount || 0,
      rank,
      totalWaitlist: totalWaitlist || 0,
      badges,
      referralLink,
      institution: referrer.institution || null,
      school: referrer.school_code || null,
      department: referrer.department_code || null,
      invites,
      streak,
    });
  } catch (e) {
    console.error('Unhandled error in referral stats:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
