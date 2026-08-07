-- ===========================================================================
-- Broadcast log: audit trail of every admin broadcast to Telegram users.
-- Run this once in the Supabase SQL editor (or via the CLI), alongside
-- scripts/rewards-first-spin-grant.sql and scripts/setup-rewards-platform.sql.
-- ===========================================================================

create table if not exists public.broadcasts (
  id          bigint      generated always as identity primary key,
  message     text        not null,
  sent        integer     not null default 0,
  failed      integer     not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists broadcasts_created_at_idx
  on public.broadcasts (created_at desc);
