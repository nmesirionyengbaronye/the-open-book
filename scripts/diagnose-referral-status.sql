-- =====================================================================
-- Targeted diagnostic: show ALL referrals for UNI-5E4206
-- Run this in Supabase SQL editor.
-- =====================================================================

-- 1. All referrals for this referrer, by status
SELECT
  ref.id AS referral_id,
  ref.referrer_id,
  ref.referred_id,
  ref.status,
  ref.verified_at,
  ref.created_at,
  r.referral_code AS referrer_code,
  w.referral_code AS referred_code,
  w.full_name AS referred_name,
  w.telegram_verified AS referred_tg_verified
FROM referrals ref
JOIN waitlist r ON r.id = ref.referrer_id
JOIN waitlist w ON w.id = ref.referred_id
WHERE UPPER(r.referral_code) = 'UNI-5E4206'
   OR UPPER(r.id::text) = '5E4206'
ORDER BY ref.created_at DESC;

-- 2. Count by status for this referrer
SELECT
  ref.status,
  COUNT(*) AS cnt
FROM referrals ref
JOIN waitlist r ON r.id = ref.referrer_id
WHERE UPPER(r.referral_code) = 'UNI-5E4206'
   OR UPPER(r.id::text) = '5E4206'
GROUP BY ref.status;

-- 3. Show waitlist entries that joined via this code
SELECT
  w.id,
  w.full_name,
  w.created_at,
  w.telegram_verified,
  w.referred_by
FROM waitlist w
WHERE UPPER(w.referred_by) = 'UNI-5E4206'
ORDER BY w.created_at DESC;
