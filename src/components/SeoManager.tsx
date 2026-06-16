import { useEffect } from 'react'
import { useSiteConfig } from '../lib/SiteConfigContext'

function setMeta(attr: string, name: string, content: string) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function SeoManager() {
  const { config } = useSiteConfig()
  const plugin = config.plugins.find(p => p.id === 'seo-manager' && p.installed && p.enabled)

  useEffect(() => {
    if (!plugin) return
    const s = plugin.settings as Record<string, string>
    if (s.defaultTitle) document.title = s.defaultTitle
    setMeta('name',     'description',    s.defaultDescription ?? '')
    setMeta('property', 'og:title',       s.ogTitle ?? s.defaultTitle ?? '')
    setMeta('property', 'og:description', s.defaultDescription ?? '')
  }, [plugin])

  return null
}
