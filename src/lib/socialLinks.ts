/* Social links for NegosyoPlans agent applications (Angie, 2 Nov 2026).
   The same rules as the shop's functions/_lib/agent-apply.js (checkSocialLink / cleanSocial) — the shop re-checks
   everything, this copy only drives the live ✓ / message per row on /affiliates. Keep the two in step. */

export const SOCIAL_MAX = 4
export const SOCIAL_URL_MAX = 200
const FB = ['facebook.com', 'm.facebook.com', 'web.facebook.com', 'fb.com']
export const SOCIAL_HOSTS: Record<string, string[] | null> = {
  facebook_page: FB, facebook_account: FB,
  tiktok: ['tiktok.com', 'vm.tiktok.com'], instagram: ['instagram.com'], youtube: ['youtube.com', 'youtu.be'],
  x: ['x.com', 'twitter.com'], threads: ['threads.net'], other: null,
}
export const SOCIAL_PLATFORMS = Object.keys(SOCIAL_HOSTS)
export type SocialReason = 'bad_platform' | 'empty' | 'http' | 'bad_url' | 'credentials' | 'too_long' | 'wrong_host' | 'own_site' | 'duplicate'
export type SocialCheck = { url: string; reason?: undefined } | { url?: undefined; reason: SocialReason }

const bare = (h: string) => h.replace(/^www\./, '')

export function checkSocialLink(platform: string, raw: unknown): SocialCheck {
  if (!SOCIAL_PLATFORMS.includes(platform)) return { reason: 'bad_platform' }
  let s = String(raw == null ? '' : raw).trim()
  if (!s) return { reason: 'empty' }
  if (/^http:\/\//i.test(s)) return { reason: 'http' }
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = 'https://' + s.replace(/^\/+/, '')
  if (s.length > SOCIAL_URL_MAX) return { reason: 'too_long' }
  let u: URL
  try { u = new URL(s) } catch { return { reason: 'bad_url' } }
  if (u.protocol !== 'https:') return { reason: u.protocol === 'http:' ? 'http' : 'bad_url' }
  if (u.username || u.password) return { reason: 'credentials' }
  const host = bare(u.hostname.toLowerCase())
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) || /^\d+(\.\d+){3}$/.test(host)) return { reason: 'bad_url' }
  const allowed = SOCIAL_HOSTS[platform]
  if (allowed) { if (!allowed.includes(host)) return { reason: 'wrong_host' } }
  else if (/(^|\.)(negosyoplans\.com|lintejas\.io)$/.test(host)) return { reason: 'own_site' }
  if (u.href.length > SOCIAL_URL_MAX) return { reason: 'too_long' }
  return { url: u.href }
}

const sameKey = (url: string) => { const u = new URL(url); return bare(u.hostname) + u.pathname.replace(/\/+$/, '').toLowerCase() + u.search }

/* One result per row; a repeat of an earlier valid link is 'duplicate'. */
export function checkSocialRows(rows: { platform: string; url: string }[]): SocialCheck[] {
  const seen = new Set<string>()
  return rows.map(r => {
    const c = checkSocialLink(r.platform, r.url)
    if (c.url) { const k = sameKey(c.url); if (seen.has(k)) return { reason: 'duplicate' }; seen.add(k) }
    return c
  })
}
