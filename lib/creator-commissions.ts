/**
 * Uni UI Creator Program — commission engine.
 *
 * PURE. No database, no Supabase, no network. It answers exactly one question:
 * given how many paying subscribers a creator has brought, how much does that
 * creator earn per subscriber, and what is the total?
 *
 * Kept pure and side-effect free for three reasons:
 *   1. This is the accounting. It must be readable and checkable by hand
 *      against the program tables, so `npm run verify:creator-commissions`
 *      asserts every published figure.
 *   2. It has to be callable from a payout batch, an admin preview, and the
 *      creator's own dashboard without three copies of the rate table.
 *   3. Paying-subscriber events originate in the main app's subscription
 *      system, not this repo. Keeping the math independent means the ledger can
 *      be wired up later without touching the rules.
 *
 * TWO SEPARATE LADDERS SHARE THIS FILE'S NEIGHBOURHOOD — DO NOT MERGE THEM:
 *
 *   Commission tier  (this file)  Starter/Growing/Established/Top
 *      = paying subscribers brought. Decides RATE.
 *   Status tier      (lib/creators.ts)  Creator/Active/Top/Elite
 *      = activity + community standing. Decides perks.
 *
 * A creator can be Top status on Starter commission: great content, weak
 * conversion. Both being called "Top" is a coincidence, not a shared concept.
 */

// ---------------------------------------------------------------------------
// Rates
// ---------------------------------------------------------------------------

export const COMMISSION_TIERS = ['starter', 'growing', 'established', 'top'] as const;
export type CommissionTier = (typeof COMMISSION_TIERS)[number];

export type TierRate = {
  /** Stable id, persisted on commission ledger rows. */
  id: CommissionTier;
  /** Inclusive lower bound of paying subscribers. */
  min: number;
  /** INCLUSIVE upper bound. null = unbounded. */
  max: number | null;
  label: string;
  /** Fraction of the first payment. */
  first: number;
  /** Fraction of each recurring monthly payment. */
  recurring: number;
};

export const TIER_RATES: readonly TierRate[] = [
  { id: 'starter', min: 0, max: 9, label: 'Starter', first: 0.1, recurring: 0.05 },
  { id: 'growing', min: 10, max: 49, label: 'Growing', first: 0.125, recurring: 0.075 },
  { id: 'established', min: 50, max: 199, label: 'Established', first: 0.15, recurring: 0.1 },
  { id: 'top', min: 200, max: null, label: 'Top', first: 0.2, recurring: 0.1 },
] as const;

/**
 * Flat bonus added to every rate for the founding 20. Permanent, not a
 * time-limited promo — that is the point: it buys ownership, and a bonus that
 * expires is a discount, not an incentive.
 */
export const FOUNDING_BONUS = 0.025;

/** How many months of recurring commission a subscriber earns. */
export const RECURRING_MONTHS = 6;

/**
 * Per-transaction commission cap.
 *
 * Applies to DEEP STUDY ONLY. At the top tier 20% of ₦10,000 is ₦2,000, which
 * is too much to pay on a single one-time purchase. It is deliberately not a
 * global cap: the published Scholar table shows a founding Top creator earning
 * ₦562.50 on a first payment (₦2,500 × 22.5%), which must NOT be clamped.
 */
export const DEEP_STUDY_COMMISSION_CAP = 500;

/**
 * Product prices in whole naira. `recurring: false` means one-time purchase —
 * no subscription, therefore no recurring commission.
 */
