/* ── Single source of truth for contact channels (item 121) ──────────────────
   WHATSAPP_NUMBER is the ONE switch for every WhatsApp surface on the site
   (floating button, footer social icon, FAQ CTA, Contact page). While it is
   '' the placeholder is never rendered anywhere — the components stay in the
   tree, they just don't show. Set it to digits only (country code + number,
   no '+', spaces or dashes — e.g. '639171234567') to turn them all on at once.
   ──────────────────────────────────────────────────────────────────────────── */
export const WHATSAPP_NUMBER = ''

/** wa.me link for the given prefilled text, or '' when no number is set. */
export function whatsappHref(text?: string): string {
  if (!WHATSAPP_NUMBER) return ''
  const q = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${WHATSAPP_NUMBER}${q}`
}

/** Public contact email (reported, unchanged). */
export const CONTACT_EMAIL = 'hello@lintejas.com'

/* Client Login destination (item 121 #2). Empty '' → the NavBar "Client Login" button
   is not rendered (component kept). It previously pointed at
   https://skillvue-production.up.railway.app/demo-entry — hidden while SkillVue is
   coming soon. Set a real URL to bring the button back everywhere at once. */
export const CLIENT_LOGIN_URL = ''

/* Social profile URLs — each footer icon renders ONLY when its URL is set (code kept,
   hidden while empty, same pattern as above). Hidden pending account confirmation:
   the Lintejas.io Facebook page is linked to Instagram @negosyoplans (not @lintejas),
   and the LinkedIn/IG @lintejas handles aren't confirmed yet. Facebook is live below.
   To re-enable: LINKEDIN_URL = 'https://linkedin.com/company/lintejas';
                 INSTAGRAM_URL = 'https://instagram.com/lintejas'. */
export const LINKEDIN_URL  = ''
export const INSTAGRAM_URL = ''
