// Database rules test (Oct 2026): only the site admin may change the site.
// Runs the real migrations in an in-memory Postgres (PGlite) with small stand-ins for Supabase's auth and storage
// schemas, then checks what the website's public key (anon), a stranger's account and the admin's account can do.
// usage: npm run test:db
import { PGlite } from '@electric-sql/pglite'
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MIG = f => fs.readFileSync(path.join(REPO, 'supabase/migrations', f), 'utf8')
const ADMIN = '11111111-1111-1111-1111-111111111111'
const STRANGER = '22222222-2222-2222-2222-222222222222'

let pass = 0, fail = 0
const ok = (name, cond) => { if (cond) { pass++; console.log('PASS ' + name) } else { fail++; console.log('FAIL ' + name) } }

const db = new PGlite()
// Stand-ins for what Supabase provides (roles, auth.users, auth.uid()/role(), storage.buckets/objects).
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth; create schema storage;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
  create function auth.role() returns text language sql stable as $$ select case when auth.uid() is null then 'anon' else 'authenticated' end $$;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id serial primary key, bucket_id text, name text);
  alter table storage.objects enable row level security;
  grant usage on schema auth, storage, public to anon, authenticated;
  grant execute on function auth.uid(), auth.role() to anon, authenticated;
  grant select, insert, update, delete on storage.objects to anon, authenticated;
  grant usage on sequence storage.objects_id_seq to anon, authenticated;
  insert into auth.users values ('${ADMIN}'), ('${STRANGER}');
`)
await db.exec(MIG('20260616000000_lintejas_site_config.sql'))
await db.exec(`grant select, insert, update, delete on public.site_config to anon, authenticated;`)
await db.exec(`insert into public.site_config (owner_id, config, updated_at) values ('${ADMIN}', '{"who":"admin"}', now() - interval '1 day');`)

async function as(role, uid, sql) {
  await db.exec(`reset role; select set_config('test.uid', '${uid ?? ''}', false); set role ${role};`)
  try { const r = await db.query(sql); return { rows: r.rows, affected: r.affectedRows ?? 0 } }
  catch (e) { return { error: e.message } }
  finally { await db.exec('reset role;') }
}
const newestConfig = () => as('anon', null, `select config->>'who' as who from public.site_config order by updated_at desc limit 1`)

// ── Before the fix: the gap exists (proves the test can see it) ──
const s0 = await as('authenticated', STRANGER, `insert into public.site_config (owner_id, config) values ('${STRANGER}', '{"who":"stranger"}')`)
ok('before: a stranger\'s account can save its own settings row', !s0.error)
ok('before: the website then shows the stranger\'s settings', (await newestConfig()).rows?.[0]?.who === 'stranger')
const u0 = await as('authenticated', STRANGER, `insert into storage.objects (bucket_id, name) values ('lintejas-assets', 'logo.png')`)
ok('before: a stranger\'s account can upload images', !u0.error)
await db.exec(`delete from public.site_config where owner_id = '${STRANGER}'; delete from storage.objects;`)

// ── Apply the fix (twice: it must be safe to run again) ──
await db.exec(MIG('20261019000000_site_admins.sql'))
await db.exec(MIG('20261019000000_site_admins.sql'))
ok('admins list holds exactly the existing settings owner', (await db.query('select user_id from public.site_admins')).rows.map(r => r.user_id).join() === ADMIN)

// ── After the fix ──
// a stranger row that already exists (e.g. created before the fix) must not be shown by the website
await db.exec(`insert into public.site_config (owner_id, config, updated_at) values ('${STRANGER}', '{"who":"stranger"}', now());`)
ok('website (public key) shows the admin\'s settings even if a newer stranger row exists', (await newestConfig()).rows?.[0]?.who === 'admin')
ok('website (public key) sees exactly 1 settings row', (await as('anon', null, 'select count(*)::int as n from public.site_config')).rows?.[0]?.n === 1)
await db.exec(`delete from public.site_config where owner_id = '${STRANGER}';`)

const s1 = await as('authenticated', STRANGER, `insert into public.site_config (owner_id, config) values ('${STRANGER}', '{"who":"stranger"}')`)
ok('stranger cannot save a settings row', !!s1.error)
const s2 = await as('authenticated', STRANGER, `update public.site_config set config = '{"who":"stranger"}'`)
ok('stranger cannot change the admin\'s settings', !s2.error && s2.affected === 0 && (await newestConfig()).rows?.[0]?.who === 'admin')
const s3 = await as('authenticated', STRANGER, `delete from public.site_config`)
ok('stranger cannot delete the admin\'s settings', !s3.error && s3.affected === 0)
const s4 = await as('anon', null, `insert into public.site_config (owner_id, config) values ('${ADMIN}', '{"who":"anon"}')`)
ok('public key cannot save settings', !!s4.error)
const s5 = await as('authenticated', STRANGER, `select * from public.site_admins`)
ok('stranger cannot read the admins list', !!s5.error)
const s6 = await as('anon', null, `select * from public.site_admins`)
ok('public key cannot read the admins list', !!s6.error)
const s7 = await as('authenticated', STRANGER, `insert into public.site_admins values ('${STRANGER}')`)
ok('stranger cannot add itself to the admins list', !!s7.error)

const i1 = await as('authenticated', STRANGER, `insert into storage.objects (bucket_id, name) values ('lintejas-assets', 'logo.png')`)
ok('stranger cannot upload images', !!i1.error)
const i2 = await as('anon', null, `insert into storage.objects (bucket_id, name) values ('lintejas-assets', 'logo.png')`)
ok('public key cannot upload images', !!i2.error)

const a1 = await as('authenticated', ADMIN, `update public.site_config set config = '{"who":"admin2"}' where owner_id = '${ADMIN}'`)
ok('admin can change the settings', !a1.error && a1.affected === 1 && (await newestConfig()).rows?.[0]?.who === 'admin2')
const a2 = await as('authenticated', ADMIN, `insert into storage.objects (bucket_id, name) values ('lintejas-assets', 'logo.png')`)
ok('admin can upload images', !a2.error)
const a3 = await as('authenticated', ADMIN, `update storage.objects set name = 'logo2.png' where bucket_id = 'lintejas-assets'`)
ok('admin can replace images', !a3.error && a3.affected === 1)
const a4 = await as('authenticated', STRANGER, `delete from storage.objects where bucket_id = 'lintejas-assets'`)
ok('stranger cannot delete the admin\'s images', !a4.error && a4.affected === 0)
const a5 = await as('authenticated', ADMIN, `delete from storage.objects where bucket_id = 'lintejas-assets'`)
ok('admin can delete images', !a5.error && a5.affected === 1)
ok('is_site_admin(): true for admin', (await as('authenticated', ADMIN, 'select public.is_site_admin() as v')).rows?.[0]?.v === true)
ok('is_site_admin(): false for stranger', (await as('authenticated', STRANGER, 'select public.is_site_admin() as v')).rows?.[0]?.v === false)
ok('is_site_admin(): false for public key', (await as('anon', null, 'select public.is_site_admin() as v')).rows?.[0]?.v === false)

console.log(`\n${pass}/${pass + fail} passed`)
process.exit(fail ? 1 : 0)
