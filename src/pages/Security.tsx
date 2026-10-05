import { useEffect, type ReactNode } from 'react'
import Reveal from '../components/ui/Reveal'
import { CONTACT_EMAIL } from '../lib/contact'

/* Plain-language security page (/#/security) — linked from the homepage Trust & Security
   section and the footer. Specific and plain: no hype or absolute-security claims. */
const LAST_UPDATED = '5 October 2026'

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal>
      <section className="py-8" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <h2 className="font-display font-semibold text-2xl mb-4" style={{ color: 'var(--cream)' }}>{title}</h2>
        <div className="space-y-4 text-base leading-relaxed" style={{ color: '#b4bfd4' }}>{children}</div>
      </section>
    </Reveal>
  )
}

const Mail = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 hover:text-[var(--cream)]" style={{ color: 'var(--gold)' }}>
    {CONTACT_EMAIL}
  </a>
)

export default function Security() {
  useEffect(() => {
    const prev = document.title
    document.title = 'How we protect your data — Lintejas'
    return () => { document.title = prev }
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[760px] mx-auto px-6 lg:px-8 pt-28 pb-28">
        <Reveal className="mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)', color: 'var(--gold)' }}
          >
            Security
          </div>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl leading-tight mb-5" style={{ color: 'var(--cream)' }}>
            How we protect your data
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--slate)' }}>
            NegosyoPlans, Matthew System and Matthew Lite all run on the same foundation. Here is what we keep,
            where it lives, and how we look after it — in plain words.
          </p>
        </Reveal>

        <Block title="What we store">
          <p>Only what the products need to work for you:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your account email, so you can log in.</li>
            <li>The business records you enter yourself — sales, expenses, inventory, loans and utang, and bookings.</li>
            <li>Your blueprint purchases on NegosyoPlans, so you can open what you bought.</li>
          </ul>
        </Block>

        <Block title="Where it lives">
          <p>
            Your records are stored on Cloudflare's cloud infrastructure — a global network with data centers
            around the world. We don't keep your business data on our own laptops, phones or USB drives.
          </p>
          <p>
            If you install the app, it keeps a working copy on <em>your</em> phone so you can keep logging when
            the signal drops. That copy syncs back to your account when you're online.
          </p>
        </Block>

        <Block title="How it's protected">
          <ul className="list-disc pl-5 space-y-2">
            <li>Every connection is encrypted in transit with HTTPS (TLS) — logins, sales, everything.</li>
            <li>Only your login opens your account.</li>
            <li>Our own access is limited to what we need to run the service and help you when you ask for support.</li>
          </ul>
        </Block>

        <Block title="What we never do">
          <ul className="list-disc pl-5 space-y-2">
            <li>We never sell your data.</li>
            <li>We never share it with advertisers.</li>
            <li>
              We never use your customers' details — your utang and suki lists — for anything other than showing
              them to you.
            </li>
          </ul>
        </Block>

        <Block title="Your choices">
          <p>
            Want a copy of your data, or want your account deleted? Email <Mail /> and we'll export it for you,
            or remove your account data.
          </p>
        </Block>

        <Block title="Straight talk">
          <p>
            No system on the internet can promise perfect security — what we promise is real protection, careful
            handling, and straight answers if anything ever affects your data.
          </p>
        </Block>

        <div className="pt-8 text-sm" style={{ borderTop: '1px solid var(--glass-border)', color: 'var(--slate)' }}>
          <p>Questions? <Mail /></p>
          <p className="mt-2">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>
    </div>
  )
}
