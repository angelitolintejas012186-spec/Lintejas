import { lazy, Suspense, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Cpu, Shield, TrendingUp, ChevronDown, Check, X } from 'lucide-react'
import TheInterlockLogo from '../components/TheInterlockLogo'
import MagneticButton from '../components/ui/MagneticButton'
import AssemblingInterlock from '../components/motion/AssemblingInterlock'
import HudFrame            from '../components/motion/HudFrame'
import LiquidGold          from '../components/motion/LiquidGold'
import { fadeUp, staggerContainer, staggerItem, ease } from '../lib/motion'

const Interlock3D = lazy(() => import('../components/Interlock3D'))

/* ── Headline lines — each reveals with a clip-path mask ──────── */
const HEADLINE = ['We build', 'precision', 'software', 'ventures.']

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

/* ── Pricing plans ────────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Starter', price: '€500', annual: '€5,000', users: 'Up to 50 users', popular: false,
    included: ['All core modules', 'Competency Matrix & Gap Analysis', 'Training Library', 'Email support', 'EU cloud hosting (GCP Frankfurt)', '30-day free trial'],
    excluded: ['Safety suite', 'API access'],
    cta: 'Start Free Trial', href: 'https://skillvue.io',
  },
  {
    name: 'Professional', price: '€1,200', annual: '€12,000', users: 'Up to 200 users', popular: true,
    included: ['All modules + Safety suite', 'LOTO, Work Permits, Confined Space', 'Production Checklists', 'Priority support', 'API access', 'Custom food categories', 'Dedicated onboarding session', 'EU cloud hosting', '30-day free trial'],
    excluded: [],
    cta: 'Request Demo', href: 'https://skillvue.io',
  },
  {
    name: 'Enterprise', price: '€2,500', annual: '€25,000', users: 'Unlimited users', popular: false,
    included: ['All modules + future features', 'Dedicated support manager', 'SLA 99.9% uptime guarantee', 'Custom ERP/MES integration', 'On-site training available', 'White-label option', 'Custom contract terms', 'EU cloud hosting', '30-day free trial'],
    excluded: [],
    cta: 'Contact Us', href: null,
  },
] as const

/* ── Values strip ─────────────────────────────────────────────── */
const VALUES = [
  { icon: Cpu,        title: 'Precision Engineering', desc: 'Every product is built to exacting standards, designed for the long run and the harshest operational environments.' },
  { icon: Shield,     title: 'European Values',       desc: 'Founded in Slovakia. Operating across the EU. Our products reflect European standards of quality, privacy, and reliability.' },
  { icon: TrendingUp, title: 'Compounding Value',     desc: 'We invest in ventures with durable moats — products that get more valuable as the businesses they serve grow.' },
]