export const PRODUCTS = {
  scholar: { id: 'scholar', label: 'Scholar', price: 2_500, recurring: true, commissionCap: null },
  deep_study: {
    id: 'deep_study',
    label: 'Deep Study',
    price: 10_000,
    recurring: false,
    commissionCap: DEEP_STUDY_COMMISSION_CAP,
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;

/**
 * Monthly subscription value used for the "% of LTV" column in the program
 * tables: 12 months of the Scholar subscription. The creator only earns
 * recurring for 6 of those months — that gap is the margin the program keeps.
 */
export const LTV_BASIS = PRODUCTS.scholar.price * 12;

// ---------------------------------------------------------------------------
// Tier resolution
// ---------------------------------------------------------------------------

/**
 * Commission tier for a paying-subscriber count. Higher counts never fall to a
 * lower tier; this is monotonic by construction of TIER_RATES.
 */
export function commissionTier(payingSubscribers: number): CommissionTier {
  const n = Math.max(0, Math.floor(payingSubscribers));
  // Ranges in the published tables are INCLUSIVE on both ends (10-49 Growing),
  // so the boundary comparison must be <=, not <.
  const hit = TIER_RATES.find((t) => t.max === null || n <= t.max);
  return hit?.id ?? 'starter';
}

/** The rate table entry for a tier id. */
export function tierRate(tier: CommissionTier): TierRate {
  const idx = COMMISSION_TIERS.indexOf(tier);
  return TIER_RATES[idx];
}

/**
 * Effective rate for a creator, including the founding bonus.
 * Clamped to [0, 1] so a bad FOUNDING_BONUS can never produce a rate that pays
 * out the subscriber's own money.
 */
export function effectiveRates(
  tier: CommissionTier,
  isFounding: boolean
): { first: number; recurring: number } {
  const base = tierRate(tier);
  const bump = isFounding ? FOUNDING_BONUS : 0;
  return {
    first: Math.min(base.first + bump, 1),
    recurring: Math.min(base.recurring + bump, 1),
  };
}

// ---------------------------------------------------------------------------
// Commission calculation
// ---------------------------------------------------------------------------

export type CommissionBreakdown = {
  tier: CommissionTier;
  tierLabel: string;
  isFounding: boolean;

  product: string;
  /** Gross price of the product before commission. */
  price: number;

  /** Rate applied to the first payment. */
  firstRate: number;
  /** Rate applied to each recurring payment. */
  recurringRate: number;

  /** Commission on the first payment, after any per-transaction cap. */
  firstCommission: number;
  /** Commission on each recurring payment, after any per-transaction cap. */
  recurringCommission: number;
  /** Recurring months actually paid. 0 for one-time products. */
  recurringMonths: number;

  /** firstCommission + recurringCommission * recurringMonths. */
  totalPerSubscriber: number;

  /** totalPerSubscriber as a fraction of LTV_BASIS. 0.081 means 8.1%. */
  ltvShare: number;

  /** True when the per-transaction cap bound this calculation. */
  capped: boolean;
};

/**
 * Commission owed to a creator for ONE paying subscriber.
 *
 * `payingSubscribers` is the creator's TOTAL count and selects the tier. The
 * tier is deliberately global rather than per-subscriber: the program says
 * "tier is based on paying subscribers you've brought" and the rate scales for
 * the whole cohort, so crossing 10 lifts commission on every subscriber, not
 * just the tenth. That is the intended incentive shape — do not "fix" this to
 * be marginal.
 */
export function commissionPerSubscriber(params: {
  payingSubscribers: number;
  isFounding: boolean;
  product?: ProductId;
}): CommissionBreakdown {
  const {
    payingSubscribers,
    isFounding,
    product = 'scholar' as ProductId,
  } = params;

  const tier = commissionTier(payingSubscribers);
  const productDef = PRODUCTS[product];
  const { first, recurring } = effectiveRates(tier, isFounding);

  // Null cap means uncapped (Scholar). Only Deep Study clamps.
  const cap = productDef.commissionCap ?? Infinity;

  const rawFirst = productDef.price * first;
  const firstCommission = Math.min(rawFirst, cap);

  const recurringMonths = productDef.recurring ? RECURRING_MONTHS : 0;
  const rawRecurring = productDef.recurring ? productDef.price * recurring : 0;
  const recurringCommission = Math.min(rawRecurring, cap);

  const totalPerSubscriber =
    round2(firstCommission) + round2(recurringCommission) * recurringMonths;

  return {
    tier,
    tierLabel: tierRate(tier).label,
    isFounding,
    product: productDef.label,
    price: productDef.price,
    firstRate: first,
    recurringRate: recurring,
    firstCommission: round2(firstCommission),
    recurringCommission: round2(recurringCommission),
    recurringMonths,
    totalPerSubscriber: round2(totalPerSubscriber),
    ltvShare: round4(totalPerSubscriber / LTV_BASIS),
    capped: rawFirst > cap || rawRecurring > cap,
  };
}

/**
 * Expected commission across a creator's whole book of business.
 *
 * This is an EXPECTATION, not a payable amount. A creator with 50 paying
 * subscribers may be spread across tiers in reality; the published tables
 * quote the rate for the tier they are in applied to all of them, so this is
 * what the tables say and what a creator should expect to see.
 */
export function projectedCommission(params: {
  payingSubscribers: number;
  isFounding: boolean;
  product?: ProductId;
}): CommissionBreakdown & { subscriberCount: number; projectedTotal: number } {
  const per = commissionPerSubscriber(params);
  const subscriberCount = Math.max(0, Math.floor(params.payingSubscribers));
  return {
    ...per,
    subscriberCount,
    projectedTotal: round2(per.totalPerSubscriber * subscriberCount),
  };
}

// ---------------------------------------------------------------------------
// Creator → creator referral bonus
// ---------------------------------------------------------------------------

/**
 * One-time bonus for recruiting another creator into the program.
 *
 * Deliberately one-time and deliberately NOT multi-level: no downline, no
 * override on the recruited creator's own earnings. The moment this compounds
 * it is an MLM, which the program explicitly is not.
 */
export const CREATOR_RECRUITMENT_BONUS = 2_500;

/** Paid only once the recruited creator is BOTH approved and activated. */
export function recruiterBonusEarned(recruited: {
  approved: boolean;
  activated: boolean;
}): number {
  return recruited.approved && recruited.activated ? CREATOR_RECRUITMENT_BONUS : 0;
}

// ---------------------------------------------------------------------------
// Payout thresholds
// ---------------------------------------------------------------------------

/** Weekly batch, every Monday. */
export const PAYOUT_WEEKDAY = 1;

/** Balance below this is carried over, not paid. */
export const PAYOUT_MINIMUM = 10_000;

/** Days after a subscriber's payment before commission is payable (refunds). */
export const PAYOUT_HOLD_DAYS = 7;

/**
 * Whether a balance is payable this batch.
 * `heldUntil` is the timestamp after which refund protection expires; compare
 * against the batch time, not against now, so a replayed batch is deterministic.
 */
export function isPayable(params: {
  balance: number;
  heldUntil: Date | string | null;
  batchTime: Date | string;
}): { payable: boolean; reason: string } {
  const { balance, heldUntil, batchTime } = params;
  if (balance <= 0) return { payable: false, reason: 'nothing owing' };
  if (balance < PAYOUT_MINIMUM) return { payable: false, reason: 'below minimum' };
  if (heldUntil) {
    const until = new Date(heldUntil).getTime();
    const at = new Date(batchTime).getTime();
    if (!Number.isFinite(until) || until > at) return { payable: false, reason: 'still in hold period' };
  }
  return { payable: true, reason: 'payable' };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Round to 2dp. Money, not percentages. */
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function round4(n: number): number {
  return Math.round((n + Number.EPSILON) * 10_000) / 10_000;
}
