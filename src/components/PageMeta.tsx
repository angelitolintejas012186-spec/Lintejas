import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import META from '../lib/page-meta.json'

/* Per-page title, description, canonical and share tags while moving between pages in the app.
   The same values are written into each page's own HTML file at build time (scripts/prerender.mjs),
   which is what search engines and link previews read. Unknown addresses are left to NotFound. */
type Meta = { title: string; description: string; image?: string; imageAlt?: string }
const PAGES = META as unknown as Record<string, Meta>
const SITE = 'https://lintejas.io'
const DEFAULT_IMAGE = `${SITE}/og-image.png?v=3`
const DEFAULT_ALT = 'Lintejas logo — a gold frame with a gold cube in the centre'

function set(selector: string, attr: string, value: string) {
  document.querySelector(selector)?.setAttribute(attr, value)
}

export default function PageMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
    const m = PAGES[path]
    if (!m || path.startsWith('_')) return
    const url = SITE + (path === '/' ? '/' : path)
    document.title = m.title
    set('meta[name="description"]', 'content', m.description)
    set('link[rel="canonical"]', 'href', url)
    set('meta[property="og:url"]', 'content', url)
    set('meta[property="og:title"]', 'content', m.title)
    set('meta[property="og:description"]', 'content', m.description)
    set('meta[property="og:image"]', 'content', m.image ?? DEFAULT_IMAGE)
    set('meta[property="og:image:alt"]', 'content', m.imageAlt ?? DEFAULT_ALT)
    set('meta[name="twitter:title"]', 'content', m.title)
    set('meta[name="twitter:description"]', 'content', m.description)
    set('meta[name="twitter:image"]', 'content', m.image ?? DEFAULT_IMAGE)
    set('meta[name="twitter:image:alt"]', 'content', m.imageAlt ?? DEFAULT_ALT)
  }, [pathname])
  return null
}
