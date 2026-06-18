import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Cpu, Shield, TrendingUp, ChevronDown, Check, Layers, BarChart3, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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

/* ── Pricing plans ─────────────────────────────────────────────
   Single source of truth — never duplicate prices or features.
   CTA hrefs marked TODO need real destinations before launch.
──────────────────────────────────────────────────────────────── */
type Plan = {
  icon: LucideIcon
  name: string
  tagline: string
  price: string
  seats: string
  popular: boolean
  deltaLead?: string          // "Everything in X, plus" prefix for Pro/Enterprise
  features: readonly string[]
  addOn?: string              // Muted add-on note shown below feature list
  cta: string
  href: string | null         // null → navigate to /contact
}

const PLANS: readonly Plan[] = [
  {
    icon:    Layers,
    name:    'Essentials',
    tagline: 'For skills-first teams',
    price:   '€500',
    seats:   'Up to 50 users',
    popular: false,
    features: [
      'Competency Assessment',
      'Training & Development',
      'Development Plans',
      'Standard dashboards',
      'Email support',
    ],
    cta:  'Choose Essentials',
    href: 'https://skillvue-production.up.railway.app/register-company?plan=starter',
  },
  {
    icon:      BarChart3,
    name:      'Professional',
    tagline:   'Everything the plant floor needs',
    price:     '€1,200',
    seats:     'Up to 250 users',
    popular:   true,
    deltaLead: 'Everything in Essentials, plus',
    features: [
      'Gap Analysis',
      'BBSHE / Safety',
      'Quality Surveys',
      'Abnormality Reports',
      'Recognition Wall',
      'Grievance',
      'Advanced reporting + custom fields',
      'Priority support',
    ],
    addOn: 'Work Permits available as add-on',
    cta:   'Choose Professional',
    href:  'https://skillvue-production.up.railway.app/register-company?plan=professional',
  },
  {
    icon:      Globe,
    name:      'Enterprise',
    tagline:   'Scale, governance & control',
    price:     '€2,500',
    seats:     'Custom seats + light-user pricing',
    popular:   false,
    deltaLead: 'Everything in Professional, plus',
    features: [
      'Work Permits',
      'CIP Tasks',
      'SSO / API & integrations',
      'Audit Log + Privacy Dashboard',
      'AI Support included',
      'Dedicated support + SLA',
    ],
    cta:  'Talk to sales',
    href: null, // → /contact
  },
]

