-- =============================================================
-- Lintejas — Business Automation pilot sign-ups (/#/automation)
-- Run this ONCE in the Supabase dashboard → SQL editor (Angie).
-- The public site key (anon) may only INSERT. Nobody can read,
-- change or delete rows with that key; you read them in the
-- dashboard (Table editor → pilot_signups).
-- =============================================================

-- ── 1. Table (lengths + allowed values checked by the database) ──
create table if not exists public.pilot_signups (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 1 and 100),
  business_name text not null check (char_length(business_name) between 1 and 120),
  business_type text not null check (business_type in
                  ('Retail','Food service','Food manufacturing','Online seller',
                   'Clinic/Salon/Spa','Services','Agriculture','Other')),
  country       text not null check (country in ('Philippines','Europe','Other')),
  email         text not null check (char_length(email) <= 200
                  and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  mobile        text check (mobile is null or char_length(mobile) <= 40),
  messenger     text check (messenger is null or char_length(messenger) <= 100),
  automations   text[] not null default '{}' check (cardinality(automations) <= 11),
  time_sink     text check (time_sink is null or char_length(time_sink) <= 300),
  consent       boolean not null check (consent = true)
);

-- ── 2. Row-Level Security: insert-only for the public key ──
alter table public.pilot_signups enable row level security;

revoke all on table public.pilot_signups from anon, authenticated;
grant insert (name, business_name, business_type, country, email, mobile,
              messenger, automations, time_sink, consent)
  on table public.pilot_signups to anon;

drop policy if exists "anon_insert_pilot_signups" on public.pilot_signups;
create policy "anon_insert_pilot_signups"
  on public.pilot_signups
  for insert
  to anon
  with check (true);
-- No select / update / delete policy → the public key can never read or change rows.

-- ── 3. Basic rate limit (runs inside the database) ──
--   max 3 sign-ups per email per day, max 20 sign-ups per minute site-wide.
create or replace function public.pilot_signups_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.pilot_signups
        where lower(email) = lower(new.email)
          and created_at > now() - interval '1 day') >= 3 then
    raise exception 'too_many_signups';
  end if;
  if (select count(*) from public.pilot_signups
        where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'busy_try_later';
  end if;
  return new;
end;
$$;
revoke all on function public.pilot_signups_guard() from public, anon, authenticated;

drop trigger if exists pilot_signups_guard on public.pilot_signups;
create trigger pilot_signups_guard
  before insert on public.pilot_signups
  for each row execute function public.pilot_signups_guard();
