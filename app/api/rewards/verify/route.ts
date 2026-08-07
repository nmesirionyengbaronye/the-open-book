import { NextRequest, NextResponse } from 'next/server';
import { verifyTelegram } from '@/lib/rewards';
import { validateTelegramInitData, parseInitDataUser } from '@/lib/telegram';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { phone, telegramId, username, initData } = await req.json();
    if (!initData || !validateTelegramInitData(initData)) {
      return NextResponse.json({ error: 'Invalid Telegram session' }, { status: 401 });
    }
    const tgUser = parseInitDataUser(initData);
    const finalTgId = telegramId || tgUser?.id;
    const finalUser = username || tgUser?.username;
    if (!phone || !finalTgId) {
      return NextResponse.json(
        { error: 'phone and telegramId are required' },
        { status: 400 }
      );
    }
    const res = await verifyTelegram(phone, String(finalTgId), finalUser);
    if (!res.ok) return NextResponse.json(res, { status: 400 });
    return NextResponse.json(res);
  } catch (e) {
    console.error('[rewards/verify]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
