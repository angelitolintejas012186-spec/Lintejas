// Affiliates form — social links for NegosyoPlans applications (2 Nov 2026).
// 1. The rules (src/lib/socialLinks.ts, the same as the shop's agent-apply.js): hosts per platform, https:// added when
//    missing, http / credentials / too long / our own sites / duplicates refused.
// 2. The page in a real browser (test build in dist-test/, FAKE Supabase address/key): the section shows only while
//    NegosyoPlans is ticked; one row to start, up to 4; the ✓ and the plain message per row in EN + TL; no valid link →
//    nothing is sent; a good form POSTs `social` (normalised) to negosyoplans.com/api/agent/apply — answered HERE by the
//    test, nothing reaches the real shop. All 8 device sizes: no sideways scroll, the new controls ≥44 px.
// 3. (3 Nov 2026, approved "Agent Approval & Payout Flow" mock) the form asks only name, email, mobile, city + the social
//    links — no wallet, channel or note — shows "Wala pang bayad na details dito…", and POSTs exactly the same fields as
//    negosyoplans.com/become-an-agent (name, email, mobile, city, social, agree, lang, source, turnstileToken).
// usage: npm run test:affiliates   [screenshots → $SHOTS if set; PW_CHROMIUM=<path> to use an installed browser]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(REPO, 'dist-test')
const SHOTS = process.env.SHOTS || ''
let pass = 0, fail = 0
const ok = (name, cond, info) => { if (cond) { pass++; console.log('PASS ' + name) } else { fail++; console.log('FAIL ' + name + (info !== undefined ? ' ' + JSON.stringify(info) : '')) } }

// ── 1. rules ──
const R = await import(pathToFileURL(path.join(REPO, 'src/lib/socialLinks.ts')).href)
{
  const c = (p, u) => R.checkSocialLink(p, u)
  ok('rules: facebook.com/x without https:// → normalised', c('facebook_page', 'facebook.com/juan').url === 'https://facebook.com/juan')
  const good = [['facebook_page', 'www.facebook.com/a'], ['facebook_account', 'm.facebook.com/a'], ['facebook_account', 'web.facebook.com/a'], ['facebook_page', 'fb.com/a'], ['tiktok', 'tiktok.com/@a'],
    ['tiktok', 'vm.tiktok.com/Z/'], ['instagram', 'instagram.com/a'], ['youtube', 'youtube.com/@a'], ['youtube', 'youtu.be/a'], ['x', 'x.com/a'], ['x', 'twitter.com/a'], ['threads', 'threads.net/@a'], ['other', 'kusina.example.ph/a']]
  ok('rules: every listed host is accepted for its platform', good.every(([p, u]) => !!c(p, u).url), good.filter(([p, u]) => !c(p, u).url))
  const bad = [['instagram', 'facebook.com/a', 'wrong_host'], ['facebook_page', 'facebook.com.evil.test/a', 'wrong_host'], ['other', 'negosyoplans.com/agent', 'own_site'], ['other', 'www.lintejas.io/x', 'own_site'],
    ['x', 'http://x.com/a', 'http'], ['x', 'https://u:p@x.com/a', 'credentials'], ['other', 'javascript:alert(1)', 'bad_url'], ['other', 'not a link', 'bad_url'], ['other', 'https://10.0.0.1/a', 'bad_url'],
    ['other', 'blog.test/' + 'a'.repeat(200), 'too_long'], ['myspace', 'x.com/a', 'bad_platform'], ['x', '   ', 'empty']]
  ok('rules: wrong host / own site / http / credentials / bad link / too long / unknown platform / empty', bad.every(([p, u, r]) => c(p, u).reason === r), bad.map(([p, u, r]) => [r, c(p, u).reason]))
  const d = R.checkSocialRows([{ platform: 'x', url: 'x.com/a' }, { platform: 'x', url: 'https://www.x.com/A/' }])
  ok('rules: the same link twice (www / case / trailing slash) → duplicate', !!d[0].url && d[1].reason === 'duplicate', d)
}

