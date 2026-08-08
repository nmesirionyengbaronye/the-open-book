-- =====================================================================
-- Smoke test: verify referral count consistency in the database.
--
-- Run this in the Supabase SQL editor (or psql).
-- It should return a single row with all zeros if counts are consistent.
-- =====================================================================

-- 1. Users where joined count != waitlist joined count
SELECT
  r.id AS user_id,
  r.referral_code,
  COALESCE(j.joined_count, 0) AS waitlist_joined,
  COALESCE(v.verified_count, 0) AS referrals_verified,
  COALESCE(r.bonus_referrals, 0) AS bonus,
  COALESCE(j.joined_count, 0) - COALESCE(v.verified_count, 0) AS diff
FROM waitlist r
LEFT JOIN (
  SELECT referred_by AS code, COUNT(*) AS joined_count
  FROM waitlist
  WHERE referred_by IS NOT NULL
  GROUP BY referred_by
) j ON j.code = r.referral_code
LEFT JOIN (
  SELECT referrer_id, COUNT(*) AS verified_count
  FROM referrals
  WHERE status = 'verified'
  GROUP BY referrer_id
) v ON v.referrer_id = r.id
WHERE COALESCE(j.joined_count, 0) <> COALESCE(v.verified_count, 0)
  AND COALESCE(r.bonus_referrals, 0) = 0
LIMIT 10;

-- 2. Users with pending referrals that should be verified
SELECT
  r.id AS user_id,
  r.referral_code,
  COUNT(*) AS pending_count
FROM waitlist r
JOIN referrals ref ON ref.referrer_id = r.id
JOIN waitlist w ON w.id = ref.referred_id
WHERE ref.status = 'pending'
  AND w.telegram_verified = true
GROUP BY r.id, r.referral_code
ORDER BY pending_count DESC
LIMIT 10;

-- 3. Check if backfill is needed
SELECT
  COUNT(*) AS needs_backfill
FROM waitlist w
JOIN waitlist r ON r.referral_code = w.referred_by
WHERE w.telegram_verified = true
  AND w.referred_by IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM referrals ref
    WHERE ref.referrer_id = r.id
      AND ref.referred_id = w.id
      AND ref.status = 'verified'
  );

-- 4. Verify canonical counts match between view and direct query
SELECT
  r.id,
  r.referral_code,
  rc.referral_count AS view_count,
  COALESCE(v.verified_count, 0) + COALESCE(r.bonus_referrals, 0) AS direct_count,
  rc.referral_count - (COALESCE(v.verified_count, 0) + COALESCE(r.bonus_referrals, 0)) AS diff
FROM waitlist r
LEFT JOIN referral_counts rc ON rc.referrer_id = r.id
LEFT JOIN (
  SELECT referrer_id, COUNT(*) AS verified_count
  FROM referrals
  WHERE status = 'verified'
  GROUP BY referrer_id
) v ON v.referrer_id = r.id
WHERE rc.referral_count IS DISTINCT FROM COALESCE(v.verified_count, 0) + COALESCE(r.bonus_referrals, 0)
LIMIT 10;
