// Admin sign-in screens test (Oct 2026): "Forgot password?", /admin/reset, and the admin-only gate.
// Uses a test build with a FAKE Supabase address/key (npm run test:admin builds dist-test/), and answers every
// Supabase request itself — nothing is sent to the real project, and no real key or password is involved.
// usage: npm run test:admin   [screenshots → $SHOTS if set]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(REPO, 'dist-test')
const SHOTS = process.env.SHOTS || ''
const EMAIL = 'owner@example.test'
const USER = { id: '11111111-1111-1111-1111-111111111111', aud: 'authenticated', role: 'authenticated', email: EMAIL, app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' }
const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url')
const TOKEN = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: USER.id, email: EMAIL, role: 'authenticated', aud: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 })}.test-signature`
const RECOVERY_HASH = `#access_token=${TOKEN}&expires_in=3600&expires_at=${Math.floor(Date.now() / 1000) + 3600}&refresh_token=test-refresh&token_type=bearer&type=recovery`

let pass = 0, fail = 0
const ok = (name, cond, info) => { if (cond) { pass++; console.log('PASS ' + name) } else { fail++; console.log('FAIL ' + name + (info ? ' ' + JSON.stringify(info) : '')) } }

if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error('dist-test/ missing: run npm run test:admin'); process.exit(1) }
const server = await new Promise(resolve => {
  const T = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' }
  const s = http.createServer((req, res) => {
    let f = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html')
    res.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res)
  })
  s.listen(0, '127.0.0.1', () => resolve(s))
})
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch()

/* A page whose Supabase calls are answered here. admin = what is_site_admin() returns. */
async function open(url, { admin = true, width = 390 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
  const calls = []
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)(?!fonts\.(googleapis|gstatic)\.com)/, async r => {
    const req = r.request(); const u = new URL(req.url())
    if (!u.hostname.endsWith('supabase.co')) return r.abort()
    const body = req.postData() || ''
    calls.push({ method: req.method(), path: u.pathname, query: u.search, body })
    const json = (status, data) => r.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(data) })
    if (req.method() === 'OPTIONS') return r.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } })
    if (u.pathname === '/auth/v1/recover') return json(200, {})
    if (u.pathname === '/auth/v1/user' && req.method() === 'GET') return req.headers()['authorization']?.includes(TOKEN) ? json(200, USER) : json(401, { msg: 'no session' })
    if (u.pathname === '/auth/v1/user' && req.method() === 'PUT') return json(200, USER)
    if (u.pathname === '/auth/v1/logout') return r.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } })
    if (u.pathname === '/rest/v1/rpc/is_site_admin') return json(200, admin)
    if (u.pathname === '/rest/v1/site_config') return json(200, [])
    return json(404, {})
  })
  const page = await ctx.newPage(); const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(base + url, { waitUntil: 'load' })
  return { ctx, page, calls, errors }
}
const shot = async (page, name) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: true }) }
const noOverflow = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)

// 1. Sign-in screen has "Forgot password?"; it sends the reset email back to /admin/reset
{
  const { ctx, page, calls, errors } = await open('/admin/login')
  await page.getByRole('button', { name: 'Forgot password?' }).waitFor({ timeout: 15000 })
  await shot(page, 'login-390')
  await page.getByRole('button', { name: 'Forgot password?' }).click()
  await page.getByRole('button', { name: 'Send reset link' }).waitFor()
  await shot(page, 'forgot-390')
  await page.locator('#reset-email').fill(EMAIL)
  await page.getByRole('button', { name: 'Send reset link' }).click()
  await page.getByText('a reset link is on its way').waitFor({ timeout: 10000 })
  await shot(page, 'forgot-sent-390')
  const rec = calls.find(c => c.path === '/auth/v1/recover')
  ok('forgot: Supabase is asked to email a reset link to that address', rec && JSON.parse(rec.body).email === EMAIL)
  ok('forgot: the link returns to /admin/reset', rec && decodeURIComponent(rec.query).includes(base + '/admin/reset'))
  ok('forgot: confirmation does not say whether the email exists', await page.getByText(/If .* has an admin account/).count() === 1)
  ok('forgot screens: no page errors', errors.length === 0, errors)
  await page.getByRole('button', { name: 'Back to sign in' }).click()
  ok('forgot: "Back to sign in" returns to the sign-in form', await page.getByRole('button', { name: 'Sign in to Dashboard' }).count() === 1)
  await ctx.close()
}

// 2. /admin/reset opened without a link → explains, offers a new link
{
  const { ctx, page } = await open('/admin/reset')
  await page.getByText('Open this page from the reset link').waitFor({ timeout: 15000 })
  ok('reset without a link: explains and offers a new link', await page.getByRole('link', { name: 'Send a new reset link' }).count() === 1)
  await ctx.close()
}

