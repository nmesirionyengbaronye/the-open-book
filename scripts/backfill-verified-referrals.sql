-- Backfill: create verified `referrals` rows for users who are already
-- telegram_verified but have no referrals row yet.
--
-- WHY: the rewards page now counts ONLY verified rows in the `referrals` table
-- (pending joins no longer unlock the wheel). Friends who verified BEFORE the
-- attribution logic existed (commit 197678c) have waitlist.telegram_verified = true
-- but no referrals row, so they vanished from the referrer's count after the
-- unification change. This restores them. Idempotent: re-running is a no-op.
--
-- Run once against your Supabase database (SQL editor / psql).

INSERT INTO referrals (referrer_id, referred_id, status, created_at, verified_at)
SELECT
  r.id,
  w.id,
  'verified',
  w.created_at,
  now()
FROM waitlist w
JOIN waitlist r ON r.referral_code = w.referred_by
WHERE w.telegram_verified = true
  AND w.referred_by IS NOT NULL
ON CONFLICT (referrer_id, referred_id) DO NOTHING;

-- Optional: also surface anyone who joined via a link but is NOT yet verified
-- as a 'pending' row, so the referrer's "Recent joins" list is complete even
-- for pre-backfill data. Safe to run; pending rows simply don't unlock spins.
INSERT INTO referrals (referrer_id, referred_id, status, created_at)
SELECT
  r.id,
  w.id,
  'pending',
  w.created_at
FROM waitlist w
JOIN waitlist r ON r.referral_code = w.referred_by
WHERE w.referred_by IS NOT NULL
  AND w.telegram_verified IS DISTINCT FROM true
ON CONFLICT (referrer_id, referred_id) DO NOTHING;
