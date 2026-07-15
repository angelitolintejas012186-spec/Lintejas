import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import TiltCard from '../components/ui/TiltCard'
import Reveal   from '../components/ui/Reveal'
import MagneticButton from '../components/ui/MagneticButton'
import { staggerContainer, staggerItem, ease } from '../lib/motion'
import NetworkGraph from '../components/motion/NetworkGraph'
import HudFrame    from '../components/motion/HudFrame'

/* ── Data ─────────────────────────────────────────────────────── */
interface Venture {
  id:       string
  icon:     string
  name:     string
  tagline:  string
  industry: string
  status:   'live' | 'beta' | 'coming-soon' | 'in-development'
  desc:     string
  url:      string
  tags:     string[]
  flagship: boolean
  /** Optional build progress (0–100) — renders a bar on the venture card. */
  progress?: number
}

const VENTURES: Venture[] = [
  {
    id:       'skillvue',
    icon:     '🧠',
    name:     'SkillVue',
    tagline:  'Safety & Workforce Intelligence Platform',
    industry: 'Food Manufacturing · Safety & HR Tech',
    status:   'live' as const,
    desc:     'The human layer of the smart factory. SkillVue unifies high-hazard safety workflows — digital work permits, LOTO, confined space entry, and risk prediction — with competency tracking, structured training pathways, and real-time skill-gap dashboards. Built for shift-based food manufacturing workforces, with 24/7 approval routing and instant push notifications.',
    url:      'https://skillvue-production.up.railway.app/demo-entry',
    tags:     ['Safety Management', 'Competency Management', 'Analytics', 'HR Tech'],
    flagship: true,
  },
  {
    id:       'negosyo-plans',
    icon:     '🛒',
    name:     'Negosyo Plans',
    tagline:  'Digital Products E-commerce',
    industry: 'E-commerce · Philippine Market',
    status:   'coming-soon' as const,
    desc:     'A digital-products e-commerce platform for Filipino entrepreneurs — ready-made business plans, templates, and starter kits for launching small businesses in the Philippine market.',
    url:      '',
    tags:     ['E-commerce', 'Digital Products'],
    flagship: false,
    progress: 85,
  },
  {
    id:       'biyaheph',
    icon:     '🚌',
    name:     'BiyahePH',
    tagline:  'Commuter Companion App',
    industry: 'Mobility · Philippine Market',
    status:   'in-development' as const,
    desc:     'A commuter companion app for the Philippine market — routes, fares, and real-time transit guidance across jeepney, bus, and rail networks. Built in Flutter for Android and iOS.',
    url:      '',
    tags:     ['Mobility', 'Consumer App'],
    flagship: false,
    progress: 60,
  },
  {
    id:       'ai-text-converter',
    icon:     '✍️',
    name:     'AI Text Converter',
    tagline:  'AI Writing Utility',
    industry: 'AI Tools · Productivity',
    status:   'in-development' as const,
    desc:     'An AI-powered utility for converting text between formats, tones, and styles. Early build.',
    url:      '',
    tags:     ['AI', 'Productivity'],
    flagship: false,
    progress: 20,
  },
  {
    id:       'mcis',
    icon:     '📦',
    name:     'MCIS',
    tagline:  'Material & Consumables Issuance Management',
    industry: 'Manufacturing · Supply Chain',
    status:   'coming-soon' as const,
    desc:     'End-to-end management of materials and consumables issuance across manufacturing operations. Tracks issue-by-line, consumption forecasting, and waste reduction in high-volume production environments.',
    url:      '',
    tags:     ['Inventory Management', 'Supply Chain'],
    flagship: false,
  },
  {
    id:       'scheduler',
    icon:     '🗓️',
    name:     'Staff Scheduler Pro',
    tagline:  'AI-Powered Shift Planning',
    industry: 'Manufacturing · Healthcare · Retail',
    status:   'coming-soon' as const,
    desc:     'AI-powered staff scheduling that respects labour rules, skill requirements, and employee preferences. Handles complex multi-site rotations, compliance alerts, and predictive absence modelling.',
    url:      '',
    tags:     ['Workforce Management', 'Automation', 'AI'],
    flagship: false,
  },
]

