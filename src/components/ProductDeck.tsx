/* ============================================================================
   ProductDeck.tsx — Lintejas brands hub deck, a 1:1 port of the live
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

/* Business Automation mark — the official logo (business-automation public/brand/logo.svg; copy in
   public/brand/automation/): violet gradient tile, white gear, yellow lightning. Own gradient id. */
const AutomationMark = (
  <svg viewBox="0 0 100 100" role="img" aria-label="Business Automation logo">
    <defs><linearGradient id="ba-deck-vg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8F5CF6" /><stop offset="1" stopColor="#4A2FC8" /></linearGradient></defs>
    <rect x="4" y="4" width="92" height="92" rx="28" fill="url(#ba-deck-vg)" />
    <g fill="#FFFFFF">
      <circle cx="50" cy="50" r="24" fill="none" stroke="#FFFFFF" strokeWidth="7" />
      <g transform="translate(50 50)">
        {[0, 60, 120, 180, 240, 300].map(d => <rect key={d} x="-4.5" y="-35" width="9" height="11" rx="2" transform={`rotate(${d})`} />)}
      </g>
    </g>
    <path d="M54 34 L42 53 H50 L46 67 L59 47 H51 Z" fill="#FFE27A" />
  </svg>
)

/* Staycation Booking mark (2026-10-27): our own simple drawing — a house with a small calendar in the doorway,
   sea-teal tile, obsidian-friendly. No real resort's logo or artwork. */
export const StayMark = (
  <svg viewBox="0 0 100 100" role="img" aria-label="Staycation Booking mark">
    <rect x="4" y="4" width="92" height="92" rx="26" fill="#0E3B3C" />
    <path d="M22 50 L50 27 L78 50" fill="none" stroke="#2EC4B6" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30 46 V74 H70 V46" fill="none" stroke="#2EC4B6" strokeWidth="6" strokeLinejoin="round" />
    <rect x="40" y="52" width="20" height="18" rx="3" fill="#F6F2E8" />
    <rect x="40" y="52" width="20" height="5" rx="2" fill="#2EC4B6" />
    <circle cx="46" cy="63" r="1.8" fill="#0E3B3C" /><circle cx="54" cy="63" r="1.8" fill="#0E3B3C" />
  </svg>
)

/* Premium card system (2026-10-03, approved mock): every card = logo + status pill → kicker →
   serif name → one-line promise → 3–6 points (line-check icons) → 3-cell stat strip or price
   boxes → CTA pinned to the bottom. Obsidian & Gold look (2026-10-17): one dark surface for all
   cards, each brand's accent set in index.css .pd-card.pdx[data-v] (--acc).
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
  pilot?: boolean         // open for pilot sign-ups (Portfolio status "Pilot open"), still a link
  logo?: string           // also the Portfolio icon
  svg?: ReactNode
  mono?: string           // coming-soon monogram (Portfolio)
  emoji?: string          // Portfolio icon only — the deck never renders emoji
  deckLogo?: string       // deck-only logo override
  deckMono?: string       // deck-only monogram (no logo asset in the repo)
  title?: string          // aria-label + Portfolio fallback
  hook?: string           // Portfolio fallback (= the promise unless noted)
  pill: string
  badgeSoon?: boolean     // deck pill → gold COMING SOON badge (replaces the pill text)
  soonLabel?: string      // text for that gold badge when it is not "Coming soon" (RomLet: Pilot programme)
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

/* Number of NegosyoPlans blueprints on sale (= negosyoplans.com "143 businesses") — update when blueprints are added. */
const NP_PLAN_COUNT = 143

