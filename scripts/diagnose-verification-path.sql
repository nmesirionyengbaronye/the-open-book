-- =====================================================================
-- Diagnostic: trace the exact verification path for the 4 users
-- who opened the rewards page after Telegram verification.
-- =====================================================================

-- 1. Find users who have telegram_verified = true
SELECT
  id,
  referral_code,
  full_name,
  referred_by,
  telegram_verified,
  telegram_id,
  bonus_referrals
FROM waitlist
WHERE telegram_verified = true
ORDER BY created_at DESC
LIMIT 20;

-- 2. For each verified user, show their referrals rows
SELECT
  w.id AS user_id,
  w.referral_code,
  w.referred_by,
  ref.id AS referral_id,
  ref.referrer_id,
  ref.referred_id,
  ref.status,
  ref.verified_at,
  ref.created_at,
  r.referral_code AS referrer_code
FROM waitlist w
LEFT JOIN referrals ref ON ref.referred_id = w.id
LEFT JOIN waitlist r ON r.id = ref.referrer_id
WHERE w.telegram_verified = true
ORDER BY w.created_at DESC;

-- 3. Show any pending referrals that should have been promoted
SELECT
  ref.id,
  ref.referrer_id,
  ref.referred_id,
  ref.status,
  w.telegram_verified AS referred_user_verified,
  w.referred_by
FROM referrals ref
JOIN waitlist w ON w.id = ref.referred_id
WHERE ref.status = 'pending'
  AND w.telegram_verified = true
ORDER BY ref.created_at DESC;

-- 4. Count how many verified users have missing referrals rows
SELECT
  COUNT(*) AS verified_users_without_referral_row
FROM waitlist w
WHERE w.telegram_verified = true
  AND w.referred_by IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM referrals ref
    WHERE ref.referred_id = w.id
  );
