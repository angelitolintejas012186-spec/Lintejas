import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SiteLogo from './SiteLogo'
import BrandName from './BrandName'
import { useSiteConfig } from '../lib/SiteConfigContext'
import { PLUGIN_REGISTRY } from '../lib/plugins'

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/about',     label: 'About' },
  { to: '/companies', label: 'Companies' },
  { to: '/services',  label: 'Services' },
  { to: '/contact',   label: 'Contact' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { config } = useSiteConfig()

  // Enabled nav-injecting plugins
  const navPlugins = config.plugins
    .filter(p => p.installed && p.enabled)
    .map(p => PLUGIN_REGISTRY.find(r => r.id === p.id))
    .filter((p): p is NonNullable<typeof p> => p?.mountPoint === 'nav')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 min-w-0" onClick={() => setOpen(false)}>
          <SiteLogo overrideConfig={{ x: 0, y: 0 }} />
          <BrandName overrideConfig={{ x: 0, y: 0 }} className="font-display font-semibold whitespace-nowrap" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.to
                  ? 'text-[var(--accent)] bg-[var(--bg-card)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {navPlugins.map(p => (
            <span key={p.id} className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)]">
              {p.icon} {p.name}
            </span>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t overflow-hidden"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.to
                      ? 'text-[var(--accent)] bg-[var(--bg-card)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
