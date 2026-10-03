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

/* Premium card system (2026-10-03, approved mock): every card = logo + status pill → kicker →
   serif name → one-line promise → 3–6 points (line-check icons) → 3-cell stat strip or price
   boxes → CTA pinned to the bottom. Each brand keeps its colours (index.css .pd-card[data-v]).
   The legacy fields title / hook / logo / svg / emoji / mono / soon / href are still read by the
   Portfolio page + footer (lib/portfolio.ts, pages/Companies.tsx) — keep them; deck-only
   overrides live in deckLogo / deckMono. */
type Point = { text: string; chip?: string; soon?: boolean }   // soon → clock icon (not live yet)
type Stat = { b: string; s: string }
type Price = { label: string; price: string; per: string; featured?: boolean }
type Card = {
  v: string
  href?: string           // undefined = coming-soon (not a link)
  navy?: boolean          // gold glow shadow (dark gold-framed cards)
  soon?: boolean
  logo?: string           // also the Portfolio icon
  svg?: ReactNode
  mono?: string           // coming-soon monogram (Portfolio)
  emoji?: string          // Portfolio icon only — the deck never renders emoji
  deckLogo?: string       // deck-only logo override
  deckMono?: string       // deck-only monogram (no logo asset in the repo)
  title?: string          // aria-label + Portfolio fallback
  hook?: string           // Portfolio fallback (= the promise unless noted)
  pill: string
  kicker: string
  name: string
  nameAccent?: string     // trailing part of the name in the brand accent (Matthew <Lite>)
  promise: string
  pointsLabel?: string    // e.g. PLANNED MODULES (hollow-circle icons)
  points?: Point[]
  stats?: Stat[]
  prices?: Price[]
  band?: { lead: string; text: string; href: string }   // secondary link (NP → dashboard)
  cta?: string
}

/* Number of NegosyoPlans blueprints on sale (incl. the bundle) — update when blueprints are added. */
const NP_PLAN_COUNT = 148

const CHECK = <svg className="pdx-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
const CLOCK = <svg className="pdx-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2.5" /></svg>
const RING = <svg className="pdx-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8" /></svg>

/* Same order as before (the original NP deck order, then coming-soon). Exported as the single
   source of truth: the Portfolio page + footer derive their venture list from it — no second list. */
