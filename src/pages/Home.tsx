import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Cpu, Shield, TrendingUp, ChevronDown, Globe, Lock, KeyRound, Home as HomeIcon } from 'lucide-react'
import TheInterlockLogo from '../components/TheInterlockLogo'
import MagneticButton from '../components/ui/MagneticButton'
import AssemblingInterlock from '../components/motion/AssemblingInterlock'
import LiquidGold          from '../components/motion/LiquidGold'
import ProductDeck         from '../components/ProductDeck'
import DeferredLogo        from '../components/DeferredLogo'
import { WHATSAPP_NUMBER, whatsappHref } from '../lib/contact'
import { useMediaQuery } from '../lib/useMediaQuery'
import { fadeUp, staggerContainer, staggerItem, ease } from '../lib/motion'

const Interlock3D = lazy(() => import('../components/Interlock3D'))

/* ── Headline lines — each reveals with a clip-path mask ──────── */
/* Each line renders unwrapped (whitespace-nowrap, CLS guard). The 3 lines fit every column: widest
   "Filipino owners." is 285px at 38.4px (phone, full-width H1 ≈342px at 390), 354px at 48px and
   506px at 72px. Gold = the "Filipino owners." accent (same gold-gradient class as before). */
type HeadLine = { text: string; gold?: boolean }
const HEADLINE: HeadLine[] = [{ text: 'The business' }, { text: 'system behind' }, { text: 'Filipino owners.', gold: true }]

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


/* ── FAQ ───────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'What does Lintejas build?',
    a: 'Software and digital tools for Filipino entrepreneurs and small businesses — NegosyoPlans for a complete business plan, Matthew System and Matthew Lite to track your sales, expenses and profit, ZAM Academy to learn digital marketing, and WDRICH to find and list suppliers.',
  },
  {
    q: 'Who is it for?',
    a: "Filipino entrepreneurs and small businesses — sari-sari stores, food carts and kitchens, service shops, online sellers, and the people behind them. Whether you're just starting out or already running, there's a tool for where you are.",
  },
  {
    q: "What's the difference between Matthew System and Matthew Lite?",
    a: "Matthew System is the full business-manager dashboard that watches your numbers so you don't go under. Matthew Lite is the simpler, lower-cost version for vendors who just want to know, every day, if they really earned. Both run on your phone.",
  },
  {
    q: 'I have a business idea but no plan — where do I start?',
    a: 'Start with NegosyoPlans. Each blueprint gives you a complete business plan — the model, startup costs, revenue projections, risks, marketing, and a 90-day launch plan — so you begin with a plan, not a guess.',
  },
  {
    q: 'Is SkillVue available yet?',
    a: "SkillVue is coming soon — it's a safety and workforce platform for food manufacturing. The rest of the Lintejas family is available today.",
  },
  {
    q: 'How do I get in touch?',
    a: 'Head to the Contact page and send us a message, or email hello@lintejas.io. We read everything and respond personally.',
  },
]

/* ── Values strip ─────────────────────────────────────────────── */
const VALUES = [
  { icon: Cpu,        title: 'Built for owners', desc: 'Every tool is made for the person behind the counter — simple enough to use on a busy day, dependable when it matters most.' },
  { icon: Shield,     title: 'Honest numbers',   desc: 'No hype and no vanity metrics. Our tools show the real picture — sales, costs, and whether you actually earned today.' },
  { icon: TrendingUp, title: 'Taglish-ready',    desc: 'Built for how Filipinos really run a business — Taglish, mobile-first, and ready for the daily grind.' },
]

// Per-card background theme (by index, matching VALUES order) — classes live in src/index.css.
const VALUE_THEMES = [
  { cls: 'card-tech',      accent: '#38bdf8' },   // Built for owners
  { cls: 'card-hologram',  accent: '#f59e0b' },   // Honest numbers
  { cls: 'card-cyberpunk', accent: '#a855f7' },   // Taglish-ready
]

/* ── Trust & Security ─────────────────────────────────────────── */
const TRUST = [
  { icon: Globe,    title: 'Enterprise-grade infrastructure', desc: "Your data lives on Cloudflare's global network — the same infrastructure trusted by millions of businesses worldwide — with your records stored securely in the cloud, never on a laptop or a USB drive." },
  { icon: Lock,     title: 'Encrypted connections, always',   desc: 'Every login, sale you log, and peso you track travels over an encrypted HTTPS connection (TLS). No one on the network — not even your internet provider — can read it in transit.' },
  { icon: KeyRound, title: 'Your data is yours',              desc: 'We never sell your business data or share it with advertisers. Your numbers exist for one purpose: running your negosyo. Ask us to delete your account, and your data goes with it.' },
  { icon: HomeIcon, title: 'Built with Filipino owners in mind', desc: "Designed to respect the spirit of the Philippine Data Privacy Act: we collect only what the product needs, and your customers' details (utang lists, suki records) stay inside your account." },
]

/* Trust card backgrounds — same technique as the Services process cards: static inline SVG,
   gold family, anchored top-right (xMaxYMin slice) and faded under the text by the mask so every
   text/background pairing keeps >=4.5:1. Gradient ids are prefixed trust- (unique page-wide). */
