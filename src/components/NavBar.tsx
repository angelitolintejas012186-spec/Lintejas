import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BrandMark from './BrandMark'
import { useSiteConfig } from '../lib/SiteConfigContext'
import { PLUGIN_REGISTRY } from '../lib/plugins'
import { ease } from '../lib/motion'
import { CLIENT_LOGIN_URL, CONTACT_EMAIL, LEGAL_NAME } from '../lib/contact'

/* Same public Facebook page the footer icons link to (SocialIcons.tsx). */
const FACEBOOK_URL = 'https://www.facebook.com/share/19JHHNKiee/'

const NAV_LINKS: { to: string; label: string; section?: string }[] = [
  { to: '/',          label: 'Home' },
  { to: '/about',     label: 'About' },
  { to: '/companies', label: 'Brands' },
  { to: '/services',  label: 'Services' },
  { to: '/',          label: 'Pricing', section: 'pricing' },
  { to: '/',          label: 'FAQ',     section: 'faq'     },
  { to: '/contact',   label: 'Contact' },
]

export default function NavBar() {
  const [open,      setOpen]      = useState(false)
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const { config }   = useSiteConfig()

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
    // Not on home yet — navigate then scroll
    navigate('/')
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350)
  }

  /* Close mobile menu on route change */
  useEffect(() => { setOpen(false) }, [pathname])

  /* Drawer open: lock page scroll (scrollbar width compensated → no layout shift), Escape closes,
     focus moves to the close button and returns to the burger on close. */
  const burgerRef = useRef<HTMLButtonElement>(null)
  const closeRef  = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const html = document.documentElement, body = document.body
    const sbw = window.innerWidth - html.clientWidth
    const prev = { h: html.style.overflow, b: body.style.overflow, p: body.style.paddingRight }
    html.style.overflow = 'hidden'; body.style.overflow = 'hidden'
    if (sbw > 0) body.style.paddingRight = sbw + 'px'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => closeRef.current?.focus(), 60)
    return () => {
      html.style.overflow = prev.h; body.style.overflow = prev.b; body.style.paddingRight = prev.p
      window.removeEventListener('keydown', onKey); window.clearTimeout(t)
      burgerRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  const navPlugins = config.plugins
    .filter(p => p.installed && p.enabled)
    .map(p => PLUGIN_REGISTRY.find(r => r.id === p.id))
    .filter((p): p is NonNullable<typeof p> => p?.mountPoint === 'nav')

  /* Solid, static header: opaque site navy (nothing shows through), the SAME look and height at every
     scroll position (no scroll listener). The 80 px bar sits below the iPhone notch/status bar
     (safe-area inset; index.html sets viewport-fit=cover) — main content is offset by the same amount. */
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background:   '#0A1628',
        paddingTop:   'env(safe-area-inset-top)',
        borderBottom: '1px solid rgba(212,168,67,0.12)',
        boxShadow:    '0 8px 24px rgba(0,0,0,0.25)',
      }}
    >
      <nav className="max-w-[1280px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between overflow-x-hidden">

        {/* ── Brand ─────────────────────────────────────────── */}
        <Link
          to="/"
          className="energy-glint flex items-center gap-3 group min-w-0 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-lg"
        >
          {/* No aria-label: the link's accessible name comes from the visible wordmark
              below, so it matches the on-screen text (a11y: label-content-name-mismatch). */}
          <BrandMark size={40} />

          {/* Lockup: LINTEJAS (line 1, unchanged font/size/colour + slow shine) over
              ENGINE (line 2, gold, wide-tracked), replacing the old descriptor. */}
          <span className="flex flex-col justify-center select-none min-w-0">
            <span
              className="brand-shine font-display font-semibold text-xl leading-tight whitespace-nowrap"
              style={{ color: 'var(--cream)', letterSpacing: '0.2em' }}
            >
              <span style={{ color: 'var(--gold)' }}>L</span>INTEJAS
            </span>
            <span
              className="block whitespace-nowrap font-semibold leading-none mt-1.5"
              style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '0.5em' }}
            >
              ENGINE
            </span>
          </span>
        </Link>

        {/* ── Desktop links ──────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = !link.section && pathname === link.to

            if (link.section) {
              return (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.section!)}
                  className="relative px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                  style={{ color: 'var(--slate)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--slate)' }}
                >
                  {link.label}
                </button>
              )
            }

            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
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
                      className="absolute bottom-0.5 left-3 right-3 h-px rounded-full"
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
            <span key={p.id} className="px-3 py-2 text-sm font-medium" style={{ color: 'var(--slate)' }}>
              {p.icon} {p.name}
            </span>
          ))}

          {CLIENT_LOGIN_URL && (
          <a
            href={CLIENT_LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            style={{
              background: 'linear-gradient(135deg, var(--gold), #b8922a)',
              color: '#0a1628',
              boxShadow: '0 2px 12px rgba(212,168,67,0.30)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,168,67,0.50)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(212,168,67,0.30)' }}
          >
            Client Login
          </a>
          )}
        </div>

        {/* ── Mobile toggle ──────────────────────────────────── */}
        <button
          ref={burgerRef}
          onClick={() => setOpen(o => !o)}
          className="lg:hidden flex-shrink-0 p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          style={{ color: 'var(--slate)' }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
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

      {/* Energy Line — decorative gold pulse on the bottom edge (styles in index.css). */}
      <span className="energy-line" aria-hidden="true" />

      {/* ── Mobile drawer — "Serif Editorial" side panel (< lg). Portalled to <body> so it sits above
           every page layer (floating WhatsApp 9999, cookie banner 10000). Same items, order, targets and
           handlers as the desktop nav; transform/opacity-only motion. ───────────────────────────────── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && (
            <div key="mobile-drawer" className="lg:hidden" style={{ position: 'fixed', inset: 0, zIndex: 10001 }} data-lenis-prevent>
              {/* Dimmed page — tap to close */}
              <motion.div
                aria-hidden="true"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(5,9,18,0.65)', touchAction: 'none' }}
              />
              <motion.div
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="np-drawer"
                style={{
                  position: 'absolute', top: 0, right: 0, bottom: 0, width: '86vw', maxWidth: 360,
                  background: 'linear-gradient(165deg,#101d38 0%,#0b1527 70%,#0d1a30 100%)',
                  boxShadow: '-28px 0 70px rgba(0,0,0,0.55)',
                  display: 'flex', flexDirection: 'column', overflowY: 'auto', overscrollBehavior: 'contain',
                  paddingTop: 'max(16px, env(safe-area-inset-top))', paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
                  willChange: 'transform',
                }}
              >
                {/* gold edge — 2px, fading at both ends */}
                <span aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 2,
                  background: 'linear-gradient(180deg,transparent,#c9a84c 18%,#c9a84c 82%,transparent)' }} />

                {/* Header row: eyebrow + close */}
                <div className="flex items-center justify-between" style={{ padding: '0 20px 0 30px' }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.34em', color: '#c9a84c', fontWeight: 600 }}>MENU</span>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                    style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.4)', background: 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', cursor: 'pointer' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                  </button>
                </div>

                {/* Nav — vertically centred serif column */}
                <nav aria-label="Mobile" className="flex-1 flex flex-col justify-center" style={{ padding: '24px 24px 24px 30px' }}>
                  {NAV_LINKS.map(link => {
                    const active = !link.section && pathname === link.to
                    const itemStyle: React.CSSProperties = {
                      minHeight: 54, display: 'flex', alignItems: 'center', gap: 14, width: '100%',
                      fontSize: active ? 30 : 28, lineHeight: 1.1, color: active ? '#e0c068' : '#eef0f5',
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
                    }
                    const inner = (<>
                      {active && <span aria-hidden="true" style={{ width: 26, height: 1, background: '#e0c068', flexShrink: 0 }} />}
                      {link.label}
                    </>)
                    return link.section ? (
                      <button key={link.label} type="button" className="font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-md"
                        style={itemStyle} onClick={() => { setOpen(false); scrollToSection(link.section!) }}>
                        {inner}
                      </button>
                    ) : (
                      <Link key={link.label} to={link.to} aria-current={active ? 'page' : undefined}
                        className="font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-md"
                        style={itemStyle} onClick={() => setOpen(false)}>
                        {inner}
                      </Link>
                    )
                  })}
                </nav>

                {/* Footer */}
                <div style={{ padding: '0 24px 0 30px' }}>
                  <div aria-hidden="true" style={{ height: 1, background: 'rgba(201,168,76,0.25)', marginBottom: 20 }} />
                  {CLIENT_LOGIN_URL && (
                    <a href={CLIENT_LOGIN_URL} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center mb-3 rounded-xl text-sm font-semibold"
                      style={{ minHeight: 50, background: 'linear-gradient(135deg, var(--gold), #b8922a)', color: '#0a1628' }}>
                      Client Login
                    </a>
                  )}
                  {/* Same target as the hero's "View our portfolio" (scroll to #ventures-deck; from another page → home first) */}
                  <button type="button"
                    onClick={() => { setOpen(false); scrollToSection('ventures-deck') }}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                    style={{ minHeight: 50, border: '1px solid #c9a84c', borderRadius: 12, color: '#e0c068', background: 'transparent', cursor: 'pointer' }}>
                    View our portfolio
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </button>
                  <p className="flex flex-wrap items-center" style={{ fontSize: 12, color: '#8a97ad', margin: '12px 0 0', columnGap: 6 }}>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center hover:text-[var(--cream)]" style={{ minHeight: 44 }}>{CONTACT_EMAIL}</a>
                    <span aria-hidden="true">·</span>
                    <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-[var(--cream)]" style={{ minHeight: 44 }}>facebook.com/lintejas</a>
                  </p>
                  <p style={{ fontSize: 11, color: '#6b7890', margin: 0 }}>{LEGAL_NAME}</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </header>
  )
}
