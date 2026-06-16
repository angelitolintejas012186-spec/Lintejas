import { motion } from 'framer-motion'
import { Code2, BarChart3, Wrench, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const SERVICES = [
  {
    icon: Code2,
    title: 'Product Development',
    desc: 'We design and build software products from concept to production — including architecture, engineering, UI/UX design, and quality assurance. We specialise in complex operational software for manufacturing and enterprise environments.',
  },
  {
    icon: BarChart3,
    title: 'Technology Investment',
    desc: 'We invest in early-stage B2B software companies operating in industrial sectors across Central and Eastern Europe. We take active board positions and contribute engineering and commercial expertise alongside capital.',
  },
  {
    icon: Wrench,
    title: 'Operational Digitisation',
    desc: 'We work with established industrial companies to digitise paper-based processes, build real-time operational dashboards, and integrate legacy systems with modern software stacks. Lean implementation, maximum return.',
  },
  {
    icon: Users,
    title: 'Fractional CTO',
    desc: 'Short-term technology leadership for scale-up companies. We assess existing architecture, define technical roadmaps, support engineering team building, and provide executive-level technology decisions while you hire your permanent leadership.',
  },
]

export default function Services() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium tracking-widest uppercase"
               style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
            Services
          </div>
          <h1 className="font-display font-semibold text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
            What we offer
          </h1>
          <p className="text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            From product development to investment and advisory — we work with founders, operators, and enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {SERVICES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-2xl p-8 border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                   style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <Icon size={20} style={{ color: 'var(--accent)' }} />
              </div>
              <h2 className="font-display font-semibold text-xl mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl p-10 border text-center"
             style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="font-display font-semibold text-3xl mb-4" style={{ color: 'var(--text-primary)' }}>Ready to start?</h2>
          <p className="text-base mb-7" style={{ color: 'var(--text-secondary)' }}>
            Tell us about your challenge. We respond within one business day.
          </p>
          <Link to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
            Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}
