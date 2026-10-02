/**
 * CSRF protection for API routes.
 *
 * Uses the "custom header" technique: browsers automatically block
 * cross-origin requests from setting custom headers unless CORS is
 * explicitly enabled on the target. By requiring a custom header like
 * `x-requested-with: kiloadmin`, we make CSRF impractical without CORS.
 */

import type { NextRequest } from 'next/server';

const REQUIRED_HEADER = 'x-requested-with';
const REQUIRED_VALUE = 'kiloadmin';

export function assertCsrf(request: NextRequest): void {
  const header = request.headers.get(REQUIRED_HEADER);
  if (header !== REQUIRED_VALUE) {
    throw new Error('CSRF');
  }
}

/**
 * Client-side counterpart to {@link assertCsrf}.
 *
 * Spread into the headers of any mutating admin request:
 *   fetch(url, { method: 'PATCH', headers: csrfHeaders({ 'Content-Type': 'application/json' }), body })
 *
 * Single definition — the header name and value must match what assertCsrf
 * checks, so they are exported from the same module rather than repeated in
 * each component.
 */
export function csrfHeaders(extra?: Record<string, string>): Record<string, string> {
  return { 'Content-Type': 'application/json', [REQUIRED_HEADER]: REQUIRED_VALUE, ...extra };
}