const CHECK = <svg className="pdx-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
const CLOCK = <svg className="pdx-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2.5" /></svg>
const ARROW = <svg className="pdx-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
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
    stats: [{ b: String(NP_PLAN_COUNT), s: 'plans' }, { b: 'EN · TL', s: 'for 112' }, { b: 'Online', s: 'blueprint' }],   // read online; emailed once GoTyme payment is confirmed (downloads are off)
    band: { lead: 'Bonus:', text: 'Matthew System Basic ₱199/month — free for 3 months with any NegosyoPlans blueprint, 14 days without.', href: `${NP}/portal/` },
    cta: 'Browse plans' },
  { v: 'matthew', href: `${NP}/matthew`, navy: true, svg: MatthewCrest,
    title: 'Matthew System', hook: "It doesn't promise profit. It watches so you don't go under.",
    pill: 'Live', kicker: 'Business manager dashboard', name: 'Matthew System',
    promise: "It doesn't promise profit. It watches so you don't go under.",
    points: [
      { text: 'Daily sales, expenses & profit — in EN or Taglish' },
      { text: 'Your own online booking page, with map', chip: 'Advanced' },
      { text: 'Walk-in POS, inventory & deliveries' },
      { text: 'Utang, ipon & sobre money tools' },
      { text: 'Counter phone for your kahera', chip: 'Advanced' },
      { text: 'Daily Business Health Score', chip: 'Advanced' },
    ],
    stats: [{ b: '14-day', s: 'free trial' }, { b: 'Offline', s: 'keeps saving' }, { b: 'Phone', s: 'first' }],
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
      { text: 'Works offline — saves when the signal drops' },   // added Oct 18
    ],
    stats: [{ b: '₱99', s: 'per month' }, { b: '7-day', s: 'free trial' }, { b: 'No', s: 'contract' }],
    cta: 'Start free' },
  // Staycation Booking — COMING SOON (2026-10-27): direct booking for staycation owners, built on the Business Automation
  // platform and not open to customers yet. Own page /staycation (pilot sign-up only). Sea-teal accent (index.css
  // data-v="staycation"). Stats are facts, not figures. Placed directly after Matthew Lite.
  { v: 'staycation', badgeSoon: true, soon: true, href: '/staycation', svg: StayMark,
    title: 'Staycation Booking', hook: 'Your own booking page — guests pick dates, sign the house agreement and send the deposit, all in one link.',
    pill: 'Coming soon', kicker: 'Direct booking for staycation owners', name: 'Staycation Booking',
    promise: 'Your own booking page — guests pick dates, sign the house agreement and send the deposit, all in one link.',
    pointsLabel: 'Planned features',
    points: [
      { text: 'Per-unit availability calendar' },
      { text: 'Owner-set prices, promos and packages' },
      { text: 'OFW-friendly: book for family, pay from abroad' },
      { text: 'Check-in / check-out inventory checklist' },
    ],
    stats: [{ b: 'Multi-unit', s: 'villas & rooms' }, { b: 'Owner-ruled', s: 'pricing' }, { b: 'Book direct', s: 'your own link' }],
    cta: "See what's coming" },
  { v: 'courses', badgeSoon: true, href: `${NP}/courses`, logo: '/brand/zam-mark.png', deckLogo: '/brand/zam-emblem.png',
    title: 'ZAM Academy', hook: 'Marketing that sells, not just gets likes.',
    pill: 'Courses', kicker: 'ZAM Academ.co', name: 'Digital Marketing',
    promise: 'Marketing that sells, not just gets likes.',
    points: [
      { text: 'Social media marketing' },
      { text: 'Search engine marketing' },
      { text: 'Search engine optimization' },
      { text: 'Taught in Taglish with Filipino examples' },   // added Oct 18
      { text: 'RAG & Agentic AI', chip: 'Soon', soon: true },
    ],
    stats: [{ b: '₱500', s: 'from / module' }, { b: '3', s: 'tracks now' }, { b: 'Online', s: 'learn anywhere' }],
    cta: 'View courses' },
  // Feasibility Study (DAMES) — REMOVED from the deck 2026-09-30 (checklist item 148): the free
  // feasibility check already lives on negosyoplans.com/feasibility. Logo /brand/dames-mark.png
  // retained per scope-lock. Restore by re-adding a card with href `${NP}/feasibility`.
  { v: 'supplier', badgeSoon: true, href: `${NP}/supplier/register`, logo: '/brand/wdrich-mark.png',
    title: 'Supplier Registration', hook: 'Register as a supplier for Filipino entrepreneurs — or share your own business model and get credited in a blueprint.',
    pill: 'Open for suppliers', kicker: 'Suppliers & business models', name: 'Supplier Registration',
    promise: 'Register as a supplier for Filipino entrepreneurs — or share your own business model and get credited in a blueprint.',
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
  // Share your business model (WDRICH) — MERGED into the Supplier Registration card above (2026-10-05): its message
  // now lives in that card's kicker + promise. The page itself stays at ${NP}/supplier/contribute (not deleted).
  // Business Automation — pilot open (2026-10-13). Own porcelain + violet look (index.css data-v="automation");
  // `pilot` → Portfolio status "Pilot open". No prices, no results — sign-up only after the pilot page.
  { v: 'automation', href: '/automation', pilot: true, svg: AutomationMark,
    title: 'Business Automation', hook: 'Ready-made automations for small businesses — pilot open.',
    pill: 'New', kicker: 'Ready-made automations', name: 'Business Automation',
    promise: 'Let the busy work run itself. You only approve.',
    points: [
      { text: 'Collect late payments politely' },
      { text: 'Win back customers' },
      { text: 'Online booking page' },
      { text: 'Product listings and training guides' },
      { text: 'AI voice receptionist answers missed calls' },   // added Oct 18
    ],
    stats: [{ b: 'You', s: 'approve first' }, { b: 'Ready-made', s: 'no coding' }, { b: 'Web', s: 'any device' }],   // placeholder (Oct 17)
    cta: 'Open' },
  // RomLet (formerly SkillVue, renamed 19 Oct 2026) — pilot programme; the card links out to romlet.tech.
  // v stays 'skillvue': the card's accent/CTA colours are keyed on data-v in index.css (styling unchanged).
  // Same gold badge as Coming soon, with its own text (soonLabel). No logo asset in the repo → deck monogram.
  { v: 'skillvue', badgeSoon: true, soonLabel: 'Pilot programme', href: 'https://romlet.tech', soon: true, pilot: true, emoji: '🧠', deckMono: 'R',
    title: 'RomLet', hook: 'Competency records your auditor can actually read.',
    pill: 'Pilot programme', kicker: 'Food manufacturing · Workforce competency', name: 'RomLet',
    promise: 'Competency records your auditor can actually read.',
    pointsLabel: 'Modules',
    points: [
      { text: 'Competency matrix by line & role' },
      { text: 'Training records & sign-offs on the floor' },
      { text: 'Gap analysis & re-certification alerts' },
      { text: 'Audit-ready exports (HACCP, ISO 22000, FSSC, BRCGS, IFS)' },
    ],
    stats: [{ b: 'EN·SK·DE·FR', s: 'languages' }, { b: 'Web', s: 'any device' }, { b: 'B2B', s: 'food plants' }],
    cta: 'Visit romlet.tech' },
  // BiyahePH — Coming soon, not a link; deck hook + the Portfolio line, plus placeholder planned features + stats.
  { v: 'biyaheph', badgeSoon: true, soon: true, mono: 'B',
    title: 'BiyahePH', hook: 'Maps and commute directions for the Philippines.',
    pill: 'Coming soon', kicker: 'Planned for Android & iOS', name: 'BiyahePH',
    promise: 'Maps and commute directions for the Philippines.',
    pointsLabel: 'Planned features',
    points: [   // placeholder (Oct 17)
      { text: 'Offline maps when the signal drops' },
      { text: 'Commute routes — jeep, bus & train' },
      { text: 'Turn-by-turn directions, Taglish ready' },
      { text: 'Built for Philippine roads & addresses' },
      { text: 'Jeepney & bus route numbers, not just streets' },   // added Oct 18
    ],
    stats: [{ b: 'Offline', s: '+ online' }, { b: 'Android', s: 'planned' }, { b: 'iOS', s: 'planned' }] },   // placeholder (Oct 17)
  // Lintejas Fashion — REMOVED from the deck 2026-09-30: the brand no longer exists.
]

