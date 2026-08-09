-- =====================================================================
-- Targeted diagnostic: look up by exact waitlist/referrals ID
-- Case-insensitive for UUIDs stored as text.
-- =====================================================================

-- 1. Find the user by exact ID (case-insensitive)
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
WHERE UPPER(id::text) = UPPER('5e4206')
   OR UPPER(referral_code) = UPPER('5e4206')
   OR UPPER(id::text) LIKE '%5E4206%'
   OR UPPER(referral_code) LIKE '%5E4206%'
LIMIT 10;

-- 2. Find referrals rows mentioning this ID
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
WHERE UPPER(ref.referrer_id::text) LIKE '%5E4206%'
   OR UPPER(ref.referred_id::text) LIKE '%5E4206%'
   OR UPPER(r.referral_code) LIKE '%5E4206%'
   OR UPPER(w.referral_code) LIKE '%5E4206%'
LIMIT 20;

-- 3. Canonical count for any referrer matching this ID
SELECT
  r.referral_code,
  COUNT(ref.id) FILTER (WHERE ref.status = 'verified') AS verified_count,
  COALESCE(r.bonus_referrals, 0) AS bonus,
  COUNT(ref.id) FILTER (WHERE ref.status = 'verified') + COALESCE(r.bonus_referrals, 0) AS canonical_count
FROM waitlist r
LEFT JOIN referrals ref ON ref.referrer_id = r.id
WHERE UPPER(r.id::text) LIKE '%5E4206%'
   OR UPPER(r.referral_code) LIKE '%5E4206%'
GROUP BY r.id, r.referral_code, r.bonus_referrals;
