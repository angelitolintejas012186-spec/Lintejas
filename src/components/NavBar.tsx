import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TheInterlockLogo from './TheInterlockLogo'
import { useSiteConfig } from '../lib/SiteConfigContext'
import { PLUGIN_REGISTRY } from '../lib/plugins'
import { ease } from '../lib/motion'

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/about',     label: 'About' },
  { to: '/companies', label: 'Companies' },
  { to: '/services',  label: 'Services' },
  { to: '/contact',   label: 'Contact' },
]

export default function NavBar() {
  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const { pathname } = useLocation()
  const { config }   = useSiteConfig()

  /* Gain frosted glass on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close mobile menu on route change */
  useEffect(() => { setOpen(false) }, [pathname])

  const navPlugins = config.plugins
    .filter(p => p.installed && p.enabled)
    .map(p => PLUGIN_REGISTRY.find(r => r.id === p.id))
    .filter((p): p is NonNullable<typeof p> => p?.mountPoint === 'nav')

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background:   scrolled ? 'rgba(10, 22, 40, 0.75)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212,168,67,0.10)' : '1px solid transparent',
        boxShadow:    scrolled ? '0 1px 0 rgba(232,199,102,0.04), 0 8px 32px rgba(0,0,0,0.20)' : 'none',
      }}
    >
      <nav className="max-w-[1280px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* ── Brand ─────────────────────────────────────────── */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-lg"
          aria-label="Lintejas — home"
        >
          <motion.span
            whileHover={{ rotate: [0, -4, 4, -2, 0], scale: 1.06 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex-shrink-0"
          >
            <TheInterlockLogo size={30} />
          </motion.span>

          <span
            className="font-display font-semibold text-lg tracking-tight select-none whitespace-nowrap"
            style={{ color: 'var(--cream)' }}
          >
            Linte<span style={{ color: 'var(--gold)' }}>j</span>as
          </span>
        </Link>

        {/* ── Desktop links ──────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                style={{
                  color: active ? 'var(--cream)' : 'var(--slate)',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--slate)' }}
              >
                {link.label}

                {/* Animated gold underline */}
                <AnimatePresence>
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0.5 left-4 right-4 h-px rounded-full"
                      style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            )
          })}

          {navPlugins.map(p => (
            <span key={p.id} className="px-4 py-2 text-sm font-medium" style={{ color: 'var(--slate)' }}>
              {p.icon} {p.name}
            </span>
          ))}
        </div>

        {/* ── Mobile toggle ──────────────────────────────────── */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          style={{ color: 'var(--slate)' }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'x' : 'menu'}
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0,   scale: 1   }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      {/* ── Mobile drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'rgba(10, 22, 40, 0.92)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(212,168,67,0.10)',
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const active = pathname === link.to
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25, ease }}
                  >
                    <Link
                      to={link.to}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        color:      active ? 'var(--gold)' : 'var(--slate)',
                        background: active ? 'rgba(212,168,67,0.07)' : 'transparent',
                      }}
                    >
                      {link.label}
                      {active && (
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: 'var(--gold)' }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
