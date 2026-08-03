import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const REWARD_TIERS = [
  { type: 'early_access', threshold: 5, title: 'Early Access' },
  { type: 'founding_member', threshold: 10, title: 'Founding Member' },
  { type: 'semester_credits', threshold: 25, title: 'Free Semester Credits' },
  { type: 'lifetime_access', threshold: 50, title: 'Lifetime Access' },
];

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

    const tier = REWARD_TIERS.find((t) => t.type === reward_type);
    if (!tier) {
      return NextResponse.json({ error: 'Unknown reward type' }, { status: 400 });
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
