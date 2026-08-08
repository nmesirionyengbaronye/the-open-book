-- =====================================================================
-- Diagnostic: check the actual state of referrals in the database.
-- Run this in the Supabase SQL editor.
-- =====================================================================

-- 1. Total referrals by status
SELECT
  status,
  COUNT(*) AS count
FROM referrals
GROUP BY status
ORDER BY status;

-- 2. Total waitlist entries with referred_by set (raw joins)
SELECT
  COUNT(*) AS total_joined_via_referral
FROM waitlist
WHERE referred_by IS NOT NULL;

-- 3. How many of those joined users are telegram_verified?
SELECT
  COUNT(*) AS verified_users_with_referrer
FROM waitlist w
JOIN waitlist r ON r.referral_code = w.referred_by
WHERE w.referred_by IS NOT NULL
  AND w.telegram_verified = true;

-- 4. How many referrals rows exist at all?
SELECT
  COUNT(*) AS total_referral_rows
FROM referrals;

-- 5. Breakdown: for each referrer, show joined vs verified
SELECT
  r.referral_code,
  COUNT(DISTINCT w.id) AS total_joined,
  COUNT(DISTINCT ref.referred_id) AS total_verified,
  COUNT(DISTINCT w.id) - COUNT(DISTINCT ref.referred_id) AS pending_or_missing
FROM waitlist r
LEFT JOIN waitlist w ON w.referred_by = r.referral_code
LEFT JOIN referrals ref ON ref.referrer_id = r.id AND ref.status = 'verified'
GROUP BY r.referral_code
HAVING COUNT(DISTINCT w.id) > 0
ORDER BY total_joined DESC
LIMIT 20;
