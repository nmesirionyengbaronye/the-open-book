import { NextRequest, NextResponse } from 'next/server';
import { getWallet } from '@/lib/rewards';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });
  try {
    const w = await getWallet(code);
    if (!w) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(w);
  } catch (e) {
    console.error('[rewards/wallet]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
