import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Building2, ShieldCheck } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import MagneticButton from '../components/ui/MagneticButton'
import { staggerContainer, staggerItem, ease } from '../lib/motion'
import { PORTFOLIO } from '../lib/portfolio'

/* ── Stats ────────────────────────────────────────────────────────────────────
   Ventures count derives from the shared venture list so it never drifts. Verified
   facts only — no "Founded" year (unconfirmed) and no unverifiable compliance claim. */
const STATS = [
  { icon: Building2,   value: String(PORTFOLIO.length),   label: 'Ventures'     },
  { icon: MapPin,      value: 'PH',                        label: 'Philippines'  },
  { icon: ShieldCheck, value: 'DTI',                       label: 'Registered'   },
]

/* ── Editorial sections ───────────────────────────────────────── */
const SECTIONS = [
  {
    title: 'Our mission',
    body:  `We build software and digital tools that help Filipino entrepreneurs start and run real
businesses — made with care, designed to last, and respectful of the people who use them.

We believe the best tools are the ones that quietly do their job: they fit into how a small
business already works and make the hard parts easier. Every product we build is held to that standard.`,
  },
  {
    title: 'Who we serve',
    body:  `We serve Filipino entrepreneurs and small businesses — sari-sari stores, food carts and
kitchens, service shops, online sellers, and the people behind them. Our products meet owners
where they are: NegosyoPlans for a complete business plan, Matthew System and Matthew Lite to
track sales, expenses and profit, ZAM Academy to learn digital marketing, and WDRICH to find
and list suppliers.

These are the businesses that feed families and neighbourhoods. We take that responsibility seriously.`,
  },
  {
    title: 'How we build',
    body:  `We build for the long run. Rather than chasing features, we ship tools that are simple to
use, dependable day to day, and improved alongside the owners who actually use them.

Quality over velocity. We would rather ship one product that endures than three that break.`,
  },
]

/* ── Principles ───────────────────────────────────────────────── */
const PRINCIPLES = [
  { n: '01', label: 'Precision over speed',  desc: 'We slow down to think before building. Rushed products accumulate debt that compounds silently for years.' },
  { n: '02', label: 'Built for real businesses', desc: 'We build for the small Filipino enterprises we understand — from the ground up. Knowing the day-to-day changes what you build and how you measure success.' },
  { n: '03', label: 'Dependable by design',   desc: 'Privacy, reliability and clarity are not features. They are table stakes, baked in from day one.' },
]

/* ── Page ──────────────────────────────────────────────────────── */
export default function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-28">

        {/* ── Header ─────────────────────────────────────────── */}
        <Reveal className="mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)', color: 'var(--gold)' }}
          >
            About
          </div>

          {/* Per-line mask reveal headline */}
          <h1
            className="font-display font-semibold leading-tight mb-5"
            style={{ color: 'var(--cream)' }}
          >
            {['Building technology', 'with purpose.'].map((line, i) => (
              <motion.span
                key={line}
                className="block overflow-hidden"
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.13, ease }}
              >
                <span
                  className={[
                    'block text-5xl sm:text-6xl',
                    i === 1 ? 'text-transparent bg-clip-text bg-gold-gradient' : '',
                  ].join(' ')}
                >
                  {line}
                </span>
              </motion.span>
            ))}
          </h1>

          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--slate)' }}>
            Lintejas is a software company building digital tools for Filipino entrepreneurs and
            small businesses — practical products that help people start, run, and grow a business.
          </p>
        </Reveal>

        {/* ── Stats row ──────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-20"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {STATS.map(({ icon: Icon, value, label }) => (
            <motion.div key={label} variants={staggerItem}>
              <div
                className="rounded-2xl p-5 border text-center"
                style={{
                  background:     'var(--glass-bg)',
                  borderColor:    'var(--glass-border)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <Icon size={16} className="mx-auto mb-3" style={{ color: 'var(--gold)' }} />
                <div className="font-display font-semibold text-2xl mb-1" style={{ color: 'var(--cream)' }}>
                  {value}
                </div>
                <div className="text-xs" style={{ color: 'var(--slate)' }}>{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Divider ────────────────────────────────────────── */}
        <Reveal className="mb-16">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              Who we are
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          </div>
        </Reveal>

        {/* ── Editorial sections ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-20 mb-24">
          {/* Left column — visual anchor */}
          <Reveal>
            <div className="lg:sticky top-28">
              <div
                className="rounded-2xl p-7 border"
                style={{
                  background:     'var(--glass-bg)',
                  borderColor:    'var(--glass-border)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div
                  className="text-4xl font-display font-semibold mb-3 text-transparent bg-clip-text bg-gold-gradient"
                >
                  Made in the PH
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--slate)' }}>
                  A young company with a long-term view. We build for decades, not quarters.
                </p>
                <div className="h-px" style={{ background: 'var(--glass-border)' }} />
                <div className="pt-4 mt-4 space-y-2">
                  {['Remote-first', 'Filipino entrepreneurs'].map(loc => (
                    <div key={loc} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} />
                      <span className="text-xs" style={{ color: 'var(--slate)' }}>{loc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right column — editorial text */}
          <div className="space-y-12">
            {SECTIONS.map(({ title, body }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <div
                  className="pl-7 border-l-2"
                  style={{ borderColor: 'rgba(212,168,67,0.35)' }}
                >
                  <h2
                    className="font-display font-semibold text-2xl mb-4"
                    style={{ color: 'var(--cream)' }}
                  >
                    {title}
                  </h2>
                  {body.split('\n\n').map((para, j) => (
                    <p
                      key={j}
                      className={`text-base leading-relaxed ${j < body.split('\n\n').length - 1 ? 'mb-4' : ''}`}
                      style={{ color: 'var(--slate)' }}
                    >
                      {para.replace(/\n/g, ' ')}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Principles ─────────────────────────────────────── */}
        <Reveal className="mb-12">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              Principles
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          </div>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {PRINCIPLES.map(({ n, label, desc }) => (
            <motion.div key={n} variants={staggerItem}>
              <div
                className="relative rounded-2xl p-7 border h-full"
                style={{
                  background:     'var(--glass-bg)',
                  borderColor:    'var(--glass-border)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div
                  className="font-display font-semibold text-4xl leading-none mb-5 select-none"
                  style={{ color: 'transparent', WebkitTextStroke: '1px rgba(212,168,67,0.18)' }}
                >
                  {n}
                </div>
                <h3 className="font-display font-semibold text-lg mb-3" style={{ color: 'var(--cream)' }}>
                  {label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ────────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <div
            className="relative rounded-2xl p-8 sm:p-10 text-center border overflow-hidden"
            style={{
              background:     'var(--glass-bg)',
              borderColor:    'var(--glass-border)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.22), transparent)' }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.06), transparent 65%)' }}
            />

            <h2 className="font-display font-semibold text-2xl sm:text-3xl mb-3" style={{ color: 'var(--cream)' }}>
              Work with us.
            </h2>
            <p className="text-sm mb-7 max-w-md mx-auto" style={{ color: 'var(--slate)' }}>
              Starting a business, or want a tool that fits how your business really runs? Let's talk.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton onClick={() => navigate('/contact')}>
                Get in touch <ArrowRight size={15} />
              </MagneticButton>
              <button
                onClick={() => navigate('/services')}
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: 'var(--slate)' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--gold)')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--slate)')}
              >
                View our services →
              </button>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