const TRUST_FADE = { WebkitMaskImage: 'radial-gradient(ellipse 300px 190px at 100% 0%, #000 35%, rgba(0,0,0,.18) 100%)', maskImage: 'radial-gradient(ellipse 300px 190px at 100% 0%, #000 35%, rgba(0,0,0,.18) 100%)' } as CSSProperties
const SUN_RAYS = Array.from({ length: 8 }, (_, k) => {
  const a = (k * Math.PI) / 4, p = (r: number, d: number) => `${(330 + r * Math.cos(a + d)).toFixed(1)} ${(78 + r * Math.sin(a + d)).toFixed(1)}`
  return `M${p(25, -0.17)} L${p(50, 0)} L${p(25, 0.17)} Z`
}).join(' ')
const VAULT_TICKS = Array.from({ length: 36 }, (_, k) => {
  const a = (k * Math.PI) / 18, r2 = k % 3 ? 70 : 76
  return `M${(330 + 64 * Math.cos(a)).toFixed(1)} ${(92 + 64 * Math.sin(a)).toFixed(1)} L${(330 + r2 * Math.cos(a)).toFixed(1)} ${(92 + r2 * Math.sin(a)).toFixed(1)}`
}).join(' ')
const TRUST_MOTIF = [
  // 1 Infrastructure — globe arcs + connected node mesh, one arc glowing
  <g key="t1" fill="none" strokeLinecap="round">
    <g stroke="#c9a84c" strokeWidth="1.3">
      <circle cx="330" cy="90" r="58" opacity="0.3" />
      <ellipse cx="330" cy="90" rx="22" ry="58" opacity="0.2" />
      <ellipse cx="330" cy="90" rx="42" ry="58" opacity="0.15" />
      <path d="M272 90 H388 M279 62 Q330 74 381 62 M279 118 Q330 106 381 118" opacity="0.18" />
    </g>
    <path d="M287 51 A58 58 0 0 1 386 72" stroke="#e0c068" strokeWidth="2" opacity="0.55" />
    <g stroke="#c9a84c" strokeWidth="1" opacity="0.22">
      <path d="M287 51 L232 34 L196 82 L272 90 M232 34 L176 40 M196 82 L240 150 L300 182 L360 146 M300 182 L398 178 M386 72 L410 30 M360 146 L398 178" />
    </g>
    <g fill="#e0c068" stroke="none">
      <circle cx="232" cy="34" r="3" opacity="0.45" /><circle cx="196" cy="82" r="2.5" opacity="0.35" /><circle cx="176" cy="40" r="2" opacity="0.25" />
      <circle cx="240" cy="150" r="2.5" opacity="0.35" /><circle cx="300" cy="182" r="3" opacity="0.4" /><circle cx="398" cy="178" r="2.5" opacity="0.35" />
      <circle cx="410" cy="30" r="2.5" opacity="0.4" /><circle cx="287" cy="51" r="3.5" opacity="0.6" /><circle cx="386" cy="72" r="3.5" opacity="0.6" />
    </g>
  </g>,
  // 2 Encryption — padlock dissolving into a cipher stream, circuit trace into the lock
  <g key="t2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <g stroke="#c9a84c" strokeWidth="1.6" opacity="0.4">
      <path d="M314 82 V64 A24 24 0 0 1 362 64 V82" />
      <rect x="298" y="82" width="80" height="62" rx="9" />
      <circle cx="338" cy="106" r="6" /><path d="M338 112 V124" />
    </g>
    <g stroke="#e0c068" strokeWidth="1.2" opacity="0.3">
      <path d="M420 212 H366 L350 196 H338 V144" /><circle cx="366" cy="212" r="2.5" fill="#e0c068" stroke="none" />
      <path d="M420 230 H392 L380 218" />
    </g>
    <g fontFamily="ui-monospace,Menlo,monospace" fontSize="11" letterSpacing="3" fill="#e0c068">
      <text x="226" y="94" opacity="0.32">1011</text><text x="168" y="94" opacity="0.16">01</text><text x="128" y="94" opacity="0.07">1</text>
      <text x="236" y="114" opacity="0.28">0110</text><text x="186" y="114" opacity="0.13">10</text><text x="146" y="114" opacity="0.06">0</text>
      <text x="220" y="134" opacity="0.24">1101</text><text x="162" y="134" opacity="0.11">01</text>
    </g>
    <g stroke="#e0c068" strokeWidth="1.2" opacity="0.28">
      <circle cx="272" cy="70" r="4" /><path d="M276 70 H290 M286 70 V74" />
      <circle cx="206" cy="150" r="3.5" opacity="0.6" /><path d="M209.5 150 H221 M218 150 V153" opacity="0.6" />
    </g>
  </g>,
  // 3 Your data — vault door rings with ticks, fingerprint-like arcs, "owned" dot at the centre
  <g key="t3" fill="none" strokeLinecap="round">
    <g stroke="#c9a84c">
      <circle cx="330" cy="92" r="64" strokeWidth="1.3" opacity="0.28" />
      <circle cx="330" cy="92" r="46" strokeWidth="1.2" opacity="0.22" strokeDasharray="10 6" />
      <circle cx="330" cy="92" r="88" strokeWidth="1" opacity="0.1" />
      <path d={VAULT_TICKS} strokeWidth="1" opacity="0.26" />
    </g>
    <g stroke="#e0c068" strokeWidth="1.4">
      <path d="M318 92 A12 12 0 0 1 342 92" opacity="0.4" />
      <path d="M312 98 A18 18 0 0 1 340 76" opacity="0.32" />
      <path d="M306 92 A24 24 0 0 1 352 80 M354 92 A24 24 0 0 1 344 112" opacity="0.26" />
      <path d="M300 96 A30 30 0 0 1 330 62 M344 65 A30 30 0 0 1 356 108" opacity="0.2" />
    </g>
    <circle cx="330" cy="92" r="4" fill="#e0c068" opacity="0.7" />
  </g>,
  // 4 Filipino owners — abstract 8-ray geometric sun over a roofline / home outline
  <g key="t4" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="330" cy="78" r="16" stroke="#e0c068" strokeWidth="1.6" opacity="0.45" />
    <circle cx="330" cy="78" r="6" fill="#e0c068" opacity="0.3" />
    <path d={SUN_RAYS} stroke="#c9a84c" strokeWidth="1.2" opacity="0.34" />
    <circle cx="330" cy="78" r="62" stroke="#c9a84c" strokeWidth="1" opacity="0.1" strokeDasharray="3 6" />
    <g stroke="#c9a84c" strokeWidth="1.4" opacity="0.3">
      <path d="M250 196 L330 150 L410 196" />
      <path d="M266 186 V236 H394 V186" opacity="0.8" />
      <path d="M316 236 V208 H344 V236" opacity="0.8" />
    </g>
    <path d="M200 236 H420" stroke="#c9a84c" strokeWidth="1" opacity="0.14" />
  </g>,
]
function TrustArt({ i }: { i: number }) {
  const id = 'trust-g' + (i + 1)
  return (
    <svg className="w-full h-full" style={TRUST_FADE} aria-hidden="true" viewBox="0 0 420 280" preserveAspectRatio="xMaxYMin slice">
      <defs><radialGradient id={id} cx="82%" cy="22%" r="70%"><stop offset="0%" stopColor="#c9a84c" stopOpacity="0.13" /><stop offset="100%" stopColor="#c9a84c" stopOpacity="0" /></radialGradient></defs>
      <rect width="420" height="280" fill={`url(#${id})`} />
      {TRUST_MOTIF[i]}
    </svg>
  )
}