// ── 2. the page ──
if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error('dist-test/ missing: run npm run test:affiliates'); process.exit(1) }
const server = await new Promise(resolve => {
  const T = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg' }
  const s = http.createServer((req, res) => {
    let f = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html')
    res.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res)
  })
  s.listen(0, '127.0.0.1', () => resolve(s))
})
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {})   // PW_CHROMIUM: use an already-installed browser
const STR = fs.readFileSync(path.join(REPO, 'src/pages/Affiliates.tsx'), 'utf8')
const str = (lang, k) => { const blk = STR.slice(STR.indexOf('\n  ' + lang + ': {')); return (blk.match(new RegExp('\\b' + k + ": '([^']*)'")) || [])[1] }

const HGT = { 360: 780, 390: 844, 768: 1024, 820: 1180, 1024: 768, 1180: 820, 1280: 800, 1440: 900 }
for (const W of [360, 390, 768, 820, 1024, 1180, 1280, 1440]) for (const L of ['tl', 'en']) {
  const tag = `[${W} ${L}] `
  const ctx = await browser.newContext({ viewport: { width: W, height: HGT[W] }, isMobile: W < 1024, hasTouch: true })
  await ctx.addInitScript(l => { try { localStorage.setItem('lt_aff_lang', l) } catch { /* */ } }, L)
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message))
  const posts = []
  await ctx.route(/^https:\/\/(?!127\.0\.0\.1)/, route => {   // nothing leaves the machine: the shop and Supabase are answered here
    const u = route.request().url()
    if (u === 'https://negosyoplans.com/api/agent/apply' && route.request().method() === 'POST') { posts.push(JSON.parse(route.request().postData() || '{}')); return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }) }
    if (u === 'https://negosyoplans.com/api/turnstile-config') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"enforce":[]}' })
    if (/fonts\.(googleapis|gstatic)\.com/.test(u)) return route.continue().catch(() => route.abort())
    return route.fulfill({ status: 204, body: '' })
  })
  await page.goto(base + '/affiliates', { waitUntil: 'load' }); await page.waitForTimeout(800)
  await page.evaluate(() => document.getElementById('apply')?.scrollIntoView()); await page.waitForTimeout(600)

  const s0 = await page.evaluate(() => { const sec = document.getElementById('aff-social'), br = document.querySelector('fieldset'), note = document.getElementById('aff-pay-note')
    return { h: sec && sec.querySelector('h3')?.textContent, rows: document.querySelectorAll('.aff-soc-row').length, after: !!(br && sec && (br.compareDocumentPosition(sec) & 4)), before: !!(sec && note && (sec.compareDocumentPosition(note) & 4)) } })
  ok(tag + 'the social section ("' + str(L, 'soc_h') + '") after the brands, before the payout note; one row', s0.h === str(L, 'soc_h') && s0.rows === 1 && s0.after && s0.before, s0)
  const f0 = await page.evaluate(() => ({ ids: [...document.querySelectorAll('form input:not([type=checkbox]):not([tabindex="-1"]), form select, form textarea')].map(x => x.id).filter(id => id && !/^aff-soc-/.test(id) && !id.startsWith('aff-soc')),
    note: document.getElementById('aff-pay-note')?.textContent?.replace(/\s+/g, ' ').trim() }))
  ok(tag + 'only name, email, mobile, city (+ social links) — no wallet, channel or note field', JSON.stringify(f0.ids) === JSON.stringify(['aff-name', 'aff-email', 'aff-mobile', 'aff-city']), f0.ids)
  ok(tag + 'the note "' + str(L, 'pay_note_b') + ' ' + str(L, 'pay_note') + '"', f0.note === str(L, 'pay_note_b') + ' ' + str(L, 'pay_note'), f0.note)
  await page.uncheck('#aff-b-negosyoplans'); await page.waitForTimeout(100)
  ok(tag + 'NegosyoPlans unticked → the section hides', await page.evaluate(() => !document.getElementById('aff-social')))
  await page.check('#aff-b-negosyoplans'); await page.waitForTimeout(100)

  await page.fill('#aff-name', 'Liza Cruz'); await page.fill('#aff-email', 'liza@example.test'); await page.fill('#aff-mobile', '0917 555 0101')
  await page.fill('#aff-city', 'Cebu City'); await page.check('#aff-agree')
  await page.click('form button[type=submit]'); await page.waitForTimeout(200)
  let e = await page.evaluate(() => ({ t: document.querySelector('[role=alert]')?.textContent, f: document.activeElement?.id }))
  ok(tag + 'no link → "' + str(L, 'e_social') + '", first link focused, nothing sent', e.t === str(L, 'e_social') && e.f === 'aff-soc-url-0' && posts.length === 0, e)

  await page.fill('#aff-soc-url-0', 'facebook.com/juannegosyo'); await page.waitForTimeout(100)
  let m = await page.evaluate(() => document.getElementById('aff-soc-msg-0').textContent)
  ok(tag + 'Facebook page link → "' + str(L, 'soc_ok').replace('{p}', 'Facebook') + '"', m === str(L, 'soc_ok').replace('{p}', 'Facebook'), m)
  await page.click('#aff-soc-add'); await page.waitForTimeout(100)
  await page.selectOption('[aria-label="' + str(L, 'soc_plat') + ' 2"]', 'instagram'); await page.fill('#aff-soc-url-1', 'facebook.com/juan'); await page.locator('#aff-soc-url-1').blur(); await page.waitForTimeout(100)
  m = await page.evaluate(() => ({ t: document.getElementById('aff-soc-msg-1').textContent, inv: document.getElementById('aff-soc-url-1').getAttribute('aria-invalid') }))
  ok(tag + 'Instagram + a Facebook link → "' + str(L, 'sr_wrong_host').replace('{p}', 'Instagram') + '"', m.t === str(L, 'sr_wrong_host').replace('{p}', 'Instagram') && m.inv === 'true', m)

  const q = await page.evaluate(() => { const els = [...document.querySelectorAll('#aff-social select, #aff-social input, #aff-soc-add')]
    return { hs: document.scrollingElement.scrollWidth - innerWidth, small: els.map(x => Math.round(x.getBoundingClientRect().height)).filter(h => h < 44) } })
  ok(tag + 'no sideways scroll, the new controls ≥44 px', q.hs <= 0 && !q.small.length, q)
  if (SHOTS) { await page.evaluate(() => document.getElementById('aff-social')?.scrollIntoView({ block: 'center' })); await page.waitForTimeout(300); await page.screenshot({ path: `${SHOTS}/aff-social-${L}-${W}.png` }) }

  await page.click('form button[type=submit]'); await page.waitForTimeout(200)
  e = await page.evaluate(() => ({ t: document.querySelector('[role=alert]')?.textContent, f: document.activeElement?.id }))
  ok(tag + 'a wrong row blocks sending (focus on it)', e.t === str(L, 'e_social') && e.f === 'aff-soc-url-1' && posts.length === 0, e)
  await page.fill('#aff-soc-url-1', 'instagram.com/juan.negosyo'); await page.click('#aff-soc-add'); await page.click('#aff-soc-add'); await page.waitForTimeout(100)
  ok(tag + 'up to 4 rows, then the add button hides', await page.evaluate(() => document.querySelectorAll('.aff-soc-row').length === 4 && !document.getElementById('aff-soc-add')))
  await page.click('form button[type=submit]'); await page.waitForTimeout(800)
  const p = posts[0] || {}
  ok(tag + 'sent: social = the 2 filled links, normalised, with source lintejas', posts.length === 1 && p.source === 'lintejas' && JSON.stringify(p.social) === JSON.stringify([{ platform: 'facebook_page', url: 'https://facebook.com/juannegosyo' }, { platform: 'instagram', url: 'https://instagram.com/juan.negosyo' }]), p)
  ok(tag + 'sent: exactly the shop form\'s fields (no walletType / channel / note)', JSON.stringify(Object.keys(p).filter(k => k !== 'turnstileToken').sort()) === JSON.stringify(['agree', 'city', 'email', 'lang', 'mobile', 'name', 'social', 'source'].sort()) && p.mobile === '09175550101', Object.keys(p))
  ok(tag + 'the thank-you shows', await page.evaluate(() => !!document.querySelector('[role=status]')))
  ok(tag + 'no page errors', !errs.length, errs)
  await ctx.close()
}
await browser.close(); server.close()
console.log(`\n${pass}/${pass + fail} passed`); process.exit(fail ? 1 : 0)
