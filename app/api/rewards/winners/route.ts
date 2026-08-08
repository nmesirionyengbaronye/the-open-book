import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getRankedReferrers } from '@/lib/referral-counts';

export async function GET() {
  try {
    const { data: top } = await supabaseAdmin
      .from('waitlist')
      .select('id, referral_code, full_name, wallet_balance')
      .eq('disqualified', false)
      // Only surface people who have actually won the wheel (wallet > 0).
      // If nobody has won yet, the Hall of Fame / Recent winners stay empty.
      .gt('wallet_balance', 0)
      .order('wallet_balance', { ascending: false })
      .limit(10);

    if (!top || top.length === 0) return NextResponse.json([]);

    // Canonical referral counts, so the number beside a winner matches their
    // dashboard and leaderboard entry.
    const board = await getRankedReferrers();
    const map = new Map(board.map((r) => [r.userId, r.count]));

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
