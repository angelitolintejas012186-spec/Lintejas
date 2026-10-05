import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Cpu, Shield, TrendingUp, ChevronDown } from 'lucide-react'
import TheInterlockLogo from '../components/TheInterlockLogo'
import MagneticButton from '../components/ui/MagneticButton'
import AssemblingInterlock from '../components/motion/AssemblingInterlock'
import LiquidGold          from '../components/motion/LiquidGold'
import ProductDeck         from '../components/ProductDeck'
import DeferredLogo        from '../components/DeferredLogo'
import { WHATSAPP_NUMBER, whatsappHref } from '../lib/contact'
import { useMediaQuery } from '../lib/useMediaQuery'
import { fadeUp, staggerContainer, staggerItem, ease } from '../lib/motion'

const Interlock3D = lazy(() => import('../components/Interlock3D'))

/* ── Headline lines — each reveals with a clip-path mask ──────── */
const HEADLINE = ['Software', 'for the', 'Filipino', 'owner.']

/* ── Scroll-cue chevron ───────────────────────────────────────── */
function ScrollCue() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
    >
      <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--slate)' }}>
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={16} style={{ color: 'var(--gold)' }} strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  )
}


/* ── FAQ ───────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'What does Lintejas build?',
    a: 'Software and digital tools for Filipino entrepreneurs and small businesses — NegosyoPlans for a complete business plan, Matthew System and Matthew Lite to track your sales, expenses and profit, ZAM Academy to learn digital marketing, and WDRICH to find and list suppliers.',
  },
  {
    q: 'Who is it for?',
    a: "Filipino entrepreneurs and small businesses — sari-sari stores, food carts and kitchens, service shops, online sellers, and the people behind them. Whether you're just starting out or already running, there's a tool for where you are.",
  },
  {
    q: "What's the difference between Matthew System and Matthew Lite?",
    a: "Matthew System is the full business-manager dashboard that watches your numbers so you don't go under. Matthew Lite is the simpler, lower-cost version for vendors who just want to know, every day, if they really earned. Both run on your phone.",
  },
  {
    q: 'I have a business idea but no plan — where do I start?',
    a: 'Start with NegosyoPlans. Each blueprint gives you a complete business plan — the model, startup costs, revenue projections, risks, marketing, and a 90-day launch plan — so you begin with a plan, not a guess.',
  },
  {
    q: 'Is SkillVue available yet?',
    a: "SkillVue is coming soon — it's a safety and workforce platform for food manufacturing. The rest of the Lintejas family is available today.",
  },
  {
    q: 'How do I get in touch?',
    a: 'Head to the Contact page and send us a message, or email hello@lintejas.com. We read everything and respond personally.',
  },
]

/* ── Values strip ─────────────────────────────────────────────── */
const VALUES = [
  { icon: Cpu,        title: 'Built for owners', desc: 'Every tool is made for the person behind the counter — simple enough to use on a busy day, dependable when it matters most.' },
  { icon: Shield,     title: 'Honest numbers',   desc: 'No hype and no vanity metrics. Our tools show the real picture — sales, costs, and whether you actually earned today.' },
  { icon: TrendingUp, title: 'Taglish-ready',    desc: 'Built for how Filipinos really run a business — Taglish, mobile-first, and ready for the daily grind.' },
]

// Per-card background theme (by index, matching VALUES order) — classes live in src/index.css.
const VALUE_THEMES = [
  { cls: 'card-tech',      accent: '#38bdf8' },   // Built for owners
  { cls: 'card-hologram',  accent: '#f59e0b' },   // Honest numbers
  { cls: 'card-cyberpunk', accent: '#a855f7' },   // Taglish-ready
]

