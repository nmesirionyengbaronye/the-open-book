import crypto from 'crypto';

/**
 * Validate a Telegram Mini App initData string (HMAC-SHA256, per Telegram spec).
 * Without BOT_TOKEN we cannot validate; in dev we allow (with a warning), in
 * production we reject. This is what stops the rewards page from being usable
 * outside a genuine Telegram session.
 */
export function validateTelegramInitData(initData: string): boolean {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    if (process.env.NODE_ENV === 'production') return false;
    console.warn('[telegram] BOT_TOKEN missing — initData validation skipped (dev mode)');
    return true;
  }

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return false;
  params.delete('hash');

  const dataCheckString = Array.from(params.entries())
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computed = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  return computed === hash;
}

export function parseInitDataUser(
  initData: string
): { id: number; username?: string; first_name?: string } | null {
  const params = new URLSearchParams(initData);
  const userRaw = params.get('user');
  if (!userRaw) return null;
  try {
    const u = JSON.parse(userRaw);
    return { id: u.id, username: u.username, first_name: u.first_name };
  } catch {
    return null;
  }
}

/**
 * Extract the phone contact shared via WebApp.requestContact().
 * This is the user's REAL, Telegram-verified number — it is embedded in the
 * signed `initData` string, so once validateTelegramInitData() passes, the
 * `phone_number` here is trustworthy and cannot be forged by the client.
 * Returns null when the user has not yet shared their contact.
 */
export function parseInitDataContact(
  initData: string
): { phone_number: string; user_id: number | string } | null {
  const params = new URLSearchParams(initData);
  const contactRaw = params.get('contact');
  if (!contactRaw) return null;
  try {
    const c = JSON.parse(contactRaw);
    if (!c?.phone_number) return null;
    return { phone_number: String(c.phone_number), user_id: c.user_id };
  } catch {
    return null;
  }
}
