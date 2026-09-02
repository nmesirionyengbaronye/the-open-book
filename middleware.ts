import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_MS = 60 * 60 * 24 * 1000; // 24 hours

const encoder = new TextEncoder();

/**
 * Admin guard for the Edge middleware. Verifies the HMAC-signed session cookie
 * produced by lib/admin-session.createSession (same token format:
 * `<expiryEpochMs>.<hexSig>`, HMAC-SHA256). The secret is ADMIN_SESSION_SECRET
 * falling back to ADMIN_PASSWORD — never shipped to the browser.
 *
 * Edge runtime uses Web Crypto (async); the Node API routes verify the same
 * token format with Node's `crypto` in lib/admin-session, so both sides agree.
 */

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function hex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token || !getSecret()) return false;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp <= Date.now()) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const expected = hex(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      const session = request.cookies.get(SESSION_COOKIE)?.value;
      if (!(await isValidSession(session))) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
