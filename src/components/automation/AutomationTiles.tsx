import { useCallback, useEffect, useRef, useState } from 'react'
import { X, ArrowRight, Bell, Plus } from 'lucide-react'
import { AUTOMATIONS, CATEGORIES, CAT_COLOR, CAT_TEXT } from './data'
import type { Automation, Category } from './data'

/* Tiles with category filter chips; tapping a tile opens a bottom sheet (centred dialog on desktop).
   The sheet's button hands the automation to the page, which pre-ticks it in the form and scrolls there. */

function StatusChip({ a }: { a: Automation }) {
  return a.status === 'pilot'
    ? <span className="ba-status ba-status--pilot">Pilot open</span>
    : <span className="ba-status ba-status--later">Coming later</span>
}

function Icon({ a, size = 40 }: { a: Automation; size?: number }) {
  const I = a.icon
  return (
    <span className="ba-ico" style={{ width: size, height: size, background: CAT_COLOR[a.category] + '1A', color: CAT_TEXT[a.category] }} aria-hidden="true">
      <I size={Math.round(size * 0.5)} strokeWidth={2} />
    </span>
  )
}

function Sheet({ a, onClose, onJoin }: { a: Automation; onClose: () => void; onJoin: (a: Automation) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  const pilot = a.status === 'pilot'
  return (
    <div className="ba-scrim" onClick={onClose}>
      <div
        className="ba-sheet" role="dialog" aria-modal="true" aria-labelledby="ba-sheet-title"
        data-lenis-prevent onClick={e => e.stopPropagation()}
      >
        <div className="ba-grab" aria-hidden="true" />
        <div className="ba-sheet-head">
          <Icon a={a} size={48} />
          <div style={{ minWidth: 0 }}>
            <span className="ba-num">#{a.n} · <span className="ba-cat" style={{ color: CAT_TEXT[a.category] }}>{a.category}</span></span>
            <h2 id="ba-sheet-title">{a.name}</h2>
            <StatusChip a={a} />
          </div>
          <button ref={closeRef} type="button" className="ba-x" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <h3>What it does</h3>
        <p>{a.what}</p>
        {a.note && <p className="ba-note">{a.note}</p>}

        <h3>How it works</h3>
        <ol className="ba-how">
          {a.how.map((s, i) => <li key={i}><span aria-hidden="true">{i + 1}</span>{s}</li>)}
        </ol>

        <h3>Good for</h3>
        <div className="ba-good">{a.goodFor.map(g => <span key={g}>{g}</span>)}</div>

        <button type="button" className={'ba-btn ' + (pilot ? 'ba-btn--pri' : 'ba-btn--sec')} onClick={() => onJoin(a)}>
          {pilot ? <>Join the pilot <ArrowRight size={18} /></> : <><Bell size={18} /> Notify me</>}
        </button>
      </div>
    </div>
  )
}

export default function AutomationTiles({ onJoin }: { onJoin: (a?: Automation) => void }) {
  const [cat, setCat] = useState<Category | 'All'>('All')
  const [open, setOpen] = useState<Automation | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const shown = cat === 'All' ? AUTOMATIONS : AUTOMATIONS.filter(a => a.category === cat)

  return (
    <>
      <div className="ba-chips" role="group" aria-label="Filter by category">
        {(['All', ...CATEGORIES] as const).map(c => (
          <button key={c} type="button" className="ba-chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c !== 'All' && <span className="dot" style={{ background: CAT_COLOR[c] }} aria-hidden="true" />}
            {c}
          </button>
        ))}
      </div>

      <div className="ba-grid">
        {shown.map(a => (
          <button key={a.n} type="button" className="ba-tile" onClick={() => setOpen(a)} aria-haspopup="dialog"
            aria-label={`${a.name} — ${a.status === 'pilot' ? 'pilot open' : 'coming later'}. Show details`}>
            <span className="ba-tile-top"><Icon a={a} /><span className="ba-num">#{a.n}</span></span>
            <span className="ba-tname">{a.name}</span>
            <span className="ba-cat" style={{ color: CAT_TEXT[a.category] }}>{a.category}</span>
            <span className="ba-line">{a.line}</span>
            <StatusChip a={a} />
          </button>
        ))}
        {/* 12th cell: fills the grid evenly (2 × 6 / 3 × 4) and asks for what's missing → the form */}
        <button type="button" className="ba-tile ba-tile--ask" onClick={() => onJoin()}>
          <span className="ba-tile-top"><span className="ba-ico" style={{ background: 'var(--ba-soft)', color: 'var(--ba-violet)' }} aria-hidden="true"><Plus size={20} strokeWidth={2.2} /></span></span>
          <span className="ba-tname">Need something else?</span>
          <span className="ba-line">Tell us in the form what takes most of your time. It helps us choose what to build next.</span>
          <span className="ba-ask-cta">Tell us <ArrowRight size={16} aria-hidden="true" /></span>
        </button>
      </div>

      {open && <Sheet a={open} onClose={close} onJoin={a => { setOpen(null); onJoin(a) }} />}
    </>
  )
}
