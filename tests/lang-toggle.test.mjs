// TL / EN language toggle — small pill beside the hero badge + floating copy that fades on scroll (Angie, 3 Nov 2026).
// Test build in dist-test/ (FAKE Supabase address/key), every outside request answered here; no real clock needed.
// At 360, 390, 768×1024, 820×1180, 1024×768, 1180×820, 1280, 1440, TL + EN:
//   the hero pill sits on the badge's line, right-aligned; each half 27×23 px, 10 px bold; 44×44 px tap area per half;
//   badge on one line; aria (group "Language", aria-pressed); contrast ≥ 4.5:1; no sideways scroll, nothing clipped;
//   floating copy: hidden at the top, hidden while scrolling down, back after a pause and on scroll up, 12 px under the
//   header and 16 px from the right, never over a form field; a tap on it switches the page text and the hero pill.
//   Once: reduced motion (no transition), mobile menu drawer above it.
// usage: npm run test:lang-toggle   [screenshots → $SHOTS if set; PW_CHROMIUM=<path> to use an installed browser]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(REPO, 'dist-test')
const SHOTS = process.env.SHOTS || ''
let pass = 0, fail = 0
const ok = (name, cond, info) => { if (cond) { pass++; console.log('PASS ' + name) } else { fail++; console.log('FAIL ' + name + (info !== undefined ? ' ' + JSON.stringify(info) : '')) } }

if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error('dist-test/ missing: run npm run test:lang-toggle'); process.exit(1) }
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

const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const H1 = { tl: 'Ibahagi ang isang Lintejas brand.', en: 'Share a Lintejas brand.' }

async function open(W, H, L, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, isMobile: W < 1024, hasTouch: true, ...extra })
  await ctx.addInitScript(l => { try { localStorage.setItem('lt_aff_lang', l) } catch { /* */ } }, L)
  await ctx.route(/^https:\/\/(?!127\.0\.0\.1)/, route => (/fonts\.(googleapis|gstatic)\.com/.test(route.request().url()) ? route.continue().catch(() => route.abort()) : route.fulfill({ status: 204, body: '' })))
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message))
  await page.goto(base + '/affiliates', { waitUntil: 'load' }); await page.waitForTimeout(1200)
  return { ctx, page, errs }
}
const float = page => page.evaluate(() => { const f = document.querySelector('.lang-float'); return { shown: f.dataset.shown === 'true', op: +getComputedStyle(f).opacity, pe: getComputedStyle(f).pointerEvents } })
/* scroll in small steps (real scroll events, one direction) */
const steps = (page, to, n = 8) => page.evaluate(async ([to, n]) => { const from = scrollY; for (let i = 1; i <= n; i++) { scrollTo(0, from + (to - from) * i / n); await new Promise(r => setTimeout(r, 40)) } }, [to, n])

