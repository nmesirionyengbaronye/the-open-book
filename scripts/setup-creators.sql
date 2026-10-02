-- Run this in the Supabase SQL Editor to set up the Uni UI Creator Program.
--
-- One table serves two jobs:
--   1. Public applications submitted at /creators (POST /api/creators/apply)
--   2. The internal outreach tracker (/admin/creators) — every column the
--      spreadsheet tracker had, so the sheet can be retired.
--
-- Pipeline columns (dm_sent, replied, ...) default to NULL/false so a cold
-- outreach row and a self-submitted application are distinguishable.
--
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS creators (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  -- ---- Application fields (public form) ----
  -- The application-identity columns are nullable on purpose: a row created by
  -- admin outreach (POST /api/admin/creators) may only be a handle and a
  -- follower count long before anyone fills in the public form. NULL means "not
  -- known yet". The public apply route (POST /api/creators/apply) enforces
  -- NOT NULL-equivalent rules in its Zod schema before inserting, so the
  -- application path can never write a partial row.
  full_name text NOT NULL,
  whatsapp_number text,
  email text,
  institution text,
  level text,
  department text,
  tiktok_handle text,
  instagram_handle text,
  tiktok_followers integer,
  instagram_followers integer,
  avg_views integer,
  content_types text[] NOT NULL DEFAULT '{}',
  why_join text NOT NULL DEFAULT '',
  how_promote text NOT NULL DEFAULT '',
  promoted_before boolean NOT NULL DEFAULT false,
  promoted_before_detail text,

  -- Creator-to-creator referral. A seeded creator who refers three others sends
  -- them to /creators?ref=<code>; this is how the 20 -> 1,000 loop is measured.
  referred_by text,
  referral_code text,

  -- ---- Pipeline / tracker columns (internal) ----
  status text NOT NULL DEFAULT 'applied'
    CHECK (status IN (
      'discovered',   -- sourced from hashtag search, not yet contacted
      'dm_sent',      -- first DM sent
      'replied',      -- replied to the DM
      'applied',      -- submitted the public form
      'approved',     -- accepted into the program
      'whatsapp',     -- added to the UNIUI CREATORS group
      'declined',     -- turned down or unreachable
      'referrer'      -- they are a referrer, tracked for the referral loop
    )),
  tier text NOT NULL DEFAULT 'seed'
    CHECK (tier IN ('seed', 'active', 'top', 'elite')),

  dm_sent_at timestamp with time zone,
  approved_at timestamp with time zone,
  whatsapp_added_at timestamp with time zone,
  campaign text,             -- most recent campaign brief they were sent
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- One application per number / email. The apply route also checks these in code
-- to return a friendly duplicate message, so this is the backstop.
CREATE UNIQUE INDEX IF NOT EXISTS idx_creators_whatsapp
  ON creators(whatsapp_number);
CREATE UNIQUE INDEX IF NOT EXISTS idx_creators_email
  ON creators(email);

-- Partial index: the referral-code lookup only ever hits approved/referred rows,
-- and most of the table will be applications without a code.
CREATE UNIQUE INDEX IF NOT EXISTS idx_creators_referral_code
  ON creators(referral_code)
  WHERE referral_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_creators_status ON creators(status);
CREATE INDEX IF NOT EXISTS idx_creators_tier ON creators(tier);
CREATE INDEX IF NOT EXISTS idx_creators_created_at ON creators(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creators_referred_by ON creators(referred_by)
  WHERE referred_by IS NOT NULL;

-- Keep updated_at honest on every admin edit.
CREATE OR REPLACE FUNCTION touch_creators_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS creators_touch_updated_at ON creators;
CREATE TRIGGER creators_touch_updated_at
  BEFORE UPDATE ON creators
  FOR EACH ROW EXECUTE FUNCTION touch_creators_updated_at();
