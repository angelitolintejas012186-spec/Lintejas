import { Navigate } from 'react-router-dom'
import { useSiteConfig } from '../lib/SiteConfigContext'

/* Admin pages: signed in AND the account is in the database's site_admins list (Oct 2026).
   The database enforces the same rule on every save and upload; this screen only keeps others out of the UI. */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin, signOut } = useSiteConfig()
  if (isLoading || (user && isAdmin === null)) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )
  if (!user) return <Navigate to="/admin/login" replace />
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0B1F33' }}>
      <div className="w-full max-w-md rounded-2xl p-8 border text-center" style={{ background: '#0F2640', borderColor: 'rgba(201,168,76,0.15)' }}>
        <h1 className="text-xl font-display font-semibold mb-2" style={{ color: '#F0EDE8' }}>Not an admin account</h1>
        <p className="text-sm mb-6" style={{ color: '#9BAAB8' }}>This account can't open the admin dashboard.</p>
        <button onClick={() => { void signOut() }} className="w-full py-3.5 rounded-xl font-medium"
                style={{ background: 'linear-gradient(135deg, #E8C96C 0%, #C9A84C 100%)', color: '#0B1F33' }}>
          Sign out
        </button>
      </div>
    </div>
  )
  return <>{children}</>
}