const SIZES = [[360, 800], [390, 844], [768, 1024], [820, 1180], [1024, 768], [1180, 820], [1280, 860], [1440, 900]]
for (const [W, H] of SIZES) for (const L of ['tl', 'en']) {
  const tag = `[${W}×${H} ${L}] `
  const { ctx, page, errs } = await open(W, H, L)

  // ── the hero pill ──
  const m = await page.evaluate(() => {
    const g = document.querySelector('main .lang-toggle:not(.lang-toggle--float), .lang-toggle:not(.lang-toggle--float)')
    const row = g.closest('.flex'); const badge = row.firstElementChild
    const bs = [...g.querySelectorAll('button')].map(b => { const r = b.getBoundingClientRect(), cs = getComputedStyle(b); return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height, fs: cs.fontSize, fw: +cs.fontWeight, pressed: b.getAttribute('aria-pressed'), text: b.textContent.trim(), color: cs.color, bg: cs.backgroundColor } })
    const gr = g.getBoundingClientRect(), br = badge.getBoundingClientRect(), rr = row.getBoundingClientRect()
    const tap = bs.map((b, i) => { const cy = (b.t + b.b) / 2; const x0 = i === 0 ? b.r - 43 : b.l + 1, x1 = i === 0 ? b.r - 1 : b.l + 43; return [[x0, cy - 21], [x1, cy - 21], [x0, cy + 21], [x1, cy + 21]].every(([x, y]) => document.elementFromPoint(x, y) === g.querySelectorAll('button')[i]) })
    return { label: g.getAttribute('aria-label'), role: g.getAttribute('role'), bs, tap, track: getComputedStyle(g).backgroundColor,
      sameLine: Math.abs((gr.top + gr.bottom) / 2 - (br.top + br.bottom) / 2) <= 3, rightGap: (() => { const c = g.closest('.mx-auto'); return c.getBoundingClientRect().right - parseFloat(getComputedStyle(c).paddingRight) - gr.right })(),
      badgeOneLine: br.height <= 34 && badge.scrollWidth <= badge.clientWidth + 1, badgeText: badge.textContent.trim(),
      inView: gr.left >= 0 && gr.right <= innerWidth, h1: document.querySelector('h1').textContent.trim(),
      gapAbove: br.top - document.querySelector('header').getBoundingClientRect().bottom }
  })
  const rgb = s => s.match(/[\d.]+/g).slice(0, 3).map(Number)
  ok(tag + 'group aria-label="Language", 2 buttons with aria-pressed', m.role === 'group' && m.label === 'Language' && m.bs.length === 2 && m.bs.filter(b => b.pressed === 'true').length === 1 && m.bs[L === 'tl' ? 0 : 1].pressed === 'true', m.bs.map(b => b.pressed))
  ok(tag + 'each half ≈27×23 px, 10 px bold', m.bs.every(b => Math.abs(b.w - 27) < 0.6 && Math.abs(b.h - 23) < 0.6 && b.fs === '10px' && b.fw >= 700), m.bs)
  ok(tag + 'each half has a 44×44 px tap area', m.tap.every(Boolean), m.tap)
  ok(tag + 'pill on the badge line, right-aligned to the page content edge', m.sameLine && Math.abs(m.rightGap) < 1, { sameLine: m.sameLine, rightGap: m.rightGap })
  ok(tag + 'badge on one line, nothing clipped', m.badgeOneLine && m.inView, m.badgeText)
  ok(tag + 'no big empty space above the hero (≤ 48 px under the header)', m.gapAbove <= 49, m.gapAbove)
  ok(tag + 'page text is ' + L.toUpperCase(), m.h1.startsWith(H1[L]), m.h1)
  const act = m.bs.find(b => b.pressed === 'true'), ina = m.bs.find(b => b.pressed !== 'true')
  const c1 = ratio(rgb(act.color), rgb(act.bg)), c2 = ratio(rgb(ina.color), rgb(m.track))
  ok(tag + 'contrast ≥ 4.5:1 (active, inactive)', c1 >= 4.5 && c2 >= 4.5, [c1.toFixed(2), c2.toFixed(2)])
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/lang-top-${L}-${W}.png` })

  // ── floating copy ──
  let s = await float(page)
  ok(tag + 'floating copy hidden while the hero pill is on screen', !s.shown && s.op === 0 && s.pe === 'none', s)
  const prog = await page.evaluate(() => document.getElementById('programs').getBoundingClientRect().top + scrollY - 140)
  await page.evaluate(() => { window.__seen = []; const f = document.querySelector('.lang-float'); window.__obs = setInterval(() => window.__seen.push(f.dataset.shown), 20) })
  await steps(page, prog, 10)
  const during = await page.evaluate(() => { clearInterval(window.__obs); return window.__seen })
  ok(tag + 'hidden while scrolling down', during.length > 3 && during.every(v => v === 'false'), during.join(''))
  await page.waitForTimeout(300); s = await float(page)
  ok(tag + 'still hidden right after scrolling stops (< 600 ms)', !s.shown, s)
  await page.waitForTimeout(900); s = await float(page)
  ok(tag + 'back after a pause (~600 ms + 0.3 s fade)', s.shown && s.op === 1 && s.pe === 'auto', s)
  const pos = await page.evaluate(() => { const r = document.querySelector('.lang-float').getBoundingClientRect(), h = document.querySelector('header').getBoundingClientRect(); return { top: r.top - h.bottom, right: innerWidth - r.right, z: +getComputedStyle(document.querySelector('.lang-float')).zIndex } })
  ok(tag + '~12 px under the header, 16 px from the right, z below the header/menu', pos.top >= 10 && pos.top <= 14 && Math.abs(pos.right - 16) < 1 && pos.z < 50, pos)
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/lang-float-${L}-${W}.png` })
  await steps(page, prog + 600, 6); s = await float(page)
  ok(tag + 'fades out again on scroll down', !s.shown, s)
  await steps(page, prog + 450, 4); await page.waitForTimeout(80); s = await float(page)
  ok(tag + 'back at once on scroll up (no pause)', s.shown, s)

  // a tap on the floating copy switches the page language + the hero pill (one state)
  const other = L === 'tl' ? 'en' : 'tl'
  await page.locator('.lang-float button', { hasText: other.toUpperCase() }).tap()
  await page.waitForTimeout(150)
  const sw = await page.evaluate(() => ({ h1: document.querySelector('h1').textContent.trim(), stored: localStorage.getItem('lt_aff_lang'),
    hero: [...document.querySelectorAll('.lang-toggle:not(.lang-toggle--float) button')].map(b => b.getAttribute('aria-pressed')),
    fl: [...document.querySelectorAll('.lang-toggle--float button')].map(b => b.getAttribute('aria-pressed')) }))
  const want = other === 'tl' ? ['true', 'false'] : ['false', 'true']
  ok(tag + `floating ${other.toUpperCase()} switches the page text + the hero pill + the stored choice`, sw.h1.startsWith(H1[other]) && sw.stored === other && sw.hero.join() === want.join() && sw.fl.join() === want.join(), sw)

  // never over a form field: park an input under the pill, wait past the pause → hidden
  const y = await page.evaluate(() => { const fx = innerWidth - 16 - 31; const inp = [...document.querySelectorAll('#apply input:not([type=checkbox]):not([type=hidden]), #apply select, #apply textarea')].find(i => { const r = i.getBoundingClientRect(); return r.width && r.left < fx && r.right > fx }); if (!inp) return null; const r = inp.getBoundingClientRect(); return r.top + scrollY - (document.querySelector('header').getBoundingClientRect().bottom + 12) + 4 })
  if (y !== null) { await steps(page, y, 6); await page.waitForTimeout(1100); s = await float(page); ok(tag + 'stays hidden over a form field', !s.shown, s) }
  else ok(tag + 'no form field reaches under the pill at this width (nothing to cover)', true)

  const q = await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth)
  ok(tag + 'no sideways scroll', q <= 0, q)
  ok(tag + 'no page errors', !errs.length, errs)
  await ctx.close()
}

// ── once: reduced motion and the mobile menu ──
{
  const { ctx, page } = await open(390, 844, 'en', { reducedMotion: 'reduce' })
  const tr = await page.evaluate(() => getComputedStyle(document.querySelector('.lang-float')).transitionDuration)
  ok('[reduced motion] no fade transition', parseFloat(tr) < 0.01, tr)
  await ctx.close()
}
{
  const { ctx, page } = await open(390, 844, 'en')
  const prog = await page.evaluate(() => document.getElementById('programs').getBoundingClientRect().top + scrollY - 140)
  await steps(page, prog, 6); await page.waitForTimeout(1100)
  await page.locator('header button[aria-expanded]').tap(); await page.waitForTimeout(600)
  const top = await page.evaluate(() => { const r = document.querySelector('.lang-float').getBoundingClientRect(); const n = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); return n ? !document.querySelector('.lang-float').contains(n) : false })
  ok('[390 menu open] the menu drawer covers the floating pill (pill under the menu)', top)
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/lang-menu-390.png` })
  await ctx.close()
}
await browser.close(); server.close()
console.log(`\n${pass}/${pass + fail} passed`); process.exit(fail ? 1 : 0)
