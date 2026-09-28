/* ============================================================================
   DeferredLogo.tsx — mobile (< lg) hero logo, static-first then 3D.

   Item B1 (perf): phones must not download the ~872 KB React-Three-Fiber chunk
   just to paint a decorative hero logo. This renders the existing static
   TheInterlockLogo SVG FIRST (same size/position as the old Suspense fallback →
   zero layout shift), then — only after first paint, only when idle, and only
   when the logo is in view — lazy-loads Interlock3D and crossfades to it over
   300 ms. The R3F chunk is NEVER downloaded when the visitor has reduced-motion,
   Save-Data, a 2g/slow-2g connection, or deviceMemory < 4: the static SVG stays.

   Desktop (≥ lg) does NOT use this component — Home renders Interlock3D directly,
   unchanged. Interlock3D.tsx itself is byte-identical (not touched).
   ============================================================================ */
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import TheInterlockLogo from './TheInterlockLogo'

const Interlock3D = lazy(() => import('./Interlock3D'))

/* Should this device ever download + run the WebGL logo? Conservative: any signal
   of reduced-motion, data-saving, a slow link, or low memory → keep the static SVG. */
function heavyLogoAllowed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    const c = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    if (c) {
      if (c.saveData) return false
      if (c.effectiveType === '2g' || c.effectiveType === 'slow-2g') return false
    }
    const dm = (navigator as unknown as { deviceMemory?: number }).deviceMemory
    if (typeof dm === 'number' && dm > 0 && dm < 4) return false
  } catch { /* unknown → allow (default to the richer experience) */ }
  return true
}

export default function DeferredLogo(
  { size, mouseRef }: { size: number; mouseRef: MutableRefObject<{ x: number; y: number }> },
) {
  const [load3D, setLoad3D]   = useState(false)   // start importing + mounting the R3F canvas
  const [swapped, setSwapped] = useState(false)   // crossfade: static out, 3D in
  const hostRef = useRef<HTMLDivElement>(null)

  /* Kick the 3D load after first paint, when idle, and only once the logo is in view. */
  useEffect(() => {
    if (!heavyLogoAllowed()) return   // static SVG forever — no R3F download
    let cancelled = false
    let io: IntersectionObserver | null = null

    const startWhenIdle = () => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback
      const run = () => { if (!cancelled) setLoad3D(true) }
      if (ric) ric(run); else setTimeout(run, 200)
    }
    const afterPaint = () => {
      if (document.readyState === 'complete') startWhenIdle()
      else window.addEventListener('load', startWhenIdle, { once: true })
    }

    const el = hostRef.current
    if (el && 'IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) { io?.disconnect(); io = null; afterPaint() }
      }, { threshold: 0.1 })
      io.observe(el)
    } else {
      afterPaint()   // no IO → still defer to idle, just not gated on visibility
    }
    return () => { cancelled = true; io?.disconnect() }
  }, [])

  /* Once the 3D is mounting, give the Canvas a beat to initialise, then crossfade. */
  useEffect(() => {
    if (!load3D) return
    const t = setTimeout(() => setSwapped(true), 450)
    return () => clearTimeout(t)
  }, [load3D])

  return (
    <div ref={hostRef} className="relative w-full h-full">
      {/* Static SVG — identical to the old Suspense fallback (size, opacity, float). Fades out on swap. */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: swapped ? 0 : 1 }}
        aria-hidden={swapped ? true : undefined}
      >
        <TheInterlockLogo size={size} className="opacity-70 animate-float" />
      </div>
      {/* 3D — mounted only after the deferred trigger; fades in over 300 ms. */}
      {load3D && (
        <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: swapped ? 1 : 0 }}>
          <Suspense fallback={null}>
            <Interlock3D mouseRef={mouseRef} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
