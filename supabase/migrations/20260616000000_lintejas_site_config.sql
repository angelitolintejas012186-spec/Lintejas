-- =============================================================
-- Lintejas — site_config table + RLS + Storage
-- Run this once in the Supabase SQL editor (or via CLI):
--   supabase db push
-- =============================================================

-- ── 1. Table ──────────────────────────────────────────────────
create table if not exists public.site_config (
  id         uuid        default gen_random_uuid() primary key,
  owner_id   uuid        not null references auth.users (id) on delete cascade,
  config     jsonb       not null default '{}',
  updated_at timestamptz not null default now()
);

-- Keep updated_at current automatically
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_config_updated_at on public.site_config;
create trigger site_config_updated_at
  before update on public.site_config
  for each row execute function public.set_updated_at();

-- ── 2. Row-Level Security ─────────────────────────────────────
alter table public.site_config enable row level security;

-- Public may read config (site visitors need theme/branding data)
create policy "public_read_config"
  on public.site_config
  for select
  using (true);

-- Only the authenticated owner may insert their own row
create policy "owner_insert_config"
  on public.site_config
  for insert
  with check (auth.uid() = owner_id);

-- Only the owner may update their own row
create policy "owner_update_config"
  on public.site_config
  for update
  using (auth.uid() = owner_id);

-- Only the owner may delete their own row
create policy "owner_delete_config"
  on public.site_config
  for delete
  using (auth.uid() = owner_id);

-- ── 3. Storage bucket ─────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lintejas-assets',
  'lintejas-assets',
  true,
  5242880,   -- 5 MB max per file
  array['image/svg+xml','image/png','image/webp','image/jpeg','image/gif']
)
on conflict (id) do nothing;

-- Public read (logo, theme images served to all visitors)
create policy "public_read_assets"
  on storage.objects
  for select
  using (bucket_id = 'lintejas-assets');

-- Only authenticated users (the owner) may upload
create policy "owner_insert_assets"
  on storage.objects
  for insert
  with check (
    bucket_id = 'lintejas-assets'
    and auth.role() = 'authenticated'
  );

-- Owner may replace an existing object
create policy "owner_update_assets"
  on storage.objects
  for update
  using (
    bucket_id = 'lintejas-assets'
    and auth.role() = 'authenticated'
  );

-- Owner may delete objects
create policy "owner_delete_assets"
  on storage.objects
  for delete
  using (
    bucket_id = 'lintejas-assets'
    and auth.role() = 'authenticated'
  );
