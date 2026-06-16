import { useEffect, useRef, useState } from 'react'
import { Upload, Palette, RotateCcw, Check, AlertCircle, Eye, EyeOff, Type } from 'lucide-react'
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

function applyVarsToDom(vars: ThemeVars) {
  Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v))
}

export default function Theme() {
  const { config, updateConfig, uploadAsset, saveConfig } = useSiteConfig()
  const theme = config.theme

  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const [extractedVars, setExtractedVars]     = useState<ThemeVars | null>(null)
  const [suggestedFont, setSuggestedFont]     = useState<string | null>(null)
  const [editedVars, setEditedVars]           = useState<ThemeVars | null>(null)
  const [extracting, setExtracting]           = useState(false)
  const [applying, setApplying]               = useState(false)
  const [isPreviewing, setIsPreviewing]       = useState(false)
  const [toast, setToast]                     = useState('')
  const [error, setError]                     = useState('')

  const inputRef       = useRef<HTMLInputElement>(null)
  const fileRef        = useRef<File | null>(null)          // persists file across renders for Supabase upload
  const previewVarsRef = useRef<ThemeVars | null>(null)     // saved vars before live-preview

  // Active vars: edited > extracted > currently applied
  const activeVars = editedVars ?? extractedVars ?? theme.vars

  // Restore CSS vars if user navigates away during a live preview
  useEffect(() => {
    return () => {
      if (previewVarsRef.current) applyVarsToDom(previewVarsRef.current)
    }
  }, [])

  async function handleFile(file: File) {
    setError('')
    setExtracting(true)
    setExtractedVars(null)
    setSuggestedFont(null)
    setEditedVars(null)
    fileRef.current = file

    const url = URL.createObjectURL(file)
    setImgPreview(url)

    await new Promise<void>(resolve => {
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

  /* Live preview — applies extracted vars to CSS without saving */
  function startPreview() {
    if (!extractedVars) return
    previewVarsRef.current = config.theme.vars      // save current so we can restore
    applyVarsToDom(editedVars ?? extractedVars)
    setIsPreviewing(true)
  }

  function stopPreview() {
    if (previewVarsRef.current) {
      applyVarsToDom(previewVarsRef.current)
      previewVarsRef.current = null
    }
    setIsPreviewing(false)
  }

  /* Permanently apply + save to Supabase */
  async function applyTheme() {
    if (!extractedVars) return
    previewVarsRef.current = null   // discard preview state — we're committing
    setIsPreviewing(false)
    setApplying(true)

    const vars = editedVars ?? extractedVars
    let imageUrl: string | null = theme.sourceImage
    try {
      const file = fileRef.current ?? inputRef.current?.files?.[0]
      if (file) imageUrl = await uploadAsset(file, 'theme')
    } catch { /* upload failure is non-fatal — local object URL used as fallback */ }

    updateConfig(c => ({
      ...c,
      theme: { sourceImage: imageUrl ?? imgPreview, vars, previous: c.theme.vars, suggestedFont },
    }))
    await saveConfig()
    setApplying(false)
    showToast('Theme applied across all pages!')
  }

  async function revertTheme() {
    if (!theme.previous) return
    stopPreview()
    updateConfig(c => ({
      ...c,
      theme: { ...c.theme, vars: c.theme.previous!, previous: null, sourceImage: null },
    }))
    await saveConfig()
    clearExtracted()
    showToast('Reverted to previous theme')
  }

  function resetToDefault() {
    stopPreview()
    updateConfig(c => ({
      ...c,
      theme: { ...c.theme, vars: DEFAULT_THEME_VARS, previous: null, sourceImage: null, suggestedFont: null },
    }))
    clearExtracted()
  }

  function applyFontSuggestion() {
    if (!suggestedFont) return
    updateConfig(c => ({
      ...c,
      branding: { ...c.branding, brandName: { ...c.branding.brandName, font: suggestedFont } },
    }))
    showToast(`"${suggestedFont}" applied to brand name`)
  }

  function clearExtracted() {
    setExtractedVars(null); setEditedVars(null); setImgPreview(null)
    setSuggestedFont(null); fileRef.current = null
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // The mini-preview uses inline styles from activeVars so it always shows the pending palette
  const pv = activeVars

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Theme Manager</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Upload a reference photo to extract a palette and apply it globally. Logo and brand-name styles are never overwritten.
        </p>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-5 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
                    style={{ background: '#0B2F1A', color: '#4ADE80', border: '1px solid #166534' }}>
          <Check size={14} /> {toast}
        </motion.div>
      )}

      {isPreviewing && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-5 px-4 py-2.5 rounded-xl text-sm flex items-center justify-between"
                    style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--accent)' }}>
          <span className="flex items-center gap-2"><Eye size={14} /> Previewing extracted palette — not saved yet</span>
          <button onClick={stopPreview} className="text-xs underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity">
            Stop preview
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: upload + actions ─────────────────── */}
        <div className="space-y-5">

          {/* Drop zone */}
          <div onDragOver={e => e.preventDefault()} onDrop={handleDrop}
               onClick={() => inputRef.current?.click()}
               className="rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden"
               style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', minHeight: 200 }}>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
                   onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {imgPreview ? (
              <div className="relative">
                <img src={imgPreview} alt="source" className="w-full object-cover max-h-56 block" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                     style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <p className="text-sm text-white font-medium">Click to replace</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                <Upload size={28} className="mb-3 opacity-40" style={{ color: 'var(--accent)' }} />
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Drop a photo here</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>JPG · PNG · WebP · HEIC</p>
              </div>
            )}
          </div>

          {extracting && (
            <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-5 h-5 border-2 rounded-full animate-spin flex-shrink-0"
                   style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Extracting colour palette…</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl p-4 flex items-center gap-3"
                 style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={16} className="flex-shrink-0" style={{ color: '#FCA5A5' }} />
              <p className="text-sm" style={{ color: '#FCA5A5' }}>{error}</p>
            </div>
          )}

          {suggestedFont && (
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
                <Type size={11} /> Typography suggestion
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                <strong>{suggestedFont}</strong> pairs well with this palette.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={applyFontSuggestion}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-90"
                        style={{ background: 'rgba(201,168,76,0.1)', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  Apply to brand name →
                </button>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or override in Branding → Brand Name</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {extractedVars && !isPreviewing && (
              <button onClick={startPreview}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-[var(--bg-card)]"
                      style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                <Eye size={14} /> Preview
              </button>
            )}
            {isPreviewing && (
              <button onClick={stopPreview}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-[var(--bg-card)]"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <EyeOff size={14} /> Stop preview
              </button>
            )}
            {extractedVars && (
              <button onClick={applyTheme} disabled={applying}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
                <Palette size={14} /> {applying ? 'Saving…' : 'Apply to site'}
              </button>
            )}
            {theme.previous && (
              <button onClick={revertTheme}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-[var(--bg-card)]"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <RotateCcw size={14} /> Revert to previous
              </button>
            )}
            <button onClick={resetToDefault}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-red-500/10 hover:text-red-400"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <RotateCcw size={14} /> Restore defaults
            </button>
          </div>
        </div>

        {/* ── Right: palette editor + mini-preview ─── */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {extractedVars ? 'Extracted palette — edit to fine-tune before applying' : 'Current theme vars'}
            </p>
          </div>

          <div className="p-5 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            {Object.entries(activeVars).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex-shrink-0 border"
                     style={{ background: v.startsWith('rgba') || v.startsWith('#') ? v : '#555', borderColor: 'var(--border)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs mb-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{VAR_LABELS[k] ?? k}</p>
                  <input value={v}
                         onChange={e => setEditedVars(prev => ({ ...(prev ?? activeVars), [k]: e.target.value }))}
                         className="w-full text-xs px-2 py-1 rounded-lg border outline-none font-mono"
                         style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
                {v.startsWith('#') && v.length === 7 && (
                  <input type="color" value={v}
                         onChange={e => setEditedVars(prev => ({ ...(prev ?? activeVars), [k]: e.target.value }))}
                         className="w-7 h-7 rounded-lg border cursor-pointer flex-shrink-0"
                         style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }} />
                )}
              </div>
            ))}
          </div>

          {/* Mini-preview — inline styles from activeVars so it shows pending palette immediately */}
          <div className="border-t p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              {extractedVars ? 'Palette preview' : 'Current theme'}
            </p>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: pv['--border'] }}>
              <div className="flex items-center gap-2 px-3 py-2 text-xs border-b"
                   style={{ background: pv['--bg-secondary'], borderColor: pv['--border'], color: pv['--text-muted'] }}>
                {['■', '■', '■'].map((d, i) => <span key={i} className="opacity-50">{d}</span>)}
              </div>
              <div className="py-8 px-4 text-center" style={{ background: pv['--bg-primary'] }}>
                <div className="w-8 h-8 rounded-lg mx-auto mb-2" style={{ background: pv['--accent'] }} />
                <div className="text-sm font-semibold mb-1" style={{ color: pv['--text-primary'] }}>Lintejas</div>
                <div className="text-xs mb-3" style={{ color: pv['--text-secondary'] }}>Technology Holding Company</div>
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: pv['--accent'], color: pv['--bg-primary'] }}>
                  View Portfolio
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
