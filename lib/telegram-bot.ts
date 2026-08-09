// Lightweight Telegram Bot API client (dependency-free).
// Provides the bot interactions the rewards platform needs (broadcast, etc.)
// without pulling in a heavy SDK. Swap for `grammy` later if desired.
//
// API reference: https://core.telegram.org/bots/api
const BASE = 'https://api.telegram.org/bot';

export type SendMessageResult = { ok: boolean; error?: string };

export function getBotToken(): string | undefined {
  return process.env.BOT_TOKEN;
}

export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<SendMessageResult> {
  try {
    const res = await fetch(`${BASE}${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
    });
    if (res.ok) return { ok: true };
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: (err as any)?.description || `HTTP ${res.status}` };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'network error' };
  }
}