export default function Home() {
  const navigate = useNavigate()
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

  return (
    <div style={{ background: 'var(--navy)' }}>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
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

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 w-full py-24 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-64px)]">

            {/* ── Text column ─────────────────────────────────── */}
            <motion.div
              className="relative z-10 flex flex-col gap-8 order-2 lg:order-1"
              initial="hidden"
              animate="show"
              variants={staggerContainer}
            >
              {/* Chip */}
              <motion.div variants={fadeUp}>
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
                  style={{
                    background: 'rgba(212,168,67,0.08)',
                    border:     '1px solid rgba(212,168,67,0.20)',
                    color:      'var(--gold)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse-live" style={{ background: 'var(--live-green)' }} />
                  Technology Holding · Slovakia, EU
                </span>
              </motion.div>

              {/* Headline — per-line mask reveal */}
              <h1 className="font-display font-semibold leading-[1.06] tracking-tight" style={{ color: 'var(--cream)' }}>
                {HEADLINE.map((line, i) => (
                  <motion.span
                    key={line}
                    className="block overflow-hidden"
                    initial={{ clipPath: 'inset(0 0 100% 0)' }}
                    animate={{ clipPath: 'inset(0 0 0% 0)' }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.11, ease }}
                  >
                    <span
                      className={[
                        'block text-5xl sm:text-6xl lg:text-7xl',
                        /* "ventures." — gold accent on last line */
                        i === HEADLINE.length - 1 ? 'text-transparent bg-clip-text bg-gold-gradient' : '',
                      ].join(' ')}
                    >
                      {line}
                    </span>
                  </motion.span>
                ))}
              </h1>

              {/* Subtext */}
              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg leading-relaxed max-w-md"
                style={{ color: 'var(--slate)' }}
              >
                From Slovakia, EU — building enduring technology for the industries
                that shape the world. Precision software ventures with durable competitive advantage.
              </motion.p>

              {/* CTA row */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
                <MagneticButton
                  onClick={() => {
                    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
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

              {/* Trust strip — HUD-framed */}
              <HudFrame
                cornerSize={12}
                strokeWidth={1.0}
                delay={1.0}
                readouts={[
                  { position: 'tr', label: 'REV', value: 'v2.4' },
                ]}
              >
                <motion.div
                  variants={fadeUp}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 px-3 pb-2"
                >
                  {['EU GDPR Compliant', 'MFA Security', 'ISO/HACCP Aligned'].map(tag => (
                    <span key={tag} className="text-xs font-medium" style={{ color: 'var(--slate)' }}>
                      <span style={{ color: 'var(--gold)' }}>—</span> {tag}
                    </span>
                  ))}
                </motion.div>
              </HudFrame>
            </motion.div>

            {/* ── 3D column ───────────────────────────────────── */}
            <motion.div
              className="relative order-1 lg:order-2 h-[340px] sm:h-[420px] lg:h-[580px]"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease }}
            >
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(212,168,67,0.10) 0%, transparent 65%)',
                  filter: 'blur(20px)',
                }}
              />
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <TheInterlockLogo size={140} className="opacity-70 animate-float" />
                  </div>
                }
              >
                <Interlock3D mouseRef={mouseRef} />
              </Suspense>
            </motion.div>
          </div>
        </div>

        {/* Gradient fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--navy))' }}
        />

        <ScrollCue />
      </section>

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
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="group relative rounded-2xl p-7 border transition-all duration-500 cursor-default"
              style={{
                background:   'var(--glass-bg)',
                borderColor:  'var(--glass-border)',
                backdropFilter: 'blur(20px)',
                boxShadow:    'var(--tw-shadow)',
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.3, ease },
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.25)'
                ;(e.currentTarget as HTMLElement).style.boxShadow  = '0 8px 40px rgba(0,0,0,0.3), 0 0 24px rgba(212,168,67,0.06)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'
                ;(e.currentTarget as HTMLElement).style.boxShadow  = 'none'
              }}
            >
              {/* Top shine */}
              <div
                className="absolute inset-x-0 top-0 h-px rounded-full opacity-60"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.3), transparent)' }}
              />

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'rgba(212,168,67,0.08)',
                  border:     '1px solid rgba(212,168,67,0.15)',
                }}
              >
                <Icon size={20} style={{ color: 'var(--gold)' }} />
              </div>

              <h3 className="font-display font-semibold text-lg mb-3" style={{ color: 'var(--cream)' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>
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
          FEATURED VENTURE — SkillVue
      ══════════════════════════════════════════════════════════ */}
      <section id="portfolio" className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-28">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Portfolio</span>
          <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="relative rounded-2xl p-8 sm:p-10 border overflow-hidden"
          style={{
            background:   'var(--glass-bg)',
            borderColor:  'var(--glass-border)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Top hairline shine */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(232,199,102,0.25) 50%, transparent 100%)' }}
          />
          {/* Gold bloom */}
          <div
            className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 70% 20%, rgba(212,168,67,0.06), transparent 70%)',
            }}
          />

          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(63,185,80,0.10)', color: '#3FB950', border: '1px solid rgba(63,185,80,0.25)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-pulse-live" />
            Live
          </div>

          <div className="flex items-start gap-5 mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid var(--glass-border)' }}
            >
              🧠
            </div>
            <div>
              <h2 className="font-display font-semibold text-2xl mb-1" style={{ color: 'var(--cream)' }}>SkillVue</h2>
              <p className="text-sm font-medium" style={{ color: 'var(--gold)' }}>Competency Intelligence Platform</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--slate)' }}>Food Manufacturing · HR Tech</p>
            </div>
          </div>

          <p className="text-base leading-relaxed mb-7 max-w-2xl" style={{ color: 'var(--slate)' }}>
            A comprehensive platform that maps, tracks, and develops employee competencies in food manufacturing
            environments. Structured training pathways, real-time skill-gap dashboards, and ISO/HACCP-aligned
            frameworks built for shift-based workforces.
          </p>

          <div className="flex flex-wrap gap-3">
            <MagneticButton href="https://skillvue-production.up.railway.app/demo-entry" strength={0.2}>
              Visit Platform <ArrowRight size={14} />
            </MagneticButton>
            <Link
              to="/companies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--cream)]"
              style={{ borderColor: 'var(--glass-border)', color: 'var(--slate)' }}
            >
              Full portfolio
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════════════ */}
      <section id="pricing" className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-28">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Pricing</span>
          <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease }}
          className="text-center mb-14"
        >
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mb-4" style={{ color: 'var(--cream)' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--slate)' }}>
            No hidden fees. No per-user charges. One flat monthly subscription.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {PLANS.map((plan) => (
            <motion.div key={plan.name} variants={staggerItem} className={plan.popular ? 'md:-mt-4' : ''}>
              <div
                className="relative rounded-2xl border h-full flex flex-col overflow-hidden transition-all duration-300"
                style={{
                  background: 'var(--glass-bg)',
                  borderColor: plan.popular ? 'rgba(212,168,67,0.50)' : 'var(--glass-border)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: plan.popular ? '0 0 40px rgba(212,168,67,0.12)' : 'none',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.40)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(212,168,67,0.15)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = plan.popular ? 'rgba(212,168,67,0.50)' : 'var(--glass-border)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = plan.popular ? '0 0 40px rgba(212,168,67,0.12)' : 'none'
                }}
              >
                {/* Top shine */}
                <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.25), transparent)' }} />

                {/* Most Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 flex justify-center">
                    <span
                      className="px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-b-lg"
                      style={{ background: 'linear-gradient(135deg, #E8C766, #D4A843)', color: '#0A1628' }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`p-7 flex flex-col flex-1 ${plan.popular ? 'pt-10' : ''}`}>
                  {/* Plan name */}
                  <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>
                    {plan.name}
                  </p>

                  {/* Price */}
                  <div className="mb-1">
                    <span className="font-display font-semibold text-4xl" style={{ color: 'var(--cream)' }}>{plan.price}</span>
                    <span className="text-sm ml-1" style={{ color: 'var(--slate)' }}>/month</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: 'var(--slate)' }}>
                    {plan.annual}/year <span style={{ color: 'var(--gold)' }}>— 2 months free</span>
                  </p>
                  <p className="text-xs mb-6 pb-6" style={{ color: 'var(--slate)', borderBottom: '1px solid var(--glass-border)' }}>
                    {plan.users}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.included.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                        <span className="text-xs leading-relaxed" style={{ color: 'var(--slate)' }}>{f}</span>
                      </li>
                    ))}
                    {plan.excluded.map(f => (
                      <li key={f} className="flex items-start gap-2.5 opacity-40">
                        <X size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--slate)' }} />
                        <span className="text-xs leading-relaxed" style={{ color: 'var(--slate)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.href ? (
                    <a
                      href={plan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                      style={plan.popular
                        ? { background: 'linear-gradient(135deg, #E8C766, #D4A843)', color: '#0A1628', boxShadow: '0 4px 20px rgba(212,168,67,0.30)' }
                        : { background: 'transparent', border: '1px solid rgba(212,168,67,0.30)', color: 'var(--cream)' }
                      }
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(212,168,67,0.45)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = plan.popular ? '0 4px 20px rgba(212,168,67,0.30)' : 'none' }}
                    >
                      {plan.cta} <ArrowRight size={14} />
                    </a>
                  ) : (
                    <button
                      onClick={() => navigate('/contact')}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                      style={{ background: 'transparent', border: '1px solid rgba(212,168,67,0.30)', color: 'var(--cream)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.60)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.30)' }}
                    >
                      {plan.cta} <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-xs mt-8"
          style={{ color: 'var(--slate)' }}
        >
          All plans include a 30-day free trial. No credit card required. Cancel anytime.{' '}
          <span style={{ color: 'var(--gold)' }}>Annual plans save 2 months.</span>
        </motion.p>
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
            Build the next venture
            <span className="block text-transparent bg-clip-text bg-gold-gradient">with us</span>
          </h2>

          <p className="text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: 'var(--slate)' }}>
            We partner with industry operators, investors, and engineering teams to build the next
            generation of industrial software.
          </p>

          <div className="flex justify-center">
            <MagneticButton onClick={() => navigate('/contact')}>
              Get in touch <ArrowRight size={15} />
            </MagneticButton>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
