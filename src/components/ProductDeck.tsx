/* ============================================================================
   ProductDeck.tsx — NegosyoPlans-family product deck, ported from the live
   NegosyoPlans hub deck (js/npdeck.js + #npdeck-carousel).

   Behaviour reproduced (cited from js/npdeck.js):
     • horizontal scroll-snap strip; active = card nearest the strip centre (:55-74)
     • autoplay every 3,600 ms (:99), PERMANENTLY stopped on first
       pointerdown / touchstart / wheel (:102-104)
     • tap a SIDE card → scrollIntoView({inline:'center'}) (:87-90);
       tap the ACTIVE card → follow its link (:84-86)
     • prefers-reduced-motion → no autoplay / no float (:47,95)
     • IntersectionObserver pauses the float when the band is off-screen (:123-127)

   The SECTION fills exactly one screen height below the header
   (window.innerHeight, top-padded by the fixed header) so the next section
   never peeks. Height is seeded from window.innerHeight on first render →
   CLS 0 (no post-mount reflow); only updated on resize.

   Every brand name carries translate="no". Links open negosyoplans.com in the
   SAME tab (no target). Card copy + targets are reused from the NP deck.
   ============================================================================ */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react'

/* Hide the whole deck behind a constant instead of deleting it (guard: nothing
   is removed). Flip to false to dark the section without touching the tree. */
const DECK_ENABLED = true

type DeckCard = {
  id:       string
  name:     string
  href?:    string          // external → negosyoplans.com, SAME tab. undefined = coming-soon (not a link)
  tone:     'navy' | 'cream'
  logo?:    string          // /brand/*.png|svg — frameless
  monogram?: string         // coming-soon tile
  sub?:     string
  hook:     string
  desc?:    string
  badge?:   string
  cta?:     string
}

/* Cards in order — targets copied from the NP deck (see file header + PART 0). */
const CARDS: DeckCard[] = [
  { id: 'negosyoplans', name: 'NegosyoPlans', href: 'https://negosyoplans.com/', tone: 'navy',
    logo: '/brand/np-mark.png', sub: 'Business blueprints for Filipino entrepreneurs',
    hook: 'Stop guessing. Start with a complete plan.', cta: 'Open →' },
  { id: 'matthew', name: 'Matthew System', href: 'https://negosyoplans.com/matthew', tone: 'navy',
    logo: '/brand/matthew-crest.svg', sub: 'Your comprehensive business manager dashboard.',
    hook: "It doesn't promise profit. It watches so you don't go under.", cta: 'See it →' },
  { id: 'lite', name: 'Matthew Lite', href: 'https://negosyoplans.com/lite', tone: 'cream',
    logo: '/brand/lite-mark.svg', sub: 'Dashboard for vendors',
    hook: 'Know every day if you really earned.',
    desc: 'Alam mo ang kita mo bawat araw. ₱99 a month.', cta: 'Get started →' },
  { id: 'zam', name: 'ZAM Academ.co', href: 'https://negosyoplans.com/courses', tone: 'cream',
    logo: '/brand/zam-mark.png', sub: 'Digital Marketing',
    hook: 'Marketing that sells, not just gets likes.', cta: 'Open →' },
  { id: 'dames', name: 'DAMES', href: 'https://negosyoplans.com/feasibility', tone: 'cream',
    logo: '/brand/dames-mark.png', sub: 'Feasibility study',
    hook: 'Test your idea before spending a peso.', cta: 'Try it free →' },
  { id: 'wdrich', name: 'WDRICH Supplier Registration', href: 'https://negosyoplans.com/supplier/register', tone: 'navy',
    logo: '/brand/wdrich-mark.png', sub: 'Supplier registration',
    hook: 'List your business where owners look for suppliers.', cta: 'Register →' },
  { id: 'contribute', name: 'Share Your Business Model', href: 'https://negosyoplans.com/supplier/contribute', tone: 'navy',
    logo: '/brand/wdrich-mark.png', sub: 'Contribute a model',
    hook: 'Real model, no blueprint yet? Tell us how it works.', badge: 'Coming soon', cta: 'Share →' },
  /* Coming-soon — dimmed, NOT links, no prices, monogram tile. */
  { id: 'skillvue', name: 'SkillVue', tone: 'navy', monogram: 'S', badge: 'Coming soon',
    hook: 'Workforce skills tracking for food manufacturers.' },
  { id: 'biyaheph', name: 'BiyahePH', tone: 'navy', monogram: 'B', badge: 'Coming soon',
    hook: 'Maps and commute directions for the Philippines.' },
  { id: 'fashion', name: 'Lintejas Fashion', tone: 'cream', monogram: 'F', badge: 'Coming soon',
    hook: "Women's fashion for Europe." },
]