/* ── FAQ ───────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Why SkillVue for food manufacturing?',
    a: 'SkillVue was built by someone who spent 15+ years working in food manufacturing. Unlike generic HR or compliance software, SkillVue understands your specific challenges — LOTO procedures, work permits, HACCP compliance, shift-based workforce, and managing competencies across 200+ employees in a food plant. It was not adapted for food manufacturing. It was built for it.',
  },
  {
    q: 'Is my data stored safely in Europe?',
    a: 'Yes. All SkillVue data is stored exclusively on Google Cloud Platform (GCP) in Frankfurt, Germany. Data is encrypted at rest (AES-256) and in transit (TLS 1.2+). We are registered in the European Union (Slovak Republic) and operate under EU GDPR. Your data never leaves the European Economic Area.',
  },
  {
    q: 'What makes Lintejas different from other tech companies?',
    a: 'Three things: industry depth, EU base, and bootstrapped focus. We build software for industries we know from the inside. We are based in the EU with full GDPR compliance built in from day one. And we are self-funded — which means our only agenda is making our clients successful, not satisfying investors.',
  },
  {
    q: 'Can I try SkillVue before committing?',
    a: 'Absolutely. SkillVue offers a 30-day free trial with full access to all features. No credit card required. You can also explore our live demo account at skillvue.io/onboarding using the demo credentials — no sign-up needed. See exactly what your team will experience before making any decision.',
  },
  {
    q: 'How long does it take to set up SkillVue?',
    a: 'Most companies are fully set up within 1-2 weeks. Day 1: create your account, configure departments, upload employees via CSV. Week 1: set up competency requirements and checklists. Week 2: your team starts using it and dashboards fill with real data. We provide dedicated onboarding support on Professional and Enterprise plans.',
  },
  {
    q: 'Does Lintejas work with companies outside Slovakia?',
    a: 'Yes. Lintejas Company and SkillVue serve clients globally. Primary markets are Slovakia, Czech Republic, Germany, Austria, and the Middle East (UAE, Saudi Arabia). SkillVue supports multiple languages and is designed for international food manufacturers. Geography is not a barrier.',
  },
]

/* ── Values strip ─────────────────────────────────────────────── */
const VALUES = [
  { icon: Cpu,        title: 'Precision Engineering', desc: 'Every product is built to exacting standards, designed for the long run and the harshest operational environments.' },
  { icon: Shield,     title: 'European Values',       desc: 'Founded in Slovakia. Operating across the EU. Our products reflect European standards of quality, privacy, and reliability.' },
  { icon: TrendingUp, title: 'Compounding Value',     desc: 'We invest in ventures with durable moats — products that get more valuable as the businesses they serve grow.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
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
            One platform. Three tiers.
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--slate)' }}>
            Start with the essentials. Unlock the full plant-floor suite when you're ready. Scale to enterprise on your terms.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {PLANS.map((plan) => {
            const Icon = plan.icon
            return (
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
                    {/* Tier icon */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                      style={{ background: 'rgba(212,168,67,0.10)', border: '1px solid rgba(212,168,67,0.18)' }}
                    >
                      <Icon size={17} style={{ color: 'var(--gold)' }} strokeWidth={1.75} />
                    </div>

                    {/* Plan name + tagline */}
                    <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>
                      {plan.name}
                    </p>
                    <p className="text-xs mb-4" style={{ color: 'var(--slate)' }}>
                      {plan.tagline}
                    </p>

                    {/* Price */}
                    <div className="mb-1">
                      <span className="font-display font-semibold text-4xl" style={{ color: 'var(--cream)' }}>{plan.price}</span>
                      <span className="text-sm ml-1" style={{ color: 'var(--slate)' }}>/month</span>
                    </div>
                    <p className="text-xs mb-6 pb-6" style={{ color: 'var(--slate)', borderBottom: '1px solid var(--glass-border)' }}>
                      {plan.seats}
                    </p>

                    {/* Feature list with optional delta-lead */}
                    <ul className="space-y-2.5 mb-4 flex-1">
                      {plan.deltaLead && (
                        <li
                          className="text-xs pb-2 mb-1"
                          style={{ color: 'var(--slate)', opacity: 0.65, borderBottom: '1px solid var(--glass-border)' }}
                        >
                          {plan.deltaLead}
                        </li>
                      )}
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                          <span className="text-xs leading-relaxed" style={{ color: 'var(--slate)' }}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Add-on note — dashed pill below feature list */}
                    {plan.addOn ? (
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg mb-5 text-xs"
                        style={{ background: 'rgba(212,168,67,0.06)', border: '1px dashed rgba(212,168,67,0.22)', color: 'var(--slate)' }}
                      >
                        <span style={{ color: 'var(--gold)', fontWeight: 600 }}>+</span>
                        {plan.addOn}
                      </div>
                    ) : (
                      <div className="mb-5" />
                    )}

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
            )
          })}
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-xs mt-8"
          style={{ color: 'var(--slate)' }}
        >
          Prices per tenant, per month.{' '}
          <span style={{ color: 'var(--gold)' }}>Annual billing and frontline light-user seats available.</span>
        </motion.p>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════ */}
      <section id="faq" className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-28">
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
                <a
                  href="https://wa.me/421XXXXXXXXX"
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                  style={{ background: 'rgba(37,211,102,0.10)', border: '1px solid rgba(37,211,102,0.30)', color: '#25D366' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.18)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.10)' }}
                >
                  <span>💬</span> Chat on WhatsApp
                </a>
              </div>

              <div className="space-y-2 pt-5" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>Quick links</p>
                {[
                  { label: 'Visit SkillVue', href: 'https://skillvue.io' },
                  { label: 'Try Demo Account', href: 'https://skillvue.io/onboarding' },
                  { label: 'Visit Lintejas Fashion', href: 'https://lintejas.store' },
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