const STATUS_CONFIG = {
  live:          { label: 'Live',         color: '#3FB950', bg: 'rgba(63,185,80,0.10)',  border: 'rgba(63,185,80,0.25)',  pulse: true  },
  beta:          { label: 'Beta',         color: '#60A5FA', bg: 'rgba(96,165,250,0.10)', border: 'rgba(96,165,250,0.25)', pulse: false },
  'coming-soon': { label: 'Coming soon',  color: '#D4A843', bg: 'rgba(212,168,67,0.10)', border: 'rgba(212,168,67,0.20)', pulse: false },
  /* Neutral steel — the site's --slate tone; same badge component, data-only. */
  'in-development': { label: 'In development', color: '#8A9AB0', bg: 'rgba(138,154,176,0.10)', border: 'rgba(138,154,176,0.25)', pulse: false },
}

/* ── Animated tag chip ─────────────────────────────────────────── */
function Tag({ label, delay }: { label: string; delay: number }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4, ease }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="px-3 py-1 rounded-full text-xs font-medium cursor-default transition-all duration-300"
      style={{
        background:  hov ? 'rgba(212,168,67,0.12)' : 'rgba(19,36,59,0.6)',
        color:       hov ? 'var(--gold)'            : 'var(--slate)',
        border:      `1px solid ${hov ? 'rgba(212,168,67,0.30)' : 'rgba(212,168,67,0.12)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {label}
    </motion.span>
  )
}

/* ── Visit platform button with sliding arrow ──────────────────── */
function VisitButton({ url }: { url: string }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded"
      style={{ color: hov ? 'var(--gold-bright)' : 'var(--gold)' }}
    >
      Visit platform
      <motion.span
        animate={{ x: hov ? 4 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="inline-flex"
      >
        <ExternalLink size={13} />
      </motion.span>
    </a>
  )
}

/* ── Flagship card (SkillVue) ─────────────────────────────────── */
function FlagshipCard({ v }: { v: typeof VENTURES[0] }) {
  const stat = STATUS_CONFIG[v.status]
  return (
    <TiltCard
      maxTilt={5}
      className="rounded-2xl border"
      style={{
        background:     'var(--glass-bg)',
        borderColor:    'var(--glass-border)',
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="p-8 sm:p-10">
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 70% 10%, rgba(212,168,67,0.07), transparent 70%)' }}
        />

        {/* Status badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
          style={{ background: stat.bg, color: stat.color, border: `1px solid ${stat.border}` }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              background: stat.color,
              animation: stat.pulse ? 'pulseGold 2s ease-in-out infinite' : 'none',
            }}
          />
          {stat.label}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
          <div>
            {/* Icon + name */}
            <div className="flex items-center gap-4 mb-5">
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid var(--glass-border)' }}
                whileHover={{ scale: 1.08, rotate: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                {v.icon}
              </motion.div>
              <div>
                <h2 className="font-display font-semibold text-2xl" style={{ color: 'var(--cream)' }}>
                  {v.name}
                </h2>
                <p className="text-sm font-medium" style={{ color: 'var(--gold)' }}>{v.tagline}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--slate)' }}>{v.industry}</p>
              </div>
            </div>

            <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: 'var(--slate)' }}>
              {v.desc}
            </p>

            {/* Animated tags */}
            <div className="flex flex-wrap gap-2 mb-7">
              {v.tags.map((tag, i) => <Tag key={tag} label={tag} delay={0.1 + i * 0.07} />)}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <MagneticButton href={v.url} strength={0.22}>
                Visit Platform <ArrowRight size={14} />
              </MagneticButton>
              <VisitButton url={v.url} />
            </div>
          </div>

          {/* Stats column */}
          <div className="hidden lg:flex flex-col gap-3 min-w-[140px]">
            {[
              { n: '26',  label: 'User roles' },
              { n: '12+', label: 'Modules' },
              { n: 'EU',  label: 'GDPR compliant' },
            ].map(({ n, label }) => (
              <div
                key={label}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid var(--glass-border)' }}
              >
                <div className="font-display font-semibold text-xl" style={{ color: 'var(--gold)' }}>{n}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--slate)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

/* ── Standard venture card ─────────────────────────────────────── */
function VentureCard({ v, index }: { v: typeof VENTURES[0]; index: number }) {
  const stat = STATUS_CONFIG[v.status]
  return (
    <motion.div variants={staggerItem}>
      <TiltCard
        maxTilt={7}
        className="rounded-2xl border h-full"
        style={{
          background:     'var(--glass-bg)',
          borderColor:    'var(--glass-border)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="p-7 h-full flex flex-col">
          {/* Status */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium self-start mb-5"
            style={{ background: stat.bg, color: stat.color, border: `1px solid ${stat.border}` }}
          >
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: stat.color }} />
            {stat.label}
          </div>

          {/* Icon */}
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 flex-shrink-0"
            style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid var(--glass-border)' }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 280, damping: 16 }}
          >
            {v.icon}
          </motion.div>

          <h3 className="font-display font-semibold text-lg mb-1" style={{ color: 'var(--cream)' }}>
            {v.name}
          </h3>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--gold)' }}>{v.tagline}</p>
          <p className="text-xs mb-4" style={{ color: 'var(--slate)' }}>{v.industry}</p>

          <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--slate)' }}>
            {v.desc}
          </p>

          {/* Build progress — only for ventures that declare it */}
          {v.progress != null && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: 'var(--slate)' }}>Build progress</span>
                <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>{v.progress}%</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(212,168,67,0.10)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'var(--gold)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${v.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease, delay: 0.2 }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {v.tags.map((tag, i) => (
              <Tag key={tag} label={tag} delay={0.05 + index * 0.1 + i * 0.05} />
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function Companies() {
  const navigate   = useNavigate()
  const flagship   = VENTURES.filter(v => v.flagship)
  const supporting = VENTURES.filter(v => !v.flagship)

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--navy)' }}>
      <NetworkGraph />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-28">

        {/* ── Header ───────────────────────────────────────── */}
        <Reveal className="mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)', color: 'var(--gold)' }}
          >
            Portfolio
          </div>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1
                className="font-display font-semibold text-5xl sm:text-6xl leading-tight mb-4"
                style={{ color: 'var(--cream)' }}
              >
                Our Companies
              </h1>
              <p className="text-lg max-w-xl" style={{ color: 'var(--slate)' }}>
                Precision-built software ventures, each solving a distinct operational problem.
              </p>
            </div>
            <span className="text-sm" style={{ color: 'var(--slate)' }}>
              {VENTURES.length} ventures
            </span>
          </div>
        </Reveal>

        {/* ── Flagship ─────────────────────────────────────── */}
        <Reveal className="mb-8" delay={0.1}>
          <p className="text-xs font-medium uppercase tracking-widest mb-5" style={{ color: 'var(--gold)' }}>
            Flagship venture
          </p>
          {flagship.map(v => (
            <HudFrame
              key={v.id}
              delay={0.4}
              cornerSize={22}
              strokeWidth={1.4}
              scanline
              readouts={[
                { position: 'tl', label: 'STATUS', value: 'LIVE' },
                { position: 'tr', label: 'MODULES', value: '12+' },
              ]}
            >
              <FlagshipCard v={v} />
            </HudFrame>
          ))}
        </Reveal>

        {/* ── Supporting ventures ───────────────────────────── */}
        <div className="mb-16">
          <Reveal className="mb-5" delay={0.05}>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--slate)' }}>
              In development
            </p>
          </Reveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {supporting.map((v, i) => (
              <VentureCard key={v.id} v={v} index={i} />
            ))}
          </motion.div>
        </div>

        {/* ── CTA ──────────────────────────────────────────── */}
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
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.06) 0%, transparent 65%)' }}
            />

            <p className="text-sm mb-2" style={{ color: 'var(--slate)' }}>
              Interested in partnering or investing?
            </p>
            <h2 className="font-display font-semibold text-2xl mb-6" style={{ color: 'var(--cream)' }}>
              Let's build together.
            </h2>

            <div className="flex justify-center">
              <MagneticButton onClick={() => navigate('/contact')}>
                Get in touch <ArrowRight size={15} />
              </MagneticButton>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
