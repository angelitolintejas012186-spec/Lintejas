-- =============================================================
-- Lintejas — read-only access for the Business Automation admin
-- to the pilot sign-ups (table public.pilot_signups).
-- Run ONCE in the Supabase dashboard → SQL editor (Angie).
--
-- What this does:
--   · A PRIVATE table holds only the SHA-256 hash of an access code.
--     The code itself is never stored here; it lives only as a
--     Cloudflare secret (BA_SIGNUPS_CODE) in Business Automation.
--   · ONE function, public.ba_pilot_signups(p_code, p_limit), returns
--     the sign-ups (newest first, at most 200) ONLY when the code is
--     right. It can read nothing else and change nothing at all.
--   · The public (anon) key may call that function. Without the code
--     it gets an error and no rows. The service-role key is NOT used.
--   · The table's insert-only rule for the public form is unchanged.
-- =============================================================

-- ── 1. Private place for the code's hash (not reachable through the API) ──
create schema if not exists ba_private;
revoke all on schema ba_private from public, anon, authenticated;

create table if not exists ba_private.reader_code (
  id          int primary key default 1 check (id = 1),     -- exactly one row
  code_hash   text not null check (code_hash ~ '^[0-9a-f]{64}$'),
  created_at  timestamptz not null default now()
);
revoke all on table ba_private.reader_code from public, anon, authenticated;

-- ── 2. The one read-only function ──
create or replace function public.ba_pilot_signups(p_code text, p_limit int default 200)
returns table (
  id bigint, created_at timestamptz, name text, business_name text, business_type text, country text,
  email text, mobile text, messenger text, automations text[], time_sink text
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if p_code is null or char_length(p_code) < 32 or not exists (
       select 1 from ba_private.reader_code c
       where c.code_hash = encode(sha256(convert_to(p_code, 'UTF8')), 'hex')) then
    raise exception 'not_allowed' using errcode = '42501';
  end if;
  return query
    select s.id, s.created_at, s.name, s.business_name, s.business_type, s.country,
           s.email, s.mobile, s.messenger, s.automations, s.time_sink
    from public.pilot_signups s
    order by s.created_at desc
    limit least(greatest(coalesce(p_limit, 200), 1), 200);
end;
$$;

-- Supabase's default privileges give new functions to anon AND authenticated: take it from everyone, then give back to anon only.
revoke all on function public.ba_pilot_signups(text, int) from public, anon, authenticated;
grant execute on function public.ba_pilot_signups(text, int) to anon;

-- ── 3. Set (or change) the code's HASH — a separate step, see the instructions ──
-- insert into ba_private.reader_code (id, code_hash) values (1, '<64 hex characters>')
--   on conflict (id) do update set code_hash = excluded.code_hash, created_at = now();
-- To switch the access off completely:  delete from ba_private.reader_code;

-- ── Retention (manual for now) ──
-- Delete sign-ups that did not join 12 months after signing up, at once on request, and once invited:
-- delete from public.pilot_signups where created_at < now() - interval '12 months';
-- delete from public.pilot_signups where id = <id>;
