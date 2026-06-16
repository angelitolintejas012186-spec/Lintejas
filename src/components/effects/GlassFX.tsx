/**
 * GlassFX — wrapper that adds living glass surface effects to new elements.
 *
 * For EXISTING glass elements (TiltCard etc.) use the `.glass-glow` CSS class instead —
 * it applies the breathing box-shadow without changing DOM structure.
 *
 * This component is for NEW glass panels where you control the markup.
 * It adds:
 *   - diagonal light sheen (static gradient that shifts on hover)
 *   - breathing edge glow (box-shadow pulse)
 *   - idle float animation (subtle Y drift, disabled when reduced-motion)
 *
 * Usage:
 *   <GlassFX float glow sheen className="rounded-2xl border" style={...}>
 *     <YourContent />
 *   </GlassFX>
 */
import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children:  ReactNode
  className?: string
  style?:     React.CSSProperties
  float?:     boolean   // idle Y float (default true)
  sheen?:     boolean   // diagonal light sheen (default true)
  glow?:      boolean   // breathing rim glow (default true)
}

export default function GlassFX({
  children,
  className = '',
  style,
  float = true,
  sheen = true,
  glow  = true,
}: Props) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      className={['relative overflow-hidden', className].join(' ')}
      style={style}
      animate={float ? { y: [0, -3, -1, 0] } : undefined}
      transition={float
        ? { duration: 7, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', times: [0, 0.45, 0.7, 1] }
        : undefined
      }
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}

      {/* Diagonal sheen — shifts on hover */}
      {sheen && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-all duration-700"
          style={{
            background: hov
              ? 'linear-gradient(135deg, rgba(232,199,102,0.09) 0%, rgba(232,199,102,0.03) 35%, transparent 65%)'
              : 'linear-gradient(135deg, rgba(232,199,102,0.045) 0%, transparent 55%)',
          }}
        />
      )}

      {/* Breathing edge glow */}
      {glow && !hov && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ animation: 'glass-glow-breathe 5s ease-in-out infinite' }}
        />
      )}
      {glow && hov && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: 'inset 0 0 22px rgba(212,168,67,0.07)' }}
        />
      )}
    </motion.div>
  )
}
