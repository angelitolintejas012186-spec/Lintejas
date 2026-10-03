/* ============================================================================
   ProductDeck.tsx — NegosyoPlans-family hub deck, a 1:1 port of the live
   NegosyoPlans deck (js/npdeck.js + js/npdeck.css + #npdeck-carousel markup).

   Look/motion: styling lives in index.css (.pd-* — verbatim npdeck.css values).
   Behaviour (js/npdeck.js): active = card nearest the strip centre (:55-74);
   autoplay 3,600 ms (:99), permanently stopped on first pointerdown/touchstart/
   wheel (:102-104); tap side → scrollIntoView({inline:'center'}) (:87-90); tap
   active → follow its link (:84-86); the Blueprints "dashboard" dash-link → its
   own href (:82-83); reduced-motion → no autoplay (:47,95); IntersectionObserver
   toggles pd-inview to pause float off-screen (:123-127); a scroll flag pauses
   float during page scroll (:129-134).

   Card CONTENT = the original deck cards (EN), same order, cited to the NP
   index.html deck markup, then the Lintejas coming-soon cards. Links open
   negosyoplans.com in the SAME tab. Brand names carry translate="no".
   Rendered once per breakpoint (Home.tsx) — one instance mounted at a time.
   ============================================================================ */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'

const DECK_ENABLED = true
const NP = 'https://negosyoplans.com'   // same-tab targets

