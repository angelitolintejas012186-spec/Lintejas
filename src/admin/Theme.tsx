import { useRef, useState } from 'react'
import { Upload, Palette, RotateCcw, Check, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteConfig } from '../lib/SiteConfigContext'
import { extractPalette } from '../lib/colorExtract'
import { DEFAULT_THEME_VARS } from '../lib/defaults'
import type { ThemeVars } from '../lib/types'

const VAR_LABELS: Record<string, string> = {
  '--bg-primary':    'Background (primary)',
  '--bg-secondary':  'Background (secondary)',
  '--bg-card':       'Card surface',
  '--accent':        'Accent / brand colour',
  '--accent-light':  'Accent (light)',
  '--text-primary':  'Text (primary)',
  '--text-secondary':'Text (secondary)',
  '--text-muted':    'Text (muted)',
  '--border':        'Border',
}

export default function Theme() {
  const { config, updateConfig, uploadAsset, saveConfig } = useSiteConfig()
  const theme = config.theme
  const [preview, setPreview] = useState<string | null>(null)
  const [extractedVars, setExtractedVars] = useState<ThemeVars | null>(null)
  const [suggestedFont, setSuggestedFont] = useState<string | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [applying, setApplying] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [editedVars, setEditedVars] = useState<ThemeVars | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeVars = editedVars ?? extractedVars ?? theme.vars

  async function handleFile(file: File) {
    setError('')
    setExtracting(true)
    setExtractedVars(null)
    setSuggestedFont(null)
    setEditedVars(null)

    const url = URL.createObjectURL(file)
    setPreview(url)

    // Wait for image to load then extract
    await new Promise<void>((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = async () => {
        try {
          const { vars, suggestedFont: font } = await extractPalette(img)
          setExtractedVars(vars)
          setSuggestedFont(font)
        } catch (e) {
          setError('Could not extract colours from this image. Try a different photo.')
          console.error(e)
        } finally {
          setExtracting(false)
          resolve()
        }
      }
      img.onerror = () => { setExtracting(false); setError('Failed to load image.'); resolve() }
      img.src = url
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function applyTheme() {
    if (!extractedVars) return
    setApplying(true)
    const vars = editedVars ?? extractedVars
    let imageUrl = theme.sourceImage
    try {
      const inputEl = inputRef.current
      if (inputEl?.files?.[0]) imageUrl = await uploadAsset(inputEl.files[0], 'theme')
    } catch {}

    updateConfig(c => ({
      ...c,
      theme: {
        sourceImage: imageUrl ?? preview,
        vars,
        previous: c.theme.vars,
        suggestedFont,
      },
    }))
    setSaving(true)
    await saveConfig()
    setSaving(false)
    setApplying(false)
    setToast('Theme applied across all pages!')
    setTimeout(() => setToast(''), 3000)
  }

  async function revertTheme() {
    if (!theme.previous) return
    updateConfig(c => ({
      ...c,
      theme: { ...c.theme, vars: c.theme.previous!, previous: null, sourceImage: null },
    }))
    await saveConfig()
    setExtractedVars(null)
    setEditedVars(null)
    setPreview(null)
    setToast('Reverted to previous theme')
    setTimeout(() => setToast(''), 2500)
  }

  function resetToDefault() {
    updateConfig(c => ({ ...c, theme: { ...c.theme, vars: DEFAULT_THEME_VARS, previous: null, sourceImage: null, suggestedFont: null } }))
    setExtractedVars(null)
    setEditedVars(null)
    setPreview(null)
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Theme Manager</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Upload a reference photo to extract a palette — applied globally across all pages.
          Logo and brand-name styles are never overwritten.
        </p>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-5 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
                    style={{ background: '#0B2F1A', color: '#4ADE80', border: '1px solid #166534' }}>
          <Check size={14} /> {toast}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload + extract */}
        <div className="space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', minHeight: 200 }}
          >
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
                   onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {preview ? (
              <div className="relative">
                <img ref={imgRef} src={preview} alt="source" className="w-full object-cover max-h-56 block" crossOrigin="anonymous" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                     style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <p className="text-sm text-white font-medium">Click to replace</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                <Upload size={28} className="mb-3 opacity-40" style={{ color: 'var(--accent)' }} />
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Drop a photo here</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Any format — JPG, PNG, WebP, HEIC</p>
              </div>
            )}
          </div>

          {extracting && (
            <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin flex-shrink-0" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Extracting colour palette…</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={16} className="flex-shrink-0" style={{ color: '#FCA5A5' }} />
              <p className="text-sm" style={{ color: '#FCA5A5' }}>{error}</p>
            </div>
          )}

          {suggestedFont && (
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent)' }}>Typography suggestion</p>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                Based on this palette, <strong>{suggestedFont}</strong> pairs well as a display font.
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Apply it in Branding → Brand Name → Font</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {extractedVars && (
              <button onClick={applyTheme} disabled={applying || saving}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
                <Palette size={14} /> {applying ? 'Applying…' : 'Apply to site'}
              </button>
            )}
            {theme.previous && (
              <button onClick={revertTheme} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-[var(--bg-card)]"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <RotateCcw size={14} /> Revert to previous
              </button>
            )}
            <button onClick={resetToDefault} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-red-500/10 hover:text-red-400"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <RotateCcw size={14} /> Restore defaults
            </button>
          </div>
        </div>

        {/* Palette editor */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {extractedVars ? 'Extracted palette — edit values to fine-tune' : 'Current theme vars'}
            </p>
          </div>
          <div className="p-5 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
            {Object.entries(activeVars).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex-shrink-0 border" style={{ background: v.startsWith('rgba') || v.startsWith('#') ? v : '#555', borderColor: 'var(--border)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs mb-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{VAR_LABELS[k] ?? k}</p>
                  <input
                    value={v}
                    onChange={e => setEditedVars(prev => ({ ...(prev ?? activeVars), [k]: e.target.value }))}
                    className="w-full text-xs px-2 py-1 rounded-lg border outline-none font-mono"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                {(v.startsWith('#') && v.length === 7) && (
                  <input type="color" value={v}
                         onChange={e => setEditedVars(prev => ({ ...(prev ?? activeVars), [k]: e.target.value }))}
                         className="w-7 h-7 rounded-lg border cursor-pointer flex-shrink-0"
                         style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }} />
                )}
              </div>
            ))}
          </div>

          {/* Site mini-preview */}
          <div className="border-t p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Preview</p>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 px-3 py-2 text-xs border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                {['■', '■', '■'].map((d, i) => <span key={i} className="opacity-50">{d}</span>)}
              </div>
              <div className="py-8 px-4 text-center" style={{ background: 'var(--bg-primary)' }}>
                <div className="w-8 h-8 rounded-lg mx-auto mb-2" style={{ background: 'var(--accent)' }} />
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Lintejas</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Technology Holding Company</div>
                <div className="mt-3 inline-block px-4 py-1.5 rounded-lg text-xs" style={{ background: 'var(--accent)', color: '#0B1F33' }}>View Portfolio</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
