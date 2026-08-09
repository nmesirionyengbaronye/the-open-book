import { NextRequest, NextResponse } from 'next/server';
import { verifyTelegram } from '@/lib/rewards';
import { validateTelegramInitData, parseInitDataUser, parseInitDataContact } from '@/lib/telegram';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();
    if (!initData || !validateTelegramInitData(initData)) {
      return NextResponse.json({ error: 'Invalid Telegram session' }, { status: 401 });
    }

    const tgUser = parseInitDataUser(initData);
    if (!tgUser?.id) {
      return NextResponse.json(
        { ok: false, reason: 'invalid_session', error: 'Missing Telegram user.' },
        { status: 400 }
      );
    }
    const telegramId = String(tgUser.id);

    // Trusted phone resolution (client can NEVER forge this):
    //   1. Signed contact embedded in initData (fast path, when present).
    //   2. Bot-stored contact delivered via webhook (reliable path).
    let phone: string | null = parseInitDataContact(initData)?.phone_number ?? null;
    if (!phone) {
      const { data } = await supabaseAdmin
        .from('telegram_contacts')
        .select('phone')
        .eq('telegram_id', telegramId)
        .maybeSingle();
      phone = data?.phone ?? null;
    }

    // The contact may still be in flight from Telegram to the bot. Tell the
    // client to retry shortly rather than failing.
    if (!phone) {
      console.log('[rewards/verify] no contact yet (waiting on bot webhook)');
      return NextResponse.json(
        {
          ok: false,
          reason: 'contact_pending',
          error: 'Still waiting for your contact from Telegram — retrying…',
        },
        { status: 202 }
      );
    }

    const res = await verifyTelegram(String(phone), telegramId, tgUser?.username);
    if (!res.ok) return NextResponse.json(res, { status: 400 });
    return NextResponse.json(res);
  } catch (e) {
    console.error('[rewards/verify] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
