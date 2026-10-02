/**
 * Product positioning: "the operating system for your semester".
 *
 * WHAT THIS IS FOR
 * ----------------
 * One place defining what Uni UI is called, what V2 will cover, and — critically
 * — which claims are safe to make in which tense.
 *
 * THE TENSION THIS RESOLVES
 * -------------------------
 * The pitch is deliberately much bigger than "AI study app": a student's whole
 * semester lives here. That breadth is V2's destination, not today's product.
 * The waitlist site is a live, public, indexable page — so breadth cannot be
 * written in the present tense. Doing so would:
 *
 *   1. Contradict the Approved Claims & Messaging Guide (doc 07), which states
 *      outright: only demonstrate features available to you; label concepts as
 *      illustrative; do not present them as a live product screen.
 *   2. Create consumer-protection exposure on a page a student can screenshot.
 *   3. Undercut every creator, because creators are told to verify before they
 *      post — a site making bolder claims than the rules allow is a trap you set
 *      for them.
 *
 * So every claim below is tagged with a tense, and `safeClaim()` returns copy
 * that is true as of today.
 */

/** Status marker for anything not yet generally available. */
export type Availability = 'live' | 'founding' | 'coming';

export type SemesterArea = {
  id: string;
  name: string;
  /** What it covers. */
  detail: string;
  /** What a creator can honestly say about it today. */
  today: string;
  availability: Availability;
};

/**
 * The breadth of a semester. Every entry carries an honest `today` line — the
 * version a creator may state in the present tense.
 *
 * `availability` is a REMINDER to keep copy honest, not an authorisation to
 * ignore it. Anything not 'live' must be described as forthcoming.
 */
export const SEMESTER_AREAS: readonly SemesterArea[] = [
  {
    id: 'academic',
    name: 'Academic',
    detail: 'Course materials, notes, past questions, sourced AI answers, study streaks.',
    today: 'Live at FUTO. Upload your course materials and get answers cited to your own notes.',
    availability: 'live',
  },
  {
    id: 'deadlines',
    name: 'Deadlines',
    detail: 'Assignments, tests, exams and project submissions, with reminders.',
    today: 'Planned for V2. Not yet available.',
    availability: 'coming',
  },
  {
    id: 'groups',
    name: 'Groups',
    detail: 'Class, department, faculty and study groups in one place.',
    today: 'Planned for V2. Not yet available.',
    availability: 'coming',
  },
  {
    id: 'tutors',
    name: 'Tutors',
    detail: 'Book sessions, pay, learn and review.',
    today: 'Planned for V2. Not yet available.',
    availability: 'coming',
  },
  {
    id: 'tasks',
    name: 'Tasks',
    detail: 'Post tasks, complete tasks, earn.',
    today: 'Planned for V2. Not yet available.',
    availability: 'coming',
  },
  {
    id: 'money',
    name: 'Money',
    detail: 'Tokens, subscriptions, earnings, referrals and gifting.',
    today: 'Tokens exist in the current release. Subscriptions, earnings and gifting are V2.',
    availability: 'founding',
  },
  {
    id: 'community',
    name: 'Community',
    detail: 'Leaderboards, challenges, campus events and governance roles.',
    today: 'Leaderboards and community challenges run on the waitlist site today.',
    availability: 'founding',
  },
  {
    id: 'progress',
    name: 'Progress',
    detail: 'Streaks, scores, rankings, badges and certificates.',
    today: 'Leaderboard, badges and milestones run on the waitlist site today.',
    availability: 'founding',
  },
  {
    id: 'identity',
    name: 'Identity',
    detail: 'Profile, campus, department, level and creator status.',
    today: 'Live. Your campus, department and level are part of your waitlist profile.',
    availability: 'live',
  },
] as const;

/** Areas available to every student right now. */
export const LIVE_AREAS = SEMESTER_AREAS.filter((a) => a.availability === 'live');

/** Areas still to come. Copy must mark these as forthcoming. */
export const COMING_AREAS = SEMESTER_AREAS.filter((a) => a.availability === 'coming');

// ---------------------------------------------------------------------------
// The line
// ---------------------------------------------------------------------------

/** Category-defining one-liner. A statement about direction, not about a shipped feature. */
export const CATEGORY_LINE = 'The operating system for your semester.';

/** The pattern interrupt. Used verbatim across creator content. */
export const PATTERN_INTERRUPT = 'Not a study app.';

/**
 * The hero line creators are instructed to use. Deliberately says "my semester",
 * which is a claim about a relationship, not about shipped functionality — so it
 * is safe even pre-launch, because a creator is describing their own intent.
 */
export const HERO_LINE = "This isn't a study app. This is where my semester lives.";

/**
 * What we are NOT. Every one of these is a real competitor category; naming them
 * as non-goals is what makes the positioning legible.
 */
export const NOT_THESE = [
  'Not a study app.',
  'Not a question bank.',
  'Not a note-taking tool.',
] as const;

// ---------------------------------------------------------------------------
// Claim safety
// ---------------------------------------------------------------------------

/**
 * Tense-correct phrasing for an area, so copy never has to guess.
 *
 *   live      -> "Live at FUTO."          (present tense, no hedge)
 *   founding  -> "Running on the waitlist site today."  (present, narrower scope)
 *   coming    -> "Planned for V2."        (explicitly future)
 */
export function claimFor(area: SemesterArea): string {
  switch (area.availability) {
    case 'live':
      return area.today;
    case 'founding':
      return `${area.today} (founding stage)`;
    case 'coming':
    default:
      return area.today;
  }
}

/**
 * A claim that is true as of today, with no forward-looking promise.
 * Use this anywhere the reader might reasonably assume it is current.
 */
export function safeClaim(): string {
  return (
    `Uni UI is live at FUTO today: upload your course materials and get answers cited to ` +
    `your own notes. V2 is being built to hold your whole semester — notes, deadlines, ` +
    `groups, money and progress — and it is rolling out across Southern Nigeria from ` +
    `November 2026.`
  );
}

/**
 * Forward-looking phrasing. Always pair with a `safeClaim()` nearby so the page
 * never reads as though unbuilt features already exist.
 */
export function roadmapClaim(): string {
  return (
    'V2 is being built with student creators to become the operating system for a Nigerian ' +
    'semester — not just notes and past questions, but deadlines, groups, tutors, tasks, ' +
    'earnings, progress and community in one place.'
  );
}

/** Copy for "what this is not", used on the waitlist and creator pages. */
export const POSITIONING_STATEMENT = [
  NOT_THESE[0],
  NOT_THESE[1],
  NOT_THESE[2],
  'The place where your entire semester lives.',
] as const;