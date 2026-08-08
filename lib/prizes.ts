/**
 * Wheel prize values — the single source shared by the server-side prize draw
 * (lib/rewards.ts) and the client wheel rendering (components/rewards/SpinWheel).
 *
 * This lives in its own module because SpinWheel is a client component and
 * lib/rewards.ts imports the Supabase service-role client, which must never be
 * bundled for the browser.
 *
 * Prize *weights* stay server-only in lib/rewards.ts — the client must not be
 * able to read the odds.
 */
export const PRIZE_VALUES = [200, 500, 1000, 2000, 5000, 10000] as const;