export default function Home() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  /* Mobile (< lg): 2-column hero (headline left, small 3D logo right); the deck is a normal section
     AFTER the hero. Desktop (≥ lg): side-by-side hero unchanged. isLg is seeded synchronously
     (useMediaQuery) → correct on first paint, no flash/CLS. */
  const isLg = useMediaQuery('(min-width: 1024px)')
  /* Mouse ref for 3D parallax — tracked at page level */
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x:  (e.clientX / window.innerWidth  - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* ── Shared hero pieces (rendered in the desktop OR mobile arrangement below; one Interlock3D
       mount per active breakpoint). ─────────────────────────────────────────────────────────── */
  const heroBadge = (
    <motion.div variants={fadeUp}>
      <span
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
        style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)', color: 'var(--gold)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse-live" style={{ background: 'var(--live-green)' }} />
        For Vendors, SMEs &amp; Manufacturers
      </span>
    </motion.div>
  )

  const heroHeadline = (
    <h1 className="font-display font-semibold leading-[1.06] tracking-tight" style={{ color: 'var(--cream)' }}>
      {HEADLINE.map((line, i) => (
        <motion.span
          key={line}
          className="block overflow-hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, delay: 0.15 + i * 0.11, ease }}
        >
          {/* mobile −20% (48px → 2.4rem/38.4px); sm −20% (60→48); desktop lg:text-7xl unchanged.
              whitespace-nowrap keeps each line 1 line in BOTH the fallback + display font (no wrap
              reflow on font-swap → no CLS in the narrow mobile column); lines already fit unwrapped. */}
          <span
            className={[
              'block whitespace-nowrap text-[2.4rem] sm:text-5xl lg:text-7xl',
              i === HEADLINE.length - 1 ? 'text-transparent bg-clip-text bg-gold-gradient' : '',
            ].join(' ')}
          >
            {line}
          </span>
        </motion.span>
      ))}
    </h1>
  )

  const heroLead = (
    /* min-h reserves the 4-line height on mobile so the body-font swap (3↔4 lines) can't change the
       hero's content height and re-centre it (items-center) → no CLS. Desktop (lg) unchanged. */
    <motion.p variants={fadeUp} className="text-base sm:text-lg leading-relaxed max-w-md min-h-[104px] sm:min-h-0" style={{ color: 'var(--slate)' }}>
      Software and digital tools that help Filipino entrepreneurs start, run, and grow
      a business — simple, dependable, and honest.
    </motion.p>
  )

  const heroCtas = (
    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
      <MagneticButton onClick={() => { document.getElementById('ventures-deck')?.scrollIntoView({ behavior: 'smooth' }) }}>
        View our portfolio <ArrowRight size={15} />
      </MagneticButton>
      <Link
        to="/about"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium border transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--cream)]"
        style={{ borderColor: 'rgba(212,168,67,0.20)', color: 'var(--slate)' }}
      >
        About Lintejas
      </Link>
    </motion.div>
  )

  const logo3D = (fallbackSize: number) => (
    <>
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, rgba(212,168,67,0.10) 0%, transparent 65%)', filter: 'blur(20px)' }}
      />
      <Suspense fallback={<div className="flex items-center justify-center h-full"><TheInterlockLogo size={fallbackSize} className="opacity-70 animate-float" /></div>}>
        <Interlock3D mouseRef={mouseRef} />
      </Suspense>
    </>
  )

  /* Mobile (< lg): same glow ring, but the 3D is DEFERRED — static SVG paints first,
     R3F loads after first paint/idle/in-view (DeferredLogo). Desktop keeps logo3D above. */
  const logo3DMobile = (fallbackSize: number) => (
    <>
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, rgba(212,168,67,0.10) 0%, transparent 65%)', filter: 'blur(20px)' }}
      />
      <DeferredLogo size={fallbackSize} mouseRef={mouseRef} />
    </>
  )

  return (
    <div style={{ background: 'var(--navy)' }}>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      {/* < lg: content-height, no vertical centring (removes the tall empty bands). ≥ lg: unchanged. */}
      <section className="relative overflow-hidden lg:flex lg:items-center lg:min-h-screen">
        {/* Watermark — assembles on load, fades on scroll; behind all hero content via DOM order */}
        <div
          className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[6%] pointer-events-none"
          style={{ opacity: 0.07 }}
        >
          <AssemblingInterlock size={320} delay={0.6} scroll />
        </div>

        {/* Liquid gold glow behind the 3D column — desktop only */}
        <div
          className="absolute top-0 right-0 bottom-0 w-[55%] pointer-events-none hidden lg:block"
          style={{ zIndex: 0 }}
        >
          <LiquidGold style={{ opacity: 0.55 }} />
        </div>

        {/* < lg: 48px below the fixed header (main already clears the header + safe area) + ~48px below the trust row. ≥ lg: py-0. */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 w-full pt-12 pb-12 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 lg:items-center lg:min-h-[calc(100vh-64px)]">

            {isLg ? (
              <>
                {/* Text column — left (desktop, unchanged) */}
                <motion.div className="relative z-10 flex flex-col gap-8" initial="hidden" animate="show" variants={staggerContainer}>
                  {heroBadge}
                  {heroHeadline}
                  {heroLead}
                  {heroCtas}
                </motion.div>

                {/* 3D column — right (desktop, unchanged: big h-580 container) */}
                <motion.div
                  className="relative h-[580px]"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.2, ease }}
                >
                  {logo3D(140)}
                </motion.div>
              </>
            ) : (
              /* Mobile (< lg): badge on top; headline (left) + small 3D logo (right) as a row,
                 vertically centred; lead + buttons + trust full width below. */
              <motion.div className="relative z-10 flex flex-col gap-6" initial="hidden" animate="show" variants={staggerContainer}>
                {heroBadge}
                <div className="flex flex-row items-center gap-4">
                  <div className="flex-1 min-w-0">{heroHeadline}</div>
                  <motion.div
                    className="relative flex-none overflow-hidden"
                    /* ~135×190 at 390, scales down proportionally at 360 (35vw, clamped). The Interlock3D
                       canvas fills this smaller container (its vertical FOV is fixed) — component untouched. */
                    style={{ width: 'clamp(118px, 35vw, 140px)', aspectRatio: '135 / 190' }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease }}
                  >
                    {logo3DMobile(120)}
                  </motion.div>
                </div>
                {heroLead}
                {heroCtas}
              </motion.div>
            )}
          </div>
        </div>

        {/* Gradient fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--navy))' }}
        />

        {/* Scroll cue is for the tall desktop hero; on the short mobile hero it would sit in the gap. */}
        {isLg && <ScrollCue />}
      </section>

      {/* ══════════════════════════════════════════════════════════
          PRODUCT DECK — The Lintejas brands. A normal full-width section directly
          AFTER the hero at every breakpoint (eyebrow + navy background), one instance.
      ══════════════════════════════════════════════════════════ */}
      {/* compact (< lg): content-height section (no full-vh centring band) so the eyebrow sits right
          after the hero. ≥ lg: full-vh centred deck, unchanged. */}
      <ProductDeck compact={!isLg} />

      {/* ══════════════════════════════════════════════════════════
          VALUES STRIP
      ══════════════════════════════════════════════════════════ */}
      <section id="values" className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-28">
        {/* Section eyebrow */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
            Our philosophy
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className={`group relative rounded-2xl p-7 border transition-all duration-500 cursor-default ${VALUE_THEMES[i].cls}`}
              whileHover={{
                y: -4,
                transition: { duration: 0.3, ease },
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.25)'
                ;(e.currentTarget as HTMLElement).style.boxShadow  = '0 8px 40px rgba(0,0,0,0.3), 0 0 24px rgba(212,168,67,0.06)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = ''   // back to the card theme's own border
                ;(e.currentTarget as HTMLElement).style.boxShadow  = ''
              }}
            >
              {/* Top shine */}
              <div
                className="absolute inset-x-0 top-0 h-px rounded-full opacity-60"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.3), transparent)' }}
              />

              <div
                className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'rgba(212,168,67,0.08)',
                  border:     `1px solid ${VALUE_THEMES[i].accent}55`,
                }}
              >
                <Icon size={20} style={{ color: VALUE_THEMES[i].accent }} />
              </div>

              <h3 className="relative z-10 font-display font-semibold text-lg mb-3" style={{ color: 'var(--cream)' }}>
                {title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed" style={{ color: '#b4bfd4' }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Interlock divider ornament */}
      <div className="flex justify-center py-6 pointer-events-none" style={{ opacity: 0.30 }}>
        <AssemblingInterlock size={60} delay={0.2} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          MANIFESTO STRIP — full-bleed editorial
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden mb-20">
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(212,168,67,0.04) 50%, transparent 100%)',
          }}
        />
        {/* Hairline top / bottom borders */}
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.18), transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.18), transparent)' }} />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="h-px w-12" style={{ background: 'rgba(212,168,67,0.30)' }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              Our belief
            </span>
          </motion.div>

          {/* Pull quote */}
          <div className="max-w-4xl">
            {[
              'The best technology',
              'is invisible.',
            ].map((line, i) => (
              <motion.span
                key={line}
                className="block overflow-hidden"
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, delay: 0.1 + i * 0.14, ease }}
              >
                <span
                  className={[
                    'block font-display font-semibold leading-tight',
                    i === 0
                      ? 'text-4xl sm:text-5xl lg:text-6xl'
                      : 'text-4xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gold-gradient',
                  ].join(' ')}
                  style={i === 0 ? { color: 'var(--cream)' } : {}}
                >
                  {line}
                </span>
              </motion.span>
            ))}

            <motion.p
              className="text-base sm:text-lg leading-relaxed mt-8 max-w-2xl"
              style={{ color: 'var(--slate)' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.45, ease }}
            >
              It dissolves into the work, amplifying human capability without friction.
              Every product we build is held to that standard — precision-engineered for
              the people who depend on it every day.
            </motion.p>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════ */}
      <section id="faq" className="scroll-mt-24 max-w-[1280px] mx-auto px-6 lg:px-8 pb-28">
        {/* Eyebrow */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>FAQ</span>
          <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease }}
          className="mb-12"
        >
          <h2 className="font-display font-semibold text-3xl sm:text-4xl" style={{ color: 'var(--cream)' }}>
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* ── Accordion ── */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="space-y-3"
          >
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <motion.div key={i} variants={staggerItem}>
                  <div
                    className="rounded-2xl border overflow-hidden transition-all duration-300"
                    style={{
                      background: 'var(--glass-bg)',
                      borderColor: isOpen ? 'rgba(212,168,67,0.35)' : 'var(--glass-border)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Question row */}
                    <button
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold leading-snug" style={{ color: 'var(--cream)' }}>
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown size={16} style={{ color: 'var(--gold)' }} />
                      </motion.span>
                    </button>

                    {/* Answer — animated height */}
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3, ease }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-6 pb-5">
                        <div className="h-px mb-4" style={{ background: 'var(--glass-border)' }} />
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* ── Right CTA box ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            <div
              className="rounded-2xl border p-7 lg:sticky lg:top-28"
              style={{ background: 'var(--glass-bg)', borderColor: 'rgba(212,168,67,0.25)', backdropFilter: 'blur(20px)' }}
            >
              <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.22), transparent)' }} />

              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)' }}
              >
                <span style={{ fontSize: '1.1rem' }}>💬</span>
              </div>

              <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--cream)' }}>
                Still have questions?
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
                Our team responds within 24 hours.
              </p>

              <div className="flex flex-col gap-3 mb-7">
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #E8C766, #D4A843)', color: '#0A1628' }}
                >
                  Contact Us <ArrowRight size={14} />
                </button>
                {WHATSAPP_NUMBER && (
                  <a
                    href={whatsappHref()}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                    style={{ background: 'rgba(37,211,102,0.10)', border: '1px solid rgba(37,211,102,0.30)', color: '#25D366' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.18)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.10)' }}
                  >
                    <span>💬</span> Chat on WhatsApp
                  </a>
                )}
              </div>

              <div className="space-y-2 pt-5" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>Quick links</p>
                {[
                  { label: 'Visit SkillVue', href: 'https://skillvue.io' },
                  { label: 'Try Demo Account', href: 'https://skillvue.io/onboarding' },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm transition-colors duration-200 py-1"
                    style={{ color: 'var(--slate)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--slate)' }}
                  >
                    <ArrowRight size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="relative rounded-2xl p-10 text-center border overflow-hidden"
          style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(20px)' }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.20), transparent)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.07) 0%, transparent 60%)' }}
          />

          <TheInterlockLogo size={52} className="mx-auto mb-6 opacity-70" />

          <h2 className="font-display font-semibold text-3xl sm:text-4xl mb-4" style={{ color: 'var(--cream)' }}>
            Build your business
            <span className="block text-transparent bg-clip-text bg-gold-gradient">with us</span>
          </h2>

          <p className="text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: 'var(--slate)' }}>
            Whether you're starting out or already running, there's a Lintejas tool for it. Explore the
            products, or get in touch and we'll point you to the right one.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton onClick={() => navigate('/contact')}>
              Get in touch <ArrowRight size={15} />
            </MagneticButton>
            <button
              onClick={() => { document.getElementById('ventures-deck')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: 'var(--slate)' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--slate)')}
            >
              See the products →
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
