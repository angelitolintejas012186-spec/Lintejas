import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Layers, BarChart3, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Reveal from '../components/ui/Reveal'
import { staggerContainer, staggerItem, ease } from '../lib/motion'

/* ── SkillVue page (/#/skillvue) ───────────────────────────────────────────────
   The SkillVue tiers moved OFF Home (Angie's ruling): they only appear here, after a
   visitor taps the SkillVue deck card. SkillVue is NOT launched — prices show
   "Coming soon" and the module lists read as PLANNED, not live. Content is unchanged
   from the former Home #pricing block (nothing invented); the intro reuses SkillVue's
   existing deck-card copy. ─────────────────────────────────────────────────────── */

type PlanFeature = string | { text: string; comingSoon: true }

type Plan = {
  icon: LucideIcon
  name: string
  tagline: string
  price: string
  seats: string
  popular: boolean
  deltaLead?: string
  features: readonly PlanFeature[]
  addOn?: string
  cta: string
  href: string | null
}

const PLANS: readonly Plan[] = [
  {
    icon:    Layers,
    name:    'Essentials',
    tagline: 'For skills-first teams',
    price:   'Coming soon',
    seats:   'Up to 50 users',
    popular: false,
    features: [
      'Competency Assessment',
      'Training & Development',
      'Development Plans',
      'Standard dashboards',
      'Email support',
    ],
    cta:  'Get notified',
    href: null,
  },
  {
    icon:      BarChart3,
    name:      'Professional',
    tagline:   'Everything the plant floor needs',
    price:     'Coming soon',
    seats:     'Up to 250 users',
    popular:   true,
    deltaLead: 'Everything in Essentials, plus',
    features: [
      'Gap Analysis',
      'BBSHE / Safety',
      'Quality Surveys',
      'Abnormality Reports',
      'Recognition Wall',
      'Grievance',
      'Advanced reporting + managed custom fields',
      'Priority support',
    ],
    addOn: 'Work Permits available as an add-on',
    cta:   'Get notified',
    href:  null,
  },
  {
    icon:      Globe,
    name:      'Enterprise',
    tagline:   'Scale, governance & control',
    price:     'Coming soon',
    seats:     'Custom seats + light-user pricing',
    popular:   false,
    deltaLead: 'Everything in Professional, plus',
    features: [
      'Work Permits',
      'Lockout/Tagout (LOTO) permits',
      'Confined Space Entry (CSE) permits',
      'Risk Prediction Tool (RPT)',
      'CIP Tasks',
      { text: 'SSO / API & integrations',    comingSoon: true },
      { text: 'Audit Log + Privacy Dashboard', comingSoon: true },
      'AI Support included',
      'Dedicated support + SLA',
    ],
    cta:  'Talk to sales',
    href: null,
  },
]

/* Intro copy — reused verbatim from the SkillVue deck card (ProductDeck CARDS). */
const INTRO = {
  tagline: 'Safety & Workforce Intelligence Platform',
  subline: 'Food Manufacturing · Safety & HR Tech',
  hook:    'The human layer of the smart factory.',
}

