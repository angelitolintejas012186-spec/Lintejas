import type { CSSProperties } from 'react'
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

/* ── Card backgrounds (inline SVG + solid colour; no images) ───────────────────
   Applied BY INDEX — SERVICES / PROCESS keep their exact structure. Gradient ids are
   prefixed svc- so they stay unique page-wide. Anchored top-right (xMaxYMin slice) so
   the motifs stay in the top-right corner on wide desktop cards. */
const SVG_CLS = 'absolute inset-0 w-full h-full pointer-events-none'
/* Masks: motifs stay full strength in the top-right corner and fade out behind the text
   so body copy keeps >=4.5:1 contrast. The CTA dims its centre, where the copy sits. */
const mask = (m: string): CSSProperties => ({ WebkitMaskImage: m, maskImage: m })
const FADE_TR = mask('radial-gradient(ellipse 300px 190px at 100% 0%, #000 35%, rgba(0,0,0,.18) 100%)')
const FADE_CTA = mask('radial-gradient(ellipse 62% 58% at 50% 52%, rgba(0,0,0,.2) 55%, #000 100%)')
const BRAND_THEMES = [
  { bg: '#0b1322', border: 'rgba(96,165,250,.3)', accent: '#93c5fd', inset: false, art: (
    <svg className={SVG_CLS} aria-hidden="true" viewBox="0 0 420 430" preserveAspectRatio="xMaxYMin slice"><defs><radialGradient id="svc-np" cx="82%" cy="12%" r="70%"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2"/><stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/></radialGradient></defs><rect width="420" height="430" fill="url(#svc-np)"/><g stroke="#60a5fa" strokeWidth="1" opacity="0.1"><line x1="0" y1="54" x2="420" y2="54"/><line x1="0" y1="108" x2="420" y2="108"/><line x1="0" y1="162" x2="420" y2="162"/><line x1="0" y1="216" x2="420" y2="216"/><line x1="0" y1="270" x2="420" y2="270"/><line x1="0" y1="324" x2="420" y2="324"/><line x1="0" y1="378" x2="420" y2="378"/><line x1="60" y1="0" x2="60" y2="430"/><line x1="120" y1="0" x2="120" y2="430"/><line x1="180" y1="0" x2="180" y2="430"/><line x1="240" y1="0" x2="240" y2="430"/><line x1="300" y1="0" x2="300" y2="430"/><line x1="360" y1="0" x2="360" y2="430"/></g><g stroke="#93c5fd" strokeWidth="1.6" fill="none" opacity="0.3" strokeLinecap="round"><rect x="248" y="56" width="128" height="86" rx="4" strokeDasharray="6 5"/><line x1="248" y1="84" x2="376" y2="84"/><line x1="292" y1="84" x2="292" y2="142"/><path d="M248 46 L248 36 M238 56 L228 56 M376 46 L376 36 M386 56 L396 56"/><circle cx="312" cy="113" r="14" strokeDasharray="3 4"/></g><text x="250" y="166" fontFamily="Figtree,sans-serif" fontSize="10" letterSpacing="2" fill="#93c5fd" opacity="0.5">PLAN v1.0 — SCALE 1:90</text></svg>
  ) },
  { bg: '#0c1220', border: 'rgba(245,158,11,.3)', accent: '#fbbf24', inset: true, art: (
    <svg className={SVG_CLS} aria-hidden="true" viewBox="0 0 420 430" preserveAspectRatio="xMaxYMin slice"><defs><radialGradient id="svc-mt" cx="78%" cy="20%" r="72%"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18"/><stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/></radialGradient><linearGradient id="svc-mtb" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.34"/><stop offset="100%" stopColor="#f59e0b" stopOpacity="0.04"/></linearGradient></defs><rect width="420" height="430" fill="url(#svc-mt)"/><g opacity="0.5"><rect x="238" y="96" width="26" height="90" rx="3" fill="url(#svc-mtb)"/><rect x="274" y="66" width="26" height="120" rx="3" fill="url(#svc-mtb)"/><rect x="310" y="118" width="26" height="68" rx="3" fill="url(#svc-mtb)"/><rect x="346" y="40" width="26" height="146" rx="3" fill="url(#svc-mtb)"/></g><g stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" strokeLinejoin="round"><path d="M238 120 L287 84 L323 138 L359 48"/><circle cx="359" cy="48" r="3.5" fill="#fbbf24" stroke="none"/></g><g opacity="0.16" stroke="#f59e0b" strokeWidth="1"><line x1="0" y1="200" x2="420" y2="200"/><line x1="0" y1="206" x2="420" y2="206"/><line x1="0" y1="212" x2="420" y2="212"/></g><text x="240" y="208" fontFamily="Figtree,sans-serif" fontSize="10" letterSpacing="2" fill="#fbbf24" opacity="0.55">KITA +12% · LIVE</text></svg>
  ) },
  { bg: '#0e0f21', border: 'rgba(168,85,247,.32)', accent: '#c084fc', inset: false, art: (
    <svg className={SVG_CLS} aria-hidden="true" viewBox="0 0 420 430" preserveAspectRatio="xMaxYMin slice"><defs><radialGradient id="svc-zm" cx="84%" cy="16%" r="75%"><stop offset="0%" stopColor="#a855f7" stopOpacity="0.2"/><stop offset="100%" stopColor="#a855f7" stopOpacity="0"/></radialGradient></defs><rect width="420" height="430" fill="url(#svc-zm)"/><g stroke="#c084fc" fill="none" strokeLinecap="round"><circle cx="352" cy="92" r="22" strokeWidth="2" opacity="0.4"/><circle cx="352" cy="92" r="46" strokeWidth="1.6" opacity="0.26"/><circle cx="352" cy="92" r="74" strokeWidth="1.3" opacity="0.16"/><circle cx="352" cy="92" r="106" strokeWidth="1" opacity="0.09"/><circle cx="352" cy="92" r="4" fill="#c084fc" stroke="none" opacity="0.6"/></g><g stroke="#a855f7" strokeWidth="1.4" opacity="0.3" strokeLinecap="round"><path d="M30 150 Q60 120 90 150 T150 150 T210 150" fill="none"/><path d="M30 172 Q60 148 90 172 T150 172 T210 172" fill="none" opacity="0.6"/></g><g fill="#c084fc" opacity="0.4"><circle cx="70" cy="64" r="2"/><circle cx="120" cy="40" r="1.5"/><circle cx="180" cy="76" r="2"/><circle cx="230" cy="48" r="1.5"/></g></svg>
  ) },
  { bg: '#0a1420', border: 'rgba(52,211,153,.3)', accent: '#6ee7b7', inset: false, art: (
    <svg className={SVG_CLS} aria-hidden="true" viewBox="0 0 420 430" preserveAspectRatio="xMaxYMin slice"><defs><radialGradient id="svc-wd" cx="80%" cy="14%" r="72%"><stop offset="0%" stopColor="#34d399" stopOpacity="0.17"/><stop offset="100%" stopColor="#34d399" stopOpacity="0"/></radialGradient></defs><rect width="420" height="430" fill="url(#svc-wd)"/><g stroke="#34d399" strokeWidth="1.2" opacity="0.26" strokeLinecap="round"><line x1="258" y1="70" x2="330" y2="110"/><line x1="330" y1="110" x2="392" y2="62"/><line x1="330" y1="110" x2="306" y2="178"/><line x1="306" y1="178" x2="374" y2="200"/><line x1="258" y1="70" x2="236" y2="140"/><line x1="236" y1="140" x2="306" y2="178"/><line x1="236" y1="140" x2="168" y2="110"/></g><g fill="#34d399"><circle cx="258" cy="70" r="5" opacity="0.5"/><circle cx="330" cy="110" r="6.5" opacity="0.6"/><circle cx="392" cy="62" r="4" opacity="0.4"/><circle cx="306" cy="178" r="5" opacity="0.5"/><circle cx="374" cy="200" r="3.5" opacity="0.35"/><circle cx="236" cy="140" r="4.5" opacity="0.45"/><circle cx="168" cy="110" r="3.5" opacity="0.3"/></g><g stroke="#6ee7b7" strokeWidth="1.4" fill="none" opacity="0.35"><circle cx="330" cy="110" r="12" strokeDasharray="3 4"/></g><g stroke="#34d399" strokeWidth="1" opacity="0.07"><line x1="0" y1="260" x2="420" y2="252"/><line x1="0" y1="300" x2="420" y2="288"/><line x1="0" y1="340" x2="420" y2="324"/></g></svg>
  ) },
]

/* Process cards 01–04: one gold HUD frame + a per-step motif (top-right). */
const PROC_MOTIF = [
  // 01 Listen — waveform: 8 rounded lines x 268..366 (step 14), centred on y 78
  <g key="m1" stroke="#c9a84c" strokeWidth="1.6" strokeLinecap="round" opacity="0.3">
    {[28, 52, 74, 84, 60, 40, 66, 24].map((h, i) => <line key={i} x1={268 + i * 14} y1={78 - h / 2} x2={268 + i * 14} y2={78 + h / 2} />)}
  </g>,
  // 02 Build simple — two isometric wireframe cubes
  <g key="m2" stroke="#c9a84c" strokeWidth="1.4" fill="none" strokeLinejoin="round">
    <path d="M300 96 L336 78 L372 96 L336 114 Z M300 96 V132 L336 150 V114 M372 96 V132 L336 150" opacity="0.3" />
    <path d="M262 128 L286 116 L310 128 L286 140 Z M262 128 V152 L286 164 V140 M310 128 V152 L286 164" opacity="0.21" />
  </g>,
  // 03 Test with owners — target reticle + check
  <g key="m3" stroke="#c9a84c" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="330" cy="92" r="18" strokeWidth="1.4" opacity="0.4" />
    <circle cx="330" cy="92" r="38" strokeWidth="1.2" strokeDasharray="4 5" opacity="0.25" />
    <circle cx="330" cy="92" r="58" strokeWidth="1" opacity="0.14" />
    <path d="M330 26 V40 M330 144 V158 M264 92 H278 M382 92 H396" strokeWidth="1.2" opacity="0.3" />
    <path d="M324 92 L329 97 L338 86" strokeWidth="2" opacity="0.55" />
  </g>,
  // 04 Keep improving — orbit loop with an arrowhead, two dots, a dashed arc below
  <g key="m4" stroke="#c9a84c" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M268 128 Q300 150 332 128 Q364 106 348 82 Q332 58 300 70" strokeWidth="1.4" opacity="0.35" />
    <path d="M309 63 L300 70 L310 76" strokeWidth="1.4" opacity="0.35" />
    <circle cx="300" cy="139" r="3" fill="#c9a84c" stroke="none" opacity="0.35" />
    <circle cx="352" cy="105.5" r="3" fill="#c9a84c" stroke="none" opacity="0.35" />
    <path d="M262 178 Q320 198 378 178" strokeWidth="1" strokeDasharray="4 5" opacity="0.16" />
  </g>,
]
function ProcArt({ i }: { i: number }) {
  const id = 'svc-pr-' + (i + 1)
  return (
    <svg className="w-full h-full" style={FADE_TR} aria-hidden="true" viewBox="0 0 420 280" preserveAspectRatio="xMaxYMin slice">
      <defs><radialGradient id={id} cx="85%" cy="20%" r="70%"><stop offset="0%" stopColor="#c9a84c" stopOpacity="0.14" /><stop offset="100%" stopColor="#c9a84c" stopOpacity="0" /></radialGradient></defs>
      <rect width="420" height="280" fill={`url(#${id})`} />
      <g stroke="#c9a84c" strokeWidth="1.4" fill="none" opacity="0.35"><path d="M24 24 H44 M24 24 V44 M396 256 H376 M396 256 V236" /></g>
      <g stroke="#c9a84c" strokeWidth="1" opacity="0.07"><line x1="0" y1="206" x2="420" y2="206" /><line x1="0" y1="220" x2="420" y2="220" /><line x1="0" y1="234" x2="420" y2="234" /></g>
      {PROC_MOTIF[i]}
    </svg>
  )
}

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
          {SERVICES.map(({ icon: Icon, title, tagline, desc, points }, i) => (
            <motion.div key={title} variants={staggerItem}>
              <TiltCard
                maxTilt={5}
                className="rounded-2xl border h-full"
                style={{ backgroundColor: BRAND_THEMES[i].bg, borderColor: BRAND_THEMES[i].border }}
              >
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={FADE_TR}>{BRAND_THEMES[i].art}</div>
                {BRAND_THEMES[i].inset && (   // TiltCard's glass-glow animates box-shadow, so the inset glow is its own layer
                  <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[inherit]" style={{ boxShadow: 'inset 0 0 24px rgba(245,158,11,.05)' }} />
                )}
                <div className="relative z-10 p-8 flex flex-col h-full">
                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 flex-shrink-0"
                    style={{ background: 'rgba(212,168,67,0.07)', border: `1px solid ${BRAND_THEMES[i].accent}59` }}
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                  >
                    <Icon size={20} style={{ color: BRAND_THEMES[i].accent }} />
                  </motion.div>

                  {/* Text */}
                  <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: BRAND_THEMES[i].accent }}>
                    {tagline}
                  </p>
                  <h2 className="font-display font-semibold text-xl mb-3" style={{ color: 'var(--cream)' }}>
                    {title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: '#b4bfd4' }}>
                    {desc}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2">
                    {points.map(pt => (
                      <li key={pt} className="flex items-start gap-2.5">
                        <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                        <span className="text-xs" style={{ color: '#b4bfd4' }}>{pt}</span>
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
          {PROCESS.map(({ n, label, desc }, i) => (
            <motion.div key={n} variants={staggerItem}>
              <div
                className="relative rounded-2xl p-6 border h-full"
                style={{ backgroundColor: '#0b1424', borderColor: 'rgba(201,168,76,.22)' }}
              >
                {/* Background art in its own clipped layer — the card itself stays unclipped so the connector line still shows */}
                <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none"><ProcArt i={i} /></div>
                {/* Step number — large, decorative */}
                <div
                  className="relative z-10 font-display font-semibold text-5xl leading-none mb-4 select-none"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(212,168,67,0.20)',
                  }}
                >
                  {n}
                </div>
                <h3 className="relative z-10 font-display font-semibold text-lg mb-2" style={{ color: 'var(--cream)' }}>
                  {label}
                </h3>
                <p className="relative z-10 text-sm leading-relaxed" style={{ color: '#b4bfd4' }}>
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
            style={{ backgroundColor: '#0b1424', borderColor: 'rgba(201,168,76,.3)' }}
          >
            <svg className={SVG_CLS} style={FADE_CTA} aria-hidden="true" viewBox="0 0 420 380" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="svc-ct1" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#e0c068" stopOpacity="0.2"/><stop offset="100%" stopColor="#e0c068" stopOpacity="0"/></radialGradient><linearGradient id="svc-ctg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c9a84c" stopOpacity="0"/><stop offset="100%" stopColor="#c9a84c" stopOpacity="0.22"/></linearGradient></defs><rect width="420" height="380" fill="url(#svc-ct1)"/><g stroke="url(#svc-ctg)" strokeWidth="1.2"><line x1="210" y1="230" x2="-40" y2="380"/><line x1="210" y1="230" x2="60" y2="380"/><line x1="210" y1="230" x2="150" y2="380"/><line x1="210" y1="230" x2="210" y2="380"/><line x1="210" y1="230" x2="270" y2="380"/><line x1="210" y1="230" x2="360" y2="380"/><line x1="210" y1="230" x2="460" y2="380"/></g><g stroke="#c9a84c" strokeWidth="1" opacity="0.14"><line x1="0" y1="290" x2="420" y2="290"/><line x1="0" y1="318" x2="420" y2="318"/><line x1="0" y1="350" x2="420" y2="350"/></g><g fill="#e0c068" opacity="0.4"><circle cx="86" cy="70" r="1.6"/><circle cx="140" cy="44" r="1.2"/><circle cx="300" cy="56" r="1.6"/><circle cx="348" cy="90" r="1.2"/><circle cx="250" cy="34" r="1.2"/></g></svg>
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.22), transparent)' }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.06), transparent 65%)' }}
            />

            <p className="relative z-10 text-sm mb-2" style={{ color: '#b4bfd4' }}>
              Ready to start?
            </p>
            <h2 className="relative z-10 font-display font-semibold text-2xl sm:text-3xl mb-3" style={{ color: 'var(--cream)' }}>
              Tell us about your challenge.
            </h2>
            <p className="relative z-10 text-sm mb-7 max-w-md mx-auto" style={{ color: '#b4bfd4' }}>
              We respond within one business day. No sales calls — just a direct conversation with the people who build.
            </p>

            <div className="relative z-10 flex justify-center">
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
