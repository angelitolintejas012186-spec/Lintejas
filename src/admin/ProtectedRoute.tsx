import { Navigate } from 'react-router-dom'
import { useSiteConfig } from '../lib/SiteConfigContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSiteConfig()
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )
  if (!user) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
