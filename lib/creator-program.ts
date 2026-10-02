/**
 * Uni UI Creator Programme — programme configuration.
 *
 * Single source of truth for everything that is *positioning* rather than
 * *maths*: the cohort size, the founding bundle tiers, the perk inventory, and
 * the pre-launch content pillars.
 *
 * Deliberately separate from lib/creator-commissions.ts, which is the pure
 * money. This module describes what we offer and how we talk about it, and can
 * change without any risk to a payout calculation.
 *
 * THE MODEL, IN ONE LINE: the creator network exists independently of the
 * product. Creators start building their audience on day one of approval.
 * Uni UI V2 launches into an audience that already exists.
 *
 * Two things that are easy to get wrong, and are load-bearing here:
 *
 *   1. FOUNDING_BONUS_COUNT is 20, not the 500 cohort size. The +2.5% rate
 *      bump is the original founding cohort's incentive. All 500 hold permanent
 *      numbered Founding Creator STATUS, but only the first 20 carry the rate
 *      bump. Widening the bump to 500 would raise commission cost roughly 25x
 *      and is a different financial decision — see lib/creator-commissions.ts.
 *
 *   2. Referral links are issued AT APPROVAL, not at launch. Anything that gates
 *      link issuance on V2 contradicts the immediate-start model.
 */

/** Total size of the founding network. */
export const FOUNDING_NETWORK_SIZE = 500;

/**
 * Spots carrying the +2.5% permanent commission bump.
 * Matches FOUNDING_NETWORK_TIERS[0].size.
 */
export const FOUNDING_BONUS_COUNT = 20;

/** Average engaged followers assumed per creator, for network-size arithmetic. */
export const ASSUMED_FOLLOWERS_PER_CREATOR = 1_000;

// ---------------------------------------------------------------------------
// Founding bundle tiers
// ---------------------------------------------------------------------------

export type BundleTier = {
  id: 'founding_20' | 'founding_100' | 'founding_500';
  name: string;
  /** Cumulative spot number this tier ends at. */
  upTo: number;
  /** Spots in this tier. */
  size: number;
  /** Cash cost per creator in this tier, in naira. */
  costEach: number;
  /** What this tier's bundle is described as. */
  bundle: string;
};

export const FOUNDING_NETWORK_TIERS: readonly BundleTier[] = [
  {
    id: 'founding_20',
    name: 'Founding 20',
    upTo: 20,
    size: 20,
    costEach: 12_450,
    bundle: 'The original founding cohort. Carries the permanent +2.5% commission bump.',
  },
  {
    id: 'founding_100',
    name: 'Founding 100',
    upTo: 100,
    size: 80,
    costEach: 4_000,
    bundle: 'The first hundred. Everything except the rate bump.',
  },
  {
    id: 'founding_500',
    name: 'Founding 500',
    upTo: 500,
    size: 400,
    costEach: 1_200,
    bundle: 'The full network. Creator access, currency, status and upside.',
  },
] as const;

/** Total cash cost of the full network. Asserted by the build, not just docs. */
export const NETWORK_TOTAL_COST = FOUNDING_NETWORK_TIERS.reduce(
  (sum, t) => sum + t.size * t.costEach,
  0
) + 575_000; // referral bonuses

/**
 * Which tier a creator (1-indexed spot number) lands in.
 */
export function tierForSpot(spot: number): BundleTier {
  for (const t of FOUNDING_NETWORK_TIERS) {
    if (spot <= t.upTo) return t;
  }
  return FOUNDING_NETWORK_TIERS[FOUNDING_NETWORK_TIERS.length - 1];
}

/** Combined warm audience the network represents at full strength. */
export const NETWORK_AUDIENCE = FOUNDING_NETWORK_SIZE * ASSUMED_FOLLOWERS_PER_CREATOR;

// ---------------------------------------------------------------------------
// The bundle
// ---------------------------------------------------------------------------

/**
 * Every perk is framed as a network-building TOOL, not a product sample.
 * `tool` is the "why it matters" line shown on the page.
 */
export type Perk = {
  name: string;
  tool: string;
  icon:
    | 'sparkles' | 'coins' | 'badge' | 'link' | 'chart' | 'users'
    | 'megaphone' | 'rocket' | 'award' | 'wifi' | 'briefcase' | 'shirt';
};

