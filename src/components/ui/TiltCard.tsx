import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
  maxTilt?: number   // degrees
  glowOnHover?: boolean
  style?: React.CSSProperties
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  glowOnHover = true,
  style,
}: Props) {
  const ref   = useRef<HTMLDivElement>(null)
  const [tilt, setTilt]   = useState({ x: 0, y: 0 })
  const [glow, setGlow]   = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el   = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px   = (e.clientX - rect.left) / rect.width   // 0–1
    const py   = (e.clientY - rect.top)  / rect.height  // 0–1

    setTilt({
      x:  (py - 0.5) * -maxTilt,   // tilt up/down
      y:  (px - 0.5) *  maxTilt,   // tilt left/right
    })
    setGlow({ x: px * 100, y: py * 100 })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setGlow({ x: 50, y: 50 })
    setHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale:   hovered ? 1.015 : 1,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.7 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective:    '1200px',
        ...style,
      }}
      className={['relative overflow-hidden glass-glow', className].join(' ')}
    >
      {/* Rim-light glow that follows cursor */}
      {glowOnHover && hovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: 0.12,
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(232,199,102,0.9), transparent 60%)`,
          }}
        />
      )}

      {/* Top-edge inner shine */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none rounded-t-[inherit]"
        style={{
          background: hovered
            ? 'linear-gradient(90deg, transparent, rgba(232,199,102,0.35), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(232,199,102,0.12), transparent)',
          transition: 'background 0.4s ease',
        }}
      />

      {children}
    </motion.div>
  )
}
