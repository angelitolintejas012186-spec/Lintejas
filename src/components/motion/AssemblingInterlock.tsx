/**
 * AssemblingInterlock — decorative watermark/divider only.
 * NOT a replacement for TheInterlockLogo.
 *
 * On mount: 5 SVG fragments scatter in from different directions,
 * snap together with a gold light flash, then settle into a slow
 * breathing idle.  Scroll-linked opacity/parallax when scroll=true.
 */
import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '../../lib/useReducedMotion'

/* ── Fragment definitions ──────────────────────────────────────── */
interface Frag {
  id:      string
  from:    Record<string, number>   // initial scattered state
  delay:   number                   // stagger offset in seconds
  spring:  { stiffness: number; damping: number; mass: number }
  finalOp: number                   // assembled opacity of the path itself
  isLast?: boolean                  // triggers flash on completion
  content: React.ReactNode          // SVG path/rect inside viewBox 0 0 80 80
}

const FRAGS: Frag[] = [
  {
    id:      'left-bracket',
    from:    { x: -65, y: -24, rotate: -15, opacity: 0, scale: 0.80 },
    delay:   0.04,
    spring:  { stiffness: 185, damping: 28, mass: 1.1 },
    finalOp: 1,
    content: <path d="M10 14 L10 66 L32 66 L32 57 L19 57 L19 23 L32 23 L32 14 Z" fill="url(#ail-gold-a)" />,
  },
  {
    id:      'right-bracket',
    from:    { x: 65, y: 24, rotate: 15, opacity: 0, scale: 0.80 },
    delay:   0.14,
    spring:  { stiffness: 185, damping: 28, mass: 1.1 },
    finalOp: 0.80,
    content: <path d="M70 66 L70 14 L48 14 L48 23 L61 23 L61 57 L48 57 L48 66 Z" fill="url(#ail-gold-b)" />,
  },
  {
    id:      'top-bar',
    from:    { x: 0, y: -52, rotate: 0, opacity: 0, scale: 0.86 },
    delay:   0.24,
    spring:  { stiffness: 220, damping: 22, mass: 0.85 },
    finalOp: 0.30,
    content: <rect x="19" y="14" width="42" height="9" fill="url(#ail-gold-a)" rx={1} />,
  },
  {
    id:      'inner-highlight',
    from:    { x: -36, y: 0, rotate: 0, opacity: 0, scale: 0.86 },
    delay:   0.26,
    spring:  { stiffness: 200, damping: 26, mass: 0.9 },
    finalOp: 0.15,
    content: <rect x="19" y="23" width="9" height="34" fill="url(#ail-gold-b)" />,
  },
  {
    id:      'centre-square',
    from:    { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0 },
    delay:   0.38,
    spring:  { stiffness: 300, damping: 17, mass: 0.65 },
    finalOp: 0.95,
    isLast:  true,
    content: <rect x="32" y="32" width="16" height="16" fill="url(#ail-gold-a)" />,
  },
]

/* ── Props ─────────────────────────────────────────────────────── */
interface Props {
  size?:    number    // rendered size in px (default 200)
  delay?:   number    // extra lead-in delay in seconds (default 0)
  scroll?:  boolean   // fade/parallax on scroll past hero
  className?: string
}

/* ── Component ─────────────────────────────────────────────────── */
export default function AssemblingInterlock({
  size    = 200,
  delay   = 0,
  scroll  = false,
  className = '',
}: Props) {
  const reduced            = useReducedMotion()
  const [flashed, setFlash] = useState(false)

  /* Scroll-linked opacity + slight Y shift */
  const { scrollY }   = useScroll()
  const scrollOpacity = useTransform(scrollY, [60, 420], [1, 0])
  const scrollY2      = useTransform(scrollY, [0, 500], [0, -28])

  /* Static fallback */
  if (reduced) {
    return (
      <div className={className} style={{ width: size, height: size }}>
        <Defs />
        <svg viewBox="0 0 80 80" width={size} height={size}>
          <path d="M10 14 L10 66 L32 66 L32 57 L19 57 L19 23 L32 23 L32 14 Z" fill="url(#ail-gold-a)" />
          <path d="M70 66 L70 14 L48 14 L48 23 L61 23 L61 57 L48 57 L48 66 Z" fill="url(#ail-gold-b)" opacity={0.80} />
          <rect x="19" y="14" width="42" height="9" fill="url(#ail-gold-a)" opacity={0.30} rx={1} />
          <rect x="19" y="23" width="9" height="34" fill="url(#ail-gold-b)" opacity={0.15} />
          <rect x="32" y="32" width="16" height="16" fill="url(#ail-gold-a)" opacity={0.95} />
        </svg>
      </div>
    )
  }

  return (
    /* Scroll wrapper — only applied when scroll=true */
    <motion.div
      className={className}
      style={scroll ? { opacity: scrollOpacity, y: scrollY2, width: size, height: size } : { width: size, height: size }}
    >
      {/* Breathing idle on the assembled mark */}
      <motion.div
        style={{ position: 'relative', width: size, height: size }}
        animate={{ scale: [1, 1.013, 1] }}
        transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity }}
      >
        {/* Shared gradient defs — referenced by all fragment SVGs in same document */}
        <Defs />

        {/* Gold flash overlay — fires once when last fragment lands */}
        <motion.div
          aria-hidden="true"
          style={{
            position:       'absolute',
            inset:          0,
            borderRadius:   '50%',
            background:     'radial-gradient(circle at center, rgba(232,199,102,0.72) 0%, rgba(212,168,67,0) 65%)',
            pointerEvents:  'none',
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={flashed ? { opacity: [0, 0.75, 0], scale: [0.4, 1.2, 1.6] } : { opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Fragments */}
        {FRAGS.map(frag => (
          <motion.div
            key={frag.id}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, opacity: frag.finalOp }}
            initial={{ ...frag.from }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: frag.finalOp, scale: 1 }}
            transition={{
              delay:     delay + frag.delay,
              type:      'spring',
              ...frag.spring,
            }}
            onAnimationComplete={
              frag.isLast ? () => setFlash(true) : undefined
            }
          >
            <svg
              viewBox="0 0 80 80"
              width={size}
              height={size}
              style={{ overflow: 'visible' }}
            >
              {frag.content}
            </svg>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

/* ── Shared gradient defs (hidden, referenced by id in same document) */
function Defs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="ail-gold-a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#F0D882" />
          <stop offset="50%"  stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#8A6A00" />
        </linearGradient>
        <linearGradient id="ail-gold-b" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="#E8C96C" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>
    </svg>
  )
}
