import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import {
  Building2, Tags, Clock, Users, ShieldCheck, Palette, Share2,
  CalendarRange, Receipt, FileSignature, Wallet, CheckCircle2, Inbox, CalendarDays, ClipboardCheck, BadgeCheck,
} from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import PilotForm from '../components/automation/PilotForm'
import { StayMark } from '../components/ProductDeck'
import '../components/automation/automation.css'

/* ── Staycation Booking (/staycation) — COMING SOON (2026-10-27) ─────────────────────────────
   The deck card's own page: what it will do, for guests and for owners, and a pilot sign-up. Honest copy only: it is
   NOT open to customers yet — no prices, no "book now", no link to the private preview. The screens are our own app
   with SAMPLE data (no real customers, no third-party photos). The sign-up reuses the Business Automation pilot form
   (Supabase pilot_signups), tagged "Staycation booking" in `automations` — no database change.
   Same site header / footer / navy background as the other venture pages; sea-teal accent like the deck card. */

const TEAL = '#2EC4B6'
const LINE = 'Direct booking for staycation owners: your own page, your own prices, and every request in one place.'

const GUEST_STEPS = [
  { icon: CalendarRange, t: 'Pick a unit and dates', d: 'A calendar for each unit shows what is free, booked or on hold.' },
  { icon: Receipt, t: 'See the price', d: 'The total is worked out from the owner’s rates, promos and packages.' },
  { icon: FileSignature, t: 'Sign the agreement', d: 'House rules, check-in times and the unit inventory, signed with a typed name.' },
  { icon: Wallet, t: 'Send the deposit', d: 'GCash, Maya, a bank or a transfer from abroad, with a reference or a proof photo.' },
  { icon: CheckCircle2, t: 'The owner confirms', d: 'Nothing is booked until the owner checks it and says yes.' },
]
const OWNER_STEPS = [
  { icon: Inbox, t: 'Requests inbox', d: 'Accept, decline or suggest other dates, with ready-made messages to send.' },
  { icon: CalendarDays, t: 'Calendar', d: 'Every unit and night at a glance; block dates for maintenance or walk-ins.' },
  { icon: ClipboardCheck, t: 'Handover and turnover', d: 'An inventory checklist at check-in and check-out, signed by the guest.' },
  { icon: BadgeCheck, t: 'Your own brand and link', d: 'Your logo, colour and tagline on a page with your own address.' },
]
const FEATURES = [
  { icon: Building2, t: 'Multi-unit', d: 'Villas, cabins or rooms — one page for all of them.' },
  { icon: Tags, t: 'Owner-ruled pricing and promos', d: 'Weekday, weekend and peak rates, promos and packages you set.' },
  { icon: Clock, t: 'Check-in and check-out times per unit', d: 'Each unit keeps its own times, with early or late on request.' },
  { icon: Users, t: 'Book for someone else', d: 'An OFW abroad books and pays; a family member checks in first.' },
  { icon: ShieldCheck, t: 'Security deposit and inventory checklist', d: 'What was there at check-in, what is missing at check-out.' },
  { icon: Palette, t: 'Your own logo, colour and tagline', d: 'A page that looks like your place, not like ours.' },
  { icon: Share2, t: 'Share link preview', d: 'Your photo, name and tagline when the link is shared on Messenger or Facebook.' },
]
const SCREENS = [
  { src: '/brand/staycation/01-guest-page.jpg', t: 'The guest page', d: 'Your name, tagline and colour' },
  { src: '/brand/staycation/02-book-for-someone.jpg', t: 'Book for someone else', d: 'Booker abroad, family checks in' },
  { src: '/brand/staycation/03-owner-inbox.jpg', t: 'The owner’s inbox', d: 'Who booked, who checks in' },
  { src: '/brand/staycation/04-handover.jpg', t: 'Check-in handover', d: 'Inventory checklist on the phone' },
]

function Chip() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
      style={{ background: 'rgba(46,196,182,0.10)', border: '1px solid rgba(46,196,182,0.35)', color: TEAL }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
      Coming soon
    </div>
  )
}

