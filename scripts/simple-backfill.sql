-- =====================================================================
-- Simple backfill: create verified referrals for telegram-verified users.
-- Run this AFTER the diagnostic confirms missing rows.
-- =====================================================================

INSERT INTO referrals (referrer_id, referred_id, status, created_at, verified_at)
SELECT
  r.id,
  w.id,
  'verified',
  w.created_at,
  now()
FROM waitlist w
JOIN waitlist r ON r.referral_code = w.referred_by
WHERE w.telegram_verified = true
  AND w.referred_by IS NOT NULL
ON CONFLICT (referrer_id, referred_id) DO NOTHING;

-- Verify it worked
SELECT
  r.referral_code,
  COUNT(*) AS newly_verified
FROM referrals ref
JOIN waitlist w ON w.id = ref.referred_id
JOIN waitlist r ON r.id = ref.referrer_id
WHERE ref.status = 'verified'
  AND ref.verified_at >= now() - interval '1 minute'
GROUP BY r.referral_code;
