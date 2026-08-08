-- =====================================================================
-- UniUI Rewards Platform — additive migration
-- Safe: only ADDS new tables/columns. Does NOT alter existing waitlist
-- structure beyond the new columns listed below.
-- Apply in the Supabase SQL editor (or psql with the Supabase connection).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Extend the EXISTING waitlist table with new columns only
-- ---------------------------------------------------------------------
ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS telegram_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS telegram_id text,
  ADD COLUMN IF NOT EXISTS telegram_username text,
  ADD COLUMN IF NOT EXISTS mystery_boxes integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS spin_tickets integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wallet_balance integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wallet_paid integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bonus_referrals integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS disqualified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- ---------------------------------------------------------------------
-- 2. telegram_users  (links a verified Telegram account to a waitlist row)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS telegram_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id uuid REFERENCES waitlist(id) ON DELETE CASCADE,
  telegram_id text UNIQUE NOT NULL,
  telegram_username text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 2b. telegram_contacts
--     The REAL, Telegram-verified phone number, delivered by Telegram to the
--     bot webhook when the user shares their contact via requestContact().
--     Keyed by Telegram user id. This is the trusted source of the phone —
--     the client can never supply or forge it.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS telegram_contacts (
  telegram_id text PRIMARY KEY,
  phone text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 3. referrals  (pending -> verified, with anti-fraud guards)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES waitlist(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES waitlist(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referrer_id, referred_id)
);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);

-- ---------------------------------------------------------------------
-- 4. mystery_boxes  (each earned box the user opens awards tickets)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mystery_boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES waitlist(id) ON DELETE CASCADE,
  box_number integer NOT NULL CHECK (box_number BETWEEN 1 AND 3),
  tickets_awarded integer NOT NULL,
  opened_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mystery_boxes_user ON mystery_boxes(user_id);

-- ---------------------------------------------------------------------
-- 5. spin_history  (one row per wheel spin; prize is server-side)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS spin_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES waitlist(id) ON DELETE CASCADE,
  ticket_used boolean NOT NULL DEFAULT true,
  prize integer NOT NULL,
  paid boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_spin_history_user ON spin_history(user_id);

-- ---------------------------------------------------------------------
-- 6. payments  (admin marks spin prizes as paid)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES waitlist(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid')),
  reference text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);

-- ---------------------------------------------------------------------
-- 7. settings  (global config)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text
);
INSERT INTO settings (key, value) VALUES
  ('launch_date', '2026-09-01'),
  ('giveaway_active', 'true')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------
-- 8. Helper view: canonical referral counts per referrer.
--
--    CANONICAL DEFINITION (mirrors lib/referral-counts.ts):
--      a referral only counts once it is VERIFIED (status = 'verified').
--      pending referrals are NOT counted — they stay pending until the
--      referred user verifies. admin-granted bonus_referrals also count.
--
--        referral count = verified referrals + bonus_referrals
--
--    This means the spin wheel, mystery boxes, badges, rank and leaderboard
--    all move only on verification, never on a raw join.
--
--    `verified_count` is retained as a column name for backwards compatibility;
--    `referral_count` is the preferred alias for the canonical (verified) total.
--    `joined_count` is the raw join figure, display-only.
--    Disqualified referrers are excluded so public and admin reads agree.
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW referral_counts AS
SELECT
  r.id                                              AS referrer_id,
  COALESCE(v.verified_count, 0) + COALESCE(r.bonus_referrals, 0) AS referral_count,
  COALESCE(v.verified_count, 0) + COALESCE(r.bonus_referrals, 0) AS verified_count,
  COALESCE(j.joined_count, 0)                       AS joined_count,
  COALESCE(r.bonus_referrals, 0)                     AS bonus_count
FROM waitlist r
LEFT JOIN (
  SELECT referrer_id, COUNT(*) AS verified_count
  FROM referrals
  WHERE status = 'verified'
  GROUP BY referrer_id
) v ON v.referrer_id = r.id
LEFT JOIN (
  SELECT referred_by AS code, COUNT(*) AS joined_count
  FROM waitlist
  WHERE referred_by IS NOT NULL
  GROUP BY referred_by
) j ON j.code = r.referral_code
WHERE COALESCE(r.disqualified, false) = false
  AND (COALESCE(v.verified_count, 0) + COALESCE(r.bonus_referrals, 0)) > 0;

-- Raw Telegram verification progress (verified referrals only), for diagnostics.
CREATE OR REPLACE VIEW verified_referral_counts AS
SELECT referrer_id, COUNT(*) AS verified_count
FROM referrals
WHERE status = 'verified'
GROUP BY referrer_id;

-- ---------------------------------------------------------------------
-- 9. Backfill: turn existing referred_by links into referrals rows.
--    Verified only if the referred user is already telegram_verified;
--    otherwise pending (becomes verified when they verify).
-- ---------------------------------------------------------------------
INSERT INTO referrals (referrer_id, referred_id, status, created_at)
SELECT r.id, w.id,
       CASE WHEN w.telegram_verified THEN 'verified' ELSE 'pending' END,
       w.created_at
FROM waitlist w
JOIN waitlist r ON r.referral_code = w.referred_by
ON CONFLICT (referrer_id, referred_id) DO NOTHING;
