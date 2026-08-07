import { NextRequest, NextResponse } from 'next/server';
import { resolveUser, getLeaderboard } from '@/lib/rewards';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code') || undefined;
    let currentUserId: string | undefined;
    if (code) {
      const u = await resolveUser(code);
      currentUserId = u?.id;
    }
    const board = await getLeaderboard(currentUserId);
    return NextResponse.json(board);
  } catch (e) {
    console.error('[rewards/leaderboard]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
