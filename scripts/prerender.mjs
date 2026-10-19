// Prerender (Oct 2026, real addresses): after `vite build`, open every public page of dist/ in a headless browser and
// write one HTML file per page, so search engines and link previews get that page's own content and tags:
//   dist/about.html, dist/companies.html … (GitHub Pages serves /about from about.html, no redirect)
//   dist/404.html     — the app for any other address (unknown pages → branded 404, /admin/* → admin), noindex
//   dist/skillvue.html — old name → /romlet
// Each file is dist/index.html with: the page's title, description, canonical and share tags (src/lib/page-meta.json),
// and the page's readable content (headings, paragraphs, lists, links) in the .lt-static block, which a browser running
// JavaScript never shows (index.html: html.js) — the app replaces it. The homepage keeps its hand-written block.
// usage: npm run build && node scripts/prerender.mjs   (CI: .github/workflows/deploy.yml)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(REPO, 'dist')
const SITE = 'https://lintejas.io'
const META = JSON.parse(fs.readFileSync(path.join(REPO, 'src/lib/page-meta.json'), 'utf8'))
const PAGES = Object.keys(META).filter(p => p.startsWith('/') && p !== '/')
const DEFAULT_IMAGE = `${SITE}/og-image.png?v=3`
const DEFAULT_ALT = 'Lintejas logo — a gold frame with a gold cube in the centre'
const TEMPLATE = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
function fail(msg) { console.error('prerender: ' + msg); process.exit(1) }

