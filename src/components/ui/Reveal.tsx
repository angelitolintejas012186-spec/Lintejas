import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, maskReveal, staggerContainer, ease } from '../../lib/motion'

type Variant = 'fade-up' | 'mask' | 'stagger'

interface Props {
  children: ReactNode
  variant?: Variant
  delay?: number
  className?: string
  once?: boolean
  margin?: string
}

const variants = {
  'fade-up': fadeUp,
  'mask':    maskReveal,
  'stagger': staggerContainer,
}

export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
  once = true,
  margin = '-80px',
}: Props) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin }}
      variants={variants[variant]}
      transition={delay ? { delay, duration: 0.8, ease } : undefined}
    >
      {children}
    </motion.div>
  )
}
