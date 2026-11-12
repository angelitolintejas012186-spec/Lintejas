import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import {
  Building2, Tags, Users, Palette, Share2, Globe, RefreshCw, Smartphone,
  CalendarRange, Receipt, FileSignature, Wallet, CheckCircle2, Inbox, CalendarDays, ClipboardCheck, BadgeCheck, ArrowRight,
} from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import { StayMark } from '../components/ProductDeck'

/* ── Staycation Booking (/staycation) — LIVE (10 Nov 2026) ────────────────────────────────────
   The deck card's own page: how it works for guests and owners, what it does, real screens and the sign-up button
   (negosyoplans.com/stays). Honest copy only — every line here is something the live app does today. The screens are
   the live app with SAMPLE data (no real customers, no third-party photos). Terms as in the app: free to start, 2.5% of
   each stay, billed once on confirm or deposit received (12 Nov 2026; 3% / 5% before), no monthly fee; guests pay the deposit straight to the owner — Lintejas never holds it.
   Same site header / footer / navy background as the other venture pages; sea-teal accent like the deck card. */

const TEAL = '#2EC4B6'
const LINE = 'Direct booking for staycation owners: your own page, your own prices, and every booking in one place.'
const APP = 'https://negosyoplans.com/stays'

const GUEST_STEPS = [
  { icon: CalendarRange, t: 'Pick a unit and dates', d: 'A calendar for each unit shows which nights are free.' },
  { icon: Receipt, t: 'See the price', d: 'The total is worked out from the owner’s rates, promos and packages.' },
  { icon: FileSignature, t: 'Sign the house agreement', d: 'The owner’s house rules, signed with a typed name.' },
  { icon: Wallet, t: 'Pay the deposit to the owner', d: 'GCash, bank or QR — straight to the owner. The guest sends the reference and a screenshot, and the dates are held at once.' },
  { icon: CheckCircle2, t: 'The owner confirms', d: 'The owner checks the money and confirms. If nothing arrived, the dates open again.' },
]
const OWNER_STEPS = [
  { icon: Inbox, t: 'Payments to check', d: 'Every paid booking with its reference and screenshot — confirm or decline in one tap, then send a ready message.' },
  { icon: CalendarDays, t: 'Calendar', d: 'Every unit and night at a glance; add walk-in, phone or Facebook bookings yourself.' },
  { icon: ClipboardCheck, t: 'Check-in and check-out', d: 'A checklist for each stay, balance paid, and private notes.' },
  { icon: BadgeCheck, t: 'A simple fee', d: 'Free to start: 2.5% of each stay, billed once when you confirm it or receive its deposit. No monthly fee. Each one is paid by GoTyme QR within 3 days.' },
]
const FEATURES = [
  { icon: Building2, t: 'Multi-unit', d: 'Villas, cabins or rooms — one page for all of them.' },
  { icon: Tags, t: 'Your prices, promos and packages', d: 'Weekday and Fri/Sat rates, promos (also with a secret code) and fixed-price packages.' },
  { icon: Users, t: 'Book for someone else', d: 'An OFW abroad books and pays; a family member checks in.' },
  { icon: FileSignature, t: 'House agreement and checklist', d: 'Guests sign your rules before they book; tick what was there at check-in and check-out.' },
  { icon: Palette, t: 'Your own logo, colour and photos', d: 'A theme, cover photo, logo and gallery — a page that looks like your place.' },
  { icon: Globe, t: 'Your own web address', d: 'Use the free link, or connect your own domain such as www.yourplace.ph.' },
  { icon: RefreshCw, t: 'Airbnb / Booking.com calendar sync', d: 'Nights booked there are blocked here, and the other way round — only “busy” dates, never names.' },
  { icon: Share2, t: 'Share link preview', d: 'Your name and tagline when the link is shared on Messenger or Facebook.' },
  { icon: Smartphone, t: 'An app on your phone', d: 'Install the dashboard on your home screen — with a built-in guide, in English and Tagalog.' },
]
const SCREENS = [
  { src: '/brand/staycation/01-guest-page.jpg', t: 'The guest page', d: 'Pick a unit and dates' },
  { src: '/brand/staycation/02-checkout.jpg', t: 'Checkout', d: 'Pay the deposit straight to the owner' },
  { src: '/brand/staycation/03-owner-home.jpg', t: 'The owner’s home', d: 'Calendar, this week and what needs you' },
  { src: '/brand/staycation/04-paid-check.jpg', t: 'A payment to check', d: 'Reference, then Confirm or Decline' },
]

function Chip() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
      style={{ background: 'rgba(46,196,182,0.10)', border: '1px solid rgba(46,196,182,0.35)', color: TEAL }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
      Live
    </div>
  )
}

function StartButton() {
  return (
    <a href={APP} className="inline-flex items-center justify-center gap-2 mt-7 px-7 rounded-xl font-semibold text-base"
      style={{ minHeight: 52, background: TEAL, color: '#06221F', boxShadow: '0 10px 30px rgba(46,196,182,0.25)' }}>
      Create my booking page <ArrowRight size={18} aria-hidden="true" />
    </a>
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
            Staycation <span style={{ color: TEAL }}>Booking</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--slate)' }}>{LINE}</p>
          <p className="text-sm max-w-2xl mx-auto mt-3" style={{ color: 'var(--slate)' }}>
            Free to start — Lintejas charges 2.5% of each stay you confirm or take a deposit for. No monthly fee. Guests pay the deposit straight to you.
          </p>
          <StartButton />
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
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-8" style={{ color: 'var(--cream)' }}>What it does</h2>
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
          <p className="text-sm text-center mb-8" style={{ color: 'var(--slate)' }}>Screens from the live app, with SAMPLE data only.</p>
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

        {/* ── Start: the live app (sign up = property name + email, login link by email) ── */}
        <Reveal className="max-w-3xl mx-auto">
          <section aria-labelledby="st-go-h" className="rounded-2xl border p-6 sm:p-8 text-center"
            style={{ background: 'var(--glass-bg)', borderColor: 'rgba(46,196,182,0.35)' }}>
            <h2 id="st-go-h" className="font-display font-semibold text-3xl mb-3" style={{ color: 'var(--cream)' }}>Create your booking page</h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--slate)' }}>
              Your property name and email are all you need. A short setup guide walks you through prices, photos and how guests pay you.
            </p>
            <StartButton />
          </section>
        </Reveal>

      </div>
    </div>
  )
}
