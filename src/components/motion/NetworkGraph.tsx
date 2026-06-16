import { useRef, useEffect } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { CENTRE_NODE, VENTURE_NODES } from './config/ventures'

/* ── Internal types ───────────────────────────────────────────── */
interface Pulse {
  t:       number   // 0 → 1 progress along edge
  speed:   number   // per ms
  opacity: number
}

const G  = '212,168,67'   // gold
const LG = '63,185,80'    // live-green

/* ── Component ────────────────────────────────────────────────── */
export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced   = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    let   rafId  = 0

    /* Resize canvas buffer to match CSS size */
    function resize() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      if (w && h) { canvas.width = w; canvas.height = h }
    }
    resize()

    /* ── Static fallback (reduced-motion + mobile) ──────────── */
    function drawStatic() {
      const { width: W, height: H } = canvas
      if (!W || !H) return
      ctx.clearRect(0, 0, W, H)

      const cx = W / 2
      const cy = H * 0.44
      const sc = Math.min(W, H) / 900

      VENTURE_NODES.forEach(v => {
        const nx = cx + Math.cos(v.angle) * v.orbit * sc
        const ny = cy + Math.sin(v.angle) * v.orbit * sc
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(nx, ny)
        ctx.strokeStyle = `rgba(${G},0.10)`
        ctx.lineWidth = 0.8
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(nx, ny, v.radius * sc, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${G},0.22)`
        ctx.fill()
      })

      ctx.beginPath()
      ctx.arc(cx, cy, CENTRE_NODE.radius * sc, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${G},0.35)`
      ctx.fill()
    }

    if (reduced || window.innerWidth < 768) {
      drawStatic()
      window.addEventListener('resize', () => { resize(); drawStatic() }, { passive: true })
      return () => {}
    }

    /* ── Animated mode ──────────────────────────────────────── */
    const cursor   = { x: 0.5, y: 0.5 }
    const pulses   = VENTURE_NODES.map(() => [] as Pulse[])
    const timers   = VENTURE_NODES.map(() => Math.random() * 2000)

    const onMove = (e: MouseEvent) => {
      cursor.x = e.clientX / window.innerWidth
      cursor.y = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let last = performance.now()

    function frame(now: number) {
      if (document.hidden) { rafId = requestAnimationFrame(frame); return }

      const dt = Math.min(now - last, 50)  // cap delta to prevent spiral
      last = now

      const { width: W, height: H } = canvas
      if (!W || !H) { rafId = requestAnimationFrame(frame); return }

      ctx.clearRect(0, 0, W, H)

      const sc  = Math.min(W, H) / 900
      /* Graph anchor — upper-centre of the canvas so it's visible on load */
      const cx  = W / 2  + (cursor.x - 0.5) * -22
      const cy  = H * 0.44 + (cursor.y - 0.5) * -12

      /* Venture node positions with organic drift */
      const vPos = VENTURE_NODES.map((v, i) => {
        const t       = now * 0.001
        const dAngle  = v.angle + Math.sin(t * 0.19 + i * 2.1) * 0.10
        const dOrbit  = v.orbit + Math.cos(t * 0.14 + i * 1.7) * 10
        const px = (cursor.x - 0.5) * -9  * (1 + i * 0.25)
        const py = (cursor.y - 0.5) * -5  * (1 + i * 0.25)
        return {
          x: cx + Math.cos(dAngle) * dOrbit * sc + px,
          y: cy + Math.sin(dAngle) * dOrbit * sc + py,
          v,
          i,
        }
      })

      /* ── Draw edges ──────────────────────────────────────── */
      vPos.forEach(({ x: nx, y: ny, i }) => {
        const edgeGrd = ctx.createLinearGradient(cx, cy, nx, ny)
        edgeGrd.addColorStop(0, `rgba(${G},0.20)`)
        edgeGrd.addColorStop(1, `rgba(${G},0.06)`)
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(nx, ny)
        ctx.strokeStyle = edgeGrd
        ctx.lineWidth   = 0.75
        ctx.stroke()

        /* Spawn pulses */
        timers[i] -= dt
        if (timers[i] <= 0) {
          pulses[i].push({
            t:       0,
            speed:   0.00055 + Math.random() * 0.00065,
            opacity: 0.55 + Math.random() * 0.45,
          })
          timers[i] = 1100 + Math.random() * 1900
        }

        /* Advance + draw pulses */
        pulses[i] = pulses[i].filter(p => {
          p.t += p.speed * dt
          if (p.t >= 1) return false

          const fade = p.t < 0.15
            ? p.t / 0.15
            : p.t > 0.72 ? (1 - p.t) / 0.28 : 1

          const px = cx + (nx - cx) * p.t
          const py = cy + (ny - cy) * p.t
          const r  = 2.4 * sc

          const gr = ctx.createRadialGradient(px, py, 0, px, py, r * 3.5)
          gr.addColorStop(0, `rgba(${G},${(p.opacity * fade).toFixed(3)})`)
          gr.addColorStop(1, `rgba(${G},0)`)
          ctx.beginPath()
          ctx.arc(px, py, r * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = gr
          ctx.fill()
          return true
        })
      })

      /* ── Draw venture nodes ──────────────────────────────── */
      vPos.forEach(({ x: nx, y: ny, v }) => {
        const r = v.radius * sc

        /* Outer glow */
        const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 4)
        glow.addColorStop(0, `rgba(${G},0.18)`)
        glow.addColorStop(1, `rgba(${G},0)`)
        ctx.beginPath()
        ctx.arc(nx, ny, r * 4, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        /* SkillVue live pulsing ring */
        if (v.status === 'live') {
          const pulse = 0.35 + Math.sin(now * 0.002) * 0.28
          ctx.beginPath()
          ctx.arc(nx, ny, r * 2.6, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${LG},${pulse.toFixed(3)})`
          ctx.lineWidth   = 0.9
          ctx.stroke()
        }

        /* Core */
        ctx.beginPath()
        ctx.arc(nx, ny, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${G},0.48)`
        ctx.fill()

        /* Label */
        ctx.font         = `${Math.max(9, 9 * sc + 7)}px Inter, system-ui, sans-serif`
        ctx.fillStyle    = `rgba(212,168,67,0.45)`
        ctx.textAlign    = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText(v.label, nx, ny + r + 5 * sc)
      })

      /* ── Centre node ─────────────────────────────────────── */
      const breath = 0.88 + Math.sin(now * 0.0011) * 0.12
      const cr = CENTRE_NODE.radius * sc

      const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 5.5)
      outerGlow.addColorStop(0, `rgba(${G},${(0.20 * breath).toFixed(3)})`)
      outerGlow.addColorStop(1, `rgba(${G},0)`)
      ctx.beginPath()
      ctx.arc(cx, cy, cr * 5.5, 0, Math.PI * 2)
      ctx.fillStyle = outerGlow
      ctx.fill()

      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr)
      coreGrad.addColorStop(0,   `rgba(232,199,102,${(0.82 * breath).toFixed(3)})`)
      coreGrad.addColorStop(0.55, `rgba(${G},${(0.62 * breath).toFixed(3)})`)
      coreGrad.addColorStop(1,   `rgba(${G},0.28)`)
      ctx.beginPath()
      ctx.arc(cx, cy, cr, 0, Math.PI * 2)
      ctx.fillStyle = coreGrad
      ctx.fill()

      /* Centre label */
      ctx.font         = `${Math.max(10, 10 * sc + 7)}px Inter, system-ui, sans-serif`
      ctx.fillStyle    = `rgba(244,241,234,0.50)`
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText('Lintejas', cx, cy + cr + 6 * sc)

      rafId = requestAnimationFrame(frame)
    }

    rafId = requestAnimationFrame(frame)

    const onResize = () => { resize() }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        0,
      }}
    />
  )
}
