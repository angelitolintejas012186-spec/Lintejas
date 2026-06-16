import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Trash2, Settings, Power, X, Check } from 'lucide-react'
import { PLUGIN_REGISTRY } from '../lib/plugins'
import type { PluginManifest, PluginState } from '../lib/types'
import { useSiteConfig } from '../lib/SiteConfigContext'

const CATEGORY_COLORS: Record<string, string> = {
  marketing:   'rgba(251,191,36,0.12)',
  content:     'rgba(96,165,250,0.12)',
  analytics:   'rgba(52,211,153,0.12)',
  integration: 'rgba(167,139,250,0.12)',
  utility:     'rgba(251,113,133,0.12)',
}
const CATEGORY_TEXT: Record<string, string> = {
  marketing:   '#FBBF24',
  content:     '#60A5FA',
  analytics:   '#34D399',
  integration: '#A78BFA',
  utility:     '#FB7185',
}

/* ── Settings modal ─────────────────────────────── */
function PluginSettings({ manifest, state, onSave, onClose }: {
  manifest: PluginManifest
  state: PluginState
  onSave: (settings: Record<string, unknown>) => void
  onClose: () => void
}) {
  const [vals, setVals] = useState<Record<string, unknown>>(state.settings)

  function set(key: string, value: unknown) {
    setVals(v => ({ ...v, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-md rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{manifest.icon} {manifest.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Plugin settings</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {Object.entries(manifest.settingsSchema ?? {}).map(([key, field]) => {
            const val = vals[key] ?? field.defaultValue ?? ''
            return (
              <div key={key}>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  {field.label}{field.required && <span style={{ color: 'var(--accent)' }}> *</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea rows={3} value={String(val)} onChange={e => set(key, e.target.value)} placeholder={field.placeholder}
                            className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                ) : field.type === 'select' ? (
                  <select value={String(val)} onChange={e => set(key, e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : field.type === 'color' ? (
                  <input type="color" value={String(val) || '#C9A84C'} onChange={e => set(key, e.target.value)}
                         className="w-full h-10 rounded-xl border cursor-pointer"
                         style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }} />
                ) : field.type === 'toggle' ? (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => set(key, !val)}
                         className={`w-10 h-5 rounded-full relative transition-all ${val ? '' : 'opacity-40'}`}
                         style={{ background: val ? 'var(--accent)' : 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${val ? 'left-5' : 'left-0.5'}`}
                           style={{ background: val ? '#0B1F33' : 'var(--text-muted)' }} />
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{val ? 'Enabled' : 'Disabled'}</span>
                  </label>
                ) : (
                  <input type={field.type} value={String(val)} onChange={e => set(key, e.target.value)} placeholder={field.placeholder}
                         className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                         style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                )}
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { onSave(vals); onClose() }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
            <Check size={14} /> Save settings
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm border hover:bg-[var(--bg-secondary)] transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Plugin card ─────────────────────────────────── */
function PluginCard({ manifest, state, onInstall, onUninstall, onToggle, onConfigure }: {
  manifest: PluginManifest
  state?: PluginState
  onInstall(): void
  onUninstall(): void
  onToggle(): void
  onConfigure(): void
}) {
  const installed = state?.installed ?? false
  const enabled   = state?.enabled   ?? false

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: installed ? 'var(--border)' : 'rgba(255,255,255,0.04)' }}>
      <div className="flex items-start gap-4">
        <div className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
             style={{ background: CATEGORY_COLORS[manifest.category] ?? 'var(--bg-secondary)' }}>
          {manifest.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{manifest.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                  style={{ background: CATEGORY_COLORS[manifest.category], color: CATEGORY_TEXT[manifest.category] }}>
              {manifest.category}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>v{manifest.version}</span>
          </div>
          <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{manifest.description}</p>

          <div className="flex flex-wrap gap-2">
            {!installed ? (
              <button onClick={onInstall}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}>
                <Download size={12} /> Install
              </button>
            ) : (
              <>
                <button onClick={onToggle}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${enabled ? 'hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400' : ''}`}
                        style={{ borderColor: enabled ? 'rgba(74,222,128,0.3)' : 'var(--border)', background: enabled ? 'rgba(74,222,128,0.08)' : 'var(--bg-secondary)', color: enabled ? '#4ADE80' : 'var(--text-muted)' }}>
                  <Power size={12} /> {enabled ? 'Enabled' : 'Disabled'}
                </button>
                {manifest.settingsSchema && (
                  <button onClick={onConfigure}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:bg-[var(--bg-secondary)]"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    <Settings size={12} /> Configure
                  </button>
                )}
                <button onClick={onUninstall}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <Trash2 size={12} /> Uninstall
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main ────────────────────────────────────────── */
export default function Plugins() {
  const { config, updateConfig } = useSiteConfig()
  const [configuring, setConfiguring] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  function getState(id: string): PluginState | undefined {
    return config.plugins.find(p => p.id === id)
  }

  function install(id: string) {
    updateConfig(c => ({
      ...c,
      plugins: [...c.plugins.filter(p => p.id !== id), { id, installed: true, enabled: false, settings: {} }],
    }))
  }
  function uninstall(id: string) {
    updateConfig(c => ({ ...c, plugins: c.plugins.filter(p => p.id !== id) }))
  }
  function toggle(id: string) {
    updateConfig(c => ({
      ...c,
      plugins: c.plugins.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p),
    }))
  }
  function saveSettings(id: string, settings: Record<string, unknown>) {
    updateConfig(c => ({
      ...c,
      plugins: c.plugins.map(p => p.id === id ? { ...p, settings } : p),
    }))
  }

  const categories = ['all', ...Array.from(new Set(PLUGIN_REGISTRY.map(p => p.category)))]
  const filtered = filter === 'all' ? PLUGIN_REGISTRY : PLUGIN_REGISTRY.filter(p => p.category === filter)
  const installedCount = config.plugins.filter(p => p.installed).length
  const enabledCount   = config.plugins.filter(p => p.installed && p.enabled).length

  const configuringPlugin = configuring ? PLUGIN_REGISTRY.find(p => p.id === configuring) : null
  const configuringState  = configuring ? getState(configuring) : null

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-semibold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Plugins & Tools</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {installedCount} installed · {enabledCount} enabled
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${filter === cat ? '' : 'opacity-60 hover:opacity-80'}`}
                  style={{
                    borderColor: filter === cat ? 'var(--accent)' : 'var(--border)',
                    background:  filter === cat ? 'rgba(201,168,76,0.1)' : 'var(--bg-card)',
                    color:       filter === cat ? 'var(--accent)' : 'var(--text-secondary)',
                  }}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(manifest => (
            <PluginCard
              key={manifest.id}
              manifest={manifest}
              state={getState(manifest.id)}
              onInstall={() => install(manifest.id)}
              onUninstall={() => uninstall(manifest.id)}
              onToggle={() => toggle(manifest.id)}
              onConfigure={() => setConfiguring(manifest.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Settings modal */}
      <AnimatePresence>
        {configuringPlugin && configuringState && (
          <PluginSettings
            manifest={configuringPlugin}
            state={configuringState}
            onSave={settings => saveSettings(configuringPlugin.id, settings)}
            onClose={() => setConfiguring(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