function headerOffset(): number {
  const h = document.querySelector('header')
  return h ? Math.round(h.getBoundingClientRect().height) : 80
}

/* Title split for the accent word: explicit nameAccent, else the last word, else the camel-case tail
   (Negosyo|Plans, Skill|Vue, Biyahe|PH). The rendered text is unchanged. */
function splitName(c: Card): [string, string] {
  if (c.nameAccent) return [c.name + ' ', c.nameAccent]
  const sp = c.name.lastIndexOf(' ')
  if (sp > 0) return [c.name.slice(0, sp + 1), c.name.slice(sp + 1)]
  const m = c.name.match(/^(.*[a-z])([A-Z].*)$/)
  return m ? [m[1], m[2]] : [c.name, '']
}

/* Obsidian & Gold (2026-10-17): status chip kind — LIVE (green), NEW (violet), COMING SOON (gold). */
const chipKind = (c: Card) => (c.badgeSoon ? 'soon' : c.pill.startsWith('Live') ? 'live' : 'new')

function CardInner({ c, n }: { c: Card; n: number }) {
  const logo = c.deckLogo || c.logo
  const [head, accent] = splitName(c)
  const kind = chipKind(c)
  return (
    <>
      {/* decorative layers behind the content (z-index −1 inside the card's stacking context) */}
      <span className="pdx-fx" aria-hidden="true"><span className="pdx-hair" /><span className="pdx-motif" /></span>
      <div className="pdx-top">
        <div className="pdx-mark" aria-hidden="true">
          {c.svg ? c.svg : logo ? <img src={logo} alt={`${c.name} logo`} draggable={false} width={36} height={36} /> : <span className="pdx-mono">{c.deckMono || c.mono}</span>}
        </div>
        <span className={`pdx-pill pdx-pill-${kind}`}><span className="pdx-dot" aria-hidden="true" />{c.badgeSoon ? (c.soonLabel ?? 'Coming soon') : c.pill}</span>
      </div>
      <div>
        <p className="pdx-kicker">{c.kicker}</p>
        <h3 className="pdx-name" translate="no">{head}{accent && <span className="pdx-accent">{accent}</span>}</h3>
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
          {c.stats.map(s => <div className="pdx-stat" key={`${s.b}|${s.s}`}><b>{s.b}</b><span>{s.s}</span></div>)}
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
        {c.cta && <span className="pdx-cta">{c.cta} {ARROW}</span>}
      </div>
      <span className="pdx-index" aria-hidden="true">{String(n).padStart(2, '0')} / {String(CARDS.length).padStart(2, '0')}</span>
    </>
  )
}

