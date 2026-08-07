import { NextRequest, NextResponse } from 'next/server';
import { spinWheel } from '@/lib/rewards';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });
    const res = await spinWheel(code);
    if (!res.ok) return NextResponse.json(res, { status: 400 });
    return NextResponse.json(res);
  } catch (e) {
    console.error('[rewards/spin]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
