import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

/**
 * Telegram bot webhook. When a Mini App user shares their contact via
 * WebApp.requestContact(), Telegram delivers it here as a message with a
 * `contact` field. We store the REAL, verified phone keyed by Telegram user id.
 * The rewards verify flow trusts this stored value (never a client-supplied one).
 *
 * Register with: scripts/set-webhook.mjs
 * Secured via X-Telegram-Bot-Api-Secret-Token (set with setWebhook secret_token).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const update = await req.json();
    const contact = update?.message?.contact;
    if (contact?.user_id && contact?.phone_number) {
      await supabaseAdmin.from('telegram_contacts').upsert(
        {
          telegram_id: String(contact.user_id),
          phone: String(contact.phone_number),
          received_at: new Date().toISOString(),
        },
        { onConflict: 'telegram_id' }
      );
    }
  } catch {
    /* ignore malformed updates */
  }
  return NextResponse.json({ ok: true });
}
