import type { ThemeVars } from './types'

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return rgbToHex(Math.round(r * (1 - amount)), Math.round(g * (1 - amount)), Math.round(b * (1 - amount)))
}

function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return rgbToHex(
    Math.min(255, Math.round(r + (255 - r) * amount)),
    Math.min(255, Math.round(g + (255 - g) * amount)),
    Math.min(255, Math.round(b + (255 - b) * amount)),
  )
}

function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}

/* Sample pixels from an image via canvas and build a reduced palette */
function samplePalette(img: HTMLImageElement, sampleCount = 12): string[] {
  const canvas = document.createElement('canvas')
  const size = 80
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, size, size)
  const data = ctx.getImageData(0, 0, size, size).data

  const buckets = new Map<string, number>()
  for (let i = 0; i < data.length; i += 4 * 8) {
    const r = Math.round(data[i]   / 32) * 32
    const g = Math.round(data[i+1] / 32) * 32
    const b = Math.round(data[i+2] / 32) * 32
    if (data[i+3] < 128) continue
    const key = `${r},${g},${b}`
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }

  return Array.from(buckets.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, sampleCount)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number)
      return rgbToHex(r, g, b)
    })
}

/* Extract palette from an image element and map to CSS vars */
export async function extractPalette(img: HTMLImageElement): Promise<{ vars: ThemeVars; suggestedFont: string }> {
  const palette = samplePalette(img, 12)
  if (!palette.length) throw new Error('No colours extracted')

  const sorted = palette.slice().sort((a, b) => getLuminance(a) - getLuminance(b))
  const darkest  = sorted[0]
  const lightest = sorted[sorted.length - 1]

  const accent = palette.reduce((best, hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const [, s, l] = rgbToHsl(r, g, b)
    const br = parseInt(best.slice(1, 3), 16)
    const bg = parseInt(best.slice(3, 5), 16)
    const bb = parseInt(best.slice(5, 7), 16)
    const [, bs, bl] = rgbToHsl(br, bg, bb)
    const score  = s * (1 - Math.abs(l  - 0.5) * 2)
    const bscore = bs * (1 - Math.abs(bl - 0.5) * 2)
    return score > bscore ? hex : best
  }, palette[2] ?? '#C9A84C')

  const vars: ThemeVars = {
    '--bg-primary':      darken(darkest, 0.2),
    '--bg-secondary':    darkest,
    '--bg-card':         lighten(darkest, 0.08),
    '--accent':          accent,
    '--accent-light':    lighten(accent, 0.2),
    '--text-primary':    lightest,
    '--text-secondary':  lighten(darkest, 0.55),
    '--text-muted':      lighten(darkest, 0.35),
    '--border':          `${accent}26`,
  }

  return { vars, suggestedFont: suggestFont(accent) }
}

function suggestFont(accentHex: string): string {
  const r = parseInt(accentHex.slice(1, 3), 16)
  const g = parseInt(accentHex.slice(3, 5), 16)
  const b = parseInt(accentHex.slice(5, 7), 16)
  const [h] = rgbToHsl(r, g, b)
  if (h >= 200 && h < 260) return 'Cormorant Garamond'
  if (h >= 30  && h < 60)  return 'Fraunces'
  if (h >= 140 && h < 200) return 'Space Grotesk'
  if (h >= 0   && h < 30)  return 'Playfair Display'
  return 'Inter'
}
