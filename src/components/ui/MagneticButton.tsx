import { useState, useRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  strength?: number     // 0–1, how far button follows cursor
  className?: string
  onClick?: () => void
  href?: string
}

export default function MagneticButton({
  children,
  strength = 0.32,
  className = '',
  onClick,
  href,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    setPos({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    })
  }

  function handleMouseLeave() {
    setPos({ x: 0, y: 0 })
    setHovered(false)
  }

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, mass: 0.6 }}
      className="inline-block"
    >
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.96 }}
        className={[
          'relative inline-flex items-center gap-2.5 px-7 py-3.5',
          'rounded-xl font-medium text-sm tracking-wide',
          'transition-shadow duration-300 outline-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]',
          className,
        ].join(' ')}
        style={{
          background: 'linear-gradient(135deg, #E8C766 0%, #D4A843 55%, #9A7A2E 100%)',
          color: '#0A1628',
          boxShadow: hovered
            ? '0 0 32px rgba(212,168,67,0.45), 0 8px 24px rgba(0,0,0,0.3)'
            : '0 0 0px rgba(212,168,67,0), 0 4px 16px rgba(0,0,0,0.2)',
        }}
        {...(rest as object)}
      >
        {/* Inner highlight shimmer */}
        <span
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)',
          }}
        />
        <span className="relative">{children}</span>
      </motion.button>
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} className="inline-block" tabIndex={-1}>
        {inner}
      </a>
    )
  }
  return inner
}
