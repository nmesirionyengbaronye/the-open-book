/**
 * Creator Program domain: application schema, tiers, and pipeline statuses.
 *
 * The public form lives at /creators and posts to /api/creators/apply. The
 * internal tracker at /admin/creators drives outreach. Both read their enums
 * from here so a status added in one place is never missing from the other.
 *
 * Note on payouts: bank details are deliberately NOT collected at application.
 * They are collected at payout onboarding, once a creator has actually earned
 * something. See docs in scripts/setup-creators.sql for the column list.
 */

import { z } from 'zod';
import { normalizeWhatsApp } from './validation';

/** Academic levels accepted by the form. */
export const CREATOR_LEVELS = ['100', '200', '300', '400', '500'] as const;

/** Content categories offered as checkboxes. */
export const CONTENT_TYPES = [
  'Study tips',
  'Campus life',
  'Exam prep',
  'Tech',
  'Lifestyle',
  'Other',
] as const;

/** Tiers, in promotion order. Index is the rank. */
export const CREATOR_TIERS = ['seed', 'active', 'top', 'elite'] as const;
export type CreatorTier = (typeof CREATOR_TIERS)[number];

/** Outreach pipeline stages. Seeded rows start at 'discovered'. */
export const CREATOR_STATUSES = [
  'discovered',
  'dm_sent',
  'replied',
  'applied',
  'approved',
  'whatsapp',
  'declined',
  'referrer',
] as const;
export type CreatorStatus = (typeof CREATOR_STATUSES)[number];

/**
 * Follower count cap. The program is explicitly for micro creators and the
 * seeded targeting band is 500–5,000. Above this we still accept the
 * application (no hard rejection on the public form — that reads as gatekeeping
 * on a page we are link-dropping into DMs) but the admin tracker can sort on it.
 */
export const MAX_FOLLOWERS = 1_000_000;

/**
 * A follower/view count field.
 *
 * `z.coerce.number()` maps '' to 0, which would silently turn a skipped optional
 * field into a real count, and `Number('  ')` to 0 as well. Blank input is
 * normalized to undefined first: a required field then fails with the caller's
 * message (Number(undefined) is NaN, which is an invalid_type), while an
 * optional field — `.optional()` is applied outside this effect, so ZodOptional
 * short-circuits before the coercion runs — simply stays undefined.
 */
function followerCount(message: string) {
  return z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v === null ? undefined : v),
    z.coerce
      .number({ invalid_type_error: message })
      .int('Enter a whole number')
      .min(0, 'This cannot be negative')
      .max(MAX_FOLLOWERS, 'That number looks off — enter your real count')
  );
}

/**
 * Application schema. Field names are snake_case to match the DB columns
 * directly; the form maps its camelCase state onto these on submit.
 */
export const CreatorApplicationSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
  whatsapp_number: z
    .string()
    .transform((v) => normalizeWhatsApp(v) ?? v)
    .refine((v) => /^\+234\d{10}$/.test(v), {
      message: 'Use a valid Nigerian WhatsApp number (e.g. 0801 234 5678)',
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Enter a valid email address')
    .max(160, 'Email is too long'),
  institution: z
    .string()
    .trim()
    .min(2, 'School or university is required')
    .max(120, 'Institution name is too long'),
  level: z.enum(CREATOR_LEVELS, {
    errorMap: () => ({ message: 'Pick your level (100–500)' }),
  }),
  department: z
    .string()
    .trim()
    .min(2, 'Department is required')
    .max(120, 'Department name is too long'),
  tiktok_handle: z
    .string()
    .trim()
    .min(1, 'TikTok handle is required')
    .max(40, 'Handle is too long')
    // Accepts "@handle", "handle", or a full profile URL; normalized below.
    .transform(normalizeHandle)
    .refine((v) => v.length >= 2, 'Enter your TikTok handle (e.g. @chisom.exams)'),
  instagram_handle: z
    .string()
    .trim()
    .max(40, 'Handle is too long')
    .transform((v) => (v ? normalizeHandle(v) : v))
    .optional()
    .or(z.literal('')),
  tiktok_followers: followerCount('Enter your TikTok follower count'),
  instagram_followers: followerCount('Enter your Instagram follower count').optional(),
  avg_views: followerCount("Enter your average views across your last 5 videos"),
  content_types: z
    .array(z.enum(CONTENT_TYPES))
    .min(1, 'Pick at least one content type')
    .max(CONTENT_TYPES.length),
  why_join: z
    .string()
    .trim()
    .min(20, 'Tell us a bit more — at least 20 characters')
    .max(1000, 'Please keep this under 1000 characters'),
  how_promote: z
    .string()
    .trim()
    .min(15, 'Tell us how you would promote UniUI — at least 15 characters')
    .max(1000, 'Please keep this under 1000 characters'),
  promoted_before: z.boolean({
    invalid_type_error: 'Let us know if you have promoted a product before',
  }),
  promoted_before_detail: z
    .string()
    .trim()
    .max(500, 'Please keep this under 500 characters')
    .optional()
    .or(z.literal('')),
  referred_by: z.string().trim().max(40).optional().or(z.literal('')),
  // Honeypot. Bots fill hidden inputs; humans never see this one.
  website: z.string().max(0, 'Rejected').optional().or(z.literal('')),
});

export type CreatorApplicationInput = z.infer<typeof CreatorApplicationSchema>;/** Shape returned to the applicant on success. */
export interface CreatorApplicationResult {
  success: true;
  creator_code: string;
  /** Referred_by code credited, or null when there was none. */
  referred_by: string | null;
}

/**
 * Strip a URL or leading '@' down to a bare handle.
 * "https://www.tiktok.com/@chisom" -> "chisom"
 */
function normalizeHandle(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?(tiktok|instagram)\.com\//i, '')
    .replace(/^@+/, '')
    .replace(/\/+$/, '')
    .trim();
}

/**
 * Generate a creator referral code. Distinct prefix from the waitlist's
 * `UNI-XXXXXX` so a creator code is never mistaken for a waitlist code (and
 * vice versa) when a creator is also a waitlist member.
 */
export function generateCreatorCode(random: () => number = Math.random): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(random() * alphabet.length)];
  }
  return `CRT-${out}`;
}

/** Tier label + description for the admin tracker and creator portal. */
export const TIER_META: Record<CreatorTier, { label: string; emoji: string; description: string }> = {
  seed: { label: 'Seed', emoji: '🌱', description: 'Hand-picked founding cohort' },
  active: { label: 'Active', emoji: '⚡', description: 'Posting consistently, campaigns delivered' },
  top: { label: 'Top', emoji: '🔥', description: 'Consistent activated-user referrals' },
  elite: { label: 'Elite', emoji: '👑', description: 'Top performers and feedback council' },
};

/** Status label for the tracker. */
export const STATUS_META: Record<CreatorStatus, { label: string; tone: string }> = {
  discovered: { label: 'Discovered', tone: 'text-muted-foreground' },
  dm_sent: { label: 'DM sent', tone: 'text-sky-300' },
  replied: { label: 'Replied', tone: 'text-cyan-300' },
  applied: { label: 'Applied', tone: 'text-gold' },
  approved: { label: 'Approved', tone: 'text-emerald-300' },
  whatsapp: { label: 'In WhatsApp', tone: 'text-emerald-400' },
  declined: { label: 'Declined', tone: 'text-destructive' },
  referrer: { label: 'Referrer', tone: 'text-purple-300' },
};
