import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Calendar, Building2, ShieldCheck } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import MagneticButton from '../components/ui/MagneticButton'
import { staggerContainer, staggerItem, ease } from '../lib/motion'

/* ── Stats ────────────────────────────────────────────────────── */
const STATS = [
  { icon: Calendar,  value: '2024',  label: 'Founded'          },
  { icon: MapPin,    value: 'SK',    label: 'Slovakia, EU'     },
  { icon: Building2, value: '3',     label: 'Ventures'         },
  { icon: ShieldCheck, value: 'EU',  label: 'GDPR Compliant'   },
]

/* ── Editorial sections ───────────────────────────────────────── */
const SECTIONS = [
  {
    title: 'Our mission',
    body:  `We exist to demonstrate that European software companies can achieve world-class outcomes —
built with care, designed for longevity, and respectful of the people who use them.

We believe the best technology is invisible: it dissolves into the work, amplifying human
capability without friction. Every product we build is held to that standard.`,
  },
  {
    title: 'Where we operate',
    body:  `Headquartered in Slovakia, we operate across the European Union. Our portfolio focuses on
manufacturing, food production, logistics, and enterprise software — sectors where the gap
between operational reality and available tooling remains significant.

These are industries that move physical goods and feed people. We take that responsibility seriously.`,
  },
  {
    title: 'How we invest',
    body:  `We take concentrated positions in companies we understand deeply. Rather than spreading
capital thinly, we commit fully — co-founding teams, contributing architecture decisions,
and staying patient through long product development cycles.

Quality over velocity. We would rather ship one product that endures than three that break.`,
  },
]

/* ── Principles ───────────────────────────────────────────────── */
const PRINCIPLES = [
  { n: '01', label: 'Precision over speed',  desc: 'We slow down to think before building. Rushed products accumulate debt that compounds silently for years.' },
  { n: '02', label: 'Operators, not tourists', desc: 'We work in the industries we build for. Knowing the domain changes what you build and how you measure success.' },
  { n: '03', label: 'European by design',    desc: 'Privacy, reliability, and regulatory compliance are not features. They are table stakes, baked in from day one.' },
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
            Lintejas is a technology holding company founded in the Slovak Republic. We identify,
            build, and grow software ventures that solve real operational problems in industries
            where precision matters.
          </p>
        </Reveal>

        {/* ── Stats row ──────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20"
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
                  Since 2024
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--slate)' }}>
                  A young company with a long-term view. We build for decades, not quarters.
                </p>
                <div className="h-px" style={{ background: 'var(--glass-border)' }} />
                <div className="pt-4 mt-4 space-y-2">
                  {['Slovakia', 'European Union', 'Remote-first'].map(loc => (
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
              Whether you're looking to build a product, invest alongside us, or bring technology expertise into your organisation.
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
