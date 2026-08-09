import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidSession } from '@/lib/admin-session';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!isValidSession(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Smoke test 1: joined count != verified count where bonus = 0
    const { data: waitlist } = await supabaseAdmin
      .from('waitlist')
      .select('id, referral_code, bonus_referrals');

    const { data: joinedRaw } = await supabaseAdmin
      .from('waitlist')
      .select('referred_by')
      .not('referred_by', 'is', null);

    const joinedMap = new Map<string, number>();
    for (const row of joinedRaw as { referred_by: string }[]) {
      joinedMap.set(row.referred_by, (joinedMap.get(row.referred_by) || 0) + 1);
    }

    const { data: verifiedRaw } = await supabaseAdmin
      .from('referrals')
      .select('referrer_id')
      .eq('status', 'verified');

    const verifiedMap = new Map<string, number>();
    for (const row of verifiedRaw as { referrer_id: string }[]) {
      verifiedMap.set(row.referrer_id, (verifiedMap.get(row.referrer_id) || 0) + 1);
    }

    const mismatch = (waitlist || [])
      .map((u: any) => {
        const joined = joinedMap.get(u.referral_code) || 0;
        const verified = verifiedMap.get(u.id) || 0;
        const bonus = u.bonus_referrals || 0;
        return {
          user_id: u.id,
          referral_code: u.referral_code,
          waitlist_joined: joined,
          referrals_verified: verified,
          bonus,
          diff: joined - verified,
        };
      })
      .filter((r) => r.diff !== 0 && r.bonus === 0)
      .slice(0, 10);

    // Smoke test 2: pending referrals for telegram-verified users
    const { data: pendingRaw } = await supabaseAdmin
      .from('referrals')
      .select('referrer_id, referred_id')
      .eq('status', 'pending');

    const pendingReferrerIds = new Set(
      (pendingRaw || []).map((r: any) => r.referrer_id)
    );

    const { data: pendingUsersRaw } = await supabaseAdmin
      .from('waitlist')
      .select('id, referral_code, telegram_verified')
      .in('id', Array.from(pendingReferrerIds));

    const pendingCounts = new Map<string, number>();
    for (const row of pendingRaw as { referrer_id: string }[]) {
      pendingCounts.set(row.referrer_id, (pendingCounts.get(row.referrer_id) || 0) + 1);
    }

    const pending = (pendingUsersRaw || [])
      .map((u: any) => ({
        user_id: u.id,
        referral_code: u.referral_code,
        pending_count: pendingCounts.get(u.id) || 0,
      }))
      .filter((r) => r.pending_count > 0)
      .sort((a, b) => b.pending_count - a.pending_count)
      .slice(0, 10);

    // Smoke test 3: backfill needed
    const { data: backfillRaw } = await supabaseAdmin
      .from('waitlist')
      .select('id, referral_code, referred_by, telegram_verified')
      .eq('telegram_verified', true)
      .not('referred_by', 'is', null);

    const { data: existingVerified } = await supabaseAdmin
      .from('referrals')
      .select('referrer_id, referred_id')
      .eq('status', 'verified');

    const existingSet = new Set(
      (existingVerified || []).map((r: any) => `${r.referrer_id}:${r.referred_id}`)
    );

    const needsBackfill = (backfillRaw || [])
      .map((w: any) => {
        const referrer = (waitlist || []).find(
          (r: any) => r.referral_code === w.referred_by
        );
        if (!referrer) return null;
        const key = `${referrer.id}:${w.id}`;
        if (existingSet.has(key)) return null;
        return { user_id: w.id, referral_code: w.referral_code };
      })
      .filter(Boolean)
      .slice(0, 10);

    return NextResponse.json({
      mismatch,
      pending,
      needsBackfill,
      needsBackfillCount: needsBackfill.length,
    });
  } catch (e) {
    console.error('[admin/smoke] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
