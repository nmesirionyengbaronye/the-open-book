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
