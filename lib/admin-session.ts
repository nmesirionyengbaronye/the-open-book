/**
 * Admin session management using secure random tokens.
 *
 * Tokens are stored server-side in memory. This is suitable for a single
 * Next.js instance; for multi-instance deployments, replace the in-memory
 * store with Redis or a database table.
 */

import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_MS = 60 * 60 * 24 * 1000; // 24 hours

/**
 * In-memory session store: token -> expiry timestamp.
 * WARNING: this resets on server restart. For multi-instance or persistent
 * deployments, move this to Redis or a database.
 */
const sessions = new Map<string, number>();

function cleanupExpired(): void {
  const now = Date.now();
  for (const [token, expiry] of sessions.entries()) {
    if (expiry <= now) sessions.delete(token);
  }
}

export function createSession(): { token: string; cookie: { name: string; value: string; options: Record<string, any> } } {
  cleanupExpired();
  const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const expiry = Date.now() + SESSION_TTL_MS;
  sessions.set(token, expiry);
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
  if (!token) return false;
  cleanupExpired();
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (expiry <= Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}
