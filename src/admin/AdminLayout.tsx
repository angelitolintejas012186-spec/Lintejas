import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Palette, Image, Puzzle, Settings, LogOut, ChevronLeft, ChevronRight, Globe } from 'lucide-react'
import TheInterlockLogo from '../components/TheInterlockLogo'
import { useSiteConfig } from '../lib/SiteConfigContext'
import { PLUGIN_REGISTRY } from '../lib/plugins'

const CORE_NAV = [
  { to: '/admin',           label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { to: '/admin/branding',  label: 'Branding',   icon: Image },
  { to: '/admin/theme',     label: 'Theme',      icon: Palette },
  { to: '/admin/plugins',   label: 'Plugins',    icon: Puzzle },
  { to: '/admin/settings',  label: 'Settings',   icon: Settings },
]

function NavItem({ to, label, icon: Icon, exact }: { to: string; label: string; icon: React.ElementType; exact?: boolean }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? 'text-[#0B1F33] bg-gradient-to-r from-[#E8C96C] to-[#C9A84C]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
        }`
      }
    >
      <Icon size={16} className="flex-shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export default function AdminLayout() {
  const { config, user, signOut, isDirty, saveConfig } = useSiteConfig()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const enabledNavPlugins = config.plugins
    .filter(p => p.installed && p.enabled)
    .map(p => PLUGIN_REGISTRY.find(r => r.id === p.id))
    .filter((p): p is NonNullable<typeof p> => p != null)

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside
        className="relative flex flex-col border-r flex-shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Brand */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b ${collapsed ? 'justify-center' : ''}`}
             style={{ borderColor: 'var(--border)', minHeight: 64 }}>
          <TheInterlockLogo size={32} />
          {!collapsed && (
            <div>
              <p className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
                Linte<span style={{ color: 'var(--accent)' }}>jas</span>
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Admin</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {CORE_NAV.map(item => (
            <div key={item.to} title={collapsed ? item.label : undefined}>
              {collapsed ? (
                <NavLink to={item.to} end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all ${
                      isActive ? 'bg-[var(--accent)] text-[#0B1F33]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                    }`
                  }>
                  <item.icon size={16} />
                </NavLink>
              ) : (
                <NavItem {...item} />
              )}
            </div>
          ))}

          {enabledNavPlugins.length > 0 && !collapsed && (
            <>
              <div className="pt-3 pb-1 px-3">
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Plugins</p>
              </div>
              {enabledNavPlugins.map(p => (
                <NavLink key={p.id} to={`/admin/plugins`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all">
                  <span>{p.icon}</span><span>{p.name}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.email}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Site owner</p>
            </div>
          )}
          <Link to="/" target="_blank" rel="noopener noreferrer" title="View site"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs transition-all hover:bg-[var(--bg-card)]"
                style={{ color: 'var(--text-muted)' }}>
            <Globe size={14} />
            {!collapsed && 'View site'}
          </Link>
          <button onClick={handleSignOut}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-red-500/10 hover:text-red-400`}
                  style={{ color: 'var(--text-muted)' }}>
            <LogOut size={14} className="flex-shrink-0" />
            {!collapsed && 'Sign out'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center border z-10 transition-colors hover:bg-[var(--accent)]"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', height: 64 }}>
          <div />
          <div className="flex items-center gap-3">
            {isDirty && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={saveConfig}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)', color: '#0B1F33' }}
              >
                Save changes
              </motion.button>
            )}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                 style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}>
              {user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6 h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
