import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { recordStreak, getStreak, celebrateMilestone, getUserBadges, awardBadge, getBadgeConfig, getMilestoneCelebrations } from '@/lib/engagement';
import { getEffectiveReferralCount } from '@/lib/rewards';
import { MILESTONE } from '@/lib/referral-counts';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });

    const { data: user } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('referral_code', code)
      .maybeSingle();

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const [streak, effective, badges, celebrations] = await Promise.all([
      getStreak(user.id),
      getEffectiveReferralCount(user.id),
      getUserBadges(user.id),
      getMilestoneCelebrations(user.id),
    ]);

    const badgeDetails = badges.map((key) => ({
      key,
      ...getBadgeConfig(key),
    }));

    const nextMilestone = Math.floor((effective || 0) / MILESTONE) + 1;
    const nextMilestoneTotal = nextMilestone * MILESTONE;
    const need = Math.max(0, nextMilestoneTotal - (effective || 0));

    return NextResponse.json({
      streak,
      badges: badgeDetails,
      celebrations,
      nextMilestone,
      need,
      effective,
    });
  } catch (e) {
    console.error('[engagement] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, action, badgeKey, milestone } = body;

    const { data: user } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('referral_code', code)
      .maybeSingle();

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    switch (action) {
      case 'touch': {
        const { touchUser } = await import('@/lib/engagement');
        await touchUser(user.id);
        return NextResponse.json({ ok: true });
      }
      case 'streak': {
        const result = await recordStreak(user.id);
        return NextResponse.json(result);
      }
      case 'celebrate': {
        if (!milestone || typeof milestone !== 'number') {
          return NextResponse.json({ error: 'milestone is required' }, { status: 400 });
        }
        const created = await celebrateMilestone(user.id, milestone);
        return NextResponse.json({ ok: created });
      }
      case 'award_badge': {
        if (!badgeKey) return NextResponse.json({ error: 'badgeKey is required' }, { status: 400 });
        const created = await awardBadge(user.id, badgeKey);
        return NextResponse.json({ ok: created });
      }
      default:
        return NextResponse.json({ error: 'unknown action' }, { status: 400 });
    }
  } catch (e) {
    console.error('[engagement] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
