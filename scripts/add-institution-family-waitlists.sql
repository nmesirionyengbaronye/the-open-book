-- =====================================================================
-- UniUI Waitlist Ecosystem — additive migration
-- Institution + Family waitlists
--
-- Safe: only ADDS columns/indexes to the EXISTING waitlist table.
-- Existing student rows backfill to waitlist_type = 'student' via the
-- column default. Nothing existing is removed or rewritten.
-- Apply in the Supabase SQL editor (or psql with the Supabase connection).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Type discriminator: one table, four queues.
--    'student'  — /join (existing rows, backfilled by the default)
--    'creator'  — reserved (creator applications live in the creators
--                 table today; the value is allowed for future use)
--    'institution' — /institutions (NEW)
--    'family'     — /families (NEW)
-- ---------------------------------------------------------------------
ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS waitlist_type text NOT NULL DEFAULT 'student';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'waitlist_waitlist_type_check'
  ) THEN
    ALTER TABLE waitlist
      ADD CONSTRAINT waitlist_waitlist_type_check
      CHECK (waitlist_type IN ('student', 'creator', 'institution', 'family'));
  END IF;
END
$$;

-- ---------------------------------------------------------------------
-- 2. Institution + family columns (all nullable — student rows stay NULL)
-- ---------------------------------------------------------------------
ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS organization_name text,
  ADD COLUMN IF NOT EXISTS organization_type text,
  ADD COLUMN IF NOT EXISTS ownership text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS relationship text,
  ADD COLUMN IF NOT EXISTS child_count integer,
  ADD COLUMN IF NOT EXISTS child_linked boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS interests jsonb,
  ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS metadata jsonb;

-- Queue position is scoped per waitlist_type. The existing student
-- entries keep their global positions; institution and family entries
-- are numbered within their own queue (see the join routes).
CREATE INDEX IF NOT EXISTS idx_waitlist_type_position
  ON waitlist (waitlist_type, position);
CREATE INDEX IF NOT EXISTS idx_waitlist_type_created
  ON waitlist (waitlist_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_email
  ON waitlist (email);

-- ---------------------------------------------------------------------
-- 3. Queue sizes per audience (sanity check after applying)
-- ---------------------------------------------------------------------
-- SELECT waitlist_type, COUNT(*), MAX(position)
-- FROM waitlist
-- GROUP BY waitlist_type;
