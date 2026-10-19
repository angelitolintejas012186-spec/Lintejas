import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ListChecks, ShieldCheck, Lock, ChevronDown, ExternalLink } from 'lucide-react'
import AutomationTiles from '../components/automation/AutomationTiles'
import PilotForm from '../components/automation/PilotForm'
import { AUTOMATIONS, BA_APP_OPEN, BA_APP_URL } from '../components/automation/data'
import type { Automation as AutomationItem } from '../components/automation/data'
import '../components/automation/automation.css'

/* ── Business Automation (/automation) ───────────────────────────────────────
   Public page + "Join the pilot" sign-up. Sold only after pilots: no prices, no results,
   no testimonials, no promised setup time. The shared header/footer stay as they are;
   only this page body uses the porcelain + violet identity (automation.css, scoped .ba).
   Plus Jakarta Sans is loaded here only, so the rest of the site's fonts are unchanged. */

const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'

const OPEN_COUNT = AUTOMATIONS.filter(a => a.status === 'pilot').length
const COUNT_WORD = ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven'][OPEN_COUNT] ?? String(OPEN_COUNT)

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

const FAQ: { q: string; a: ReactNode }[] = [
  { q: 'Is it free?',
    a: 'Setup is free for pilot businesses during the pilot. Pricing is announced after the pilot — nothing is charged before then.' },
  { q: 'Do messages go out without me?',
    a: 'No. Every message is drafted for you first, and nothing is sent until you approve it.' },
  { q: 'Where is my data?',
    a: <>Your data stays yours. We only use it to run the automations you choose, and you can ask us to delete it anytime. Read how we look after it on our <Link to="/security">security page</Link>.</> },
  { q: 'Is it in Matthew System?',
    a: 'Matthew users see it as Smart Reminders inside their dashboard.' },
]

export default function Automation() {
  const [picked, setPicked] = useState<number[]>([])

  /* Land at the top; load the page font once. (Title, description and share tags: components/PageMeta.) */
  useEffect(() => {
    window.scrollTo(0, 0)
    if (!document.querySelector(`link[href="${FONT_HREF}"]`)) {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONT_HREF; document.head.appendChild(l)
    }
  }, [])

  const join = (a?: AutomationItem) => {
    if (a && !picked.includes(a.n)) setPicked([...picked, a.n])
    requestAnimationFrame(() => scrollToId('join'))
  }

  return (
    <div className="ba">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="ba-hero">
        <div className="ba-wrap">
          <img className="ba-logo" src="/brand/automation/logo.svg" alt="Business Automation logo" width="64" height="64" />
          <span className="ba-eyebrow"><span translate="no">Lintejas</span> · Business Automation</span>
          <h1 className="ba-h1">Automate your business.</h1>
          <p className="ba-lead">Ready-made automations that do the repeat work for you. You approve before anything is sent.</p>
          <div className="ba-ctas">
            {BA_APP_OPEN ? (
              <>
                {/* Shown only when BA_APP_OPEN (data.ts) is true. */}
                <a className="ba-btn ba-btn--pri" href={BA_APP_URL} target="_blank" rel="noopener">Open the pilot app <ExternalLink size={18} aria-hidden="true" /></a>
                <button type="button" className="ba-btn ba-btn--sec" onClick={() => join()}>Join the pilot <ArrowRight size={18} /></button>
              </>
            ) : (
              <>
                <button type="button" className="ba-btn ba-btn--pri" onClick={() => join()}>Join the pilot <ArrowRight size={18} /></button>
                <button type="button" className="ba-btn ba-btn--sec" onClick={() => scrollToId('automations')}>See the automations</button>
              </>
            )}
          </div>
          <ul className="ba-facts">
            <li className="ba-fact"><ListChecks size={22} aria-hidden="true" />{OPEN_COUNT} of {AUTOMATIONS.length} open for the pilot</li>
            <li className="ba-fact"><ShieldCheck size={22} aria-hidden="true" />You approve everything</li>
            <li className="ba-fact"><Lock size={22} aria-hidden="true" />Your data stays yours</li>
          </ul>
        </div>
      </section>

      {/* ── How the pilot works ──────────────────────────── */}
      <section className="ba-sec" aria-labelledby="ba-how-h">
        <div className="ba-wrap">
          <h2 id="ba-how-h" className="ba-h2">How the pilot works</h2>
          <p className="ba-sub">A small group of businesses tries the automations first, with us beside them.</p>
          <ol className="ba-steps">
            <li className="ba-step"><span className="ba-stepn">1</span><h3>Tell us your business</h3><p>Fill in the short form below: what you do and which automations you'd like.</p></li>
            <li className="ba-step"><span className="ba-stepn">2</span><h3>We set it up with you</h3><p>We set up the automations together with you — free during the pilot.</p></li>
            <li className="ba-step"><span className="ba-stepn">3</span><h3>You approve every message</h3><p>Drafts wait for you. Nothing goes to a customer until you say yes.</p></li>
          </ol>
        </div>
      </section>

      {/* ── Automations ──────────────────────────────────── */}
      <section id="automations" className="ba-sec" aria-labelledby="ba-auto-h" style={{ scrollMarginTop: 'calc(88px + env(safe-area-inset-top))' }}>
        <div className="ba-wrap">
          <h2 id="ba-auto-h" className="ba-h2">The automations</h2>
          <p className="ba-sub">{COUNT_WORD} are open for the pilot now. The rest are planned. Tap any one to see what it does.</p>
          <AutomationTiles onJoin={join} />
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section className="ba-sec" aria-labelledby="ba-price-h">
        <div className="ba-wrap">
          <div className="ba-price">
            <h2 id="ba-price-h" className="ba-h2">Pricing</h2>
            <p>Pricing is announced after the pilot. Pilot businesses get free setup during the pilot.</p>
          </div>
        </div>
      </section>

      {/* ── Join the pilot ───────────────────────────────── */}
      <section id="join" className="ba-sec" aria-labelledby="ba-join-h" style={{ scrollMarginTop: 'calc(88px + env(safe-area-inset-top))' }}>
        <div className="ba-wrap">
          <h2 id="ba-join-h" className="ba-h2">Join the pilot</h2>
          <p className="ba-sub">Tell us a little about your business. We'll get back to you to talk it through.</p>
          <PilotForm picked={picked} setPicked={setPicked} />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="ba-sec" aria-labelledby="ba-faq-h" style={{ paddingBottom: 72 }}>
        <div className="ba-wrap">
          <h2 id="ba-faq-h" className="ba-h2">Questions</h2>
          <div className="ba-faq">
            {FAQ.map(f => (
              <details key={f.q}>
                <summary>{f.q}<ChevronDown size={20} aria-hidden="true" /></summary>
                <p className="ans">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