function Steps({ title, items }: { title: string; items: typeof GUEST_STEPS }) {
  return (
    <div className="rounded-2xl border p-6 sm:p-7" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
      <h3 className="font-display font-semibold text-2xl mb-5" style={{ color: 'var(--cream)' }}>{title}</h3>
      <ol className="space-y-4">
        {items.map((s, i) => (
          <li key={s.t} className="flex items-start gap-3">
            <span className="flex-shrink-0 flex items-center justify-center rounded-xl" aria-hidden="true"
              style={{ width: 40, height: 40, background: 'rgba(46,196,182,0.10)', border: '1px solid rgba(46,196,182,0.30)', color: TEAL }}>
              <s.icon size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--cream)' }}><span className="sr-only">Step {i + 1}: </span>{s.t}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Staycation() {
  /* Land at the top. (Title, description and share tags: components/PageMeta.) */
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-24">

        {/* ── Hero ── */}
        <Reveal className="text-center mb-16">
          <Chip />
          <div className="mb-5 mx-auto" aria-hidden="true" style={{ width: '3.75rem', height: '3.75rem' }}>{StayMark}</div>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl mb-4" style={{ color: 'var(--cream)', textWrap: 'balance' } as CSSProperties}>
            Staycation <span style={{ color: TEAL }}>Booking</span> — coming soon
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--slate)' }}>{LINE}</p>
          <p className="text-sm max-w-2xl mx-auto mt-3" style={{ color: 'var(--slate)' }}>
            Not open to customers yet. Owners can join the pilot below.
          </p>
        </Reveal>

        {/* ── How it works ── */}
        <Reveal className="mb-16">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-8" style={{ color: 'var(--cream)' }}>How it works</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Steps title="For guests" items={GUEST_STEPS} />
            <Steps title="For owners" items={OWNER_STEPS} />
          </div>
        </Reveal>

        {/* ── Features ── */}
        <Reveal className="mb-16">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-8" style={{ color: 'var(--cream)' }}>What it will do</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(f => (
              <li key={f.t} className="rounded-2xl border p-5 flex items-start gap-3" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
                <f.icon size={20} className="flex-shrink-0 mt-0.5" style={{ color: TEAL }} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--cream)' }}>{f.t}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>{f.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── Screens (our own app, SAMPLE data) ── */}
        <Reveal className="mb-16">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-2" style={{ color: 'var(--cream)' }}>A first look</h2>
          <p className="text-sm text-center mb-8" style={{ color: 'var(--slate)' }}>Screens from the app in development, with SAMPLE data only.</p>
          <ul className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            {SCREENS.map(s => (
              <li key={s.src} className="min-w-0">
                <figure className="rounded-2xl border overflow-hidden" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
                  <img src={s.src} alt={`${s.t} — ${s.d} (sample data)`} width={780} height={1688} loading="lazy" decoding="async"
                    className="block w-full h-auto" style={{ aspectRatio: '780 / 1688' }} />
                  <figcaption className="p-3">
                    <p className="text-sm font-semibold" style={{ color: 'var(--cream)' }}>{s.t}</p>
                    <p className="text-xs" style={{ color: 'var(--slate)' }}>{s.d}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── Join the pilot (the Business Automation pilot sign-up, tagged "Staycation booking") ── */}
        <Reveal className="max-w-3xl mx-auto">
          <section id="join" aria-labelledby="st-join-h" className="ba rounded-2xl p-6 sm:p-8"
            style={{ '--ba-violet': '#0B6E66', '--ba-violet2': '#139C8F', '--ba-soft': '#E3F6F3', scrollMarginTop: 'calc(88px + env(safe-area-inset-top))' } as CSSProperties}>
            <h2 id="st-join-h" className="ba-h2">Notify me / join the pilot</h2>
            <p className="ba-sub">Run a staycation, resort or villas? Leave your details and we will contact you when the pilot opens. No payment is asked for.</p>
            <PilotForm tag="Staycation booking" defaultType="Other" />
          </section>
        </Reveal>

      </div>
    </div>
  )
}