export const CARDS: Card[] = [
  { v: 'blueprints', href: `${NP}/`, navy: true, logo: '/brand/np-mark.png',
    title: 'NegosyoPlans', hook: 'Stop guessing. Start with a comprehensive business plan.',
    pill: 'Live', kicker: 'Business plan blueprints', name: 'NegosyoPlans',
    promise: 'Stop guessing. Start with a comprehensive business plan.',
    points: [
      { text: 'Ready-made plans for real Filipino businesses' },
      { text: 'Startup costs, pricing & revenue projections' },
      { text: 'Risk, marketing & a 90-day launch plan' },
      { text: 'OFW remote-management playbook' },
      { text: 'Food safety & FDA steps for food plans' },
    ],
    stats: [{ b: String(NP_PLAN_COUNT), s: 'plans + bundle' }, { b: 'EN/TL', s: 'language' }, { b: 'Instant', s: 'download' }],
    band: { lead: 'Bonus:', text: 'Matthew System included — 10 days full access, then Basic for life.', href: `${NP}/portal/` },
    cta: 'Browse plans' },
  { v: 'matthew', href: `${NP}/matthew`, navy: true, svg: MatthewCrest,
    title: 'Matthew System', hook: "It doesn't promise profit. It watches so you don't go under.",
    pill: 'Live', kicker: 'Business manager dashboard', name: 'Matthew System',
    promise: "It doesn't promise profit. It watches so you don't go under.",
    points: [
      { text: 'Daily sales, expenses & profit — in EN or Taglish' },
      { text: 'Your own online booking page, with map' },
      { text: 'Walk-in POS, inventory & deliveries' },
      { text: 'Utang, ipon & sobre money tools' },
      { text: 'Counter phone for your kahera' },
      { text: 'Daily Business Health Score', chip: 'Advanced' },
    ],
    stats: [{ b: '10-day', s: 'free trial' }, { b: 'Offline', s: 'keeps saving' }, { b: 'Phone', s: 'first' }],
    cta: 'See it in action' },
  { v: 'lite', href: `${NP}/lite`, logo: '/brand/lite-lockup-light.svg', deckLogo: '/brand/lite-mark.svg',
    title: 'Matthew Lite', hook: 'Know every day if you really earned.',
    pill: 'Live · for vendors', kicker: 'For sari-sari & bangketa', name: 'Matthew', nameAccent: 'Lite',
    promise: 'Know every day if you really earned.',
    points: [
      { text: 'Quick sale & expense logging' },
      { text: "Today's real profit, at a glance" },
      { text: 'Your cash split, worked out for you' },
      { text: 'Installs on any phone like an app' },
    ],
    stats: [{ b: '₱99', s: 'per month' }, { b: '5-day', s: 'free trial' }, { b: 'No', s: 'contract' }],
    cta: 'Start free' },
  { v: 'courses', href: `${NP}/courses`, logo: '/brand/zam-mark.png', deckLogo: '/brand/zam-emblem.png',
    title: 'ZAM Academy', hook: 'Marketing that sells, not just gets likes.',
    pill: 'Courses', kicker: 'ZAM Academ.co', name: 'Digital Marketing',
    promise: 'Marketing that sells, not just gets likes.',
    points: [
      { text: 'Social media marketing' },
      { text: 'Search engine marketing' },
      { text: 'Search engine optimization' },
      { text: 'RAG & Agentic AI', chip: 'Soon', soon: true },
    ],
    stats: [{ b: '₱500', s: 'from / module' }, { b: '3', s: 'tracks now' }, { b: 'Online', s: 'learn anywhere' }],
    cta: 'View courses' },
  // Feasibility Study (DAMES) — REMOVED from the deck 2026-09-30 (checklist item 148): the free
  // feasibility check already lives on negosyoplans.com/feasibility. Logo /brand/dames-mark.png
  // retained per scope-lock. Restore by re-adding a card with href `${NP}/feasibility`.
  { v: 'supplier', href: `${NP}/supplier/register`, logo: '/brand/wdrich-mark.png',
    title: 'Supplier Registration', hook: 'Get found by business owners looking for suppliers.',
    pill: 'Open for suppliers', kicker: 'WDRICH supplier directory', name: 'Supplier Registration',
    promise: 'Get found by business owners looking for suppliers.',
    points: [
      { text: 'Listed where NegosyoPlans owners look for suppliers' },
      // Verified 2026-10-03: register → status 'pending'; only an admin approval makes it public
      // (NP functions/api/supplier/register.js:132, admin/orders/approve.js:114-125, suppliers.js:11).
      { text: 'Every listing reviewed before it goes live' },
      { text: 'Buyers contact you directly — no middleman fees' },
    ],
    prices: [
      { label: 'Listed', price: '₱1,300', per: 'per year' },
      { label: 'Featured', price: '₱2,500', per: 'per year · shown first', featured: true },
    ],
    cta: 'Register your business' },
  // Share your business model (WDRICH) — existing deck copy only.
  { v: 'contribute', href: `${NP}/supplier/contribute`, logo: '/brand/wdrich-mark.png',
    title: 'Share your business model', hook: 'Real model, no blueprint yet? Tell us how it works.',
    pill: 'Open', kicker: 'New blueprint ideas', name: 'Share your business model',
    promise: 'Real model, no blueprint yet? Tell us how it works.',
    points: [
      { text: 'If selected, we may build a blueprint from it' },
      { text: 'Free to share · no guarantee' },
      { text: 'Credited or anonymous — your choice' },
    ],
    cta: 'Share' },
  // SkillVue — Coming soon (dashed). No logo asset in the repo → deck monogram; 🧠 stays the Portfolio icon.
  { v: 'skillvue', href: '/#/skillvue', soon: true, emoji: '🧠', deckMono: 'SV',
    title: 'SkillVue', hook: 'The human layer of the smart factory.',
    pill: 'Coming soon', kicker: 'Food manufacturing · Safety & HR', name: 'SkillVue',
    promise: 'The human layer of the smart factory.',
    pointsLabel: 'Planned modules',
    points: [
      { text: 'Digital work permits, LOTO & confined-space entry' },
      { text: 'Competency tracking & training pathways' },
      { text: 'Skill-gap dashboards & risk prediction' },
    ],
    cta: 'See plans & get notified' },
  // BiyahePH — Coming soon, not a link; existing copy only (deck hook + the Portfolio line).
  { v: 'biyaheph', soon: true, mono: 'B',
    title: 'BiyahePH', hook: 'Maps and commute directions for the Philippines.',
    pill: 'Coming soon', kicker: 'Planned for Android & iOS', name: 'BiyahePH',
    promise: 'Maps and commute directions for the Philippines.' },
  // Lintejas Fashion — REMOVED from the deck 2026-09-30: the brand no longer exists.
]

