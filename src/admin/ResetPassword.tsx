import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import TheInterlockLogo from '../components/TheInterlockLogo'
import { useSiteConfig } from '../lib/SiteConfigContext'

/* /admin/reset (Oct 2026): the "Forgot password?" email links here. Supabase signs the account in from the link
   (detectSessionInUrl); this page then sets the new password. An expired or used link shows a way to get a new one.
   Nothing here is logged; the password goes only to Supabase. */
const MIN_LENGTH = 12

function linkError(): string | null {
  const p = new URLSearchParams(window.location.hash.slice(1) || window.location.search.slice(1))
  return p.get('error_description') || p.get('error') ? 'This reset link has expired or was already used.' : null
}

export default function ResetPassword() {
  const { user, authReady, updatePassword } = useSiteConfig()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [saving, setSaving]     = useState(false)
  const [done, setDone]         = useState(false)
  const badLink = linkError()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < MIN_LENGTH) { setError(`Use at least ${MIN_LENGTH} characters.`); return }
    if (password !== confirm) { setError('The two passwords do not match.'); return }
    setSaving(true)
    try {
      await updatePassword(password)
      setPassword(''); setConfirm('')
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the new password. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl text-sm outline-none border focus:ring-1 transition-all'
  const inputStyle: React.CSSProperties = { background: '#0F2640', borderColor: 'rgba(201,168,76,0.2)', color: '#F0EDE8' }
  const goldButton: React.CSSProperties = { background: 'linear-gradient(135deg, #E8C96C 0%, #C9A84C 100%)', color: '#0B1F33' }

  let body: React.ReactNode
  if (done) {
    body = (
      <div className="space-y-5">
        <div className="p-4 rounded-xl text-sm" role="status" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#86EFAC' }}>
          Your new password is saved. Use it next time you sign in.
        </div>
        <Link to="/admin" className="block w-full py-3.5 rounded-xl font-medium text-center" style={goldButton}>Go to the dashboard</Link>
      </div>
    )
  } else if (!authReady && !badLink) {
    body = (
      <div className="flex flex-col items-center gap-4 py-6" role="status">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: '#9BAAB8' }}>Checking your reset link…</p>
      </div>
    )
  } else if (!user) {
    body = (
      <div className="space-y-5">
        <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}>
          {badLink ?? 'Open this page from the reset link in your email.'} Links work once, for 1 hour.
        </div>
        <Link to="/admin/login?forgot" className="block w-full py-3.5 rounded-xl font-medium text-center" style={goldButton}>Send a new reset link</Link>
      </div>
    )
  } else {
    body = (
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-sm" style={{ color: '#9BAAB8' }}>
          Choose a new password for <strong style={{ color: '#F0EDE8' }}>{user.email}</strong>. At least {MIN_LENGTH} characters; a password manager can make one for you.
        </p>
        {error && (
          <div className="p-3 rounded-xl text-sm" role="alert" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}>{error}</div>
        )}
        <div>
          <label htmlFor="new-password" className="block text-xs font-medium mb-2" style={{ color: '#9BAAB8' }}>New password</label>
          <div className="relative">
            <input id="new-password" type={showPw ? 'text' : 'password'} required minLength={MIN_LENGTH} value={password}
                   onChange={e => setPassword(e.target.value)} autoComplete="new-password"
                   className={inputClass} style={{ ...inputStyle, paddingRight: '2.75rem' }} />
            <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 flex items-center justify-center"
                    style={{ color: '#9BAAB8', width: 44, height: 44 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-xs font-medium mb-2" style={{ color: '#9BAAB8' }}>Type it again</label>
          <input id="confirm-password" type={showPw ? 'text' : 'password'} required minLength={MIN_LENGTH} value={confirm}
                 onChange={e => setConfirm(e.target.value)} autoComplete="new-password"
                 className={inputClass} style={inputStyle} />
        </div>
        <button type="submit" disabled={saving}
                className="w-full py-3.5 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" style={goldButton}>
          {saving ? 'Saving…' : 'Save new password'}
        </button>
      </form>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0B1F33' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="rounded-2xl p-8 border" style={{ background: '#0F2640', borderColor: 'rgba(201,168,76,0.15)' }}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5"><TheInterlockLogo size={56} /></div>
            <h1 className="text-2xl font-display font-semibold mb-1" style={{ color: '#F0EDE8' }}>
              Linte<span style={{ color: '#C9A84C' }}>jas</span>
            </h1>
            <p className="text-sm" style={{ color: '#9BAAB8' }}>Set a new admin password</p>
          </div>
          {body}
          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
            <a href="/" className="text-xs hover:underline" style={{ color: '#5A7490' }}>← Return to website</a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
