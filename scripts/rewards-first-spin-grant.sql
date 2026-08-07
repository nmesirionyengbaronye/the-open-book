-- ===========================================================================
-- Reward spin: guaranteed ₦1000 for the FIRST TWO people on their first spin.
-- Run this once in the Supabase SQL editor (or via the CLI).
-- ===========================================================================

create table if not exists public.first_spin_grants (
  user_id    bigint      primary key references public.waitlist(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Atomically claim a spot among the first two spinners.
-- Returns true if THIS user is one of the first two to ever spin.
create or replace function public.claim_first_spin_grant(p_user_id bigint)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_granted boolean := false;
begin
  -- Only the first two distinct users to ever spin get the guaranteed ₦1000.
  if (select count(*) from public.first_spin_grants) < 2 then
    insert into public.first_spin_grants (user_id)
    values (p_user_id)
    on conflict (user_id) do nothing;
  end if;

  select exists (
    select 1 from public.first_spin_grants where user_id = p_user_id
  ) into v_granted;

  return v_granted;
end;
$$;

grant execute on function public.claim_first_spin_grant(bigint) to service_role;
