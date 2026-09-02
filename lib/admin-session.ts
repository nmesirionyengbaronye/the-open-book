import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_MS = 60 * 60 * 24 * 1000; // 24 hours

// Signing secret for admin sessions. Prefer ADMIN_SESSION_SECRET; fall back to
// ADMIN_PASSWORD so no extra config is needed. This value is server-only and
// is never shipped to the browser.
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';

/**
 * Stateless admin sessions.
 *
 * The previous implementation kept session tokens in an in-memory Map, which
 * does not survive Vercel serverless invocations (cold starts / separate
 * containers), so every protected request looked unauthenticated. The cookie
 * value is now an HMAC-signed token: `<expiryEpochMs>.<hex(signature)>`.
 * Verification is self-contained (signature + expiry), so it works identically
 * across serverless invocations, Node API routes, and the Edge middleware.
 */

function sign(payload: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
}

export function createSession(): {
  token: string;
  cookie: { name: string; value: string; options: Record<string, any> };
} {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = String(exp);
  const token = `${payload}.${sign(payload)}`;
  return {
    token,
    cookie: {
      name: SESSION_COOKIE,
      value: token,
      options: {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: Math.floor(SESSION_TTL_MS / 1000),
        secure: process.env.NODE_ENV === 'production',
      },
    },
  };
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export function isValidSession(token: string | undefined): boolean {
  if (!token || !SESSION_SECRET) return false;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp <= Date.now()) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  // constant-time comparison to avoid timing side channels
  return crypto.timingSafeEqual(a, b);
}

export function destroySession(token: string): void {
  // Stateless: there is nothing server-side to delete. The client clears the
  // cookie (see /api/admin/logout), which is sufficient.
}
