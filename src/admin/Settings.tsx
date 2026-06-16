import { useState } from 'react'
import { Check } from 'lucide-react'
import { useSiteConfig } from '../lib/SiteConfigContext'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Settings() {
  const { user, signOut } = useSiteConfig()
  const [toast, _setToast] = useState('')

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Account and site configuration</p>
      </div>

      {toast && (
        <div className="mb-5 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
             style={{ background: '#0B2F1A', color: '#4ADE80', border: '1px solid #166534' }}>
          <Check size={14} /> {toast}
        </div>
      )}

      {/* Account */}
      <section className="rounded-2xl border p-6 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>Account</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
               style={{ background: 'var(--bg-secondary)', color: 'var(--accent)', border: '2px solid var(--border)' }}>
            {user?.email?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.email}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Site owner</p>
          </div>
        </div>
        <button onClick={signOut} className="px-5 py-2.5 rounded-xl text-sm border transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          Sign out
        </button>
      </section>

      {/* Backend status */}
      <section className="rounded-2xl border p-6 mb-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Backend</h2>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-green-400' : 'bg-amber-400'}`} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {isSupabaseConfigured ? 'Supabase connected — data persists across devices' : 'Supabase not configured — using local storage only'}
          </p>
        </div>
        {!isSupabaseConfigured && (
          <div className="mt-4 p-4 rounded-xl text-xs leading-relaxed" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
            To enable cross-device persistence, set <code className="px-1 py-0.5 rounded" style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}>VITE_SUPABASE_URL</code> and <code className="px-1 py-0.5 rounded" style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}>VITE_SUPABASE_ANON_KEY</code> in your <code>.env.local</code> file and as GitHub Actions secrets.
            <br /><br />
            Then create the <code>site_config</code> table in Supabase and enable RLS as described in the setup guide.
          </div>
        )}
      </section>

      {/* Site info */}
      <section className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Site information</h2>
        <div className="space-y-3">
          {[
            { label: 'Site URL',       value: 'https://lintejas.io' },
            { label: 'Framework',      value: 'React 18 + Vite + TypeScript' },
            { label: 'Deployment',     value: 'GitHub Actions → GitHub Pages' },
            { label: 'Storage',        value: isSupabaseConfigured ? 'Supabase Storage + Postgres' : 'localStorage (no Supabase)' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-4 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs w-28 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span className="text-xs font-mono break-all" style={{ color: 'var(--text-secondary)' }}>{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
