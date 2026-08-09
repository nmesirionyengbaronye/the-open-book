import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MILESTONE } from '@/lib/referral-counts';

export const runtime = 'nodejs';

function adminOnly(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  return session?.value === 'authenticated';
}

export async function GET(req: NextRequest) {
  if (!adminOnly(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });

  try {
    // 1. Resolve user
    const { data: user, error: userError } = await supabaseAdmin
      .from('waitlist')
      .select('id, referral_code, full_name, bonus_referrals, telegram_verified')
      .eq('referral_code', code.toUpperCase())
      .maybeSingle();

    if (userError || !user) {
      return NextResponse.json({ error: 'user not found', details: userError?.message }, { status: 404 });
    }

    const userId = user.id as string;

    // 2. Raw joined count
    const { count: joinedCount } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', code.toUpperCase());

    // 3. Verified referrals count
    const { count: verifiedCount } = await supabaseAdmin
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId)
      .eq('status', 'verified');

    // 4. Pending referrals count
    const { count: pendingCount } = await supabaseAdmin
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId)
      .eq('status', 'pending');

    // 5. Bonus referrals
    const bonus = (user as any).bonus_referrals || 0;

    // 6. Canonical count
    const canonical = (verifiedCount || 0) + bonus;

    // 7. Boxes due
    const boxesDue = Math.floor(canonical / MILESTONE);

    // 8. Rank
    const { data: allReferrers } = await supabaseAdmin
      .from('waitlist')
      .select('id, referral_code, bonus_referrals, disqualified')
      .eq('disqualified', false);

    const referrerIds = (allReferrers || []).map((r: any) => r.id);
    const { data: allVerified } = await supabaseAdmin
      .from('referrals')
      .select('referrer_id')
      .eq('status', 'verified')
      .in('referrer_id', referrerIds);

    const verifiedMap = new Map<string, number>();
    for (const r of allVerified || []) {
      const rid = (r as any).referrer_id;
      verifiedMap.set(rid, (verifiedMap.get(rid) || 0) + 1);
    }

    const ranked = (allReferrers || [])
      .map((r: any) => ({
        id: r.id,
        referral_code: r.referral_code,
        count: (verifiedMap.get(r.id) || 0) + (r.bonus_referrals || 0),
      }))
      .filter((r) => r.count > 0)
      .sort((a, b) => b.count - a.count || a.referral_code.localeCompare(b.referral_code));

    const rankIndex = ranked.findIndex((r) => r.id === userId);
    const rank = rankIndex >= 0 ? rankIndex + 1 : null;

    return NextResponse.json({
      user: {
        id: userId,
        referral_code: user.referral_code,
        full_name: user.full_name,
        bonus_referrals: bonus,
        telegram_verified: user.telegram_verified,
      },
      counts: {
        joinedCount: joinedCount || 0,
        verifiedCount: verifiedCount || 0,
        pendingCount: pendingCount || 0,
        bonus,
        canonical,
        boxesDue,
      },
      rank,
      milestones: Array.from({ length: Math.max(3, Math.ceil(canonical / MILESTONE) + 2) }).map((_, i) => ({
        milestone: (i + 1) * MILESTONE,
        unlocked: canonical >= (i + 1) * MILESTONE,
      })),
    });
  } catch (e) {
    console.error('[rewards/debug]', e);
    return NextResponse.json({ error: 'server error', details: String(e) }, { status: 500 });
  }
}