export const CREATOR_BUNDLE: readonly Perk[] = [
  {
    name: 'Creator access — 6 months Premium',
    tool: 'Your working tool. You cannot demo credibly what you have not used.',
    icon: 'sparkles',
  },
  {
    name: '5,000 tokens',
    tool: "The network's currency. Gift them, spend them on giveaway subscriptions, run your own mini-campaigns, or hold them.",
    icon: 'coins',
  },
  {
    name: 'Your permanent referral slug',
    tool: 'Your address in the network. Yours for as long as the network exists.',
    icon: 'link',
  },
  {
    name: 'Founding Creator status',
    tool: 'Permanent and numbered. Proof you were here at the beginning.',
    icon: 'badge',
  },
  {
    name: 'Creator dashboard',
    tool: 'Your command centre. Clicks, signups, earnings and network growth.',
    icon: 'chart',
  },
  {
    name: 'The creator community',
    tool: 'Collaboration, cross-promotion and people who understand the work.',
    icon: 'users',
  },
  {
    name: 'Campaign infrastructure',
    tool: 'You do not have to invent content. We supply briefs, assets and direction.',
    icon: 'megaphone',
  },
  {
    name: 'Commission — 10–20% first, 5–10% × 6 months',
    tool: 'Scales automatically with the subscribers you bring. Uncapped.',
    icon: 'coins',
  },
  {
    name: 'V2 early access',
    tool: 'You will be first, because you built the audience while it was still cold.',
    icon: 'rocket',
  },
  {
    name: 'Founding certificate',
    tool: 'A record of your place in the network, dated and permanent.',
    icon: 'award',
  },
  {
    name: 'Network operations support',
    tool: 'Data and tooling support so you are not creating on an empty phone.',
    icon: 'wifi',
  },
  {
    name: 'Career asset',
    tool: 'A referenceable, documented role you can point to after the network grows.',
    icon: 'briefcase',
  },
] as const;

// ---------------------------------------------------------------------------
// Pre-launch content pillars
// ---------------------------------------------------------------------------

export type Pillar = {
  name: string;
  example: string;
  purpose: string;
};

/**
 * What creators post BEFORE the product exists.
 *
 * The governing rule is in `PRELAUNCH_RULE`: never pitch a product that does not
 * exist yet. Pitch the journey, the problem, and the creator's own story. When
 * V2 lands these audiences already trust the creator, which is the entire point
 * of starting before launch.
 */
export const PRELAUNCH_PILLARS: readonly Pillar[] = [
  {
    name: 'The Journey',
    example: '"Day 1 as a Founding Creator"',
    purpose: 'Builds your creator brand and makes the network visible.',
  },
  {
    name: 'The Problem',
    example: '"Why studying in Nigeria is broken"',
    purpose: 'Sets up the solution without ever pitching it.',
  },
  {
    name: 'The Build',
    example: '"What I am building with 500 other creators"',
    purpose: 'Creates anticipation and makes joining feel like momentum.',
  },
  {
    name: 'The Tips',
    example: '"3 study hacks I actually use"',
    purpose: 'Your normal content, with a subtle affiliation to the network.',
  },
  {
    name: 'The Network',
    example: '"Meet the other Founding Creators"',
    purpose: 'Cross-promotion and community growth.',
  },
  {
    name: 'The Countdown',
    example: '"Something is coming. Here is what I know."',
    purpose: 'Anticipation and a reason to follow you until it drops.',
  },
] as const;

export const PRELAUNCH_RULE =
  'Never pitch the product before it exists. Pitch the journey, the problem and your own story. ' +
  'When V2 launches, you pivot to product content into an audience that already trusts you.';

// ---------------------------------------------------------------------------
// The immediate-start path
// ---------------------------------------------------------------------------

export type Week = {
  week: string;
  focus: string;
  posts: string;
};

/** Weeks 1-6. The creator is active from approval, not from launch. */
export const IMMEDIATE_START_PATH: readonly Week[] = [
  {
    week: 'Week 1',
    focus: 'Onboard and set up your creator identity',
    posts: 'Introduction post: "I am building with UniUI."',
  },
  {
    week: 'Week 2',
    focus: 'Learn the creator tools and meet the network',
    posts: 'Behind the scenes: what you are building, and why.',
  },
  {
    week: 'Week 3',
    focus: 'Start network-building content',
    posts: '"Join my network" posts carrying your referral slug.',
  },
  {
    week: 'Week 4',
    focus: 'Your first campaign',
    posts: '"The problem I am solving for students."',
  },
  {
    week: 'Week 5+',
    focus: 'Ongoing network building',
    posts: 'Study tips, campus content, creator life. Your normal content, affiliated.',
  },
  {
    week: 'At V2 launch',
    focus: 'Activate the network you already built',
    posts: 'Coordinated launch content, into a warm audience.',
  },
] as const;

export const CREATOR_RECRUITMENT_BONUS = 2_500;