function headerOffset(): number {
  const h = document.querySelector('header')
  return h ? Math.round(h.getBoundingClientRect().height) : 80
}

export default function ProductDeck() {
  const stripRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)   // live mirror of `active` for the autoplay interval
  /* Seed height from the viewport on first render → correct at first paint (CLS 0). */
  const [vh, setVh] = useState<number>(() => (typeof window !== 'undefined' ? window.innerHeight : 800))
  const [pad, setPad] = useState<number>(() => (typeof window !== 'undefined' ? headerOffset() : 80))
  const reduced = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false

  /* One screen height below the header, updated on resize (task spec). */
  useLayoutEffect(() => {
    const onResize = () => { setVh(window.innerHeight); setPad(headerOffset()) }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Active = card whose centre is nearest the strip centre (npdeck.js:55-74). */
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
      setActive(best)
      ticking = false
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    strip.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => strip.removeEventListener('scroll', onScroll)
  }, [])

  /* Autoplay 3,600 ms; permanently stopped on first pointerdown/touchstart/wheel
     (npdeck.js:94-104). No autoplay under reduced-motion. */
  useEffect(() => {
    const strip = stripRef.current
    if (!strip || reduced) return
    let timer: ReturnType<typeof setInterval> | null = null
    let stopped = false
    const centre = (i: number) => cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    const tick = () => {
      const next = (activeRef.current + 1) % CARDS.length
      centre(next)
    }
    timer = setInterval(tick, 3600)
    const stop = () => { if (!stopped) { stopped = true; if (timer) { clearInterval(timer); timer = null } } }
    ;['pointerdown', 'touchstart', 'wheel'].forEach(ev => strip.addEventListener(ev, stop, { passive: true }))
    return () => {
      if (timer) clearInterval(timer)
      ;['pointerdown', 'touchstart', 'wheel'].forEach(ev => strip.removeEventListener(ev, stop))
    }
  }, [reduced])

  useEffect(() => { activeRef.current = active }, [active])

  /* IntersectionObserver — float only while the band is on-screen (npdeck.js:123-127). */
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(e => setInView(e[0].isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onCardClick = (e: ReactMouseEvent, i: number) => {
    const card = CARDS[i]
    if (i !== active) {                    // side card → centre it (npdeck.js:87-90)
      e.preventDefault()
      cardRefs.current[i]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
      return
    }
    if (!card.href) e.preventDefault()      // active but not a link (coming-soon) → no-op
    /* active + link → default <a> navigation proceeds (SAME tab) */
  }

  /* Guard kept after all hooks (stable module constant → hook order never changes). */
  if (!DECK_ENABLED) return null

  return (
    <section
      ref={sectionRef}
      id="ventures-deck"
      aria-label="Our products and ventures"
      className="relative w-full overflow-hidden"
      style={{ height: vh, background: 'var(--navy)' }}
    >
      <div className="h-full flex flex-col justify-center" style={{ paddingTop: pad }}>
        {/* Eyebrow */}
        <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-8 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              The <span translate="no">NegosyoPlans</span> family
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          </div>
        </div>

        {/* Scroll-snap strip */}
        <div
          ref={stripRef}
          role="list"
          className="flex gap-4 sm:gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar"
          style={{
            scrollPadding: '0 50%',
            paddingLeft: 'calc(50% - 150px)',
            paddingRight: 'calc(50% - 150px)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {CARDS.map((card, i) => {
            const isActive = i === active
            const cream = card.tone === 'cream'
            const isLink = !!card.href
            const bg = cream ? 'var(--cream)' : 'rgba(10,22,40,0.72)'
            const ink = cream ? '#0A1628' : 'var(--cream)'
            const muted = cream ? 'rgba(10,22,40,0.62)' : 'var(--slate)'
            const border = isActive ? 'rgba(212,168,67,0.55)' : (cream ? 'rgba(10,22,40,0.10)' : 'var(--glass-border)')
            const comingSoon = !isLink

            const inner = (
              <>
                {/* active gold sheen */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.55), transparent)' }}
                  />
                )}
                <div className="flex items-start justify-between gap-3 mb-5">
                  {/* logo / monogram tile — frameless for real logos */}
                  {card.logo ? (
                    <img src={card.logo} alt="" draggable={false} width={56} height={56}
                      style={{ width: 56, height: 56, objectFit: 'contain', flexShrink: 0 }} />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex items-center justify-center font-display font-semibold"
                      style={{
                        width: 56, height: 56, borderRadius: 14, fontSize: 24, flexShrink: 0,
                        color: cream ? '#0A1628' : 'var(--gold)',
                        background: cream ? 'rgba(10,22,40,0.06)' : 'rgba(212,168,67,0.10)',
                        border: `1px solid ${cream ? 'rgba(10,22,40,0.12)' : 'rgba(212,168,67,0.20)'}`,
                      }}
                    >
                      {card.monogram}
                    </span>
                  )}
                  {card.badge ? (
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md whitespace-nowrap"
                      style={{ color: cream ? '#8A6420' : 'var(--slate)', background: cream ? 'rgba(212,168,67,0.14)' : 'rgba(138,154,176,0.12)', border: `1px solid ${cream ? 'rgba(212,168,67,0.30)' : 'rgba(138,154,176,0.22)'}` }}
                    >
                      {card.badge}
                    </span>
                  ) : card.cta ? (
                    <span className="text-xs font-semibold whitespace-nowrap" style={{ color: cream ? '#8A6420' : 'var(--gold)' }}>
                      {card.cta}
                    </span>
                  ) : null}
                </div>

                <h3 className="font-display font-semibold text-xl leading-tight mb-1" style={{ color: ink }} translate="no">
                  {card.name}
                </h3>
                {card.sub && (
                  <p className="text-xs font-medium mb-3" style={{ color: cream ? '#8A6420' : 'var(--gold)' }}>{card.sub}</p>
                )}
                <p className="text-sm leading-relaxed" style={{ color: muted }}>{card.hook}</p>
                {card.desc && (
                  <p className="text-sm leading-relaxed mt-2 font-medium" style={{ color: ink }}>{card.desc}</p>
                )}
              </>
            )

            const cardStyle: CSSProperties = {
              position: 'relative',
              width: 300,
              flex: '0 0 auto',
              height: 'clamp(340px, 58vh, 440px)',
              padding: '22px 22px',
              borderRadius: 20,
              background: bg,
              border: `1px solid ${border}`,
              boxShadow: isActive ? '0 18px 50px -20px rgba(0,0,0,0.55), 0 0 26px rgba(212,168,67,0.10)' : '0 8px 30px -20px rgba(0,0,0,0.5)',
              opacity: comingSoon ? (isActive ? 0.82 : 0.42) : (isActive ? 1 : 0.5),
              transform: `scale(${isActive ? 1 : 0.9})`,
              transformOrigin: 'center',
              transition: reduced ? 'none' : 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease, box-shadow 0.45s ease, border-color 0.3s ease',
              textDecoration: 'none',
              cursor: (isLink || i !== active) ? 'pointer' : 'default',
              scrollSnapAlign: 'center',
              overflow: 'hidden',
              display: 'block',
              /* gentle float only when active, on-screen, and motion allowed */
              animation: (!reduced && inView && isActive) ? 'deckFloat 5s ease-in-out infinite' : 'none',
            }

            return isLink ? (
              <a
                key={card.id}
                ref={el => { cardRefs.current[i] = el }}
                href={card.href}
                role="listitem"
                aria-label={card.name}
                onClick={e => onCardClick(e, i)}
                style={cardStyle}
              >
                {inner}
              </a>
            ) : (
              <div
                key={card.id}
                ref={el => { cardRefs.current[i] = el }}
                role="listitem"
                aria-label={`${card.name} — coming soon`}
                onClick={e => onCardClick(e, i)}
                style={cardStyle}
              >
                {inner}
              </div>
            )
          })}
        </div>

        {/* Hint */}
        <div className="text-center mt-6" aria-hidden="true">
          <span className="text-xs" style={{ color: 'var(--slate)' }}>← swipe · tap a card to open →</span>
        </div>
      </div>
    </section>
  )
}
