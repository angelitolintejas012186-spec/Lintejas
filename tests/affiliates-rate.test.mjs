// Affiliates — NegosyoPlans blueprint rate switches at 17 Nov 2026 00:00 Manila (Angie, 3 Nov 2026).
// FROZEN CLOCK ONLY (times relative to the cutoff constant in src/lib/npRates.ts; never the real clock).
// 1. the rule: 25% before (1 ms before included), 20% at and after.
// 2. the page in a real browser (test build in dist-test/, FAKE Supabase address/key, every outside request answered
//    here): before → "25%" + "… (20% mula 17 Nob)" / "… (20% from 17 Nov)"; after → "20%" + the plain line; the other
//    rates (20% Matthew, 20% OFW bundle, ₱50 Lite) unchanged; 360–1440 incl. tablets, TL + EN: no sideways scroll.
// usage: npm run test:affiliates-rate   [screenshots → $SHOTS if set; PW_CHROMIUM=<path> to use an installed browser]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(REPO, 'dist-test')
const SHOTS = process.env.SHOTS || ''
let pass = 0, fail = 0
const ok = (name, cond, info) => { if (cond) { pass++; console.log('PASS ' + name) } else { fail++; console.log('FAIL ' + name + (info !== undefined ? ' ' + JSON.stringify(info) : '')) } }

// ── 1. the rule ──
const R = await import(pathToFileURL(path.join(REPO, 'src/lib/npRates.ts')).href)
const T = R.NP_BLUEPRINT_RATE_CUTOFF_MS
ok('cutoff = 17 Nov 2026 00:00 Manila (16 Nov 16:00 UTC)', R.NP_BLUEPRINT_RATE_CUTOFF === '2026-11-17T00:00:00+08:00' && T === Date.UTC(2026, 10, 16, 16, 0, 0))
ok('3 days before → 25%', R.npBlueprintRate(T - 3 * 864e5) === '25%' && R.npBlueprintRateIsNew(T - 3 * 864e5) === false)
ok('1 ms before → 25%', R.npBlueprintRate(T - 1) === '25%')
ok('at the cutoff → 20%', R.npBlueprintRate(T) === '20%' && R.npBlueprintRateIsNew(T) === true)
ok('a day after → 20%', R.npBlueprintRate(T + 864e5) === '20%')

// ── 2. the page ──
if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error('dist-test/ missing: run npm run test:affiliates-rate'); process.exit(1) }
const server = await new Promise(resolve => {
  const TY = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg' }
  const s = http.createServer((req, res) => {
    let f = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html')
    res.writeHead(200, { 'Content-Type': TY[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res)
  })
  s.listen(0, '127.0.0.1', () => resolve(s))
})
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {})
const WANT = {
  tl: { before: ['25%', 'ng bawat blueprint na binili ng customer mo (20% mula 17 Nob)'], after: ['20%', 'ng bawat blueprint na binili ng customer mo'] },
  en: { before: ['25%', 'of every blueprint your customer buys (20% from 17 Nov)'], after: ['20%', 'of every blueprint your customer buys'] },
}
const SIZES = [[360, 800], [390, 844], [768, 1024], [820, 1180], [1024, 768], [1180, 820], [1280, 860], [1440, 900]]
for (const [W, H] of SIZES) for (const L of ['tl', 'en']) for (const [when, t] of [['before', T - 3 * 864e5], ['after', T + 3600e3]]) {
  const tag = `[${W}×${H} ${L} ${when}] `
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, isMobile: W < 1024, hasTouch: true })
  await ctx.addInitScript(({ l, t }) => {
    const D = Date; function F(...a) { if (!(this instanceof F)) return new D(t).toString(); return a.length ? new D(...a) : new D(t) }
    F.prototype = D.prototype; F.now = () => t; F.parse = D.parse; F.UTC = D.UTC; window.Date = F
    try { localStorage.setItem('lt_aff_lang', l) } catch { /* */ }
  }, { l: L, t })
  await ctx.route(/^https:\/\/(?!127\.0\.0\.1)/, route => (/fonts\.(googleapis|gstatic)\.com/.test(route.request().url()) ? route.continue().catch(() => route.abort()) : route.fulfill({ status: 204, body: '' })))
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message))
  await page.goto(base + '/affiliates', { waitUntil: 'load' }); await page.waitForTimeout(700)
  const rows = await page.evaluate(() => {
    const li = [...document.querySelectorAll('li')].filter(x => x.querySelector('b') && /^(\d+%|₱50)$/.test(x.querySelector('b').textContent.trim()))
    return li.slice(0, 4).map(x => [x.querySelector('b').textContent.trim(), x.querySelector('span')?.textContent.trim()])
  })
  const [wn, wt] = WANT[L][when]
  ok(tag + `blueprint row "${wn} ${wt}"`, rows[0] && rows[0][0] === wn && rows[0][1] === wt, rows)
  ok(tag + 'other rates unchanged (20%, 20%, ₱50)', rows.length === 4 && rows[1][0] === '20%' && rows[2][0] === '20%' && rows[3][0] === '₱50', rows)
  const q = await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth)
  ok(tag + 'no sideways scroll', q <= 0, q)
  ok(tag + 'no page errors', !errs.length, errs)
  if (SHOTS && (W === 390 || W === 820 || W === 1280)) {
    await page.evaluate(() => { const b = [...document.querySelectorAll('li b')].find(x => /^\d+%$/.test(x.textContent.trim())); b && b.scrollIntoView({ block: 'center' }) }); await page.waitForTimeout(250)
    await page.screenshot({ path: `${SHOTS}/aff-rate-${when}-${L}-${W}.png` })
  }
  await ctx.close()
}
await browser.close(); server.close()
console.log(`\n${pass}/${pass + fail} passed`); process.exit(fail ? 1 : 0)
