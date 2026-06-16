import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import TheInterlockLogo from '../components/TheInterlockLogo'
import { useSiteConfig } from '../lib/SiteConfigContext'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Login() {
  const { user, signIn } = useSiteConfig()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  if (user) return <Navigate to="/admin" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl text-sm outline-none border focus:ring-1 transition-all'
  const inputStyle: React.CSSProperties = {
    background: '#0F2640',
    borderColor: 'rgba(201,168,76,0.2)',
    color: '#F0EDE8',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0B1F33' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl p-8 border" style={{ background: '#0F2640', borderColor: 'rgba(201,168,76,0.15)' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <TheInterlockLogo size={56} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
                 style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}>
              System Administration
            </div>
            <h1 className="text-2xl font-display font-semibold mb-1" style={{ color: '#F0EDE8' }}>
              Linte<span style={{ color: '#C9A84C' }}>jas</span>
            </h1>
            <p className="text-sm" style={{ color: '#9BAAB8' }}>Sign in to the admin dashboard</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-5 p-3 rounded-xl text-xs" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#FBBF24' }}>
              ⚠️ Supabase is not yet configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> env vars to enable authentication.
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#9BAAB8' }}>Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className={inputClass} style={inputStyle} placeholder="admin@lintejas.com" autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#9BAAB8' }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  className={inputClass} style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  placeholder="••••••••••" autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                        style={{ color: '#9BAAB8' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading || !isSupabaseConfigured}
              className="w-full py-3.5 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #E8C96C 0%, #C9A84C 100%)', color: '#0B1F33' }}
            >
              {loading ? 'Signing in…' : 'Sign in to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <a href="/" className="text-xs hover:underline" style={{ color: '#5A7490' }}>← Return to website</a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
