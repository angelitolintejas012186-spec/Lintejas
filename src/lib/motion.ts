import type { Variants, Transition } from 'framer-motion'

/* ── Easings ──────────────────────────────────────────────────── */
export const ease         = [0.16, 1, 0.3, 1]    as const  // weighted decelerate — the "expensive" feel
export const easeInOut    = [0.76, 0, 0.24, 1]   as const
export const easeOut      = [0.0, 0.0, 0.2, 1]   as const
export const spring: Transition = { type: 'spring', stiffness: 120, damping: 20, mass: 1 }

/* ── Shared transitions ───────────────────────────────────────── */
export const t = {
  fast:   { duration: 0.4, ease },
  base:   { duration: 0.7, ease },
  slow:   { duration: 1.0, ease },
  slower: { duration: 1.4, ease },
} satisfies Record<string, Transition>

/* ── Fade up — the universal reveal ──────────────────────────── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: t.base },
}

/* ── Mask reveal — text sliding up from clip ─────────────────── */
export const maskReveal: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 1 },
  show:   { clipPath: 'inset(0 0 0% 0)',   opacity: 1, transition: { duration: 0.9, ease } },
}

/* ── Scale in ────────────────────────────────────────────────── */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.90 },
  show:   { opacity: 1, scale: 1,    transition: t.base },
}

/* ── Stagger container ───────────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

/* ── Stagger item ────────────────────────────────────────────── */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0,  transition: t.base },
}

/* ── Character stagger (for per-letter headline animation) ───── */
export const charContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
}

export const charItem: Variants = {
  hidden: { opacity: 0, y: '100%' },
  show:   { opacity: 1, y: '0%', transition: { duration: 0.6, ease } },
}

/* ── Slide in from left / right ──────────────────────────────── */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0,   transition: t.slow },
}
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0,   transition: t.slow },
}
