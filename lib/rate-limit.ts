import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter for serverless environments.
 * Keys are scoped by identifier + action, e.g. "join:192.168.1.1".
 *
 * For production scale, replace with Redis/Upstash.
 */

type RateLimitEntry = { count: number; resetAt: number };

const WINDOW_MS = 60_000; // 1 minute
const DEFAULT_LIMIT = 10;

const store = new Map<string, RateLimitEntry>();

function cleanUp() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export function rateLimit(
  identifier: string,
  action: string,
  limit = DEFAULT_LIMIT
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanUp();
  const key = `${action}:${identifier}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}
