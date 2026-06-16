import { useSiteConfig } from '../lib/SiteConfigContext'
import TheInterlockLogo from './TheInterlockLogo'
import type { LogoConfig } from '../lib/types'

function logoStyle(cfg: LogoConfig): React.CSSProperties {
  const glowActive = cfg.glow.intensity > 0
  const shadow = glowActive
    ? `0 0 ${cfg.glow.blur}px ${cfg.glow.spread}px ${cfg.glow.color}${Math.round(cfg.glow.intensity * 255).toString(16).padStart(2, '0')}`
    : 'none'

  const animMap: Record<string, string> = {
    float:   `float ${cfg.animationSpeed}s ease-in-out infinite`,
    pulse:   `pulse-gold ${cfg.animationSpeed}s ease-in-out infinite`,
    shimmer: `shimmer ${cfg.animationSpeed}s linear infinite`,
    fade:    `pulseGold ${cfg.animationSpeed}s ease-in-out infinite`,
  }

  return {
    width:          cfg.size,
    height:         cfg.size,
    borderRadius:   cfg.radius,
    filter:         `brightness(${cfg.brightness})${cfg.tint ? ` sepia(100%) saturate(300%) hue-rotate(${hueFromHex(cfg.tint)}deg)` : ''}`,
    boxShadow:      shadow,
    transform:      `translate(${cfg.x}px, ${cfg.y}px)`,
    animation:      cfg.animation !== 'none' ? animMap[cfg.animation] ?? 'none' : 'none',
    flexShrink:     0,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
  }
}

function hueFromHex(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  if (max === min) return 0
  const d = max - min
  if (max === r) return (((g - b) / d + (g < b ? 6 : 0)) / 6) * 360
  if (max === g) return (((b - r) / d + 2) / 6) * 360
  return (((r - g) / d + 4) / 6) * 360
}

interface Props {
  overrideConfig?: Partial<LogoConfig>
  className?: string
}

export default function SiteLogo({ overrideConfig, className }: Props) {
  const { config } = useSiteConfig()
  const cfg = overrideConfig ? { ...config.branding.logo, ...overrideConfig } : config.branding.logo

  return (
    <div style={logoStyle(cfg)} className={className}>
      {cfg.src
        ? <img src={cfg.src} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        : <TheInterlockLogo size={cfg.size * 0.8} />
      }
    </div>
  )
}
