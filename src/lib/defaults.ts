import type { SiteConfig, ThemeVars } from './types'

export const DEFAULT_THEME_VARS: ThemeVars = {
  '--bg-primary':    '#0B1F33',
  '--bg-secondary':  '#0F2640',
  '--bg-card':       '#132D4A',
  '--accent':        '#C9A84C',
  '--accent-light':  '#E8C96C',
  '--text-primary':  '#F0EDE8',
  '--text-secondary':'#9BAAB8',
  '--text-muted':    '#5A7490',
  '--border':        'rgba(201,168,76,0.15)',
}

export const DEFAULT_CONFIG: SiteConfig = {
  branding: {
    logo: {
      src: null,
      x: 0, y: 0,
      align: 'left',
      size: 48,
      radius: 10,
      brightness: 1.0,
      tint: null,
      glow: { color: '#C9A84C', blur: 0, spread: 0, intensity: 0 },
      animation: 'none',
      animationSpeed: 3,
    },
    brandName: {
      mode: 'text',
      text: 'Lintejas',
      suffix: 'jas',
      font: 'Fraunces',
      size: 28,
      weight: 600,
      letterSpacing: 0.5,
      color: '#F0EDE8',
      gradient: null,
      imageSrc: null,
      imageHeight: 32,
      x: 0, y: 0,
      align: 'left',
      brightness: 1.0,
      glow: { color: '#C9A84C', blur: 0, spread: 0, intensity: 0 },
      animation: 'none',
      animationSpeed: 3,
    },
  },
  theme: {
    sourceImage: null,
    vars: DEFAULT_THEME_VARS,
    previous: null,
    suggestedFont: null,
  },
  plugins: [],
}
