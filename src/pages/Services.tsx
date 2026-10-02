import { useNavigate } from 'react-router-dom'
import { FileText, BarChart3, GraduationCap, Store, ArrowRight, CheckCircle2 } from 'lucide-react'
import TiltCard from '../components/ui/TiltCard'
import Reveal   from '../components/ui/Reveal'
import MagneticButton from '../components/ui/MagneticButton'
import { staggerContainer, staggerItem } from '../lib/motion'
import { motion } from 'framer-motion'

/* ── Data ─────────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon:    FileText,
    title:   'Start with a plan',
    tagline: 'NegosyoPlans',
    desc:    'Ready-made business blueprints for Filipino entrepreneurs — a complete plan instead of a guess. Each one covers the model, startup costs, revenue projections, risks, marketing, and a 90-day launch plan.',
    points:  ['Complete business plan', 'Startup costs & revenue projections', 'Risk & marketing strategy', '90-day launch action plan'],
  },
  {
    icon:    BarChart3,
    title:   'Run your numbers',
    tagline: 'Matthew System · Matthew Lite',
    desc:    "A simple business dashboard that watches your money so you don't go under. Track sales, expenses, profit, inventory, and your cash split — so you know every day if you really earned.",
    points:  ['Daily sales, expenses & profit', 'Inventory & cash tracking', 'Matthew Lite from ₱99/month', 'Works on your phone'],
  },
  {
    icon:    GraduationCap,
    title:   'Learn to market',
    tagline: 'ZAM Academy',
    desc:    'Practical digital-marketing courses for small businesses — marketing that sells, not just gets likes. Social media, search, and the basics that actually bring in customers.',
    points:  ['Social media marketing', 'Search engine marketing & SEO', 'From ₱500 per module', 'Built for small budgets'],
  },
  {
    icon:    Store,
    title:   'Find & list suppliers',
    tagline: 'WDRICH',
    desc:    'A vetted supplier directory where business owners find suppliers — and where your business gets listed so owners can find you.',
    points:  ['Listed in the supplier directory', 'Listed — ₱1,300/yr', 'Featured — ₱2,500/yr', 'Have a model? Share it — we may build a blueprint'],
  },
]

const PROCESS = [
  { n: '01', label: 'Listen',          desc: 'We learn how real Filipino businesses actually run — the cash, the stock, the daily grind — before we build anything.' },
  { n: '02', label: 'Build simple',    desc: 'We design tools that are simple to use and dependable, so a busy owner can pick them up without a manual.' },
  { n: '03', label: 'Test with owners', desc: 'We put every product in front of real owners and fix what trips them up before it ships.' },
  { n: '04', label: 'Keep improving',  desc: 'We stay close after launch and keep improving the tools alongside the people who use them.' },
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
            Practical software and digital tools for Filipino entrepreneurs and small businesses —
            to start with a real plan, run the day-to-day, and grow.
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
