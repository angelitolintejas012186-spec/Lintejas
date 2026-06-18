import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'
import SocialIcons from './SocialIcons'

const NAV = [
  {
    heading: 'Company',
    links: [
      { to: '/about',     label: 'About'    },
      { to: '/companies', label: 'Portfolio' },
      { to: '/services',  label: 'Services'  },
      { to: '/contact',   label: 'Contact'   },
    ],
  },
  {
    heading: 'Ventures',
    links: [
      { to: '/companies', label: 'SkillVue'           },
      { to: '/companies', label: 'MCIS'               },
      { to: '/companies', label: 'Staff Scheduler Pro' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/contact', label: 'Impressum' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative">
      {/* Gradient underglow — fades up from navy into the section above */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,67,0.03))' }}
      />

      {/* Top hairline separator */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.22) 50%, transparent 100%)' }}
      />

      <div
        className="relative"
        style={{ background: 'var(--navy)' }}
      >
        {/* Ambient gold bloom behind the logo */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.05) 0%, transparent 70%)' }}
        />

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-16 pb-10">

          {/* ── Upper row ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">

            {/* Brand */}
            <div>
              <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
                <BrandMark />
                <span className="font-display font-semibold text-lg" style={{ color: 'var(--cream)' }}>
                  Linte<span style={{ color: 'var(--gold)' }}>j</span>as
                </span>
              </Link>

              <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: 'var(--slate)' }}>
                A European technology holding company building precision software for industries that
                shape the world. Registered in the Slovak Republic.
              </p>

              {/* Trust marks */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
                {['EU GDPR', 'ISO/HACCP', 'MFA Security'].map(tag => (
                  <span key={tag} className="text-xs" style={{ color: 'var(--slate)' }}>
                    <span style={{ color: 'var(--bronze)' }}>—</span> {tag}
                  </span>
                ))}
              </div>

              {/* Social icons */}
              <SocialIcons />
            </div>

            {/* Nav columns */}
            {NAV.map(col => (
              <div key={col.heading}>
                <p
                  className="text-xs font-medium uppercase tracking-widest mb-4"
                  style={{ color: 'var(--gold)' }}
                >
                  {col.heading}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-sm transition-colors duration-200"
                        style={{ color: 'var(--slate)' }}
                        onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--cream)')}
                        onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--slate)')}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ────────────────────────────────── */}
          <div
            className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderColor: 'rgba(212,168,67,0.10)' }}
          >
            <p className="text-xs" style={{ color: 'var(--slate)' }}>
              © {year} Lintejas s.r.o. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: 'var(--slate)' }}>
              Slovak Republic · European Union
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
