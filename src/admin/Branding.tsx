import { useRef, useState } from 'react'
import { DndContext, useDraggable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import { Upload, RotateCcw, Save, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteConfig } from '../lib/SiteConfigContext'
import SiteLogo from '../components/SiteLogo'
import BrandName from '../components/BrandName'
import TheInterlockLogo from '../components/TheInterlockLogo'
import type { LogoConfig, BrandNameConfig, LogoAnimation } from '../lib/types'
import { DEFAULT_CONFIG } from '../lib/defaults'

/* ── Draggable wrapper ───────────────────────────── */
function Draggable({ id, x, y, children }: { id: string; x: number; y: number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  const style: React.CSSProperties = {
    transform: transform ? `translate(${x + transform.x}px, ${y + transform.y}px)` : `translate(${x}px, ${y}px)`,
    position: 'absolute',
    cursor: 'grab',
    touchAction: 'none',
  }
  return <div ref={setNodeRef} style={style} {...listeners} {...attributes}>{children}</div>
}

/* ── Reusable slider ─────────────────────────────── */
function Slider({ label, value, min, max, step = 1, onChange, unit = '' }: {
  label: string; value: number; min: number; max: number; step?: number; onChange(v: number): void; unit?: string
}) {
  return (
    <label className="block">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
             onChange={e => onChange(Number(e.target.value))}
             className="w-full h-1.5 rounded appearance-none cursor-pointer"
             style={{ accentColor: 'var(--accent)', background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((value - min) / (max - min)) * 100}%, var(--bg-card) ${((value - min) / (max - min)) * 100}%, var(--bg-card) 100%)` }} />
    </label>
  )
}

/* ── Drop zone ───────────────────────────────────── */
function DropZone({ label, onFile, preview, onRemove }: {
  label: string; onFile(f: File): void; preview?: string | null; onRemove?(): void
}) {
  const [drag, setDrag] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      onClick={() => !preview && ref.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${preview ? 'p-0 overflow-hidden' : 'p-8 cursor-pointer'}`}
      style={{ borderColor: drag ? 'var(--accent)' : 'var(--border)', background: drag ? 'rgba(201,168,76,0.05)' : 'var(--bg-secondary)', minHeight: 100 }}
    >
      <input ref={ref} type="file" accept="image/svg+xml,image/png,image/webp,image/jpeg" className="hidden" onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
      {preview
        ? <>
            <img src={preview} alt="preview" className="w-full h-full object-contain max-h-32" />
            {onRemove && <button onClick={e => { e.stopPropagation(); onRemove() }} className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500/20" style={{ background: 'var(--bg-card)' }}><X size={12} style={{ color: 'var(--text-muted)' }} /></button>}
          </>
        : <div className="text-center">
            <Upload size={20} className="mx-auto mb-2 opacity-50" style={{ color: 'var(--accent)' }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
      }
    </div>
  )
}

/* ── Main ────────────────────────────────────────── */
const ANIMATIONS: LogoAnimation[] = ['none', 'fade', 'float', 'pulse', 'shimmer']
const FONTS = ['Fraunces', 'Inter', 'Cormorant Garamond', 'Playfair Display', 'Space Grotesk']

export default function Branding() {
  const { config, updateConfig, uploadAsset, saveConfig } = useSiteConfig()
  const logo = config.branding.logo
  const brand = config.branding.brandName
  const [tab, setTab] = useState<'logo' | 'brand'>('logo')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  function setLogo(patch: Partial<LogoConfig>) {
    updateConfig(c => ({ ...c, branding: { ...c.branding, logo: { ...c.branding.logo, ...patch } } }))
  }
  function setBrand(patch: Partial<BrandNameConfig>) {
    updateConfig(c => ({ ...c, branding: { ...c.branding, brandName: { ...c.branding.brandName, ...patch } } }))
  }

  async function handleLogoFile(file: File) {
    const url = await uploadAsset(file, 'logo')
    setLogo({ src: url })
  }
  async function handleWordmarkFile(file: File) {
    const url = await uploadAsset(file, 'wordmark')
    setBrand({ imageSrc: url, mode: 'image' })
  }

  async function handleSave() {
    setSaving(true)
    await saveConfig()
    setSaving(false)
    setToast('Saved!')
    setTimeout(() => setToast(''), 2000)
  }

  function handleLogoDragEnd(e: DragEndEvent) {
    const d = e.delta
    setLogo({ x: logo.x + d.x, y: logo.y + d.y })
  }
  function handleBrandDragEnd(e: DragEndEvent) {
    const d = e.delta
    setBrand({ x: brand.x + d.x, y: brand.y + d.y })
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  )

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-semibold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Branding Editor</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Customise logo, brand name, and visual identity</p>
        </div>
        <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
          <Save size={14} /> {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mb-4 px-4 py-2.5 rounded-xl text-sm" style={{ background: '#0B2F1A', color: '#4ADE80', border: '1px solid #166534' }}>
          ✓ {toast}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
            {(['logo', 'brand'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors capitalize ${tab === t ? 'border-b-2' : 'opacity-60 hover:opacity-80'}`}
                      style={{ borderColor: tab === t ? 'var(--accent)' : 'transparent', color: tab === t ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {t === 'logo' ? 'Logo' : 'Brand Name'}
              </button>
            ))}
          </div>

          <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {tab === 'logo' ? (
              <>
                <Section title="Logo Image">
                  <DropZone label="SVG · PNG · WebP — drag & drop or click" onFile={handleLogoFile}
                            preview={logo.src} onRemove={() => setLogo({ src: null })} />
                  <button onClick={() => setLogo({ src: null })} className="w-full py-2 text-xs rounded-lg transition-colors hover:bg-[var(--bg-secondary)]"
                          style={{ color: 'var(--text-muted)' }}>
                    <RotateCcw size={12} className="inline mr-1.5" /> Reset to The Interlock
                  </button>
                </Section>

                <Section title="Position">
                  <div>
                    <span className="text-xs block mb-2" style={{ color: 'var(--text-secondary)' }}>Alignment on page</span>
                    <div className="flex gap-2">
                      {(['left', 'center', 'right'] as const).map(a => (
                        <button key={a} onClick={() => setLogo({ align: a })}
                                className={`flex-1 py-2 rounded-xl text-xs font-medium border capitalize transition-all ${logo.align === a ? '' : 'opacity-60 hover:opacity-80'}`}
                                style={{ borderColor: logo.align === a ? 'var(--accent)' : 'var(--border)', background: logo.align === a ? 'rgba(201,168,76,0.1)' : 'var(--bg-secondary)', color: logo.align === a ? 'var(--accent)' : 'var(--text-secondary)' }}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(['x', 'y'] as const).map(axis => (
                      <div key={axis}>
                        <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{axis.toUpperCase()} offset</label>
                        <input type="number" value={logo[axis]}
                               onChange={e => setLogo({ [axis]: Number(e.target.value) } as Partial<LogoConfig>)}
                               className="w-full px-3 py-2 rounded-xl text-sm border outline-none font-mono"
                               style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Size & Shape">
                  <Slider label="Size" value={logo.size} min={24} max={120} onChange={v => setLogo({ size: v })} unit="px" />
                  <Slider label="Border radius" value={logo.radius} min={0} max={64} onChange={v => setLogo({ radius: v })} unit="px" />
                  <Slider label="Brightness" value={Math.round(logo.brightness * 100)} min={30} max={200} onChange={v => setLogo({ brightness: v / 100 })} unit="%" />
                </Section>

                <Section title="Glow / Lighting">
                  <div className="flex gap-3">
                    <label className="flex-1 block">
                      <span className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Colour</span>
                      <input type="color" value={logo.glow.color} onChange={e => setLogo({ glow: { ...logo.glow, color: e.target.value } })}
                             className="w-full h-9 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }} />
                    </label>
                    <div className="flex-1">
                      <Slider label="Intensity" value={Math.round(logo.glow.intensity * 100)} min={0} max={100} onChange={v => setLogo({ glow: { ...logo.glow, intensity: v / 100 } })} unit="%" />
                    </div>
                  </div>
                  <Slider label="Blur" value={logo.glow.blur} min={0} max={60} onChange={v => setLogo({ glow: { ...logo.glow, blur: v } })} unit="px" />
                  <Slider label="Spread" value={logo.glow.spread} min={0} max={30} onChange={v => setLogo({ glow: { ...logo.glow, spread: v } })} unit="px" />
                </Section>

                <Section title="Animation">
                  <div className="grid grid-cols-3 gap-2">
                    {ANIMATIONS.map(a => (
                      <button key={a} onClick={() => setLogo({ animation: a })}
                              className={`py-2 px-3 rounded-xl text-xs font-medium transition-all capitalize ${logo.animation === a ? 'border' : 'border hover:border-[var(--accent)] opacity-60'}`}
                              style={{ borderColor: logo.animation === a ? 'var(--accent)' : 'var(--border)', background: logo.animation === a ? 'rgba(201,168,76,0.1)' : 'var(--bg-secondary)', color: logo.animation === a ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        {a}
                      </button>
                    ))}
                  </div>
                  {logo.animation !== 'none' && (
                    <Slider label="Speed" value={logo.animationSpeed} min={1} max={8} step={0.5} onChange={v => setLogo({ animationSpeed: v })} unit="s" />
                  )}
                </Section>

                <Section title="Tint / Colour">
                  <div className="flex gap-3 items-center">
                    <input type="color" value={logo.tint ?? '#C9A84C'} onChange={e => setLogo({ tint: e.target.value })}
                           className="h-9 w-12 rounded-lg border cursor-pointer flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }} />
                    <div className="flex-1">
                      <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                        <input type="checkbox" checked={logo.tint !== null} onChange={e => setLogo({ tint: e.target.checked ? '#C9A84C' : null })}
                               className="rounded" style={{ accentColor: 'var(--accent)' }} />
                        Apply tint to logo
                      </label>
                    </div>
                  </div>
                </Section>
              </>
            ) : (
              <>
                <Section title="Format">
                  <div className="flex gap-2">
                    {(['text', 'image'] as const).map(m => (
                      <button key={m} onClick={() => setBrand({ mode: m })}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize ${brand.mode === m ? '' : 'opacity-60'}`}
                              style={{ borderColor: brand.mode === m ? 'var(--accent)' : 'var(--border)', background: brand.mode === m ? 'rgba(201,168,76,0.1)' : 'var(--bg-secondary)', color: brand.mode === m ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        {m === 'text' ? 'Text' : 'Wordmark Image'}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Position">
                  <div>
                    <span className="text-xs block mb-2" style={{ color: 'var(--text-secondary)' }}>Alignment on page</span>
                    <div className="flex gap-2">
                      {(['left', 'center', 'right'] as const).map(a => (
                        <button key={a} onClick={() => setBrand({ align: a })}
                                className={`flex-1 py-2 rounded-xl text-xs font-medium border capitalize transition-all ${brand.align === a ? '' : 'opacity-60 hover:opacity-80'}`}
                                style={{ borderColor: brand.align === a ? 'var(--accent)' : 'var(--border)', background: brand.align === a ? 'rgba(201,168,76,0.1)' : 'var(--bg-secondary)', color: brand.align === a ? 'var(--accent)' : 'var(--text-secondary)' }}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(['x', 'y'] as const).map(axis => (
                      <div key={axis}>
                        <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{axis.toUpperCase()} offset</label>
                        <input type="number" value={brand[axis]}
                               onChange={e => setBrand({ [axis]: Number(e.target.value) } as Partial<BrandNameConfig>)}
                               className="w-full px-3 py-2 rounded-xl text-sm border outline-none font-mono"
                               style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      </div>
                    ))}
                  </div>
                </Section>

                {brand.mode === 'text' ? (
                  <>
                    <Section title="Text">
                      <div>
                        <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Brand name</label>
                        <input value={brand.text} onChange={e => setBrand({ text: e.target.value })}
                               className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Gold suffix (e.g. "jas")</label>
                        <input value={brand.suffix} onChange={e => setBrand({ suffix: e.target.value })}
                               className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      </div>
                    </Section>

                    <Section title="Typography">
                      <div>
                        <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Font</label>
                        <select value={brand.font} onChange={e => setBrand({ font: e.target.value })}
                                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <Slider label="Size" value={brand.size} min={14} max={56} onChange={v => setBrand({ size: v })} unit="px" />
                      <Slider label="Weight" value={brand.weight} min={300} max={800} step={100} onChange={v => setBrand({ weight: v })} />
                      <Slider label="Letter spacing" value={brand.letterSpacing} min={-2} max={8} step={0.5} onChange={v => setBrand({ letterSpacing: v })} unit="px" />
                      {/* Colour / Gradient */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Colour{brand.gradient ? ' (gradient)' : ''}</span>
                          <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                            <input type="checkbox" checked={brand.gradient !== null}
                                   onChange={e => setBrand({ gradient: e.target.checked ? `linear-gradient(135deg, ${brand.color}, #C9A84C)` : null })}
                                   style={{ accentColor: 'var(--accent)' }} />
                            Gradient
                          </label>
                        </div>
                        {brand.gradient ? (
                          <div className="space-y-2">
                            {[0, 1].map(i => {
                              const cols = brand.gradient?.match(/#[0-9a-fA-F]{6}/g) ?? [brand.color, '#C9A84C']
                              const hex = cols[i] ?? brand.color
                              return (
                                <div key={i} className="flex items-center gap-3">
                                  <span className="text-xs w-6 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{i === 0 ? 'A' : 'B'}</span>
                                  <input type="color" value={hex}
                                         onChange={e => {
                                           const c = brand.gradient?.match(/#[0-9a-fA-F]{6}/g) ?? [brand.color, '#C9A84C']
                                           const next = [...c]; next[i] = e.target.value
                                           setBrand({ gradient: `linear-gradient(135deg, ${next[0]}, ${next[1] ?? next[0]})` })
                                         }}
                                         className="flex-1 h-8 rounded-lg border cursor-pointer"
                                         style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }} />
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <input type="color" value={brand.color} onChange={e => setBrand({ color: e.target.value })}
                                 className="w-full h-9 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }} />
                        )}
                      </div>
                    </Section>
                  </>
                ) : (
                  <Section title="Wordmark Image">
                    <DropZone label="Upload wordmark image — SVG · PNG · WebP" onFile={handleWordmarkFile}
                              preview={brand.imageSrc} onRemove={() => setBrand({ imageSrc: null, mode: 'text' })} />
                    <Slider label="Image height" value={brand.imageHeight} min={16} max={80} onChange={v => setBrand({ imageHeight: v })} unit="px" />
                  </Section>
                )}

                <Section title="Brightness & Glow">
                  <Slider label="Brightness" value={Math.round(brand.brightness * 100)} min={30} max={200} onChange={v => setBrand({ brightness: v / 100 })} unit="%" />
                  <div className="flex gap-3">
                    <label className="flex-1 block">
                      <span className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Glow colour</span>
                      <input type="color" value={brand.glow.color} onChange={e => setBrand({ glow: { ...brand.glow, color: e.target.value } })}
                             className="w-full h-9 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }} />
                    </label>
                    <div className="flex-1">
                      <Slider label="Intensity" value={Math.round(brand.glow.intensity * 100)} min={0} max={100} onChange={v => setBrand({ glow: { ...brand.glow, intensity: v / 100 } })} unit="%" />
                    </div>
                  </div>
                  <Slider label="Blur" value={brand.glow.blur} min={0} max={60} onChange={v => setBrand({ glow: { ...brand.glow, blur: v } })} unit="px" />
                </Section>

                <Section title="Animation">
                  <div className="grid grid-cols-3 gap-2">
                    {ANIMATIONS.map(a => (
                      <button key={a} onClick={() => setBrand({ animation: a })}
                              className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${brand.animation === a ? '' : 'opacity-60'}`}
                              style={{ borderColor: brand.animation === a ? 'var(--accent)' : 'var(--border)', background: brand.animation === a ? 'rgba(201,168,76,0.1)' : 'var(--bg-secondary)', color: brand.animation === a ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        {a}
                      </button>
                    ))}
                  </div>
                  {brand.animation !== 'none' && (
                    <Slider label="Speed" value={brand.animationSpeed} min={1} max={8} step={0.5} onChange={v => setBrand({ animationSpeed: v })} unit="s" />
                  )}
                </Section>
              </>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-3 rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Live preview — drag elements to reposition</span>
            <button onClick={() => { updateConfig(c => ({ ...c, branding: DEFAULT_CONFIG.branding })) }}
                    className="text-xs flex items-center gap-1.5 hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
              <RotateCcw size={11} /> Reset all
            </button>
          </div>

          {/* Header preview */}
          <div className="relative overflow-hidden border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', height: 180 }}>
            <DndContext modifiers={[restrictToParentElement]} onDragEnd={handleLogoDragEnd}>
              <Draggable id="logo" x={logo.x + 20} y={logo.y + 20}>
                <SiteLogo overrideConfig={{ x: 0, y: 0 }} />
              </Draggable>
            </DndContext>
            <DndContext modifiers={[restrictToParentElement]} onDragEnd={handleBrandDragEnd}>
              <Draggable id="brand" x={brand.x + 80} y={brand.y + 28}>
                <BrandName overrideConfig={{ x: 0, y: 0 }} />
              </Draggable>
            </DndContext>
            <p className="absolute bottom-2 right-3 text-xs opacity-30" style={{ color: 'var(--text-muted)' }}>Header</p>
          </div>

          {/* Hero preview */}
          <div className="relative flex flex-col py-14 px-8" style={{ background: 'var(--bg-primary)', alignItems: logo.align === 'right' ? 'flex-end' : logo.align === 'left' ? 'flex-start' : 'center' }}>
            <div className="mb-5">
              <SiteLogo overrideConfig={{ size: 72 }} />
            </div>
            <BrandName className={`block mb-2 text-3xl ${brand.align === 'left' ? 'text-left' : brand.align === 'right' ? 'text-right' : 'text-center'}`} />
            <p className="text-xs text-center max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Technology Holding Company · Slovakia, EU
            </p>
          </div>

          {/* Nav preview */}
          <div className="flex items-center gap-5 px-6 py-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-2">
              <div style={{ width: 20, height: 20 }}>
                {logo.src
                  ? <img src={logo.src} alt="" className="w-full h-full object-contain" style={{ borderRadius: logo.radius / 2.4 }} />
                  : <TheInterlockLogo size={20} />
                }
              </div>
              <BrandName className="text-sm" />
            </div>
            {['Home', 'About', 'Companies', 'Services'].map(l => (
              <span key={l} className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