export default function SkillVue() {
  const navigate = useNavigate()

  /* Land at the top; set page-specific SEO and restore it on leave. */
  useEffect(() => {
    window.scrollTo(0, 0)
    const prevTitle = document.title
    document.title = 'SkillVue — Safety & Workforce Platform (Coming soon) · Lintejas Engine'

    const descEl  = document.querySelector('meta[name="description"]')
    const canonEl = document.querySelector('link[rel="canonical"]')
    const prevDesc  = descEl?.getAttribute('content') ?? null
    const prevCanon = canonEl?.getAttribute('href') ?? null
    descEl?.setAttribute('content', 'SkillVue — a safety and workforce intelligence platform planned for food manufacturing. Coming soon from Lintejas Engine. See the planned tiers and modules.')
    canonEl?.setAttribute('href', 'https://lintejas.io/#/skillvue')

    return () => {
      document.title = prevTitle
      if (prevDesc  !== null) descEl?.setAttribute('content', prevDesc)
      if (prevCanon !== null) canonEl?.setAttribute('href', prevCanon)
    }
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-28">

        {/* ── Intro (reused SkillVue card copy + Coming-soon pill) ─────────── */}
        <Reveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)', color: 'var(--gold)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
            Coming soon
          </div>
          {/* Fixed box reserves the glyph's space so the emoji font-swap can't shift the tiers (CLS). */}
          <div className="mb-5 mx-auto" aria-hidden="true" style={{ fontSize: '3rem', lineHeight: '3.5rem', height: '3.5rem' }}>🧠</div>
          <h1 className="font-display font-semibold text-5xl sm:text-6xl mb-4" style={{ color: 'var(--cream)' }} translate="no">
            SkillVue
          </h1>
          <p className="text-base font-medium mb-1" style={{ color: 'var(--gold)' }}>{INTRO.tagline}</p>
          <p className="text-sm mb-5" style={{ color: 'var(--slate)' }}>{INTRO.subline}</p>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--slate)' }}>{INTRO.hook}</p>
        </Reveal>

        {/* ── Tiers ───────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease }}
          className="text-center mb-14"
        >
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mb-4" style={{ color: 'var(--cream)' }}>
            One platform, three tiers.
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--slate)' }}>
            SkillVue is our safety and workforce platform for food manufacturing. Start with the essentials. Unlock the full plant-floor suite when you're ready. Scale to enterprise on your terms.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {PLANS.map((plan) => {
            const Icon = plan.icon
            return (
              <motion.div key={plan.name} variants={staggerItem} className={plan.popular ? 'md:-mt-4' : ''}>
                <div
                  className="relative rounded-2xl border h-full flex flex-col overflow-hidden transition-all duration-300"
                  style={{
                    background: 'var(--glass-bg)',
                    borderColor: plan.popular ? 'rgba(212,168,67,0.50)' : 'var(--glass-border)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: plan.popular ? '0 0 40px rgba(212,168,67,0.12)' : 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.40)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(212,168,67,0.15)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = plan.popular ? 'rgba(212,168,67,0.50)' : 'var(--glass-border)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = plan.popular ? '0 0 40px rgba(212,168,67,0.12)' : 'none'
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.25), transparent)' }} />

                  {plan.popular && (
                    <div className="absolute top-0 inset-x-0 flex justify-center">
                      <span
                        className="px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-b-lg"
                        style={{ background: 'linear-gradient(135deg, #E8C766, #D4A843)', color: '#0A1628' }}
                      >
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`p-7 flex flex-col flex-1 ${plan.popular ? 'pt-10' : ''}`}>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                      style={{ background: 'rgba(212,168,67,0.10)', border: '1px solid rgba(212,168,67,0.18)' }}
                    >
                      <Icon size={17} style={{ color: 'var(--gold)' }} strokeWidth={1.75} />
                    </div>

                    <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--gold)' }}>
                      {plan.name}
                    </p>
                    <p className="text-xs mb-4" style={{ color: 'var(--slate)' }}>
                      {plan.tagline}
                    </p>

                    {/* Price — not announced: "Coming soon", no currency */}
                    <div className="mb-1">
                      <span className="font-display font-semibold text-2xl" style={{ color: 'var(--gold)' }}>{plan.price}</span>
                    </div>
                    <p className="text-xs mb-6 pb-6" style={{ color: 'var(--slate)', borderBottom: '1px solid var(--glass-border)' }}>
                      {plan.seats}
                    </p>

                    {/* Planned modules — these are PLANNED, not live features */}
                    <p className="text-[0.62rem] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--slate)', opacity: 0.8 }}>
                      Planned modules
                    </p>
                    <ul className="space-y-2.5 mb-4 flex-1">
                      {plan.deltaLead && (
                        <li
                          className="text-xs pb-2 mb-1"
                          style={{ color: 'var(--slate)', opacity: 0.65, borderBottom: '1px solid var(--glass-border)' }}
                        >
                          {plan.deltaLead}
                        </li>
                      )}
                      {plan.features.map(f => {
                        const label      = typeof f === 'string' ? f : f.text
                        const comingSoon = typeof f !== 'string' && f.comingSoon
                        return (
                          <li key={label} className="flex items-start gap-2.5">
                            <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: comingSoon ? 'var(--slate)' : 'var(--gold)', opacity: comingSoon ? 0.45 : 1 }} />
                            <span className="text-xs leading-relaxed" style={{ color: 'var(--slate)' }}>
                              {label}
                              {comingSoon && (
                                <span
                                  className="ml-2 inline-flex items-center px-1.5 rounded"
                                  style={{
                                    fontSize: '0.58rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    verticalAlign: 'middle',
                                    background: 'rgba(138,154,176,0.12)',
                                    border: '1px solid rgba(138,154,176,0.22)',
                                    color: 'var(--slate)',
                                    paddingTop: '0.15rem',
                                    paddingBottom: '0.15rem',
                                  }}
                                >
                                  Later
                                </span>
                              )}
                            </span>
                          </li>
                        )
                      })}
                    </ul>

                    {plan.addOn ? (
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg mb-5 text-xs"
                        style={{ background: 'rgba(212,168,67,0.06)', border: '1px dashed rgba(212,168,67,0.22)', color: 'var(--slate)' }}
                      >
                        <span style={{ color: 'var(--gold)', fontWeight: 600 }}>+</span>
                        {plan.addOn}
                      </div>
                    ) : (
                      <div className="mb-5" />
                    )}

                    {/* CTA → Contact (SkillVue has no external sign-up yet) */}
                    <button
                      onClick={() => navigate('/contact')}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                      style={plan.popular
                        ? { background: 'linear-gradient(135deg, #E8C766, #D4A843)', color: '#0A1628', boxShadow: '0 4px 20px rgba(212,168,67,0.30)' }
                        : { background: 'transparent', border: '1px solid rgba(212,168,67,0.30)', color: 'var(--cream)' }
                      }
                      onMouseEnter={e => { if (plan.popular) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(212,168,67,0.45)'; else (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.60)' }}
                      onMouseLeave={e => { if (plan.popular) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,168,67,0.30)'; else (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.30)' }}
                    >
                      {plan.cta} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-xs mt-8"
          style={{ color: 'var(--slate)' }}
        >
          SkillVue pricing will be announced at launch.{' '}
          <span style={{ color: 'var(--gold)' }}>Leave your details and we'll notify you.</span>
        </motion.p>

      </div>
    </div>
  )
}
