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
-- 8. Helper view: verified referral counts per referrer (excludes bonuses)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW referral_counts AS
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
