-- =====================================================================
-- Trace the 4 verified users through the referral attribution path.
-- Run this in Supabase SQL editor and paste the results.
-- =====================================================================

-- 1. Find the 4 telegram-verified users and who referred them
SELECT
  w.id AS user_id,
  w.referral_code AS user_code,
  w.full_name,
  w.referred_by,
  r.id AS referrer_id,
  r.referral_code AS referrer_code,
  r.full_name AS referrer_name
FROM waitlist w
LEFT JOIN waitlist r ON r.referral_code = w.referred_by
WHERE w.telegram_verified = true
  AND w.referred_by IS NOT NULL
ORDER BY w.created_at DESC;

-- 2. For those same users, show their referrals rows
SELECT
  ref.id AS referral_id,
  ref.referrer_id,
  ref.referred_id,
  ref.status,
  ref.verified_at,
  r.referral_code AS referrer_code,
  w.referral_code AS referred_code
FROM waitlist w
LEFT JOIN referrals ref ON ref.referred_id = w.id
LEFT JOIN waitlist r ON r.id = ref.referrer_id
WHERE w.telegram_verified = true
  AND w.referred_by IS NOT NULL
ORDER BY w.created_at DESC;

-- 3. Count verified referrals per referrer for these 4 users' referrers
SELECT
  r.referral_code,
  COUNT(ref.id) FILTER (WHERE ref.status = 'verified') AS verified_count,
  COUNT(ref.id) FILTER (WHERE ref.status = 'pending') AS pending_count
FROM waitlist w
JOIN waitlist r ON r.referral_code = w.referred_by
LEFT JOIN referrals ref ON ref.referrer_id = r.id
WHERE w.telegram_verified = true
  AND w.referred_by IS NOT NULL
GROUP BY r.referral_code
ORDER BY verified_count DESC;
