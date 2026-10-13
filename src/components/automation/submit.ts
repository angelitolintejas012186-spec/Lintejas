/* Pilot sign-up → Supabase table `pilot_signups` (insert-only for the public anon key;
   table, row-level security and the per-email limit are set up by Angie in the Supabase
   dashboard — see supabase/migrations/20261013000000_pilot_signups.sql).
   Returns only after the database confirmed the row, so the page never says "sent" when it wasn't.
   './supabase' is imported dynamically, same as SiteConfigContext, to keep it out of the main bundle. */

export interface PilotSignup {
  name: string
  business_name: string
  business_type: string
  country: string
  email: string
  mobile: string | null
  messenger: string | null
  automations: string[]
  time_sink: string | null
  consent: true
}

const LAST_KEY = 'lz_pilot_last'   // per-browser cooldown (the database enforces the real limit)
const COOLDOWN_MS = 60_000

export function cooldownLeft(): number {
  try {
    const t = Number(localStorage.getItem(LAST_KEY) || 0)
    return Math.max(0, t + COOLDOWN_MS - Date.now())
  } catch { return 0 }
}

export async function sendPilotSignup(row: PilotSignup): Promise<void> {
  const { supabase } = await import('../../lib/supabase')
  if (!supabase) throw new Error('Sign-up is not connected on this copy of the site (no database configured).')
  const { error } = await supabase.from('pilot_signups').insert(row)
  if (error) {
    const raw = [error.message, error.code].filter(Boolean).join(' · ')
    if (/too_many_signups/.test(error.message)) throw new Error('This email has already signed up several times today — we have your details, no need to send again.')
    if (/busy_try_later/.test(error.message)) throw new Error('Too many sign-ups right now. Please try again in a minute.')
    if (error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message))
      throw new Error('Sign-up is not switched on yet. Please email hello@lintejas.com instead. (' + raw + ')')
    if (/failed to fetch|network|load failed/i.test(error.message))
      throw new Error("Not sent — we couldn't reach the sign-up server. Check your connection and try again. (" + raw + ')')
    throw new Error('Not sent: ' + raw)
  }
  try { localStorage.setItem(LAST_KEY, String(Date.now())) } catch { /* private mode — fine */ }
}
