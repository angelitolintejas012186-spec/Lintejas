-- =============================================================
-- Lintejas — only the site admin may change the site (19 Oct 2026)
-- Before: any signed-in account could save its own settings row (and the website shows the newest row),
-- and upload/replace/delete images. Sign-ups are now OFF in Supabase; this closes the gap in the database too.
--
-- Run once in the Supabase SQL editor. Safe to run again (idempotent). Contains no password, key or email:
-- the admins list is filled from the owner of the existing settings row (the one account that has saved settings).
-- =============================================================

-- ── 1. Admins list ────────────────────────────────────────────
create table if not exists public.site_admins (
  user_id    uuid        primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.site_admins enable row level security;
-- No policies: nobody can read or change this table through the website's public key. Manage it in the dashboard.
revoke all on table public.site_admins from anon, authenticated;

insert into public.site_admins (user_id)
select distinct owner_id from public.site_config
on conflict (user_id) do nothing;

-- ── 2. Checks used by the rules below (and by the admin screen) ──
create or replace function public.is_site_admin_user(uid uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.site_admins where user_id = uid)
$$;

create or replace function public.is_site_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.is_site_admin_user(auth.uid())
$$;

revoke all on function public.is_site_admin_user(uuid) from public;
revoke all on function public.is_site_admin()          from public;
grant execute on function public.is_site_admin_user(uuid) to anon, authenticated;
grant execute on function public.is_site_admin()          to anon, authenticated;

-- ── 3. site_config: everyone reads only the admin's settings; only the admin writes ──
drop policy if exists "public_read_config"  on public.site_config;
drop policy if exists "owner_insert_config" on public.site_config;
drop policy if exists "owner_update_config" on public.site_config;
drop policy if exists "owner_delete_config" on public.site_config;
drop policy if exists "admin_settings_read"   on public.site_config;
drop policy if exists "admin_settings_insert" on public.site_config;
drop policy if exists "admin_settings_update" on public.site_config;
drop policy if exists "admin_settings_delete" on public.site_config;

create policy "admin_settings_read"
  on public.site_config for select
  using (public.is_site_admin_user(owner_id));

create policy "admin_settings_insert"
  on public.site_config for insert
  with check (auth.uid() = owner_id and public.is_site_admin());

create policy "admin_settings_update"
  on public.site_config for update
  using (auth.uid() = owner_id and public.is_site_admin())
  with check (auth.uid() = owner_id and public.is_site_admin());

create policy "admin_settings_delete"
  on public.site_config for delete
  using (auth.uid() = owner_id and public.is_site_admin());

-- ── 4. Images (lintejas-assets): everyone reads; only the admin uploads, replaces or deletes ──
drop policy if exists "owner_insert_assets" on storage.objects;
drop policy if exists "owner_update_assets" on storage.objects;
drop policy if exists "owner_delete_assets" on storage.objects;
drop policy if exists "admin_assets_insert" on storage.objects;
drop policy if exists "admin_assets_update" on storage.objects;
drop policy if exists "admin_assets_delete" on storage.objects;

create policy "admin_assets_insert"
  on storage.objects for insert
  with check (bucket_id = 'lintejas-assets' and public.is_site_admin());

create policy "admin_assets_update"
  on storage.objects for update
  using (bucket_id = 'lintejas-assets' and public.is_site_admin())
  with check (bucket_id = 'lintejas-assets' and public.is_site_admin());

create policy "admin_assets_delete"
  on storage.objects for delete
  using (bucket_id = 'lintejas-assets' and public.is_site_admin());

-- ── 5. Check (counts only): expect admins = 1, settings_rows_visible = 1 ──
select (select count(*) from public.site_admins) as admins,
       (select count(*) from public.site_config where public.is_site_admin_user(owner_id)) as settings_rows_visible;
