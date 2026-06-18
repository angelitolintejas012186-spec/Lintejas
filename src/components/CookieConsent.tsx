import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'lintejas-cookie-consent'

export function getCookieConsent(): 'all' | 'essential' | null {
  try { return localStorage.getItem(STORAGE_KEY) as 'all' | 'essential' | null }
  catch { return null }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true)
  }, [])

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, 'all') } catch { /* private mode */ }
    setVisible(false)
  }

  function reject() {
    try { localStorage.setItem(STORAGE_KEY, 'essential') } catch { /* private mode */ }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '110%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30, delay: 1.2 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10000,
            borderTop: '1px solid rgba(212,168,67,0.35)',
            background: 'rgba(8,18,36,0.97)',
            backdropFilter: 'blur(24px)',
          }}
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
        >
          {/* Gold top-line shimmer */}
          <div
            style={{
              position: 'absolute', top: -1, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.55) 50%, transparent 100%)',
            }}
          />

          <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

              {/* Cookie icon + text */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: 1 }}>🍪</span>
                <p className="text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>
                  We use cookies to improve your experience and analyse site traffic. Only essential
                  cookies are active by default.{' '}
                  <Link
                    to="/contact"
                    className="underline underline-offset-2 transition-colors duration-200"
                    style={{ color: 'rgba(212,168,67,0.85)' }}
                    onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--gold)')}
                    onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(212,168,67,0.85)')}
                  >
                    Privacy policy
                  </Link>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={reject}
                  className="text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#94A3B8',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(255,255,255,0.10)'
                    el.style.color = '#F0F4F8'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(255,255,255,0.05)'
                    el.style.color = '#94A3B8'
                  }}
                >
                  Essential only
                </button>
                <button
                  onClick={accept}
                  className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #E8C766, #D4A843)',
                    color: '#0A1628',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
