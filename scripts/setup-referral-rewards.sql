-- Run this in the Supabase SQL Editor to enable referral rewards tracking.
-- It creates a simple table for granted/claimed rewards tied to a referral code.

CREATE TABLE IF NOT EXISTS referral_rewards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code text NOT NULL,
  reward_type text NOT NULL,
  threshold integer NOT NULL,
  granted_at timestamp with time zone DEFAULT now() NOT NULL,
  claimed_at timestamp with time zone
);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_code ON referral_rewards(referral_code);

-- Optional seed data for reward tiers can be managed via the API.
-- Tiers: giveaway_entry=15, early_access=25, founding_member=40, semester_credits=60, lifetime_access=100
