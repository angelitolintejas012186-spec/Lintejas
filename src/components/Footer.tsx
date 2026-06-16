import { Link } from 'react-router-dom'
import TheInterlockLogo from './TheInterlockLogo'
import BrandName from './BrandName'

export default function Footer() {
  return (
    <footer className="border-t mt-24" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <TheInterlockLogo size={36} />
              <BrandName overrideConfig={{ x: 0, y: 0 }} className="text-xl font-display font-semibold" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              A European technology holding company building precision software for industry.
              Registered in the Slovak Republic.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>Company</h4>
            <ul className="space-y-2">
              {[
                { to: '/about',     label: 'About' },
                { to: '/companies', label: 'Portfolio' },
                { to: '/services',  label: 'Services' },
                { to: '/contact',   label: 'Contact' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-secondary)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact#impressum" className="text-sm transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-secondary)' }}>
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Lintejas s.r.o. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Slovak Republic · EU VAT registered
          </p>
        </div>
      </div>
    </footer>
  )
}
