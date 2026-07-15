import { useNavigate } from 'react-router-dom'
import { Code2, BarChart3, Wrench, Users, ArrowRight, CheckCircle2 } from 'lucide-react'
import TiltCard from '../components/ui/TiltCard'
import Reveal   from '../components/ui/Reveal'
import MagneticButton from '../components/ui/MagneticButton'
import { staggerContainer, staggerItem } from '../lib/motion'
import { motion } from 'framer-motion'

/* ── Data ─────────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon:    Code2,
    title:   'Product Development',
    tagline: 'From concept to production',
    desc:    'We design and build software products end-to-end — architecture, engineering, UI/UX, and QA. We specialise in complex operational software for manufacturing and enterprise environments.',
    points:  ['Technical architecture & system design', 'Full-stack engineering (Laravel, React)', 'UI/UX design & user testing', 'DevOps, CI/CD, and production ops'],
  },
  {
    icon:    BarChart3,
    title:   'Technology Investment',
    tagline: 'Active capital with conviction',
    desc:    'We invest in early-stage B2B software companies in industrial sectors. We take active board positions, contributing engineering and commercial expertise alongside capital.',
    points:  ['Seed & early-stage B2B SaaS', 'Central and Eastern Europe focus', 'Board-level technical advisory', 'Engineering co-founding support'],
  },
  {
    icon:    Wrench,
    title:   'Operational Digitisation',
    tagline: 'Paper-to-digital transformation',
    desc:    'We work with established industrial companies to digitise paper-based processes, build real-time operational dashboards, and integrate legacy systems with modern software stacks.',
    points:  ['Process mapping & gap analysis', 'Real-time operational dashboards', 'Legacy system integration', 'ISO, HACCP & regulatory compliance'],
  },
  {
    icon:    Users,
    title:   'Fractional CTO',
    tagline: 'Senior leadership, flexible engagement',
    desc:    'Technology leadership for scale-up companies. We assess existing architecture, define technical roadmaps, support engineering hiring, and provide executive-level decisions while you hire permanently.',
    points:  ['Architecture assessment & audit', 'Technical roadmap definition', 'Engineering team structure', 'Vendor & tooling selection'],
  },
]

const PROCESS = [
  { n: '01', label: 'Assess',    desc: 'We audit your current state — processes, systems, constraints — and identify where technology adds the most leverage.' },
  { n: '02', label: 'Architect', desc: 'We design a solution that solves the real problem, not a theoretical one. Simple, durable, and built for your team to own.' },
  { n: '03', label: 'Build',     desc: 'Precision engineering: clean code, documented decisions, production-grade security and performance from day one.' },
  { n: '04', label: 'Operate',   desc: 'We don\'t just hand over and disappear. We stay close through stabilisation and provide on-call support during critical periods.' },
]

/* ── Page ──────────────────────────────────────────────────────── */
export default function Services() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-28">

        {/* ── Header ─────────────────────────────────────────── */}
        <Reveal className="mb-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)', color: 'var(--gold)' }}
          >
            Services
          </div>

          <h1
            className="font-display font-semibold text-5xl sm:text-6xl leading-tight mb-5"
            style={{ color: 'var(--cream)' }}
          >
            What we do
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--slate)' }}>
            From building products from scratch to investing in exceptional founders — we work with
            operators, enterprises, and startups worldwide.
          </p>
        </Reveal>

        {/* ── Service cards ──────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {SERVICES.map(({ icon: Icon, title, tagline, desc, points }) => (
            <motion.div key={title} variants={staggerItem}>
              <TiltCard
                maxTilt={5}
                className="rounded-2xl border h-full"
                style={{
                  background:     'var(--glass-bg)',
                  borderColor:    'var(--glass-border)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="p-8 flex flex-col h-full">
                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 flex-shrink-0"
                    style={{ background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.15)' }}
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                  >
                    <Icon size={20} style={{ color: 'var(--gold)' }} />
                  </motion.div>

                  {/* Text */}
                  <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>
                    {tagline}
                  </p>
                  <h2 className="font-display font-semibold text-xl mb-3" style={{ color: 'var(--cream)' }}>
                    {title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--slate)' }}>
                    {desc}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2">
                    {points.map(pt => (
                      <li key={pt} className="flex items-start gap-2.5">
                        <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                        <span className="text-xs" style={{ color: 'var(--slate)' }}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* ── How we work ────────────────────────────────────── */}
        <Reveal className="mb-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              Our process
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          </div>

          <h2 className="font-display font-semibold text-3xl sm:text-4xl mb-4 text-center" style={{ color: 'var(--cream)' }}>
            How we work
          </h2>
          <p className="text-base text-center max-w-xl mx-auto mb-14" style={{ color: 'var(--slate)' }}>
            A repeatable approach refined over multiple ventures. Straightforward, undramatic, and effective.
          </p>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {PROCESS.map(({ n, label, desc }) => (
            <motion.div key={n} variants={staggerItem}>
              <div
                className="relative rounded-2xl p-6 border h-full"
                style={{
                  background:     'var(--glass-bg)',
                  borderColor:    'var(--glass-border)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* Step number — large, decorative */}
                <div
                  className="font-display font-semibold text-5xl leading-none mb-4 select-none"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(212,168,67,0.20)',
                  }}
                >
                  {n}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--cream)' }}>
                  {label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>
                  {desc}
                </p>

                {/* Connector line (all but last) */}
                <div
                  className="absolute top-1/2 -right-2 w-4 h-px hidden lg:block"
                  style={{ background: 'rgba(212,168,67,0.20)' }}
                />
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

            <p className="text-sm mb-2" style={{ color: 'var(--slate)' }}>
              Ready to start?
            </p>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl mb-3" style={{ color: 'var(--cream)' }}>
              Tell us about your challenge.
            </h2>
            <p className="text-sm mb-7 max-w-md mx-auto" style={{ color: 'var(--slate)' }}>
              We respond within one business day. No sales calls — just a direct conversation with the people who build.
            </p>

            <div className="flex justify-center">
              <MagneticButton onClick={() => navigate('/contact')}>
                Contact us <ArrowRight size={15} />
              </MagneticButton>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
