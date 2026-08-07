import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: top } = await supabaseAdmin
      .from('waitlist')
      .select('id, referral_code, full_name, wallet_balance')
      .eq('disqualified', false)
      .order('wallet_balance', { ascending: false })
      .limit(10);

    if (!top || top.length === 0) return NextResponse.json([]);

    const ids = top.map((t: any) => t.id);
    const { data: counts } = await supabaseAdmin
      .from('referral_counts')
      .select('referrer_id, verified_count')
      .in('referrer_id', ids);

    const map = new Map<string, number>(
      (counts || []).map((c: any) => [c.referrer_id, c.verified_count])
    );

    const winners = top.map((t: any) => ({
      name: t.full_name,
      code: t.referral_code,
      winnings: t.wallet_balance || 0,
      referrals: map.get(t.id) || 0,
    }));

    return NextResponse.json(winners);
  } catch (e) {
    console.error('[rewards/winners]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