// 3. Expired / used link (Supabase redirects with an error) → clear message
{
  const { ctx, page } = await open('/admin/reset#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired')
  await page.getByText('expired or was already used').waitFor({ timeout: 15000 })
  await shot(page, 'reset-expired-390')
  ok('expired link: says so and offers a new link', await page.getByRole('link', { name: 'Send a new reset link' }).count() === 1)
  await page.getByRole('link', { name: 'Send a new reset link' }).click()
  await page.getByRole('button', { name: 'Send reset link' }).waitFor({ timeout: 10000 })
  ok('"Send a new reset link" opens the forgot form directly', true)
  await ctx.close()
}

// 4. Valid link → set a new password (rules, then save)
{
  const { ctx, page, calls, errors } = await open('/admin/reset' + RECOVERY_HASH)
  await page.locator('#new-password').waitFor({ timeout: 15000 })
  ok('valid link: the form names the account', await page.getByText(EMAIL).count() >= 1)
  await shot(page, 'reset-form-390')
  await page.locator('#new-password').fill('short'); await page.locator('#confirm-password').fill('short')
  await page.locator('#new-password').evaluate(el => el.removeAttribute('minlength')); await page.locator('#confirm-password').evaluate(el => el.removeAttribute('minlength'))
  await page.getByRole('button', { name: 'Save new password' }).click()
  ok('rule: under 12 characters is refused', await page.getByText('Use at least 12 characters.').count() === 1)
  await page.locator('#new-password').fill('a-long-test-value-1'); await page.locator('#confirm-password').fill('a-long-test-value-2')
  await page.getByRole('button', { name: 'Save new password' }).click()
  ok('rule: the two entries must match', await page.getByText('The two passwords do not match.').count() === 1)
  ok('nothing was saved while the rules failed', !calls.some(c => c.path === '/auth/v1/user' && c.method === 'PUT'))
  await page.locator('#confirm-password').fill('a-long-test-value-1')
  await page.getByRole('button', { name: 'Save new password' }).click()
  await page.getByText('Your new password is saved').waitFor({ timeout: 10000 })
  await shot(page, 'reset-done-390')
  const put = calls.find(c => c.path === '/auth/v1/user' && c.method === 'PUT')
  ok('save: the new password goes to Supabase (only there)', put && JSON.parse(put.body).password === 'a-long-test-value-1')
  ok('save: the fields are cleared afterwards', await page.locator('#new-password').count() === 0)
  ok('reset screens: no page errors', errors.length === 0, errors)
  await page.getByRole('link', { name: 'Go to the dashboard' }).click()
  await page.waitForTimeout(2500)
  ok('admin account: "Go to the dashboard" opens the admin dashboard', (await page.evaluate(() => location.pathname)) === '/admin' && await page.getByText('Not an admin account').count() === 0 && await page.locator('#new-password').count() === 0)
  await ctx.close()
}

// 5. Signed in but not on the admins list → refused, can sign out
{
  const { ctx, page } = await open('/admin/reset' + RECOVERY_HASH, { admin: false })
  await page.locator('#new-password').waitFor({ timeout: 15000 })
  await page.goto(base + '/admin', { waitUntil: 'load' })
  await page.getByText('Not an admin account').waitFor({ timeout: 15000 })
  await shot(page, 'not-admin-390')
  ok('non-admin account: dashboard refused', true)
  await page.getByRole('button', { name: 'Sign out' }).click()
  await page.waitForURL(/\/admin\/login/, { timeout: 10000 })
  ok('non-admin account: "Sign out" returns to the sign-in screen', true)
  await ctx.close()
}

// 6. Every new screen at 7 widths: no sideways scroll, no page errors
for (const width of [360, 390, 768, 820, 1024, 1280, 1440]) {
  const bad = []
  for (const [url, ready] of [['/admin/login?forgot', '#reset-email'], ['/admin/reset' + RECOVERY_HASH, '#new-password'], ['/admin/reset', 'text=Send a new reset link']]) {
    const { ctx, page, errors } = await open(url, { width })
    await page.locator(ready).first().waitFor({ timeout: 15000 })
    if (!(await noOverflow(page)) || errors.length) bad.push({ url: url.slice(0, 20), errors })
    await ctx.close()
  }
  ok(`width ${width}: new screens fit, no page errors`, bad.length === 0, bad)
}

await browser.close(); server.close()
console.log(`\n${pass}/${pass + fail} passed`)
process.exit(fail ? 1 : 0)
