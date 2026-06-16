export type PluginCategory = 'marketing' | 'content' | 'analytics' | 'integration' | 'utility'
export type MountPoint = 'nav' | 'home-section' | 'footer' | 'page'
export type FieldType = 'text' | 'email' | 'url' | 'textarea' | 'color' | 'select' | 'number' | 'toggle'

export interface FieldDef {
  type: FieldType
  label: string
  required?: boolean
  options?: string[]
  placeholder?: string
  defaultValue?: string | boolean | number
}

export interface PluginManifest {
  id: string
  name: string
  description: string
  version: string
  category: PluginCategory
  icon: string
  settingsSchema?: Record<string, FieldDef>
  mountPoint?: MountPoint
}

export interface PluginState {
  id: string
  installed: boolean
  enabled: boolean
  settings: Record<string, unknown>
}

export type LogoAnimation = 'none' | 'fade' | 'float' | 'pulse' | 'shimmer'
export type BrandNameMode = 'text' | 'image'

export interface GlowConfig {
  color: string
  blur: number
  spread: number
  intensity: number
}

export interface LogoConfig {
  src: string | null
  x: number
  y: number
  align: 'left' | 'center' | 'right'
  size: number
  radius: number
  brightness: number
  tint: string | null
  glow: GlowConfig
  animation: LogoAnimation
  animationSpeed: number
}

export interface BrandNameConfig {
  mode: BrandNameMode
  text: string
  suffix: string
  font: string
  size: number
  weight: number
  letterSpacing: number
  color: string
  gradient: string | null
  imageSrc: string | null
  imageHeight: number
  x: number
  y: number
  align: 'left' | 'center' | 'right'
  brightness: number
  glow: GlowConfig
  animation: LogoAnimation
  animationSpeed: number
}

export interface BrandingConfig {
  logo: LogoConfig
  brandName: BrandNameConfig
}

export interface ThemeVars {
  '--bg-primary': string
  '--bg-secondary': string
  '--bg-card': string
  '--accent': string
  '--accent-light': string
  '--text-primary': string
  '--text-secondary': string
  '--text-muted': string
  '--border': string
  [key: string]: string
}

export interface ThemeConfig {
  sourceImage: string | null
  vars: ThemeVars
  previous: ThemeVars | null
  suggestedFont: string | null
}

export interface SiteConfig {
  branding: BrandingConfig
  theme: ThemeConfig
  plugins: PluginState[]
}
