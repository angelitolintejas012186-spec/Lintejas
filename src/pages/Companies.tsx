import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Lightbulb } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PORTFOLIO } from '../lib/portfolio'
import TiltCard from '../components/ui/TiltCard'
import Reveal   from '../components/ui/Reveal'
import MagneticButton from '../components/ui/MagneticButton'
import { staggerContainer, staggerItem } from '../lib/motion'
import NetworkGraph from '../components/motion/NetworkGraph'
import HudFrame    from '../components/motion/HudFrame'
import { CARDS } from '../components/ProductDeck'

/* ── Data ─────────────────────────────────────────────────────────
   The venture list is the shared single source (lib/portfolio.ts). Status, link and
   base icon come from the homepage deck (ProductDeck CARDS). A few family members need
   a square-friendly icon (the deck uses a wide lockup or a detailed crest), so the
   Portfolio overrides those — official marks only, a view-only concern; the Footer
   reads the same shared list for its links. `scale` = fraction of the tile the mark fills. */
const ICON_OVERRIDE: Record<string, { src?: string; Comp?: LucideIcon; scale?: number }> = {
  // Official Lite mark = the shield element of the official Lite lockup (public/brand/
  // lite-lockup-light.svg): same mango #DD7823 + cream stroke. Distinct from the Matthew
  // System crest (navy field + gold shield) by colour + no navy background.
  lite:       { src: '/brand/lite-mark.svg' },
  // Square crop of the REAL ZAM crest (public/brand/zam-mark.png) — emblem only, the
  // "ZAM ACADEM.CO" text + laurels cropped out so the eagle shield reads at tile size.
  courses:    { src: '/brand/zam-emblem.png', scale: 0.84 },
  // "Share your business model" is a WDRICH action with no distinct brand mark of its
  // own; a lightbulb (idea) keeps it visually distinct from WDRICH Supplier.
  contribute: { Comp: Lightbulb },
}

interface Venture {
  id: string; name: string; purpose: string
  status: 'live' | 'coming-soon'
  url: string
  logo?: string; svg?: ReactNode; emoji?: string; mono?: string
  iconSrc?: string; IconComp?: LucideIcon; iconScale?: number
  flagship: boolean
}

const byId: Record<string, typeof CARDS[number]> =
  Object.fromEntries(CARDS.map(c => [c.v, c]))

const VENTURES: Venture[] = PORTFOLIO.map(p => {
  const c = byId[p.v]
  const soon = !!(c && c.soon)
  const ov = ICON_OVERRIDE[p.v]
  return {
    id: p.v, name: p.name, purpose: p.purpose,
    status: soon ? 'coming-soon' : 'live',
    url: !soon && c && c.href ? c.href : '',
    logo: c && c.logo, svg: c && c.svg, emoji: c && c.emoji, mono: c && c.mono,
    iconSrc: ov && ov.src, IconComp: ov && ov.Comp, iconScale: ov && ov.scale,
    flagship: !!p.flagship,
  }
})

const STATUS_CONFIG = {
  live:          { label: 'Live',        color: '#3FB950', bg: 'rgba(63,185,80,0.10)',  border: 'rgba(63,185,80,0.25)',  pulse: true  },
  'coming-soon': { label: 'Coming soon', color: '#D4A843', bg: 'rgba(212,168,67,0.10)', border: 'rgba(212,168,67,0.20)', pulse: false },
}

/* venture icon — reuses the deck's own logo / crest / emoji / monogram */
function VentureIcon({ v, size }: { v: Venture; size: number }) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: 'rgba(212,168,67,0.08)', border: '1px solid var(--glass-border)' }}
      aria-hidden="true"
    >
      {v.IconComp
        ? <v.IconComp size={Math.round(size * 0.5)} color="var(--gold)" strokeWidth={1.6} />
        : v.iconSrc
          ? <img src={v.iconSrc} alt="" draggable={false} style={{ width: size * (v.iconScale ?? 0.6), height: size * (v.iconScale ?? 0.6), objectFit: 'contain' }} />
          : v.svg
            ? <div style={{ width: size * 0.58, height: size * 0.58 }}>{v.svg}</div>
            : v.logo
              ? <img src={v.logo} alt="" draggable={false} style={{ width: size * 0.62, height: size * 0.62, objectFit: 'contain' }} />
              : v.emoji
                ? <span style={{ fontSize: size * 0.5, lineHeight: 1 }}>{v.emoji}</span>
                : <span className="font-display font-semibold" style={{ fontSize: size * 0.42, color: 'var(--gold)' }}>{v.mono}</span>}
    </div>
  )
}

function StatusPill({ status, big }: { status: Venture['status']; big?: boolean }) {
  const s = STATUS_CONFIG[status]
  return (
    <div
      className={`self-start inline-flex items-center gap-2 rounded-full font-medium text-xs ${big ? 'px-3 py-1' : 'px-2.5 py-0.5'}`}
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color, animation: s.pulse ? 'pulseGold 2s ease-in-out infinite' : 'none' }} />
      {s.label}
    </div>
  )
}

