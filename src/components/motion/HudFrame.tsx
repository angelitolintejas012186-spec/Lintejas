/**
 * HudFrame — wraps any content with futuristic HUD corner brackets.
 * On viewport entry: corners draw in with pathLength animation, then
 * an optional scan line sweeps once.  Optional readout chips at corners.
 *
 * Reduced-motion: static corner brackets, no scan line, no animation.
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '../../lib/useReducedMotion'

/* ── Types ─────────────────────────────────────────────────────── */
export interface Readout {
  position: 'tl' | 'tr' | 'bl' | 'br'
  label:    string
  value:    string
}

interface Props {
  children:     React.ReactNode
  className?:   string
  style?:       React.CSSProperties
  cornerSize?:  number       // arm length of each L-bracket in px (default 18)
  strokeWidth?: number       // bracket stroke width (default 1.2)
  color?:       string       // bracket color (default gold)
  delay?:       number       // entry animation delay in seconds (default 0)
  scanline?:    boolean      // enable one-shot + looping scan line
  readouts?:    Readout[]    // data chips at corners (max 4)
}

/* ── Corner path data ─────────────────────────────────────────── */
const CORNER_PATHS = {
  tl: (cs: number) => `M ${cs} 0 L 0 0 L 0 ${cs}`,
  tr: (cs: number) => `M 0 0 L ${cs} 0 L ${cs} ${cs}`,
  bl: (cs: number) => `M 0 0 L 0 ${cs} L ${cs} ${cs}`,
  br: (cs: number) => `M ${cs} 0 L ${cs} ${cs} L 0 ${cs}`,
}

const CORNER_STYLE: Record<string, React.CSSProperties> = {
  tl: { top:    0, left:  0 },
  tr: { top:    0, right: 0 },
  bl: { bottom: 0, left:  0 },
  br: { bottom: 0, right: 0 },
}

const READOUT_STYLE: Record<string, React.CSSProperties> = {
  tl: { top:    '6px', left:    '26px' },
  tr: { top:    '6px', right:   '26px' },
  bl: { bottom: '6px', left:    '26px' },
  br: { bottom: '6px', right:   '26px' },
}

/* ── Component ─────────────────────────────────────────────────── */
export default function HudFrame({
  children,
  className   = '',
  style,
  cornerSize  = 18,
  strokeWidth = 1.2,
  color       = 'rgba(212,168,67,0.55)',
  delay       = 0,
  scanline    = false,
  readouts    = [],
}: Props) {
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()

  const cs = cornerSize
  const corners = Object.keys(CORNER_PATHS) as Array<keyof typeof CORNER_PATHS>

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', ...style }}
    >
      {children}

      {/* ── Corner brackets ──────────────────────────────────── */}
      {corners.map((pos, idx) => (
        <svg
          key={pos}
          aria-hidden="true"
          width={cs}
          height={cs}
          viewBox={`0 0 ${cs} ${cs}`}
          style={{
            position:      'absolute',
            pointerEvents: 'none',
            overflow:      'visible',
            ...CORNER_STYLE[pos],
          }}
        >
          <motion.path
            d={CORNER_PATHS[pos](cs)}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
            animate={
              reduced
                ? { pathLength: 1, opacity: 0.6 }
                : inView
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
            }
            transition={{
              delay:      delay + idx * 0.06,
              duration:   reduced ? 0 : 0.55,
              ease:       [0.16, 1, 0.3, 1],
            }}
          />
        </svg>
      ))}

      {/* ── Scan line ────────────────────────────────────────── */}
      {scanline && !reduced && (
        <motion.div
          aria-hidden="true"
          style={{
            position:    'absolute',
            left:        0,
            right:       0,
            height:      '1px',
            background:  'linear-gradient(90deg, transparent, rgba(212,168,67,0.12) 30%, rgba(232,199,102,0.22) 50%, rgba(212,168,67,0.12) 70%, transparent)',
            pointerEvents: 'none',
          }}
          initial={{ top: '-1px', opacity: 0 }}
          animate={inView ? {
            top: ['0%', '100%', '100%'],
            opacity: [0, 0.9, 0],
          } : {}}
          transition={{
            delay,
            duration:  2.4,
            times:     [0, 0.82, 1],
            ease:      'linear',
            repeat:    Infinity,
            repeatDelay: 6,
          }}
        />
      )}

      {/* ── Readout chips ────────────────────────────────────── */}
      {readouts.map(({ position, label, value }) => (
        <motion.div
          key={position}
          aria-hidden="true"
          style={{
            position:   'absolute',
            pointerEvents: 'none',
            fontFamily: 'monospace',
            fontSize:   '9px',
            letterSpacing: '0.08em',
            lineHeight: 1,
            ...READOUT_STYLE[position],
          }}
          initial={reduced ? { opacity: 0.5 } : { opacity: 0 }}
          animate={
            reduced
              ? { opacity: 0.5 }
              : inView
                ? { opacity: 0.6 }
                : { opacity: 0 }
          }
          transition={{ delay: delay + 0.45, duration: reduced ? 0 : 0.4 }}
        >
          <span style={{ color: 'rgba(212,168,67,0.55)' }}>{label}</span>
          <span style={{ color: 'rgba(244,241,234,0.55)', marginLeft: '4px' }}>{value}</span>
        </motion.div>
      ))}
    </div>
  )
}
