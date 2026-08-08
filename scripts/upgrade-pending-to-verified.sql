-- =====================================================================
-- Fix: upgrade existing pending referrals to verified for telegram_verified users.
-- Use this when the simple backfill inserts 0 rows because referrals rows
-- already exist as pending.
-- =====================================================================

-- 1. Upgrade pending referrals to verified for telegram-verified users
UPDATE referrals ref
SET status = 'verified', verified_at = now()
FROM waitlist w
WHERE ref.referred_id = w.id
  AND ref.status = 'pending'
  AND w.telegram_verified = true;

-- 2. Verify it worked
SELECT
  r.referral_code,
  COUNT(*) FILTER (WHERE ref.status = 'verified') AS verified_count,
  COUNT(*) FILTER (WHERE ref.status = 'pending') AS pending_count
FROM referrals ref
JOIN waitlist w ON w.id = ref.referred_id
JOIN waitlist r ON r.id = ref.referrer_id
WHERE w.telegram_verified = true
GROUP BY r.referral_code
ORDER BY verified_count DESC;