/* ── Visit-platform link (live ventures only) — ≥44px tap target ─── */
function VisitButton({ url }: { url: string }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded px-1 min-h-[44px]"
      style={{ color: hov ? 'var(--gold-bright)' : 'var(--gold)' }}
    >
      Visit platform
      <motion.span animate={{ x: hov ? 4 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="inline-flex">
        <ExternalLink size={13} />
      </motion.span>
    </a>
  )
}

/* ── Flagship card (NegosyoPlans) ──────────────────────────────── */
function FlagshipCard({ v }: { v: Venture }) {
  return (
    <TiltCard
      maxTilt={5}
      className="rounded-2xl border"
      style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(24px)' }}
    >
      <div className="p-7 sm:p-9">
        <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none" style={{ background: 'radial-gradient(circle at 70% 10%, rgba(212,168,67,0.07), transparent 70%)' }} />
        <StatusPill status={v.status} big />
        <div className="flex items-center gap-4 mt-5 mb-4">
          <motion.div whileHover={{ scale: 1.06, rotate: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
            <VentureIcon v={v} size={64} />
          </motion.div>
          <h2 className="font-display font-semibold text-2xl" style={{ color: 'var(--cream)' }}>{v.name}</h2>
        </div>
        <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: 'var(--slate)' }}>{v.purpose}</p>
        {v.url && (
          <div className="flex flex-wrap items-center gap-5">
            <MagneticButton href={v.url} strength={0.22}><span className="inline-flex items-center gap-2 whitespace-nowrap">Visit platform <ArrowRight size={14} /></span></MagneticButton>
            <VisitButton url={v.url} />
          </div>
        )}
      </div>
    </TiltCard>
  )
}

/* ── Standard venture card ─────────────────────────────────────── */
function VentureCard({ v }: { v: Venture }) {
  return (
    <motion.div variants={staggerItem} className="h-full">
      <TiltCard
        maxTilt={7}
        className="rounded-2xl border h-full"
        style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(20px)' }}
      >
        <div className="p-6 h-full flex flex-col">
          <StatusPill status={v.status} />
          <div className="mt-5 mb-4"><VentureIcon v={v} size={48} /></div>
          <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--cream)' }}>{v.name}</h3>
          <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--slate)' }}>{v.purpose}</p>
          {v.url
            ? <VisitButton url={v.url} />
            : <span className="text-xs font-medium" style={{ color: 'var(--slate)' }}>In the works — not yet available.</span>}
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
      {/* Background graph CONFINED to the hero band (top) and faded out before the
          card grid — so no stray nodes ever render in the gaps between cards
          (notably Lite↔ZAM at 390). overflow-hidden clips; the mask softens the edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 overflow-hidden pointer-events-none"
        style={{
          height: 'clamp(340px, 50vh, 540px)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 58%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, #000 58%, transparent 100%)',
        }}
      >
        <NetworkGraph />
      </div>
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 pt-24 pb-24">

        {/* ── Header ───────────────────────────────────────── */}
        <Reveal className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-4"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)', color: 'var(--gold)' }}
          >
            Portfolio
          </div>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display font-semibold text-4xl sm:text-5xl leading-tight mb-3" style={{ color: 'var(--cream)' }}>
                Our Ventures
              </h1>
              <p className="text-base sm:text-lg max-w-xl" style={{ color: 'var(--slate)' }}>
                Products of one company — each solving a real business problem.
              </p>
            </div>
            <span className="text-sm whitespace-nowrap" style={{ color: 'var(--slate)' }}>{VENTURES.length} ventures</span>
          </div>
        </Reveal>

        {/* ── Flagship (NegosyoPlans) ───────────────────────── */}
        <Reveal className="mb-10" delay={0.1}>
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--gold)' }}>
            Flagship venture
          </p>
          {flagship.map(v => (
            <HudFrame
              key={v.id}
              delay={0.4}
              cornerSize={22}
              strokeWidth={1.4}
              scanline
              readouts={[{ position: 'tl', label: 'STATUS', value: 'LIVE' }]}
            >
              <FlagshipCard v={v} />
            </HudFrame>
          ))}
        </Reveal>

        {/* ── More ventures ─────────────────────────────────── */}
        <div className="mb-14">
          <Reveal className="mb-4" delay={0.05}>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--slate)' }}>
              More ventures
            </p>
          </Reveal>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {supporting.map(v => <VentureCard key={v.id} v={v} />)}
          </motion.div>
        </div>

        {/* ── CTA ──────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <div
            className="relative rounded-2xl p-8 sm:p-10 text-center border overflow-hidden"
            style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(20px)' }}
          >
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.22), transparent)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.06) 0%, transparent 65%)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--slate)' }}>Interested in partnering or investing?</p>
            <h2 className="font-display font-semibold text-2xl mb-6" style={{ color: 'var(--cream)' }}>Let's build together.</h2>
            <div className="flex justify-center">
              <MagneticButton onClick={() => navigate('/contact')}><span className="inline-flex items-center gap-2 whitespace-nowrap">Get in touch <ArrowRight size={15} /></span></MagneticButton>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
