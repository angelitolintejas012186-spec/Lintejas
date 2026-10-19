import { useEffect } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import Reveal from '../components/ui/Reveal'

/* ── RomLet brand card (/romlet; /skillvue and old /#/ links redirect here) ───────────────────
   SkillVue was renamed RomLet (19 Oct 2026) and now has its own site, romlet.tech,
   with the tiers, pricing and pilot sign-up. This page is a short hand-off only:
   the deck card's copy plus two links out. Styling reuses the former SkillVue page
   (navy, gold pill, cream display title, glass card, gold / outline buttons). */
const ROMLET = {
  line: 'Workforce competency & compliance for food manufacturers',
  points: [
    'Competency matrix by line & role',
    'Training records & sign-offs on the floor',
    'Gap analysis & re-certification alerts',
    'Audit-ready exports (HACCP, ISO 22000, FSSC, BRCGS, IFS)',
  ],
}

export default function Romlet() {
  /* Land at the top. (Title, description and share tags: components/PageMeta.) */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-28 pb-28">

        <Reveal className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.20)', color: 'var(--gold)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
            Pilot programme
          </div>
          {/* R tile — the deck card's monogram tile */}
          <div
            className="mb-5 mx-auto flex items-center justify-center rounded-2xl font-display font-semibold"
            aria-hidden="true"
            style={{ width: '3.5rem', height: '3.5rem', fontSize: '1.6rem', background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.30)', color: 'var(--gold)' }}
          >
            R
          </div>
          <h1 className="font-display font-semibold text-5xl sm:text-6xl mb-4" style={{ color: 'var(--cream)' }} translate="no">
            Rom<span style={{ color: 'var(--gold)' }}>Let</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--slate)' }}>{ROMLET.line}</p>
        </Reveal>

        <Reveal className="max-w-xl mx-auto">
          <div
            className="relative rounded-2xl border overflow-hidden p-7"
            style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(20px)' }}
          >
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(232,199,102,0.25), transparent)' }} />
            <ul className="space-y-3 mb-7">
              {ROMLET.points.map(p => (
                <li key={p} className="flex items-start gap-2.5">
                  <Check size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                  <span className="text-sm leading-relaxed" style={{ color: 'var(--cream)' }}>{p}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://romlet.tech"
                target="_blank"
                rel="noopener"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #E8C766, #D4A843)', color: '#0A1628', boxShadow: '0 4px 20px rgba(212,168,67,0.30)' }}
              >
                Visit romlet.tech <ArrowRight size={14} />
              </a>
              <a
                href="https://romlet.tech/contact"
                target="_blank"
                rel="noopener"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{ background: 'transparent', border: '1px solid rgba(212,168,67,0.30)', color: 'var(--cream)' }}
              >
                Request a pilot
              </a>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
