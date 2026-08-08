-- =====================================================================
-- Targeted diagnostic: look up by exact waitlist/referrals ID
-- Paste the exact ID in the WHERE clause below.
-- =====================================================================

-- 1. Find the user by exact ID
SELECT
  id,
  referral_code,
  full_name,
  referred_by,
  telegram_verified,
  telegram_id,
  bonus_referrals,
  disqualified
FROM waitlist
WHERE id::text = '5e4206'
   OR referral_code = '5e4206'
   OR id::text LIKE '%5e4206%'
   OR referral_code LIKE '%5e4206%'
LIMIT 10;

-- 2. Find referrals rows by exact IDs
SELECT
  ref.id AS referral_id,
  ref.referrer_id,
  ref.referred_id,
  ref.status,
  ref.verified_at,
  r.referral_code AS referrer_code,
  w.referral_code AS referred_code,
  w.full_name AS referred_name,
  w.telegram_verified AS referred_tg_verified
FROM referrals ref
JOIN waitlist r ON r.id = ref.referrer_id
JOIN waitlist w ON w.id = ref.referred_id
WHERE ref.referrer_id::text LIKE '%5e4206%'
   OR ref.referred_id::text LIKE '%5e4206%'
   OR r.referral_code LIKE '%5e4206%'
   OR w.referral_code LIKE '%5e4206%'
LIMIT 20;

-- 3. Canonical count for any referrer matching this ID
SELECT
  r.referral_code,
  COUNT(ref.id) FILTER (WHERE ref.status = 'verified') AS verified_count,
  COALESCE(r.bonus_referrals, 0) AS bonus,
  COUNT(ref.id) FILTER (WHERE ref.status = 'verified') + COALESCE(r.bonus_referrals, 0) AS canonical_count
FROM waitlist r
LEFT JOIN referrals ref ON ref.referrer_id = r.id
WHERE r.id::text LIKE '%5e4206%'
   OR r.referral_code LIKE '%5e4206%'
GROUP BY r.id, r.referral_code, r.bonus_referrals;