/* ── Obsidian page background (Oct 18) — facets, fracture seams, gold veins ─────────────────
   Generated once (scratch script, not shipped) on a 1440×4800 canvas that is stretched to the
   homepage (preserveAspectRatio none). Facets that would meet under text are merged, so every
   face boundary, seam and vein runs on an edge that clears every text block sitting on the page
   background at 390, 820 and 1280 (measured, 12px margin), and regions holding text only get the
   dark (shadow) face types; hairline/vein edges that
   clear 820 + 1280 but not 390 carry .home-bg-desk and are hidden below 768px. Strokes, nodes and
   ridges are non-scaling so the stretch never thickens or smears them. Static: no animation. */
const BG_FACES: [string, string][] = [
  ['s', 'M1440 0L1440 259.2L1228.3 357.6L1125.4 558.9L884.4 594.3L496.3 598.6L259.3 732.8L0 734.8L0 387.3L0 0L277.4 0L612.2 0L869.8 0L1151.5 0Z'],
  ['g', 'M1228.3 357.6L1440 259.2L1440 661.6L1125.4 558.9Z'],
  ['g', 'M0 734.8L259.3 732.8L0 1031Z'],
  ['l', 'M0 1031L256.5 995.3L259.3 732.8Z'],
  ['t', 'M259.3 732.8L256.5 995.3L581.3 1000.8L496.3 598.6Z'],
  ['t', 'M884.4 594.3L943.9 967.7L581.3 1000.8L496.3 598.6Z'],
  ['t', 'M943.9 967.7L1130.1 955.4L1125.4 558.9L884.4 594.3Z'],
  ['l', 'M1130.1 955.4L1440 661.6L1125.4 558.9Z'],
  ['s', 'M1130.1 955.4L1440 1003.5L1440 661.6Z'],
  ['t', 'M0 1382.1L256.5 995.3L0 1031Z'],
  ['s', 'M0 1382.1L256.5 995.3L366 1239.7Z'],
  ['t', 'M510.7 1371.7L816.5 1317.1L1130.1 955.4L943.9 967.7L581.3 1000.8L256.5 995.3Z'],
  ['l', 'M366 1239.7L510.7 1371.7L256.5 995.3Z'],
  ['t', 'M816.5 1317.1L1130.1 955.4L1095 1280.4Z'],
  ['l', 'M1130.1 955.4L1440 1003.5L1440 1325.9L1095 1280.4Z'],
  ['s', 'M366 1239.7L265.3 1584.6L0 1382.1Z'],
  ['l', 'M0 1382.1L0 1692.7L265.3 1584.6Z'],
  ['l', 'M366 1239.7L510.7 1371.7L625.4 1603.7Z'],
  ['s', 'M366 1239.7L265.3 1584.6L625.4 1603.7Z'],
  ['t', 'M510.7 1371.7L816.5 1317.1L800.8 1567.1Z'],
  ['l', 'M625.4 1603.7L800.8 1567.1L510.7 1371.7Z'],
  ['s', 'M1095 1280.4L1109.9 1652.8L816.5 1317.1Z'],
  ['l', 'M800.8 1567.1L1109.9 1652.8L816.5 1317.1Z'],
  ['t', 'M1095 1280.4L1109.9 1652.8L1440 1325.9Z'],
  ['l', 'M1440 1325.9L1440 1630.2L1109.9 1652.8Z'],
  ['s', 'M0 1692.7L265.3 1584.6L0 1835.3Z'],
  ['s', 'M539.3 2214.6L922.1 2168.9L1092.4 2184.2L1440 2172.6L1440 1870L1224.9 1912.9L877.4 1917.1L800.8 1567.1L625.4 1603.7L265.3 1584.6L0 1835.3L0 2199.3L267.8 2220.9Z'],
  ['s', 'M1109.9 1652.8L1224.9 1912.9L800.8 1567.1Z'],
  ['l', 'M800.8 1567.1L877.4 1917.1L1224.9 1912.9Z'],
  ['t', 'M1109.9 1652.8L1440 1630.2L1440 1870L1224.9 1912.9Z'],
  ['s', 'M539.3 2214.6L922.1 2168.9L1092.4 2184.2L1440 2172.6L1440 2539.6L1440 2889.9L1440 3202.3L1216.2 3546.7L868.2 3894.1L541.8 3922.1L260.3 3859.8L0 3822.9L0 3465.4L0 3173.3L0 2860.7L0 2659L0 2199.3L267.8 2220.9Z'],
  ['s', 'M1216.2 3546.7L1440 3563.1L1440 3202.3Z'],
  ['s', 'M868.2 3894.1L1191.2 3780L1216.2 3546.7Z'],
  ['t', 'M1191.2 3780L1440 3563.1L1216.2 3546.7Z'],
  ['t', 'M1191.2 3780L1440 3563.1L1440 3836Z'],
  ['t', 'M0 3822.9L260.3 3859.8L224.2 4071.8Z'],
  ['s', 'M0 4073.2L224.2 4071.8L0 3822.9Z'],
  ['l', 'M260.3 3859.8L653.4 4152.7L541.8 3922.1Z'],
  ['s', 'M846.6 4203.3L1106.6 4080.1L1211.6 4495.4L1440 4491.6L1213.2 4800L935.9 4800L505.3 4800L366.6 4800L0 4406.9L0 4073.2L224.2 4071.8L260.3 3859.8L653.4 4152.7Z'],
  ['l', 'M541.8 3922.1L868.2 3894.1L653.4 4152.7Z'],
  ['l', 'M653.4 4152.7L846.6 4203.3L868.2 3894.1Z'],
  ['l', 'M868.2 3894.1L1191.2 3780L1106.6 4080.1L846.6 4203.3Z'],
  ['l', 'M1191.2 3780L1106.6 4080.1L1440 3836Z'],
  ['l', 'M1440 3836L1440 4073.1L1106.6 4080.1Z'],
  ['g', 'M1106.6 4080.1L1440 4073.1L1440 4491.6Z'],
  ['l', 'M1106.6 4080.1L1211.6 4495.4L1440 4491.6Z'],
  ['t', 'M0 4800L366.6 4800L0 4406.9Z'],
  ['t', 'M1213.2 4800L1440 4491.6L1440 4800Z'],
]
const BG_SEAMS = 'M0 1692.7L0 1835.3 M1092.4 2184.2L1440 2172.6 M0 1835.3L265.3 1584.6 M496.3 598.6L884.4 594.3 M0 3822.9L0 4073.2 M539.3 2214.6L922.1 2168.9 M884.4 594.3L1125.4 558.9 M1106.6 4080.1L1440 4073.1 M277.4 0L612.2 0 M505.3 4800L935.9 4800 M1216.2 3546.7L1440 3563.1 M935.9 4800L1213.2 4800 M877.4 1917.1L1224.9 1912.9 M800.8 1567.1L1224.9 1912.9 M0 734.8L0 1031 M1228.3 357.6L1125.4 558.9 M1440 2172.6L1440 2539.6 M1130.1 955.4L1440 661.6 M1151.5 0L1440 0 M0 4406.9L0 4800 M0 1382.1L256.5 995.3 M260.3 3859.8L541.8 3922.1 M1216.2 3546.7L1191.2 3780 M612.2 0L869.8 0 M496.3 598.6L581.3 1000.8 M0 4406.9L254 4426.3 M366 1239.7L625.4 1603.7 M869.8 0L1151.5 0 M1440 1003.5L1440 1325.9 M1440 0L1440 259.2 M1216.2 3546.7L1440 3202.3 M1440 4073.1L1440 4491.6 M0 3822.9L224.2 4071.8 M1109.9 1652.8L1224.9 1912.9 M265.3 1584.6L625.4 1603.7 M366 1239.7L265.3 1584.6 M1440 2889.9L1440 3202.3 M1440 3836L1440 4073.1 M1211.6 4495.4L1440 4491.6 M0 1692.7L265.3 1584.6 M653.4 4152.7L846.6 4203.3 M0 0L277.4 0 M1440 259.2L1440 661.6 M1224.9 1912.9L1440 1870 M0 2860.7L0 3173.3 M1440 4491.6L1440 4800 M816.5 1317.1L1095 1280.4 M922.1 2168.9L1092.4 2184.2 M0 3465.4L0 3822.9 M0 1382.1L366 1239.7 M541.8 3922.1L653.4 4152.7 M366 1239.7L510.7 1371.7 M0 0L0 387.3 M0 734.8L259.3 732.8 M510.7 1371.7L625.4 1603.7 M0 4800L366.6 4800 M943.9 967.7L1130.1 955.4 M259.3 732.8L256.5 995.3 M1440 3202.3L1440 3563.1 M1191.2 3780L1440 3836 M0 1031L259.3 732.8 M0 1382.1L0 1692.7 M260.3 3859.8L224.2 4071.8 M1440 1870L1440 2172.6 M868.2 3894.1L1216.2 3546.7 M0 4073.2L224.2 4071.8 M1125.4 558.9L1440 661.6 M256.5 995.3L581.3 1000.8 M1106.6 4080.1L1440 4491.6 M0 4406.9L366.6 4800 M1191.2 3780L1106.6 4080.1 M816.5 1317.1L1130.1 955.4 M259.3 732.8L496.3 598.6 M1213.2 4800L1440 4491.6 M1109.9 1652.8L1440 1630.2 M800.8 1567.1L877.4 1917.1 M366.6 4800L505.3 4800 M1130.1 955.4L1440 1003.5 M0 4073.2L0 4406.9 M625.4 1603.7L800.8 1567.1 M510.7 1371.7L800.8 1567.1 M1125.4 558.9L1130.1 955.4 M1440 2539.6L1440 2889.9 M816.5 1317.1L1109.9 1652.8 M581.3 1000.8L943.9 967.7 M846.6 4203.3L1106.6 4080.1 M1228.3 357.6L1440 259.2 M1095 1280.4L1440 1325.9 M1191.2 3780L1440 3563.1 M1106.6 4080.1L1211.6 4495.4 M868.2 3894.1L846.6 4203.3 M1440 1630.2L1440 1870 M800.8 1567.1L1109.9 1652.8 M1130.1 955.4L1095 1280.4 M1440 3563.1L1440 3836 M816.5 1317.1L800.8 1567.1 M1106.6 4080.1L1440 3836 M1095 1280.4L1109.9 1652.8 M0 2199.3L267.8 2220.9 M653.4 4152.7L868.2 3894.1 M541.8 3922.1L868.2 3894.1 M1109.9 1652.8L1440 1325.9 M0 387.3L0 734.8 M868.2 3894.1L1191.2 3780 M0 3173.3L0 3465.4 M256.5 995.3L510.7 1371.7 M0 1031L256.5 995.3 M510.7 1371.7L816.5 1317.1 M0 2199.3L0 2659 M1440 1325.9L1440 1630.2 M0 2659L0 2860.7 M1440 661.6L1440 1003.5 M884.4 594.3L943.9 967.7 M267.8 2220.9L539.3 2214.6 M0 1382.1L265.3 1584.6 M256.5 995.3L366 1239.7 M0 1031L0 1382.1 M0 1835.3L0 2199.3 M0 3822.9L260.3 3859.8 M260.3 3859.8L653.4 4152.7 M1213.2 4800L1440 4800'
const BG_SEAMS_DESK = 'M902.4 264.4L1228.3 357.6 M869.8 0L902.4 264.4 M943.9 967.7L816.5 1317.1 M1228.3 357.6L1440 0 M1151.5 0L1228.3 357.6 M630.6 1965.8L877.4 1917.1 M902.4 264.4L884.4 594.3 M612.2 0L902.4 264.4 M869.8 0L1228.3 357.6 M581.3 1000.8L510.7 1371.7 M902.4 264.4L1125.4 558.9 M1211.6 4495.4L1213.2 4800'
const BG_VEINS = [
  { id: 'home-vein-1', desk: false, d: 'M1130.1 955.4L816.5 1317.1L1109.9 1652.8L1224.9 1912.9L800.8 1567.1L510.7 1371.7L256.5 995.3L0 1382.1L366 1239.7L625.4 1603.7', nodes: 'M816.5 1317.1h0 M1109.9 1652.8h0 M1224.9 1912.9h0 M800.8 1567.1h0 M510.7 1371.7h0 M256.5 995.3h0 M0 1382.1h0 M366 1239.7h0' },
  { id: 'home-vein-2', desk: false, d: 'M1440 4073.1L1440 4491.6L1106.6 4080.1L1440 3836L1440 3563.1L1440 3202.3L1216.2 3546.7L868.2 3894.1L653.4 4152.7L260.3 3859.8', nodes: 'M1440 4491.6h0 M1106.6 4080.1h0 M1440 3836h0 M1440 3563.1h0 M1440 3202.3h0 M1216.2 3546.7h0 M868.2 3894.1h0 M653.4 4152.7h0' },
  { id: 'home-vein-3', desk: true, d: 'M869.8 0L1228.3 357.6L1440 0L1440 259.2L1440 661.6L1125.4 558.9L902.4 264.4L884.4 594.3L496.3 598.6L581.3 1000.8', nodes: 'M1228.3 357.6h0 M1440 0h0 M1440 259.2h0 M1440 661.6h0 M1125.4 558.9h0 M902.4 264.4h0 M884.4 594.3h0 M496.3 598.6h0' },
  { id: 'home-vein-4', desk: false, d: 'M0 4800L366.6 4800L0 4406.9L0 4073.2L0 3822.9L0 3465.4L0 3173.3L0 2860.7L0 2659L0 2199.3', nodes: 'M366.6 4800h0 M0 4406.9h0 M0 4073.2h0 M0 3822.9h0 M0 3465.4h0 M0 3173.3h0 M0 2860.7h0 M0 2659h0' },
]
const BG_GLOW_NODES = 'M510.7 1371.7h0 M1440 3202.3h0 M1125.4 558.9h0'
const BG_RIDGES = ['M0 1692.7L0 1835.3', 'M922.1 2168.9L1092.4 2184.2', 'M1213.2 4800L1440 4800']
const NS = { vectorEffect: 'non-scaling-stroke' } as CSSProperties