/* Matthew crest — the exact inline SVG the original deck uses (index.html:708). */
/* Official Matte-1 crest — navy field rx 22, flat gold shield #D9A93C, navy M. Dead-flat, no hairline. */
const MatthewCrest = (
  <svg viewBox="0 0 100 100" role="img" aria-label="Matthew System crest">
    <rect x="0" y="0" width="100" height="100" rx="22" fill="#0D1B2E" />
    <path d="M50 12 L84 22 V52 C84 71 69 84.5 50 90.5 C31 84.5 16 71 16 52 V22 Z" fill="#D9A93C" />
    <path d="M31 64 V34 L50 52 L69 34 V64" fill="none" stroke="#0D1B2E" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type Feat = { text: string; food?: boolean }
type Offer = { title: string; sub: string; soon?: boolean }
type Card = {
  v: string
  href?: string           // undefined = coming-soon (not a link)
  navy?: boolean
  frameless?: boolean
  soon?: boolean
  logo?: string
  svg?: ReactNode
  mono?: string           // coming-soon monogram
  emoji?: string          // coming-soon rich card (SkillVue) — emoji icon tile
  liteTag?: boolean
  lockupBrand?: boolean    // brand shown via a horizontal lockup image → suppress the text h3 title
  cta?: string            // gold pill text
  title?: string
  titleBadge?: string     // e.g. FREE
  topBadge?: string       // standalone badge above the icon (SkillVue "Coming soon")
  brand?: boolean         // translate="no" on the title
  sub?: string
  tagline?: string        // gold tagline (SkillVue)
  subline?: string        // muted sub-line (SkillVue)
  hook?: string
  offers?: Offer[]
  feat?: Feat[]
  dash?: string           // blueprints dashboard dash-link
  dashHref?: string
  litedesc?: string
  liteCta?: string
}

/* Same order as the original NP deck (index.html #npdeck-carousel), then coming-soon.
   Exported as the single source of truth: the Portfolio page (pages/Companies.tsx)
   derives its venture list from this same data (ruling 3) — no second list. */
export const CARDS: Card[] = [
  // Business Blueprints — index.html:688-704
  { v: 'blueprints', href: `${NP}/`, navy: true, frameless: true, logo: '/brand/np-mark.png', cta: 'Open →',
    title: 'Business Blueprints', hook: 'Stop guessing. Start with a complete plan.',
    feat: [
      { text: 'Complete business plan' }, { text: 'Startup costs & revenue projections' },
      { text: 'Risk management' }, { text: 'Marketing & social media strategy' },
      { text: 'OFW remote management' }, { text: '90-day launch action plan' },
      { text: 'Food safety & FDA compliance (food)', food: true },
    ],
    dash: 'Includes 30 days of Matthew System Basic →', dashHref: `${NP}/portal/` },
  // Matthew System — index.html:706-718
  { v: 'matthew', href: `${NP}/matthew`, navy: true, frameless: true, svg: MatthewCrest, cta: 'See it →', brand: true,
    title: 'Matthew System', sub: 'Your Comprehensive Business Manager Dashboard.',
    hook: "It doesn't promise profit. It watches so you don't go under.",
    feat: [
      { text: 'Launch journey & milestones' }, { text: 'Money Calendar & Results' },
      { text: 'Operations — deliveries, inventory' }, { text: 'Client bookings' },
      { text: 'PRO: daily Business Health Score' },
    ] },
  // Matthew Lite — Lite brand: cream card + P1 horizontal lockup (shield + "Matthew" brown + "Lite" mango),
  // mango hook rule, dark-brown body, mango CTA. Matches negosyoplans.com/lite. No blue.
  { v: 'lite', href: `${NP}/lite`, frameless: true, logo: '/brand/lite-lockup-light.svg', lockupBrand: true, brand: true,
    title: 'Matthew Lite', hook: 'Know every day if you really earned.',
    litedesc: 'Sales, expenses, profit and your cash split — at a glance. ₱99/month, no contract.',
    liteCta: 'Get started →' },
  // Courses (ZAM) — index.html:733-752
  { v: 'courses', href: `${NP}/courses`, frameless: true, logo: '/brand/zam-mark.png', cta: 'Open →',
    offers: [
      { title: 'Digital Marketing', sub: 'Market your business on the Internet' },
      { title: 'RAG & Agentic AI', sub: 'Improve your skills', soon: true },
    ],
    hook: 'Marketing that sells, not just gets likes.',
    feat: [
      { text: 'Social media marketing' }, { text: 'Search engine marketing' },
      { text: 'Search engine optimization' }, { text: 'From ₱500 per module' },
    ] },
  // Feasibility Study (DAMES) — index.html:754-766
  // REMOVED from the deck 2026-09-30 (checklist item 148): the free feasibility check already lives
  // on negosyoplans.com/feasibility, so this card duplicated it. Data object kept (commented) and the
  // logo asset /brand/dames-mark.png retained per scope-lock — uncomment to restore the card.
  // { v: 'feasibility', href: `${NP}/feasibility`, frameless: true, logo: '/brand/dames-mark.png', cta: 'Try it free →',
  //   title: 'Feasibility Study', titleBadge: 'FREE', hook: 'Test your idea before spending a peso.',
  //   feat: [{ text: 'Free area check' }, { text: 'No email, no payment' }, { text: 'Ideas, not promises' }] },
  // Supplier Registration (WDRICH) — index.html:768-780
  { v: 'supplier', href: `${NP}/supplier/register`, navy: true, frameless: true, logo: '/brand/wdrich-mark.png', cta: 'Register →',
    title: 'Supplier Registration', hook: 'List your business where owners look for suppliers.',
    feat: [{ text: 'Listed in the vetted supplier directory' }, { text: 'Listed — ₱1,300/yr' }, { text: 'Featured — ₱2,500/yr' }] },
  // Share your business model (WDRICH) — index.html:782-794
  { v: 'contribute', href: `${NP}/supplier/contribute`, navy: true, frameless: true, logo: '/brand/wdrich-mark.png', cta: 'Share →',
    title: 'Share your business model', hook: 'Real model, no blueprint yet? Tell us how it works.',
    feat: [{ text: 'If selected, we may build a blueprint from it' }, { text: 'Free to share · no guarantee' }, { text: 'Credited or anonymous — your choice' }] },
  // Coming-soon (Lintejas additions) — dimmed, not links, no price
  // SkillVue = the site's existing SkillVue "Coming soon" featured card content (Home.tsx:553-578),
  // in deck-card style. Navy card so the gold tagline + all text clear ≥4.5:1 (as on the featured card).
  { v: 'skillvue', href: '/#/skillvue', soon: true, navy: true, emoji: '🧠', brand: true, topBadge: 'Coming soon',
    title: 'SkillVue',
    tagline: 'Safety & Workforce Intelligence Platform',       // Home.tsx:570
    subline: 'Food Manufacturing · Safety & HR Tech',          // Home.tsx:571
    hook: 'The human layer of the smart factory.',             // Home.tsx:576 (first sentence)
    feat: [                                                    // derived from the description Home.tsx:576-578
      { text: 'Digital work permits' },
      { text: 'LOTO and confined space entry' },
      { text: 'Risk prediction' },
      { text: 'Competency tracking and training pathways' },
      { text: 'Real-time skill-gap dashboards' },
    ] },
  { v: 'biyaheph', soon: true, mono: 'B', brand: true, title: 'BiyahePH', titleBadge: 'Coming soon',
    hook: 'Maps and commute directions for the Philippines.' },
  // Lintejas Fashion — REMOVED from the deck 2026-09-30: the brand no longer exists.
  // Data object kept (commented) per scope-lock — uncomment to restore.
  // { v: 'fashion', soon: true, mono: 'L', brand: true, title: 'Lintejas Fashion', titleBadge: 'Coming soon',
  //   hook: "Women's fashion for Europe." },
]

function headerOffset(): number {
  const h = document.querySelector('header')
  return h ? Math.round(h.getBoundingClientRect().height) : 80
}

function CardInner({ c }: { c: Card }) {
  // Rich coming-soon card (SkillVue) — mirrors the featured card: badge top-left,
  // 🧠 tile, title, gold tagline, muted sub-line, hook, checklist. No CTA / link / price.
  if (c.emoji) {
    return (
      <>
        {c.topBadge && <span className="pd-soon-badge">{c.topBadge}</span>}
        <div className="pd-ci pd-emoji-tile" aria-hidden="true"><span className="pd-emoji">{c.emoji}</span></div>
        <h3 translate={c.brand ? 'no' : undefined}>{c.title}</h3>
        {c.tagline && <p className="pd-tagline">{c.tagline}</p>}
        {c.subline && <p className="pd-subline">{c.subline}</p>}
        {c.hook && <p className="pd-hook">{c.hook}</p>}
        {c.feat && (
          <ul className="pd-feat">
            {c.feat.map((f) => <li key={f.text}>{f.text}</li>)}
          </ul>
        )}
      </>
    )
  }
  return (
    <>
      <div className="pd-top">
        <div className="pd-ci" aria-hidden={c.soon ? true : undefined}>
          {c.svg ? c.svg : c.logo ? <img src={c.logo} alt="" draggable={false} /> : <span className="pd-mono">{c.mono}</span>}
        </div>
        {c.liteTag
          ? <span className="pd-lite-tag" aria-hidden="true">LITE</span>
          : c.cta
            ? <span className="pd-go">{c.cta}</span>
            : c.soon
              ? <span className="pd-badge pd-badge--soon">Coming soon</span>
              : null}
      </div>

      {c.offers ? (
        <div>
          {c.offers.map((o) => (
            <div className="pd-offer" key={o.title}>
              <div className="pd-offer-row">
                <h3>{o.title}</h3>
                {o.soon && <span className="pd-badge pd-badge--soon">SOON</span>}
              </div>
              <p className="pd-sub">{o.sub}</p>
            </div>
          ))}
        </div>
      ) : c.title && !c.lockupBrand ? (
        <h3 translate={c.brand ? 'no' : undefined}>
          {c.title}
          {c.titleBadge && (c.soon
            ? null
            : <span className="pd-badge">{c.titleBadge}</span>)}
        </h3>
      ) : null}

      {c.sub && !c.offers && <p className="pd-sub">{c.sub}</p>}
      {c.hook && <p className="pd-hook">{c.hook}</p>}
      {c.litedesc && <p className="pd-litedesc">{c.litedesc}</p>}

      {c.feat && (
        <ul className="pd-feat">
          {c.feat.map((f) => <li key={f.text} className={f.food ? 'pd-feat-food' : undefined}>{f.text}</li>)}
        </ul>
      )}

      {c.dash && (
        <span className="pd-dash" role="link" tabIndex={0} data-dash={c.dashHref}>{c.dash}</span>
      )}
      {c.liteCta && <span className="pd-lite-cta">{c.liteCta}</span>}
    </>
  )
}

/* compact (mobile < lg): content-height section, top-aligned, so the eyebrow sits right after the hero
   (no full-vh centring band). scroll-margin clears the fixed header for the "View our portfolio" anchor.
   Default (false) keeps the desktop deck byte-identical (full-vh, centred). Cards unchanged either way. */
export default function ProductDeck({ compact = false }: { compact?: boolean } = {}) {
  const stripRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const activeRef = useRef(0)
  const [vh, setVh] = useState<number>(() => (typeof window !== 'undefined' ? window.innerHeight : 800))
  const [pad, setPad] = useState<number>(() => (typeof window !== 'undefined' ? headerOffset() : 80))
  const reduced = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false

  useLayoutEffect(() => {
    const onResize = () => { setVh(window.innerHeight); setPad(headerOffset()) }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Active = card nearest the strip centre → toggle .pd-active (npdeck.js:55-74). */
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    let ticking = false
    const update = () => {
      const mid = strip.scrollLeft + strip.clientWidth / 2
      let best = 0, bd = Infinity
      cardRefs.current.forEach((c, i) => {
        if (!c) return
        const cc = c.offsetLeft + c.offsetWidth / 2
        const dd = Math.abs(cc - mid)
        if (dd < bd) { bd = dd; best = i }
      })
      if (best !== activeRef.current) {
        activeRef.current = best
        cardRefs.current.forEach((c, i) => c && c.classList.toggle('pd-active', i === best))
      }
      ticking = false
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    strip.addEventListener('scroll', onScroll, { passive: true })
    cardRefs.current.forEach((c, i) => c && c.classList.toggle('pd-active', i === 0))   // card 0 active on mount
    update()
    return () => strip.removeEventListener('scroll', onScroll)
  }, [])

  /* Autoplay 3,600 ms; permanently stopped on first pointerdown/touchstart/wheel. */
  useEffect(() => {
    const strip = stripRef.current
    if (!strip || reduced) return
    let stopped = false
    const timer = setInterval(() => {
      const next = (activeRef.current + 1) % CARDS.length
      cardRefs.current[next]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }, 3600)
    const stop = () => { if (!stopped) { stopped = true; clearInterval(timer) } }
    const evs: (keyof HTMLElementEventMap)[] = ['pointerdown', 'touchstart', 'wheel']
    evs.forEach(ev => strip.addEventListener(ev, stop, { passive: true }))
    return () => { clearInterval(timer); evs.forEach(ev => strip.removeEventListener(ev, stop)) }
  }, [reduced])

  /* pd-inview (pause float off-screen) + pd-scrolling (pause during page scroll). */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(e => el.classList.toggle('pd-inview', e[0].isIntersecting), { threshold: 0.05 })
      io.observe(el)
    } else { el.classList.add('pd-inview') }
    let t: ReturnType<typeof setTimeout> | null = null
    const onScroll = () => {
      el.classList.add('pd-scrolling')
      if (t) clearTimeout(t)
      t = setTimeout(() => el.classList.remove('pd-scrolling'), 140)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io?.disconnect(); window.removeEventListener('scroll', onScroll); if (t) clearTimeout(t) }
  }, [])

  const onCardClick = (e: ReactMouseEvent, i: number) => {
    const dash = (e.target as HTMLElement).closest('.pd-dash') as HTMLElement | null
    if (dash) { e.preventDefault(); e.stopPropagation(); const h = dash.getAttribute('data-dash'); if (h) window.location.href = h; return }
    if (i !== activeRef.current) {   // side card → centre it
      e.preventDefault()
      cardRefs.current[i]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
      return
    }
    if (!CARDS[i].href) e.preventDefault()   // active but not a link (coming-soon) → no-op
    /* active + link → default <a> navigation (SAME tab) */
  }

  if (!DECK_ENABLED) return null

  return (
    <section
      ref={sectionRef}
      id="ventures-deck"
      aria-label="Our products and ventures"
      className="relative w-full overflow-hidden"
      style={{ height: compact ? 'auto' : vh, background: 'var(--navy)', scrollMarginTop: compact ? 'calc(88px + env(safe-area-inset-top))' : undefined }}
    >
      <div className={compact ? 'flex flex-col' : 'h-full flex flex-col justify-center'} style={{ paddingTop: compact ? 0 : pad, paddingBottom: compact ? 24 : undefined }}>
        <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-8 mb-3 sm:mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              The <span translate="no">NegosyoPlans</span> family
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          </div>
        </div>

        <div className="pd-carousel" ref={stripRef} role="list">
          {CARDS.map((c, i) => {
            const cls = ['pd-card', c.navy ? 'pd-navy' : '', c.frameless ? 'pd-frameless' : '', c.soon ? 'pd-soon' : ''].filter(Boolean).join(' ')
            return c.href ? (
              <a key={c.v} ref={el => { cardRefs.current[i] = el }} href={c.href} data-v={c.v} role="listitem"
                aria-label={c.title || c.v} className={cls} onClick={e => onCardClick(e, i)}>
                <CardInner c={c} />
              </a>
            ) : (
              <div key={c.v} ref={el => { cardRefs.current[i] = el }} data-v={c.v} role="listitem"
                aria-label={`${c.title} — coming soon`} className={cls} onClick={e => onCardClick(e, i)}>
                <CardInner c={c} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