/* compact (mobile < lg): content-height section, top-aligned, so the eyebrow sits right after the hero
   (no full-vh centring band). scroll-margin clears the fixed header for the "View our portfolio" anchor.
   Default (false) keeps the desktop deck byte-identical (full-vh, centred). Cards unchanged either way. */
/* Deck-section backdrop (Angie, 20 Oct 2026): deep space behind the cards only. Performance pass
   (real-phone scroll test, 20 Oct 2026): everything static — navy base, nebulae, beams, ringed planet,
   horizon, haze, glossy floor, scan lines, most stars and the top/bottom fades — is ONE pre-rendered
   image (public/bg/deck-space-{phone,tablet,desktop}.{avif,webp}, baked from the #27 layers). Only
   cheap motion stays live on top: two aurora bands (transform), one twinkling star layer (opacity) and
   rising gold dust (transform/opacity) — no blur, blend modes or masks. Styling in index.css (.pds-*). */
const TWINKLE = (() => {
  // same seeded sky as the pre-rendered image; only the first twinkle group stays live
  let a = 20261020
  const rnd = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const tint = () => { const r = rnd(); return r < 0.7 ? '#FFFFFF' : r < 0.85 ? '#F3D58A' : '#A9C6FF' }
  Array.from({ length: 150 }, () => [rnd(), rnd(), rnd(), rnd(), tint()])   // the dim layer (baked into the image)
  return Array.from({ length: 42 }, (_, i) => ({ x: rnd() * 1440, y: rnd() * 540, r: 1 + rnd() * 0.7, o: 0.7 + rnd() * 0.3, f: tint(), g: i % 3 })).filter(s => s.g === 0)
})()
const DUST = Array.from({ length: 16 }, (_, i) => ({ left: `${(i * 37 + 11) % 100}%`, dur: `${11 + (i * 7) % 8}s`, delay: `-${(i * 1.9) % 14}s`, size: 1.5 + (i % 3) * 0.6 }))

