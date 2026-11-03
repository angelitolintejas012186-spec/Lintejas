import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/* ── TL / EN language toggle (Angie, 3 Nov 2026 — approved mock "Lintejas Floating Language Toggle") ──────────
   A small pill (each half 27×23 px, 10 px bold) that sits beside the hero badge, plus ONE floating copy that appears
   top-right under the header once the hero's pill has scrolled out of view. Both copies are driven by the page's own
   language state (the same value + stored preference), so there is never a second store.
   Floating copy: fades out while scrolling down; back on scroll up or after ~600 ms without scrolling. It also stays
   hidden whenever it would sit on top of a link, button or form field, so it never covers something to tap.
   Each half has an invisible 44×44 px tap area (.lang-toggle-btn::before in index.css). */

export type Lang = 'tl' | 'en'

interface PillProps { lang: Lang; onPick: (l: Lang) => void; floating?: boolean }

export function LangPill({ lang, onPick, floating = false }: PillProps) {
  return (
    <div role="group" aria-label="Language" className={'lang-toggle' + (floating ? ' lang-toggle--float' : '')}>
      {(['tl', 'en'] as const).map(l => (
        <button key={l} type="button" onClick={() => onPick(l)} aria-pressed={lang === l} className="lang-toggle-btn">
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

const HIDE_IDLE_MS = 600
const TAPPABLE = 'a[href], button, input, select, textarea, label, summary, [role="button"], [contenteditable="true"]'

interface FloatProps extends PillProps { anchor: RefObject<HTMLElement> }

/* The floating copy. `anchor` = the hero's pill: while any of it is on screen below the header, no floating copy. */
export function FloatingLangToggle({ lang, onPick, anchor }: FloatProps) {
  const box = useRef<HTMLDivElement>(null)
  const [away, setAway] = useState(false)       // the hero pill has scrolled out of view
  const [moving, setMoving] = useState(false)   // scrolling down right now
  const [blocked, setBlocked] = useState(false) // would cover something tappable

  useEffect(() => {
    const el = anchor.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setAway(!e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [anchor])

  useEffect(() => {
    let lastY = window.scrollY, timer = 0
    const check = () => {
      const b = box.current
      if (!b) return
      const r = b.getBoundingClientRect()
      const pts: [number, number][] = [[r.left + 2, r.top + 2], [r.right - 2, r.top + 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.bottom - 2], [(r.left + r.right) / 2, (r.top + r.bottom) / 2]]
      const hit = pts.some(([x, y]) => document.elementsFromPoint(x, y).some(n => !b.contains(n) && !!(n as Element).closest?.(TAPPABLE)))
      setBlocked(hit)
    }
    const onScroll = () => {
      const y = window.scrollY
      if (y > lastY + 1) setMoving(true)
      else if (y < lastY - 1) { setMoving(false); check() }
      lastY = y
      window.clearTimeout(timer)
      timer = window.setTimeout(() => { setMoving(false); check() }, HIDE_IDLE_MS)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', check)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', check); window.clearTimeout(timer) }
  }, [])

  const shown = away && !moving && !blocked
  return (
    <div ref={box} className={'lang-float' + (shown ? ' is-shown' : '')} data-shown={shown ? 'true' : 'false'}
      aria-hidden={shown ? undefined : true} {...(shown ? {} : { inert: '' })}>
      <LangPill lang={lang} onPick={onPick} floating />
    </div>
  )
}
