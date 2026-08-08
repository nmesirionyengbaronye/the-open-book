-- =====================================================================
-- Focused diagnostic: why backfill may have inserted 0 rows.
-- Run this in Supabase SQL editor.
-- =====================================================================

-- 1. Does telegram_verified exist, and how many users are marked true?
SELECT
  COUNT(*) FILTER (WHERE telegram_verified = true) AS telegram_verified_true,
  COUNT(*) FILTER (WHERE telegram_verified = false) AS telegram_verified_false,
  COUNT(*) FILTER (WHERE telegram_verified IS NULL) AS telegram_verified_null
FROM waitlist;

-- 2. How many users have a telegram_id?
SELECT
  COUNT(*) AS users_with_telegram_id
FROM waitlist
WHERE telegram_id IS NOT NULL;

-- 3. What does telegram_users look like?
SELECT
  telegram_id,
  waitlist_id,
  verified
FROM telegram_users
LIMIT 20;

-- 4. Are there ANY referrals rows at all?
SELECT
  status,
  COUNT(*) AS cnt
FROM referrals
GROUP BY status;

-- 5. Sample waitlist rows with referred_by
SELECT
  id,
  referral_code,
  referred_by,
  telegram_verified,
  telegram_id
FROM waitlist
WHERE referred_by IS NOT NULL
ORDER BY created_at DESC
LIMIT 20;
