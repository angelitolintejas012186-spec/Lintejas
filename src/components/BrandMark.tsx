import { motion } from 'framer-motion'
import TheInterlockLogo from './TheInterlockLogo'

/** Canonical public-site logo mark — same size, shadow, and hover animation everywhere. */
export default function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <motion.span
      whileHover={{ rotate: [0, -5, 5, -2, 0], scale: 1.06 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex-shrink-0 block"
      style={{ filter: 'drop-shadow(0 0 10px rgba(212,168,67,0.30))' }}
    >
      <TheInterlockLogo size={size} />
    </motion.span>
  )
}
