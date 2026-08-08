-- =====================================================================
-- Targeted diagnostic for referral ID / user ID: 5e4206
-- Run this in Supabase SQL editor.
-- =====================================================================

-- 1. Find the user by exact ID match
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
WHERE id::text LIKE '%5e4206%'
   OR referral_code LIKE '%5e4206%'
   OR full_name ILIKE '%5e4206%'
LIMIT 10;

-- 2. Find referrals rows mentioning this ID
SELECT
  ref.id,
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

-- 3. If there are verified referrals for this referrer, show canonical count
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

-- 4. Show the waitlist entries that joined via this referrer
SELECT
  w.id,
  w.full_name,
  w.created_at,
  w.telegram_verified,
  ref.status AS referral_status,
  ref.verified_at
FROM waitlist w
LEFT JOIN referrals ref ON ref.referred_id = w.id AND ref.referrer_id::text LIKE '%5e4206%'
WHERE w.referred_by LIKE '%5e4206%'
   OR w.referred_by IN (SELECT referral_code FROM waitlist WHERE id::text LIKE '%5e4206%')
ORDER BY w.created_at DESC
LIMIT 20;
