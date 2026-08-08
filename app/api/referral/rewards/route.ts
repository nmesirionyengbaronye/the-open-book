import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { TIERS, getTier } from '@/lib/tiers';
import { getRankedReferrers } from '@/lib/referral-counts';

// Thresholds come from the shared TIERS table (lib/tiers.ts) so the claim API,
// the badges and the marketing copy can never drift apart again.
const REWARD_TIERS = TIERS.map((t) => ({
  type: t.type,
  threshold: t.threshold,
  title: t.title,
}));

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    if (!code || code.trim().length < 3) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    let granted: { reward_type: string; threshold: number; granted_at: string; claimed_at: string | null }[] = [];
    try {
      const { data, error } = await supabaseAdmin
        .from('referral_rewards')
        .select('reward_type, threshold, granted_at, claimed_at')
        .eq('referral_code', code.trim());

      if (!error && data) {
        granted = data;
      }
    } catch {
      // Table may not exist yet
    }

    const grantedTypes = new Set(granted.map((r) => r.reward_type));
    const available = REWARD_TIERS.filter((t) => !grantedTypes.has(t.type));
    const earned = REWARD_TIERS.filter((t) => grantedTypes.has(t.type)).map((t) => ({
      ...t,
      granted_at: granted.find((g) => g.reward_type === t.type)?.granted_at || null,
      claimed_at: granted.find((g) => g.reward_type === t.type)?.claimed_at || null,
    }));

    return NextResponse.json({ available, earned });
  } catch (e) {
    console.error('Rewards fetch error:', e);
    return NextResponse.json({ available: REWARD_TIERS, earned: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, reward_type } = body || {};

    if (!code || !reward_type || code.trim().length < 3) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const tier = getTier(reward_type);
    if (!tier) {
      return NextResponse.json({ error: 'Unknown reward type' }, { status: 400 });
    }

    // Enforce the tier threshold server-side using the canonical count.
    const { data: user } = await supabaseAdmin
      .from('waitlist')
      .select('id, disqualified')
      .eq('referral_code', code.trim())
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: 'Referral code not found' }, { status: 404 });
    }
    if (user.disqualified) {
      return NextResponse.json({ error: 'This account is not eligible' }, { status: 403 });
    }

    const board = await getRankedReferrers();
    const referralCount = board.find((r) => r.userId === user.id)?.count ?? 0;

    if (referralCount < tier.threshold) {
      return NextResponse.json(
        {
          error: `You need ${tier.threshold} referrals to claim ${tier.title}. You have ${referralCount}.`,
          referralCount,
          threshold: tier.threshold,
        },
        { status: 403 }
      );
    }

    // Don't grant the same tier twice.
    const { data: existing } = await supabaseAdmin
      .from('referral_rewards')
      .select('reward_type')
      .eq('referral_code', code.trim())
      .eq('reward_type', tier.type)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, alreadyClaimed: true, reward: tier });
    }

    let inserted: { reward_type: string; threshold: number; granted_at: string } | null = null;
    try {
      const { data, error } = await supabaseAdmin
        .from('referral_rewards')
        .insert({
          referral_code: code.trim(),
          reward_type: tier.type,
          threshold: tier.threshold,
        })
        .select('reward_type, threshold, granted_at')
        .single();

      if (!error && data) {
        inserted = data;
      }
    } catch {
      // Table may not exist yet
    }

    if (!inserted) {
      return NextResponse.json({ success: true, simulated: true, reward: tier });
    }

    return NextResponse.json({ success: true, reward: { ...tier, granted_at: inserted.granted_at } });
  } catch (e) {
    console.error('Reward claim error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
