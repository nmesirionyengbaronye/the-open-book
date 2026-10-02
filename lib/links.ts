/**
 * Shared app-wide links and copy.
 *
 * Keep single-sourced values here rather than re-declaring them per component —
 * WHATSAPP_URL previously existed in both JoinForm.tsx and ReferralDashboard.tsx.
 */

export const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/UniUICommunity';

/** Live Uni UI web app — available for FUTO students today. */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.uniui.com.ng';

/** Graduated rollout plan for waitlisted Southern-Nigeria universities.
 *
 * - Wave 1 (November 2026): the first 6 universities go live on app.uniui.com.ng.
 * - Then 3 universities go live every month.
 * - By August 2027 the entire Southern-Nigeria university lineup is covered.
 *
 * Only FUTO is live today; every other institution is on the waitlist until
 * its wave lands (see lib/institutions.ts → Institution.live).
 */
export const WAITLIST_TARGET_DATE = 'August 2027';
export const WAITLIST_FULL_COVERAGE_DATE = 'August 2027';

export type RoadmapPhase = {
  /** Sort key / display key, e.g. "2026-11". */
  key: string;
  /** Display label, e.g. "November 2026". */
  month: string;
  /** Universities going live in this phase. 0 + complete = remainder wave. */
  universities: number;
  /** True for the final phase that achieves full Southern coverage. */
  complete?: boolean;
};

export const WAITLIST_ROADMAP: RoadmapPhase[] = [
  { key: '2026-11', month: 'November 2026', universities: 6 },
  { key: '2026-12', month: 'December 2026', universities: 3 },
  { key: '2027-01', month: 'January 2027', universities: 3 },
  { key: '2027-02', month: 'February 2027', universities: 3 },
  { key: '2027-03', month: 'March 2027', universities: 3 },
  { key: '2027-04', month: 'April 2027', universities: 3 },
  { key: '2027-05', month: 'May 2027', universities: 3 },
  { key: '2027-06', month: 'June 2027', universities: 3 },
  { key: '2027-07', month: 'July 2027', universities: 3 },
  { key: '2027-08', month: 'August 2027', universities: 0, complete: true },
];

/** Contact / social handles (live accounts). */
/**
 * Single official contact address for the whole platform.
 * Support, partnerships and general enquiries all land here.
 */
export const SUPPORT_EMAIL = 'sofia@uniui.com.ng';
export const X_URL = 'https://x.com/1stuniui_com_ng';
export const TIKTOK_URL = 'https://tiktok.com/@1stuniui_com_ng';