/* Replace one tag's attribute value; every tag must exist exactly once in the template. */
function setTag(html, re, value, label) {
  const m = html.match(re); if (!m || html.split(m[0]).length !== 2) fail(`template tag not found once: ${label}`)
  return html.replace(re, (_a, pre, _old, post) => pre + esc(value) + post)
}
function withMeta(html, { title, description, url, image, imageAlt }) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  html = setTag(html, /(<meta name="description" content=")([^"]*)(")/, description, 'description')
  html = setTag(html, /(<link rel="canonical" href=")([^"]*)(")/, url, 'canonical')
  html = setTag(html, /(<meta property="og:url" content=")([^"]*)(")/, url, 'og:url')
  html = setTag(html, /(<meta property="og:title" content=")([^"]*)(")/, title, 'og:title')
  html = setTag(html, /(<meta property="og:description" content=")([^"]*)(")/, description, 'og:description')
  html = setTag(html, /(<meta property="og:image" content=")([^"]*)(")/, image, 'og:image')
  html = setTag(html, /(<meta property="og:image:alt" content=")([^"]*)(")/, imageAlt, 'og:image:alt')
  html = setTag(html, /(<meta name="twitter:title" content=")([^"]*)(")/, title, 'twitter:title')
  html = setTag(html, /(<meta name="twitter:description" content=")([^"]*)(")/, description, 'twitter:description')
  html = setTag(html, /(<meta name="twitter:image" content=")([^"]*)(")/, image, 'twitter:image')
  html = setTag(html, /(<meta name="twitter:image:alt" content=")([^"]*)(")/, imageAlt, 'twitter:image:alt')
  return html
}
/* Swap the <main> inside the .lt-static block (its header nav and footer links stay). */
function withMain(html, mainHtml) {
  const a = html.indexOf('<div class="lt-static">'); if (a < 0) fail('no .lt-static block in dist/index.html')
  const s = html.indexOf('<main>', a), e = html.indexOf('</main>', s)
  if (s < 0 || e < 0) fail('no <main> inside .lt-static')
  return html.slice(0, s) + '<main>\n' + mainHtml + '\n        </main>' + html.slice(e + '</main>'.length)
}

/* Static server for dist/: files as-is, anything else → index.html (the app routes it). Local only. */
const server = await new Promise(resolve => {
  const T = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' }
  const s = http.createServer((req, res) => {
    let f = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html')
    res.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res)
  })
  s.listen(0, '127.0.0.1', () => resolve(s))
})
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch()

/* In the page: the readable structure of <main>, as plain HTML (headings, paragraphs, lists, links, bold). */
function extract() {
  const main = document.querySelector('#main-content'); if (!main) return null
  const SKIP = new Set(['SCRIPT', 'STYLE', 'SVG', 'CANVAS', 'NOSCRIPT', 'BUTTON', 'FORM', 'INPUT', 'SELECT', 'TEXTAREA', 'IFRAME', 'IMG', 'VIDEO'])
  const BLOCK = /^(DIV|SECTION|ARTICLE|ASIDE|HEADER|FOOTER|NAV|MAIN|UL|OL|LI|P|H[1-6]|DL|DT|DD|TABLE|TR|TD|TH|FIGURE|BLOCKQUOTE)$/
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const hidden = el => el.getAttribute('aria-hidden') === 'true' || el.hidden || getComputedStyle(el).display === 'none' || getComputedStyle(el).visibility === 'hidden'
  const href = a => { const u = new URL(a.getAttribute('href'), location.href); return u.origin === location.origin ? (u.pathname + u.search + u.hash) : u.href }
  function inline(el) {
    let out = ''
    for (const n of el.childNodes) {
      if (n.nodeType === 3) { out += esc(n.textContent); continue }
      if (n.nodeType !== 1 || SKIP.has(n.tagName) || hidden(n)) continue
      if (n.tagName === 'BR') { out += ' '; continue }
      const inner = inline(n)
      const gap = getComputedStyle(n).display === 'inline' ? '' : ' '   // separate words that only line breaks/blocks kept apart
      if (n.tagName === 'A' && n.getAttribute('href')) out += `${gap}<a href="${esc(href(n))}">${inner.trim()}</a>${gap}`
      else if (n.tagName === 'STRONG' || n.tagName === 'B') out += `${gap}<strong>${inner.trim()}</strong>${gap}`
      else out += gap + inner + gap
    }
    return out.replace(/\s+/g, ' ').replace(/ ([.,;:!?])/g, '$1')
  }
  const hasBlock = el => [...el.children].some(c => BLOCK.test(c.tagName))
  const out = []
  function walk(el) {
    for (const n of el.children) {
      if (SKIP.has(n.tagName) || hidden(n)) continue
      const t = n.tagName
      if (/^H[1-6]$/.test(t)) { const h = Math.min(+t[1], 3); const x = inline(n).trim(); if (x) out.push(`<h${h}>${x}</h${h}>`); continue }
      if (t === 'P') { const x = inline(n).trim(); if (x) out.push(`<p>${x}</p>`); continue }
      if (t === 'UL' || t === 'OL') {
        const items = [...n.children].filter(li => li.tagName === 'LI' && !hidden(li)).map(li => inline(li).trim()).filter(Boolean)
        if (items.length) out.push(`<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`)
        continue
      }
      if (t === 'A' && !hasBlock(n)) { const x = inline(n).trim(); if (x && n.getAttribute('href')) out.push(`<p><a href="${esc(href(n))}">${x}</a></p>`); continue }
      if (hasBlock(n)) { walk(n); continue }
      const x = inline(n).trim(); if (x.replace(/<[^>]+>/g, '').trim().length > 0) out.push(`<p>${x}</p>`)
    }
  }
  walk(main)
  return out.filter((x, i) => x !== out[i - 1]).join('\n')
}

async function render(route) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort())   // no network: deterministic, nothing sent anywhere
  const page = await ctx.newPage(); const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(base + route, { waitUntil: 'load', timeout: 60000 })
  await page.waitForSelector('#main-content h1', { timeout: 30000 })
  await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } scrollTo(0, 0) })
  await page.waitForTimeout(500)
  const body = await page.evaluate(extract)
  await ctx.close()
  if (errors.length) console.warn(`prerender: ${route}: page error (continuing): ${errors[0].slice(0, 160)}`)
  if (!body || !/<h1>/.test(body)) fail(`${route}: no <h1> in the rendered page`)
  return body
}

const indent = s => s.split('\n').map(l => '          ' + l).join('\n')
const written = []
for (const route of PAGES) {
  const m = META[route]
  let html = withMeta(TEMPLATE, { title: m.title, description: m.description, url: SITE + route, image: m.image ?? DEFAULT_IMAGE, imageAlt: m.imageAlt ?? DEFAULT_ALT })
  html = withMain(html, indent(await render(route)))
  const file = path.join(DIST, route.slice(1) + '.html')
  fs.writeFileSync(file, html); written.push(path.relative(DIST, file))
}

/* 404.html: the app for every other address (GitHub Pages serves it with status 404). Never indexed. */
{
  let html = withMain(TEMPLATE, indent('<h1>Page not found</h1>\n<p>The page you are looking for does not exist or has moved. <a href="/">Go to the homepage</a>.</p>'))
  html = html.replace(/<title>[^<]*<\/title>/, '<title>Page not found — Lintejas Engine</title>')
  html = html.replace(/\s*<link rel="canonical" href="[^"]*" \/>/, '')
  html = html.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex" />')
  if (!html.includes('name="robots" content="noindex"')) fail('404.html: noindex not added')
  fs.writeFileSync(path.join(DIST, '404.html'), html); written.push('404.html')
}

/* skillvue.html: old name, redirects to /romlet. */
fs.writeFileSync(path.join(DIST, 'skillvue.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="robots" content="noindex" />
<title>RomLet — Lintejas Engine</title><link rel="canonical" href="${SITE}/romlet" />
<meta http-equiv="refresh" content="0; url=/romlet" /><script>location.replace('/romlet')</script></head>
<body style="background:#0A1628;color:#F3EFE4;font-family:system-ui,sans-serif;padding:24px"><p>SkillVue is now RomLet. <a href="/romlet" style="color:#E8C766">Continue to RomLet</a>.</p></body></html>
`); written.push('skillvue.html')

await browser.close(); server.close()
console.log('prerendered: ' + written.join(', '))
