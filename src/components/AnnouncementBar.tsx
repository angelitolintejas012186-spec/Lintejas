import { useState } from 'react'
import { X } from 'lucide-react'
import { useSiteConfig } from '../lib/SiteConfigContext'

export default function AnnouncementBar() {
  const { config } = useSiteConfig()
  const [dismissed, setDismissed] = useState(false)

  const plugin = config.plugins.find(p => p.id === 'announcement-bar' && p.installed && p.enabled)
  if (!plugin || dismissed) return null

  const s = plugin.settings as Record<string, string | boolean>
  if (!s.message) return null

  return (
    <div
      className="w-full flex items-center justify-center gap-4 px-4 py-2.5 text-sm font-medium text-white relative"
      style={{ background: String(s.color ?? '#C9A84C') }}
    >
      <span>
        {String(s.message)}
        {s.link && (
          <a href={String(s.link)} className="ml-2 underline underline-offset-2 hover:opacity-80">
            {String(s.linkText || 'Learn more')} →
          </a>
        )}
      </span>
      {s.dismissable !== false && (
        <button onClick={() => setDismissed(true)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
