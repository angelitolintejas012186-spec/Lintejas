import { useSiteConfig } from '../lib/SiteConfigContext'
import type { BrandNameConfig } from '../lib/types'

function nameStyle(cfg: BrandNameConfig): React.CSSProperties {
  const glowActive = cfg.glow.intensity > 0
  const textShadow = glowActive
    ? `0 0 ${cfg.glow.blur}px ${cfg.glow.color}${Math.round(cfg.glow.intensity * 255).toString(16).padStart(2, '0')}`
    : 'none'

  const animMap: Record<string, string> = {
    float:   `float ${cfg.animationSpeed}s ease-in-out infinite`,
    pulse:   `pulse-gold ${cfg.animationSpeed}s ease-in-out infinite`,
    shimmer: `shimmer ${cfg.animationSpeed}s linear infinite`,
    fade:    `pulseGold ${cfg.animationSpeed}s ease-in-out infinite`,
  }

  const base: React.CSSProperties = {
    transform: `translate(${cfg.x}px, ${cfg.y}px)`,
    animation: cfg.animation !== 'none' ? animMap[cfg.animation] ?? 'none' : 'none',
    filter:    `brightness(${cfg.brightness})`,
    textShadow,
  }

  if (cfg.mode === 'image') return base

  return {
    ...base,
    fontFamily:    `'${cfg.font}', Georgia, serif`,
    fontSize:      cfg.size,
    fontWeight:    cfg.weight,
    letterSpacing: cfg.letterSpacing,
    color:         cfg.gradient ? 'transparent' : cfg.color,
    backgroundImage:   cfg.gradient ?? 'none',
    backgroundClip:    cfg.gradient ? 'text' : 'unset',
    WebkitBackgroundClip: cfg.gradient ? 'text' : 'unset',
  }
}

interface Props {
  overrideConfig?: Partial<BrandNameConfig>
  className?: string
}

export default function BrandName({ overrideConfig, className }: Props) {
  const { config } = useSiteConfig()
  const cfg = overrideConfig ? { ...config.branding.brandName, ...overrideConfig } : config.branding.brandName

  if (cfg.mode === 'image' && cfg.imageSrc) {
    return (
      <img
        src={cfg.imageSrc}
        alt={cfg.text}
        style={{ height: cfg.imageHeight, width: 'auto', ...nameStyle(cfg) }}
        className={className}
      />
    )
  }

  // Text mode — highlight suffix in gold
  const name   = cfg.text || 'Lintejas'
  const suffix = cfg.suffix || ''
  const endsW  = suffix && name.toLowerCase().endsWith(suffix.toLowerCase())
  const prefix = endsW ? name.slice(0, -suffix.length) : name
  const sfx    = endsW ? suffix : ''

  return (
    <span style={nameStyle(cfg)} className={className}>
      {prefix}
      {sfx && <span style={{ color: 'var(--accent)' }}>{sfx}</span>}
    </span>
  )
}
