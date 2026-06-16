import { useEffect } from 'react'
import { useSiteConfig } from '../lib/SiteConfigContext'

export default function Analytics() {
  const { config } = useSiteConfig()
  const plugin = config.plugins.find(p => p.id === 'analytics' && p.installed && p.enabled)

  useEffect(() => {
    document.getElementById('analytics-s1')?.remove()
    document.getElementById('analytics-s2')?.remove()

    if (!plugin) return
    const s = plugin.settings as Record<string, string>
    if (!s.trackingId) return

    if (s.provider === 'google-analytics') {
      const s1 = document.createElement('script')
      s1.id = 'analytics-s1'
      s1.async = true
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(s.trackingId)}`
      document.head.appendChild(s1)

      const s2 = document.createElement('script')
      s2.id = 'analytics-s2'
      s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(s.trackingId)});`
      document.head.appendChild(s2)
    } else if (s.provider === 'plausible') {
      const sc = document.createElement('script')
      sc.id = 'analytics-s1'
      sc.defer = true
      sc.setAttribute('data-domain', s.trackingId)
      sc.src = 'https://plausible.io/js/script.js'
      document.head.appendChild(sc)
    }

    return () => {
      document.getElementById('analytics-s1')?.remove()
      document.getElementById('analytics-s2')?.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugin?.enabled, JSON.stringify(plugin?.settings)])

  return null
}
