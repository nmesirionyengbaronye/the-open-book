-- =====================================================================
-- UniUI Rewards Platform — token system migration
-- Adds token balance and converts mystery boxes from spin tickets
-- to tokens.
-- =====================================================================

-- 1. Add token balance to waitlist
ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS tokens_balance integer NOT NULL DEFAULT 0;

-- 2. Convert mystery_boxes to store tokens instead of tickets
ALTER TABLE mystery_boxes
  ADD COLUMN IF NOT EXISTS tokens_awarded integer;

-- Backfill existing rows: assume 1 ticket = 100 tokens for historical data
UPDATE mystery_boxes
SET tokens_awarded = tickets_awarded * 100
WHERE tokens_awarded IS NULL;

ALTER TABLE mystery_boxes
  ALTER COLUMN tokens_awarded SET NOT NULL;

-- 3. Token values per box:
--    Box 1 = 500 tokens
--    Box 2 = 1000 tokens
--    Box 3 = 1500 tokens
CREATE OR REPLACE FUNCTION get_box_tokens(box_number integer)
RETURNS integer AS $$
BEGIN
  RETURN box_number * 500;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Helper: award tokens to a user
CREATE OR REPLACE FUNCTION award_tokens(p_user_id uuid, p_amount integer)
RETURNS void AS $$
BEGIN
  UPDATE waitlist
  SET tokens_balance = tokens_balance + p_amount
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;