function DeckSpace() {
  return (
    <div className="pds" aria-hidden="true">
      <span className="pds-img" />
      <span className="pds-aurora pds-aurora-gold" /><span className="pds-aurora pds-aurora-blue" />
      <span className="pds-tw">
        <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
          {TWINKLE.map((s, i) => <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(2)} fill={s.f} opacity={s.o.toFixed(2)} />)}
        </svg>
      </span>
      {DUST.map((d, i) => <span key={i} className="pds-dust" style={{ left: d.left, width: d.size, height: d.size, animationDuration: d.dur, animationDelay: d.delay }} />)}
    </div>
  )
}

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

  /* Autoplay 3,600 ms; permanently stopped on first pointerdown/touchstart/wheel.
     Scrolls the strip only (horizontal scrollTo) — scrollIntoView also scrolled the PAGE down to the deck.
     Runs only while ≥30% of the strip is on screen. */
  useEffect(() => {
    const strip = stripRef.current
    if (!strip || reduced) return
    let stopped = false
    let timer: ReturnType<typeof setInterval> | null = null
    const advance = () => {
      const card = cardRefs.current[(activeRef.current + 1) % CARDS.length]
      if (!card) return
      // strip and cards share the section as offsetParent → card position inside the strip, centred
      const left = card.offsetLeft - strip.offsetLeft + card.offsetWidth / 2 - strip.clientWidth / 2
      strip.scrollTo({ left, behavior: 'smooth' })
    }
    const start = () => { if (!stopped && !timer) timer = setInterval(advance, 3600) }
    const pause = () => { if (timer) { clearInterval(timer); timer = null } }
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(e => (e[0].isIntersecting ? start() : pause()), { threshold: 0.3 })
      io.observe(strip)
    } else { start() }
    const stop = () => { if (!stopped) { stopped = true; pause(); io?.disconnect() } }
    const evs: (keyof HTMLElementEventMap)[] = ['pointerdown', 'touchstart', 'wheel']
    evs.forEach(ev => strip.addEventListener(ev, stop, { passive: true }))
    return () => { pause(); io?.disconnect(); evs.forEach(ev => strip.removeEventListener(ev, stop)) }
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
    /* active + link → default <a> navigation (SAME tab; an external https link such as romlet.tech opens a new tab) */
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
      <DeckSpace />
      {/* desktop: full-viewport band, centred — min-height (not height) so the premium cards are never
          clipped on short laptop screens (≈ <790px tall); on taller screens it is exactly one viewport. */}
      <div className={compact ? 'flex flex-col' : 'flex flex-col justify-center'} style={{ paddingTop: compact ? 0 : pad, paddingBottom: compact ? 24 : undefined, minHeight: compact ? undefined : vh, boxSizing: 'border-box' }}>
        <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-8 mb-3 sm:mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              The <span translate="no">Lintejas</span> brands
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          </div>
        </div>

        <div className="pd-carousel" ref={stripRef} role="list">
          {CARDS.map((c, i) => {
            const cls = ['pd-card', 'pdx', c.navy ? 'pd-navy' : '', c.soon ? 'pd-soon' : '', chipKind(c) === 'live' ? 'pdx-live' : ''].filter(Boolean).join(' ')
            return c.href ? (
              <a key={c.v} ref={el => { cardRefs.current[i] = el }} href={c.href} data-v={c.v} role="listitem"
                {...(/^https?:/.test(c.href) ? { target: '_blank', rel: 'noopener' } : {})}
                aria-label={c.title || c.v} className={cls} onClick={e => onCardClick(e, i)}>
                <CardInner c={c} n={i + 1} />
              </a>
            ) : (
              <div key={c.v} ref={el => { cardRefs.current[i] = el }} data-v={c.v} role="listitem"
                aria-label={`${c.title} — coming soon`} className={cls} onClick={e => onCardClick(e, i)}>
                <CardInner c={c} n={i + 1} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