function ObsidianBackdrop() {
  return (
    <div className="home-bg" aria-hidden="true">
      <svg className="home-bg-art" viewBox="0 0 1440 4800" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="home-bg-l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".075" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <linearGradient id="home-bg-g" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F1D77A" stopOpacity=".07" /><stop offset="1" stopColor="#F1D77A" stopOpacity="0" /></linearGradient>
          <linearGradient id="home-bg-s" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity=".38" /><stop offset="1" stopColor="#000" stopOpacity=".04" /></linearGradient>
          <linearGradient id="home-bg-t" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#000" stopOpacity=".30" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
          <linearGradient id="home-bg-vein" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F1D77A" /><stop offset="1" stopColor="#FFF2B8" /></linearGradient>
        </defs>
        {BG_FACES.map(([t, d], i) => <path key={i} d={d} fillRule="evenodd" fill={`url(#home-bg-${t})`} />)}
        <g fill="none" stroke="#DCE3F1" strokeOpacity=".09" strokeWidth="1">
          <path d={BG_SEAMS} style={NS} />
          <path className="home-bg-desk" d={BG_SEAMS_DESK} style={NS} />
        </g>
        {BG_VEINS.map(v => (
          <g key={v.id} id={v.id} className={v.desk ? 'home-bg-desk' : undefined} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* bloom: 7px #D4AF37 at 28% (core), blurred by stacking two wider, fainter passes — no SVG filter */}
            <path d={v.d} stroke="#D4AF37" strokeOpacity=".06" strokeWidth="13" style={NS} />
            <path d={v.d} stroke="#D4AF37" strokeOpacity=".09" strokeWidth="10" style={NS} />
            <path d={v.d} stroke="#D4AF37" strokeOpacity=".16" strokeWidth="7" style={NS} />
            <path d={v.d} stroke="url(#home-bg-vein)" strokeWidth="1.4" style={NS} />
            <path d={v.nodes} stroke="#FFF2B8" strokeWidth="2" style={NS} />
          </g>
        ))}
        <g fill="none" strokeLinecap="round">
          <path d={BG_GLOW_NODES} stroke="#FFF2B8" strokeOpacity=".12" strokeWidth="16" style={NS} />
          <path d={BG_GLOW_NODES} stroke="#FFF2B8" strokeOpacity=".3" strokeWidth="7" style={NS} />
          <path d={BG_GLOW_NODES} stroke="#FFF2B8" strokeWidth="2.5" style={NS} />
          {BG_RIDGES.map((d, i) => <path key={i} d={d} stroke="#fff" strokeOpacity={[.22, .18, .16][i]} strokeWidth="1.5" style={NS} />)}
        </g>
      </svg>
      {/* grain in its own un-stretched SVG (user-space px), so the noise stays round at every width */}
      <svg className="home-bg-grain" width="100%" height="100%" focusable="false">
        <filter id="home-bg-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves={3} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#home-bg-noise)" />
      </svg>
      <div className="home-bg-vignette" />
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  /* Mobile (< lg): 2-column hero (headline left, small 3D logo right); the deck is a normal section
     AFTER the hero. Desktop (≥ lg): side-by-side hero unchanged. isLg is seeded synchronously
     (useMediaQuery) → correct on first paint, no flash/CLS. */
  const isLg = useMediaQuery('(min-width: 1024px)')
  /* Phone (< md, Oct 18 ruling): H1 full width on its own row, then sub-line left + 3D logo right.
     md → lg keeps the Sep 29 arrangement (headline left, logo right). Seeded synchronously → no CLS. */
  const isMd = useMediaQuery('(min-width: 768px)')
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

  /* ── Shared hero pieces (rendered in the desktop OR mobile arrangement below; one Interlock3D
       mount per active breakpoint). ─────────────────────────────────────────────────────────── */
  const heroBadge = (
    <motion.div variants={fadeUp}>
      <span
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
        style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)', color: 'var(--gold)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse-live" style={{ background: 'var(--live-green)' }} />
        For Vendors, SMEs &amp; Manufacturers
      </span>
    </motion.div>
  )

  const heroHeadline = (
    <h1 className="font-display font-semibold leading-[1.06] tracking-tight" style={{ color: 'var(--cream)' }}>
      {HEADLINE.map((line, i) => (
        <motion.span
          key={line.text}
          className="block overflow-hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, delay: 0.15 + i * 0.11, ease }}
        >
          {/* mobile −20% (48px → 2.4rem/38.4px); sm −20% (60→48); desktop lg:text-7xl unchanged.
              whitespace-nowrap keeps each line 1 line in BOTH the fallback + display font (no wrap
              reflow on font-swap → no CLS in the narrow mobile column); lines already fit unwrapped. */}
          <span
            className={[
              'block whitespace-nowrap text-[2.4rem] sm:text-5xl lg:text-7xl',
              line.gold ? 'text-transparent bg-clip-text bg-gold-gradient' : '',
            ].join(' ')}
          >
            {line.text}
          </span>
        </motion.span>
      ))}
    </h1>
  )

  const heroLead = (
    /* min-h reserves the 4-line height on mobile so the body-font swap (3↔4 lines) can't change the
       hero's content height and re-centre it (items-center) → no CLS. Desktop (lg) unchanged. */
    <motion.p variants={fadeUp} className="text-base sm:text-lg leading-relaxed max-w-md min-h-[104px] sm:min-h-0" style={{ color: 'var(--slate)' }}>
      Blueprints, a daily dashboard, suppliers and automations that all talk to each other.
    </motion.p>
  )

  const heroCtas = (
    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
      <MagneticButton onClick={() => { document.getElementById('ventures-deck')?.scrollIntoView({ behavior: 'smooth' }) }}>
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
  )

  const logo3D = (fallbackSize: number) => (
    <>
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, rgba(212,168,67,0.10) 0%, transparent 65%)', filter: 'blur(20px)' }}
      />
      <Suspense fallback={<div className="flex items-center justify-center h-full"><TheInterlockLogo size={fallbackSize} className="opacity-70 animate-float" /></div>}>
        <Interlock3D mouseRef={mouseRef} />
      </Suspense>
    </>
  )

  /* Mobile (< lg): same glow ring, but the 3D is DEFERRED — static SVG paints first,
     R3F loads after first paint/idle/in-view (DeferredLogo). Desktop keeps logo3D above. */
  const logo3DMobile = (fallbackSize: number) => (
    <>
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, rgba(212,168,67,0.10) 0%, transparent 65%)', filter: 'blur(20px)' }}
      />
      <DeferredLogo size={fallbackSize} mouseRef={mouseRef} />
    </>
  )

  /* Small 3D logo tile (< lg): beside the headline on tablet, beside the lead on phone. */
  const logoSmall = (
    <motion.div
      className="relative flex-none overflow-hidden"
      /* ~135×190 at 390, scales down proportionally at 360 (35vw, clamped). The Interlock3D
         canvas fills this smaller container (its vertical FOV is fixed) — component untouched. */
      style={{ width: 'clamp(118px, 35vw, 140px)', aspectRatio: '135 / 190' }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.2, ease }}
    >
      {logo3DMobile(120)}
    </motion.div>
  )

  return (
    /* Homepage-only lighter page navy: --navy is overridden here, not globally, so the
       hero fade and the deck section follow it while other routes keep #0A1628.
       .home-root: position:relative + contain:paint for the obsidian backdrop (z 0) behind
       .home-content (z 1). Sections with their own backgrounds (deck, cards) cover it as before. */
    <div className="home-root" style={{ '--navy': '#111E3A', background: 'var(--navy)' } as CSSProperties}>
      <ObsidianBackdrop />
      <div className="home-content">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      {/* < lg: content-height, no vertical centring (removes the tall empty bands). ≥ lg: unchanged. */}
      <section className="relative overflow-hidden lg:flex lg:items-center lg:min-h-screen">
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

        {/* < lg: 48px below the fixed header (main already clears the header + safe area) + ~48px below the trust row. ≥ lg: py-0. */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 w-full pt-12 pb-12 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 lg:items-center lg:min-h-[calc(100vh-64px)]">

            {isLg ? (
              <>
                {/* Text column — left (desktop, unchanged) */}
                <motion.div className="relative z-10 flex flex-col gap-8" initial="hidden" animate="show" variants={staggerContainer}>
                  {heroBadge}
                  {heroHeadline}
                  {heroLead}
                  {heroCtas}
                </motion.div>

                {/* 3D column — right (desktop, unchanged: big h-580 container) */}
                <motion.div
                  className="relative h-[580px]"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.2, ease }}
                >
                  {logo3D(140)}
                </motion.div>
              </>
            ) : (
              isMd ? (
                /* Tablet (md → lg, unchanged): badge on top; headline (left) + small 3D logo (right) as a row,
                   vertically centred; lead + buttons full width below. */
                <motion.div className="relative z-10 flex flex-col gap-6" initial="hidden" animate="show" variants={staggerContainer}>
                  {heroBadge}
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex-1 min-w-0">{heroHeadline}</div>
                    {logoSmall}
                  </div>
                  {heroLead}
                  {heroCtas}
                </motion.div>
              ) : (
                /* Phone (< md, Oct 18): badge + full-width headline; then lead (left) + the same small 3D
                   logo (right), vertically centred to the lead; buttons below. */
                <motion.div className="relative z-10 flex flex-col gap-6" initial="hidden" animate="show" variants={staggerContainer}>
                  {heroBadge}
                  {heroHeadline}
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex-1 min-w-0">{heroLead}</div>
                    {logoSmall}
                  </div>
                  {heroCtas}
                </motion.div>
              )
            )}
          </div>
        </div>

        {/* Gradient fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--navy))' }}
        />

        {/* Scroll cue is for the tall desktop hero; on the short mobile hero it would sit in the gap. */}
        {isLg && <ScrollCue />}
      </section>

      {/* ══════════════════════════════════════════════════════════
          PRODUCT DECK — The Lintejas brands. A normal full-width section directly
          AFTER the hero at every breakpoint (eyebrow + navy background), one instance.
      ══════════════════════════════════════════════════════════ */}
      {/* compact (< lg): content-height section (no full-vh centring band) so the eyebrow sits right
          after the hero. ≥ lg: full-vh centred deck, unchanged. */}
      <ProductDeck compact={!isLg} />

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
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className={`group relative rounded-2xl p-7 border transition-all duration-500 cursor-default ${VALUE_THEMES[i].cls}`}
              whileHover={{
                y: -4,
                transition: { duration: 0.3, ease },
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.25)'
                ;(e.currentTarget as HTMLElement).style.boxShadow  = '0 8px 40px rgba(0,0,0,0.3), 0 0 24px rgba(212,168,67,0.06)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = ''   // back to the card theme's own border
                ;(e.currentTarget as HTMLElement).style.boxShadow  = ''
              }}
            >
              {/* Top shine */}
              <div
                className="absolute inset-x-0 top-0 h-px rounded-full opacity-60"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.3), transparent)' }}
              />

              <div
                className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'rgba(212,168,67,0.08)',
                  border:     `1px solid ${VALUE_THEMES[i].accent}55`,
                }}
              >
                <Icon size={20} style={{ color: VALUE_THEMES[i].accent }} />
              </div>

              <h3 className="relative z-10 font-display font-semibold text-lg mb-3" style={{ color: 'var(--cream)' }}>
                {title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed" style={{ color: '#b4bfd4' }}>
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
          FAQ
      ══════════════════════════════════════════════════════════ */}
      <section id="faq" className="scroll-mt-24 max-w-[1280px] mx-auto px-6 lg:px-8 pb-28">
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
                {WHATSAPP_NUMBER && (
                  <a
                    href={whatsappHref()}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                    style={{ background: 'rgba(37,211,102,0.10)', border: '1px solid rgba(37,211,102,0.30)', color: '#25D366' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.18)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.10)' }}
                  >
                    <span>💬</span> Chat on WhatsApp
                  </a>
                )}
              </div>

              <div className="space-y-2 pt-5" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--gold)' }}>Quick links</p>
                {[
                  { label: 'Visit SkillVue', href: 'https://skillvue.io' },
                  { label: 'Try Demo Account', href: 'https://skillvue.io/onboarding' },
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
          TRUST & SECURITY
      ══════════════════════════════════════════════════════════ */}
      <section id="trust" className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-28">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Trust &amp; Security</span>
          <div className="h-px flex-1" style={{ background: 'var(--glass-border)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease }}
          className="mb-12 max-w-2xl"
        >
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mb-4" style={{ color: 'var(--cream)' }}>
            Your business data, guarded.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--slate)' }}>
            Every Lintejas product — NegosyoPlans, Matthew System, Matthew Lite — runs on the same security foundation.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {TRUST.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="trust-card relative rounded-2xl p-6 border h-full"
              style={{ backgroundColor: '#101d38', borderColor: 'rgba(201,168,76,.22)' }}
            >
              <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none"><TrustArt i={i} /></div>
              <div
                className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.25)' }}
              >
                <Icon size={20} strokeWidth={1.6} style={{ color: 'var(--gold)' }} />
              </div>
              <h3 className="relative z-10 font-display font-semibold text-lg mb-3" style={{ color: 'var(--cream)' }}>
                {title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed" style={{ color: '#b4bfd4' }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8">
          <Link
            to="/security"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 hover:text-[var(--cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-md"
            style={{ color: 'var(--gold)', minHeight: 44 }}
          >
            Read how we protect your data →
          </Link>
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
            Build your business
            <span className="block text-transparent bg-clip-text bg-gold-gradient">with us</span>
          </h2>

          <p className="text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: 'var(--slate)' }}>
            Whether you're starting out or already running, there's a Lintejas tool for it. Explore the
            products, or get in touch and we'll point you to the right one.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton onClick={() => navigate('/contact')}>
              Get in touch <ArrowRight size={15} />
            </MagneticButton>
            <button
              onClick={() => { document.getElementById('ventures-deck')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: 'var(--slate)' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--slate)')}
            >
              See the products →
            </button>
          </div>
        </motion.div>
      </section>

      </div>
    </div>
  )
}
