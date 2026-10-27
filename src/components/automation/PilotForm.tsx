import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, ArrowRight } from 'lucide-react'
import { AUTOMATIONS, BUSINESS_TYPES, COUNTRIES } from './data'
import { cooldownLeft, sendPilotSignup } from './submit'

/* Join-the-pilot form. `picked` = automation numbers ticked (lifted to the page so a tile's sheet can
   pre-tick one). Says "Thanks" ONLY after the database confirmed the save; otherwise shows the real error.
   `tag` (2026-10-27, /staycation): a product page's own sign-up — the automation list is hidden and the row is
   tagged in `automations` (e.g. ['Staycation booking']), so no database change is needed; `defaultType` pre-picks the
   business type (still changeable). Without `tag` the form is exactly as before (/automation). */

const MAX_NOTE = 300
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'ok' } | { kind: 'err'; msg: string }

export default function PilotForm({ picked = [], setPicked = () => {}, tag, defaultType = '' }: { picked?: number[]; setPicked?: (n: number[]) => void; tag?: string; defaultType?: string }) {
  const [f, setF] = useState({ name: '', business: '', type: defaultType, country: '', email: '', mobile: '', messenger: '', note: '', website: '' })
  const [consent, setConsent] = useState(false)
  const [st, setSt] = useState<State>({ kind: 'idle' })
  /* After a successful save the tall form is replaced by a short thank-you box, so the page gets much shorter and
     the box ended up above the screen (the visitor saw the FAQ instead). Bring it into view and move focus to it
     so screen readers announce it. Instant scroll: the site's smooth scroller (Lenis) follows native scrolling. */
  const okRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (st.kind !== 'ok' || !okRef.current) return
    const el = okRef.current
    requestAnimationFrame(() => {
      el.scrollIntoView({ block: 'center', behavior: 'auto' })
      el.focus({ preventScroll: true })
    })
  }, [st.kind])
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF(p => ({ ...p, [k]: e.target.value }))

  const toggle = (n: number) => setPicked(picked.includes(n) ? picked.filter(x => x !== n) : [...picked, n])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (st.kind === 'sending') return
    if (f.website) { setSt({ kind: 'err', msg: 'Not sent. Please reload the page and try again.' }); return }   // honeypot
    if (!EMAIL_RE.test(f.email.trim())) { setSt({ kind: 'err', msg: 'Not sent: please enter a valid email address.' }); return }
    if (!consent) { setSt({ kind: 'err', msg: 'Not sent: please tick the consent box so we may contact you.' }); return }
    const wait = cooldownLeft()
    if (wait > 0) { setSt({ kind: 'err', msg: `Not sent: you just signed up from this browser. Please wait ${Math.ceil(wait / 1000)} seconds before sending again.` }); return }

    setSt({ kind: 'sending' })
    try {
      await sendPilotSignup({
        name: f.name.trim(), business_name: f.business.trim(), business_type: f.type, country: f.country,
        email: f.email.trim(), mobile: f.mobile.trim() || null, messenger: f.messenger.trim() || null,
        automations: tag ? [tag] : AUTOMATIONS.filter(a => picked.includes(a.n)).map(a => `#${a.n} ${a.name}`),
        time_sink: f.note.trim() || null, consent: true,
      })
      setSt({ kind: 'ok' })
    } catch (err) {
      setSt({ kind: 'err', msg: err instanceof Error ? err.message : 'Not sent: ' + String(err) })
    }
  }

  if (st.kind === 'ok') {
    return (
      <div ref={okRef} tabIndex={-1} className="ba-msg ba-msg--ok" role="status" aria-live="polite">
        <strong>Thanks — we'll message you within a few days.</strong>
        <div style={{ marginTop: 4 }}>Your details were saved. You can ask us to delete them anytime at hello@lintejas.io.</div>
      </div>
    )
  }

  const sending = st.kind === 'sending'
  return (
    <form className="ba-form" onSubmit={onSubmit} aria-describedby="ba-form-msg">
      <div className="ba-field">
        <label htmlFor="ba-name">Your name</label>
        <input id="ba-name" className="ba-in" required maxLength={100} autoComplete="name" value={f.name} onChange={set('name')} />
      </div>
      <div className="ba-field">
        <label htmlFor="ba-biz">Business name</label>
        <input id="ba-biz" className="ba-in" required maxLength={120} autoComplete="organization" value={f.business} onChange={set('business')} />
      </div>
      <div className="ba-field">
        <label htmlFor="ba-type">Business type</label>
        <select id="ba-type" className="ba-in" required value={f.type} onChange={set('type')}>
          <option value="" disabled>Choose one</option>
          {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="ba-field">
        <label htmlFor="ba-country">Country</label>
        <select id="ba-country" className="ba-in" required value={f.country} onChange={set('country')}>
          <option value="" disabled>Choose one</option>
          {COUNTRIES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="ba-field ba-full">
        <label htmlFor="ba-email">Email</label>
        <input id="ba-email" className="ba-in" type="email" required maxLength={200} autoComplete="email" inputMode="email" value={f.email} onChange={set('email')} />
      </div>
      <div className="ba-field">
        <label htmlFor="ba-mobile">Mobile <span className="ba-opt">(optional)</span></label>
        <input id="ba-mobile" className="ba-in" type="tel" maxLength={40} autoComplete="tel" value={f.mobile} onChange={set('mobile')} />
      </div>
      <div className="ba-field">
        <label htmlFor="ba-msgr">Messenger name or link <span className="ba-opt">(optional)</span></label>
        <input id="ba-msgr" className="ba-in" maxLength={100} value={f.messenger} onChange={set('messenger')} />
      </div>

      {tag ? (
        <p className="ba-full ba-tagline">Interested in: <strong>{tag}</strong></p>
      ) : (
      <fieldset className="ba-fs ba-full">
        <legend className="ba-legend">Automations you're interested in <span className="ba-opt">(optional)</span></legend>
        <div className="ba-checks">
          {AUTOMATIONS.map(a => (
            <label key={a.n} className="ba-check">
              <input type="checkbox" checked={picked.includes(a.n)} onChange={() => toggle(a.n)} />
              <span>#{a.n} {a.name}</span>
              <small>{a.status === 'pilot' ? 'Pilot open' : 'Later'}</small>
            </label>
          ))}
        </div>
      </fieldset>
      )}

      <div className="ba-field ba-full">
        <label htmlFor="ba-note">What takes most of your time? <span className="ba-opt">(optional)</span></label>
        <textarea id="ba-note" className="ba-in" maxLength={MAX_NOTE} value={f.note} onChange={set('note')} />
        <span className="ba-count" aria-live="polite">{f.note.length} / {MAX_NOTE}</span>
      </div>

      {/* honeypot — hidden from people and screen readers; bots fill it */}
      <div className="ba-hp" aria-hidden="true">
        <label htmlFor="ba-website">Website</label>
        <input id="ba-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </div>

      <label className="ba-consent ba-full">
        <input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} />
        <span>
          You may contact me about the pilot. I can ask to delete my details anytime.{' '}
          <Link to="/security">Privacy &amp; security</Link>
        </span>
      </label>

      <div className="ba-full" id="ba-form-msg" aria-live="polite">
        {st.kind === 'err' && <div className="ba-msg ba-msg--err" role="alert">{st.msg}</div>}
      </div>

      <div className="ba-full">
        <button type="submit" className="ba-btn ba-btn--pri" disabled={sending} style={{ width: '100%' }}>
          {sending ? <><Loader2 size={18} className="ba-spin" /> Sending…</> : <>Join the pilot <ArrowRight size={18} /></>}
        </button>
      </div>
    </form>
  )
}
