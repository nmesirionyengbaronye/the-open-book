#!/usr/bin/env node
/**
 * Asserts the commission engine against every figure published in the Creator
 * Program plan. Run: npm run verify:creator-commissions
 *
 * The published tables are the contract. If this script fails, either the code
 * or the published number is wrong — and money is involved, so resolve it
 * before paying anybody.
 *
 * Imports lib/creator-commissions.ts directly via Node's native type stripping
 * (Node 22.6+/24, `--experimental-strip-types`), so this checks the actual
 * shipped module rather than a reimplementation. That module is deliberately
 * dependency-free and uses erasable-only syntax, which is what makes this work.
 */

import {
  commissionPerSubscriber,
  commissionTier,
  isPayable,
  CREATOR_RECRUITMENT_BONUS,
  DEEP_STUDY_COMMISSION_CAP,
  FOUNDING_BONUS,
  LTV_BASIS,
  PAYOUT_MINIMUM,
  RECURRING_MONTHS,
  recruiterBonusEarned,
} from '../lib/creator-commissions.ts';

let failures = 0;
let checks = 0;

function eq(label, actual, expected) {
  checks++;
  const ok = typeof expected === 'number' && typeof actual === 'number'
    ? Math.abs(actual - expected) < 0.005
    : Object.is(actual, expected);
  if (!ok) {
    failures++;
    console.log(`  FAIL  ${label}\n        expected ${expected}, got ${actual}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

// ---------------------------------------------------------------------------
section('Tier boundaries');
// ---------------------------------------------------------------------------
for (const [n, expected] of [
  [0, 'starter'], [9, 'starter'],
  [10, 'growing'], [49, 'growing'],
  [50, 'established'], [199, 'established'],
  [200, 'top'], [5000, 'top'],
]) {
  eq(`tier(${n})`, commissionTier(n), expected);
}

// ---------------------------------------------------------------------------
section('Plan 3.3 — standard creator, N2,500 Scholar');
// ---------------------------------------------------------------------------
const standard = {
  Starter: [9, 250, 125, 750, 1000, 0.0333],
  Growing: [49, 312.5, 187.5, 1125, 1437.5, 0.0479],
  Established: [199, 375, 250, 1500, 1875, 0.0625],
  Top: [200, 500, 250, 1500, 2000, 0.0667],
};
for (const [label, [n, first, rec, recTotal, total, ltv]] of Object.entries(standard)) {
  const c = commissionPerSubscriber({ payingSubscribers: n, isFounding: false });
  eq(`${label} label`, c.tierLabel, label);
  eq(`${label} first`, c.firstCommission, first);
  eq(`${label} recurring/mo`, c.recurringCommission, rec);
  eq(`${label} recurring total`, c.recurringCommission * c.recurringMonths, recTotal);
  eq(`${label} total`, c.totalPerSubscriber, total);
  eq(`${label} % of LTV`, c.ltvShare, ltv);
}

// ---------------------------------------------------------------------------
section('Plan 3.2 — founding creator, +2.5% permanent');
// ---------------------------------------------------------------------------
const founding = {
  Starter: [9, 312.5, 187.5, 1125, 1437.5, 0.0479],
  Growing: [49, 375, 250, 1500, 1875, 0.0625],
  Established: [199, 437.5, 312.5, 1875, 2312.5, 0.0771],
  Top: [200, 562.5, 312.5, 1875, 2437.5, 0.0813],
};
for (const [label, [n, first, rec, recTotal, total, ltv]] of Object.entries(founding)) {
  const c = commissionPerSubscriber({ payingSubscribers: n, isFounding: true });
  eq(`founding ${label} label`, c.tierLabel, label);
  eq(`founding ${label} first`, c.firstCommission, first);
  eq(`founding ${label} recurring/mo`, c.recurringCommission, rec);
  eq(`founding ${label} recurring total`, c.recurringCommission * c.recurringMonths, recTotal);
  eq(`founding ${label} total`, c.totalPerSubscriber, total);
  eq(`founding ${label} % of LTV`, c.ltvShare, ltv);
}
eq('founding bonus is exactly +2.5%', FOUNDING_BONUS, 0.025);
eq('recurring window is 6 months', RECURRING_MONTHS, 6);

// ---------------------------------------------------------------------------
section('Plan 3.4 — Deep Study N10,000 capped at N500');
// ---------------------------------------------------------------------------
const dsFoundingTop = commissionPerSubscriber({
  payingSubscribers: 200, isFounding: true, product: 'deep_study',
});
eq('22.5% of 10k = 2250 -> capped at 500', dsFoundingTop.firstCommission, DEEP_STUDY_COMMISSION_CAP);
eq('one-time product earns no recurring', dsFoundingTop.recurringMonths, 0);
eq('deep study total is the cap', dsFoundingTop.totalPerSubscriber, DEEP_STUDY_COMMISSION_CAP);
eq('cap is reported as binding', dsFoundingTop.capped, true);

const dsStandardStarter = commissionPerSubscriber({
  payingSubscribers: 0, isFounding: false, product: 'deep_study',
});
eq('10% of 10k = 1000 -> capped at 500', dsStandardStarter.firstCommission, 500);

// The cap is Deep Study ONLY. Scholar must stay uncapped even at the top
// founding rate, because the published table shows N562.50 there. A global cap
// silently underpays founding Top creators by N62.50 per subscriber.
const scholarTopFounding = commissionPerSubscriber({
  payingSubscribers: 200, isFounding: true, product: 'scholar',
});
eq('scholar is never capped', scholarTopFounding.capped, false);
eq('scholar founding top first = 562.50', scholarTopFounding.firstCommission, 562.5);

// ---------------------------------------------------------------------------
section('Plan 3.3 — margin guard: creators stay under 10% of LTV');
// ---------------------------------------------------------------------------
eq('LTV basis = 2500 x 12', LTV_BASIS, 30000);
for (const n of [0, 25, 100, 500]) {
  for (const isFounding of [false, true]) {
    const c = commissionPerSubscriber({ payingSubscribers: n, isFounding });
    eq(
      `tier(${n}) founding=${isFounding} under 10% of LTV (${(c.ltvShare * 100).toFixed(2)}%)`,
      c.ltvShare <= 0.1,
      true
    );
  }
}

// ---------------------------------------------------------------------------
section('Plan 10 — creator-to-creator recruitment bonus is one-time');
// ---------------------------------------------------------------------------
eq('bonus is N2,500', CREATOR_RECRUITMENT_BONUS, 2500);
eq('approved + activated -> paid', recruiterBonusEarned({ approved: true, activated: true }), 2500);
eq('approved but not activated -> 0', recruiterBonusEarned({ approved: true, activated: false }), 0);
eq('activated but not approved -> 0', recruiterBonusEarned({ approved: false, activated: true }), 0);
eq('neither -> 0', recruiterBonusEarned({ approved: false, activated: false }), 0);

// Two recruited creators, two bonuses — still one per recruit, never compounding.
eq('two recruits = 2 x one-time bonus',
  recruiterBonusEarned({ approved: true, activated: true }) +
    recruiterBonusEarned({ approved: true, activated: true }),
  2 * CREATOR_RECRUITMENT_BONUS);

// ---------------------------------------------------------------------------
section('Plan 12 — payout gate');
// ---------------------------------------------------------------------------
const batch = '2026-10-05T09:00:00Z'; // a Monday
eq('above minimum, no hold -> payable',
  isPayable({ balance: 12000, heldUntil: null, batchTime: batch }).payable, true);
eq('N9,999 is below minimum -> held',
  isPayable({ balance: 9999, heldUntil: null, batchTime: batch }).payable, false);
eq('exactly N10,000 -> payable',
  isPayable({ balance: PAYOUT_MINIMUM, heldUntil: null, batchTime: batch }).payable, true);
eq('zero balance -> nothing owing',
  isPayable({ balance: 0, heldUntil: null, batchTime: batch }).payable, false);
eq('negative balance -> nothing owing',
  isPayable({ balance: -500, heldUntil: null, batchTime: batch }).payable, false);
eq('inside 7-day refund hold -> held',
  isPayable({ balance: 20000, heldUntil: '2026-10-10T00:00:00Z', batchTime: batch }).payable, false);
eq('hold expired -> payable',
  isPayable({ balance: 20000, heldUntil: '2026-10-01T00:00:00Z', batchTime: batch }).payable, true);

// ---------------------------------------------------------------------------
section('Monotonicity — more subscribers must never earn less per head');
// ---------------------------------------------------------------------------
for (const isFounding of [false, true]) {
  let prev = -1;
  for (const n of [0, 5, 10, 25, 50, 100, 200, 400, 1000]) {
    const { totalPerSubscriber } = commissionPerSubscriber({ payingSubscribers: n, isFounding });
    eq(`founding=${isFounding} n=${n} earns >= previous`, totalPerSubscriber >= prev, true);
    prev = totalPerSubscriber;
  }
}

// ---------------------------------------------------------------------------
console.log(
  `\n${failures === 0 ? 'PASS' : 'FAIL'} - ${checks - failures}/${checks} checks passed.`
);
if (failures > 0) {
  console.log('\nDo not pay anybody until these match the published program tables.');
  process.exit(1);
}
