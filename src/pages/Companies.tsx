import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const VENTURES = [
  {
    id: 'skillvue',
    icon: '🧠',
    name: 'SkillVue',
    tagline: 'Competency Intelligence Platform',
    industry: 'Food Manufacturing · HR Tech',
    status: 'live' as const,
    desc: 'A comprehensive platform that maps, tracks, and develops employee competencies in food manufacturing environments. Structured training pathways, real-time skill-gap dashboards, and ISO/HACCP-aligned frameworks built for shift-based workforces.',
    url: 'https://skillvue-app.fly.dev',
    tags: ['Competency Management', 'Analytics', 'HR Tech'],
  },
  {
    id: 'mcis',
    icon: '📦',
    name: 'MCIS',
    tagline: 'Material & Consumables Issuance Management',
    industry: 'Manufacturing · Supply Chain',
    status: 'coming-soon' as const,
    desc: 'End-to-end management of materials and consumables issuance across manufacturing operations. Tracks issue-by-line, consumption forecasting, and waste reduction in high-volume production environments.',
    url: '',
    tags: ['Inventory Management', 'Supply Chain'],
  },
  {
    id: 'scheduler',
    icon: '🗓️',
    name: 'Staff Scheduler Pro',
    tagline: 'AI-Powered Shift Planning',
    industry: 'Manufacturing · Healthcare · Retail',
    status: 'coming-soon' as const,
    desc: 'AI-powered staff scheduling that respects labour rules, skill requirements, and employee preferences. Handles complex multi-site rotations, compliance alerts, and predictive absence modelling.',
    url: '',
    tags: ['Workforce Management', 'Automation', 'AI'],
  },
]

const STATUS = {
  live:         { label: 'Live',         dot: 'bg-green-400 animate-pulse', style: { background: '#0B2F1A', color: '#4ADE80', border: '1px solid #166534' } },
  beta:         { label: 'Beta',         dot: 'bg-blue-400',                style: { background: '#0C1F3F', color: '#60A5FA', border: '1px solid #1E40AF' } },
  'coming-soon': { label: 'Coming soon', dot: 'bg-amber-400',               style: { background: '#2A1F0A', color: '#FBBF24', border: '1px solid #78350F' } },
}

export default function Companies() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium tracking-widest uppercase"
               style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
            Portfolio
          </div>
          <h1 className="font-display font-semibold text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
            Our Companies
          </h1>
          <p className="text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Precision-built software ventures, each solving a distinct operational problem.
          </p>
        </div>

        <div className="space-y-6">
          {VENTURES.map((v, i) => {
            const stat = STATUS[v.status]
            return (
              <motion.article
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-2xl p-8 border group"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                       style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    {v.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="font-display font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>{v.name}</h2>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={stat.style}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} /> {stat.label}
                      </span>
                    </div>

                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--accent)' }}>{v.tagline}</p>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{v.industry}</p>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {v.tags.map(t => (
                        <span key={t} className="px-2.5 py-0.5 rounded-full text-xs"
                              style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    {v.url && (
                      <a href={v.url} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                         style={{ color: 'var(--accent)' }}>
                        Visit platform <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        <div className="mt-14 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Interested in partnering or investing?</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