function headerOffset(): number {
  const h = document.querySelector('header')
  return h ? Math.round(h.getBoundingClientRect().height) : 80
}

function CardInner({ c }: { c: Card }) {
  const logo = c.deckLogo || c.logo
  return (
    <>
      <div className="pdx-top">
        <div className="pdx-mark" aria-hidden="true">
          {c.svg ? c.svg : logo ? <img src={logo} alt="" draggable={false} width={36} height={36} /> : <span className="pdx-mono">{c.deckMono || c.mono}</span>}
        </div>
        <span className="pdx-pill">{c.pill}</span>
      </div>
      <div>
        <p className="pdx-kicker">{c.kicker}</p>
        <h3 className="pdx-name" translate="no">{c.name}{c.nameAccent && <> <span className="pdx-accent">{c.nameAccent}</span></>}</h3>
      </div>
      <p className="pdx-promise">{c.promise}</p>
      {c.pointsLabel && <p className="pdx-plabel">{c.pointsLabel}</p>}
      {c.points && (
        <ul className="pdx-list">
          {c.points.map(p => (
            <li key={p.text}>
              {c.pointsLabel ? RING : p.soon ? CLOCK : CHECK}
              <span>{p.text}{p.chip && <span className="pdx-chip">{p.chip}</span>}</span>
            </li>
          ))}
        </ul>
      )}
      {c.stats && (
        <div className="pdx-stats">
          {c.stats.map(s => <div className="pdx-stat" key={s.s}><b>{s.b}</b><span>{s.s}</span></div>)}
        </div>
      )}
      {c.prices && (
        <div className="pdx-prices">
          {c.prices.map(p => (
            <div className={'pdx-price' + (p.featured ? ' is-featured' : '')} key={p.label}>
              <span className="pdx-plab">{p.label}</span><b>{p.price}</b><span className="pdx-per">{p.per}</span>
            </div>
          ))}
        </div>
      )}
      <div className="pdx-foot">
        {c.band && (
          <span className="pd-dash pdx-band" role="link" tabIndex={0} data-dash={c.band.href}><b>{c.band.lead}</b> {c.band.text}</span>
        )}
        {c.cta && <span className="pdx-cta">{c.cta} <span aria-hidden="true">→</span></span>}
      </div>
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
      style={{ height: compact ? 'auto' : undefined, minHeight: compact ? undefined : vh, background: 'var(--navy)', scrollMarginTop: compact ? 'calc(88px + env(safe-area-inset-top))' : undefined }}
    >
      {/* desktop: full-viewport band, centred — min-height (not height) so the premium cards are never
          clipped on short laptop screens (≈ <790px tall); on taller screens it is exactly one viewport. */}
      <div className={compact ? 'flex flex-col' : 'flex flex-col justify-center'} style={{ paddingTop: compact ? 0 : pad, paddingBottom: compact ? 24 : undefined, minHeight: compact ? undefined : vh, boxSizing: 'border-box' }}>
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
            const cls = ['pd-card', 'pdx', c.navy ? 'pd-navy' : '', c.soon ? 'pd-soon' : ''].filter(Boolean).join(' ')
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
