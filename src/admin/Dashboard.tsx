import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Image, Palette, Puzzle, ArrowRight } from 'lucide-react'
import { useSiteConfig } from '../lib/SiteConfigContext'
import TheInterlockLogo from '../components/TheInterlockLogo'

const QUICK_ACTIONS = [
  { to: '/admin/branding', icon: Image,   title: 'Branding',   desc: 'Edit logo, brand name, and identity' },
  { to: '/admin/theme',    icon: Palette, title: 'Theme',      desc: 'Apply a photo as the site theme' },
  { to: '/admin/plugins',  icon: Puzzle,  title: 'Plugins',    desc: 'Install and configure site extensions' },
]

export default function Dashboard() {
  const { config, user } = useSiteConfig()
  const installed = config.plugins.filter(p => p.installed).length
  const enabled   = config.plugins.filter(p => p.installed && p.enabled).length
  const hasTheme  = Boolean(config.theme.sourceImage)
  const hasLogo   = Boolean(config.branding.logo.src)

  return (
    <div className="max-w-5xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display font-semibold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
          Welcome back, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Lintejas Admin — manage your site from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Plugins installed', value: installed },
          { label: 'Plugins enabled',   value: enabled },
          { label: 'Custom theme',       value: hasTheme ? 'Yes' : 'No' },
          { label: 'Custom logo',        value: hasLogo  ? 'Yes' : 'No' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-2xl font-display font-semibold" style={{ color: 'var(--accent)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {QUICK_ACTIONS.map(({ to, icon: Icon, title, desc }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link to={to} className="block rounded-xl p-6 border group transition-all hover:border-[var(--accent)]"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <Icon size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Interlock preview */}
      <div className="rounded-xl p-7 border flex items-center gap-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <TheInterlockLogo size={48} />
        <div>
          <p className="font-medium text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>The Interlock</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Your brand baseline. Upload a custom logo in Branding → or leave The Interlock as your mark.
          </p>
        </div>
      </div>
    </div>
  )
}
