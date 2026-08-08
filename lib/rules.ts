import { MILESTONE } from '@/lib/referral-counts';

/**
 * The giveaway rules, written once.
 *
 * Previously there were two near-identical lists — RewardsMiniApp.RULES (the
 * Telegram Mini App) and ReferralDashboard.RulesGate (the web dashboard) —
 * which could drift apart and promise users different terms.
 *
 * `REFERRAL_RULES` is the short web-dashboard gate; `GIVEAWAY_RULES` is the
 * fuller Telegram list. Both derive their numbers from MILESTONE.
 */

export const REFERRAL_RULES: string[] = [
  'Refer friends with your unique link. They appear as "joined" right away and move you up once they verify.',
  `Every ${MILESTONE} verified referrals unlock 1 spin — ${MILESTONE} → 1 spin, ${MILESTONE * 2} → 2 spins, ${MILESTONE * 3} → 3 spins, and so on. Unlimited. Pending referrals don't count until verified.`,
  'Each spin is paid out immediately as a cash prize to your wallet.',
  `At AI launch you receive 500 tokens for every ${MILESTONE} verified referrals — usable inside the Uni UI app.`,
  'Top referrers are featured on the Hall of Fame.',
  'Duplicate signups are blocked (one per WhatsApp number), so only real new signups count.',
];

export const GIVEAWAY_RULES: string[] = [
  `Earn 1 spin for every ${MILESTONE} verified referrals. Spins are unlimited as long as you keep referring. A referral only counts once the friend verifies — pending ones stay pending.`,
  'Each spin is paid out as cash to your in-app wallet immediately after it lands.',
  'Spin prizes are random — most land on ₦200, with rarer ₦500–₦10,000 wins. The first two players get a guaranteed ₦1,000 on their first spin.',
  `Mystery boxes (containing 1, 2 or 5 spin tickets) unlock at every ${MILESTONE}-referral milestone (verified).`,
  'Referrals must be real, verified people. Fake, recycled, or self-referrals are not allowed.',
  'One account per person. Multiple accounts, bots, or VPN abuse lead to disqualification and forfeited winnings.',
  'Prizes are promotional. UniUI may review activity and withhold payouts where abuse is suspected.',
  'UniUI reserves the right to modify, pause, or end the giveaway at any time, with notice in the community.',
];
