import { useEffect, useRef } from 'react'

/* ── Particle type ────────────────────────────────────────────── */
interface Particle {
  x: number; y: number
  vx: number; vy: number
  r: number               // radius
  op: number              // base opacity
}

const GOLD = '212,168,67' // rgba components

function makeParticle(w: number, h: number): Particle {
  const angle = Math.random() * Math.PI * 2
  const speed = 0.07 + Math.random() * 0.10
  return {
    x:  Math.random() * w,
    y:  Math.random() * h,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r:  0.7 + Math.random() * 1.0,
    op: 0.17 + Math.random() * 0.18,
  }
}

/* ── Component ────────────────────────────────────────────────── */
export default function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursor    = useRef({ x: -999, y: -999 })
  const rafRef    = useRef(0)

  useEffect(() => {
    /* Honour prefers-reduced-motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const LINK_DIST   = 115
    const REPEL_DIST  = 85
    const REPEL_STR   = 0.85
    const MAX_SPEED   = 0.22
    const DAMPEN      = 0.991

    const count = () => (window.innerWidth < 768 ? 0 : 55)
    let   pts:  Particle[] = []

    /* ── Canvas sizing ──────────────────────────────────────── */
    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      pts = Array.from({ length: count() }, () =>
        makeParticle(canvas.width, canvas.height)
      )
    }

    /* ── RAF draw loop ──────────────────────────────────────── */
    function draw() {
      /* Pause while tab hidden */
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const { width: W, height: H } = canvas
      const mx = cursor.current.x
      const my = cursor.current.y

      ctx.clearRect(0, 0, W, H)

      if (pts.length === 0) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      /* Move */
      for (const p of pts) {
        const dx = p.x - mx
        const dy = p.y - my
        const d  = Math.hypot(dx, dy)

        /* Cursor repulsion */
        if (d < REPEL_DIST && d > 0) {
          const f = ((REPEL_DIST - d) / REPEL_DIST) * REPEL_STR * 0.05
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }

        /* Dampen + clamp */
        p.vx *= DAMPEN
        p.vy *= DAMPEN
        const spd = Math.hypot(p.vx, p.vy)
        if (spd > MAX_SPEED) { p.vx = (p.vx / spd) * MAX_SPEED; p.vy = (p.vy / spd) * MAX_SPEED }

        p.x += p.vx
        p.y += p.vy

        /* Edge wrap */
        if (p.x < -4)  p.x = W + 4
        if (p.x > W+4) p.x = -4
        if (p.y < -4)  p.y = H + 4
        if (p.y > H+4) p.y = -4
      }

      /* Connection lines */
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d  = Math.hypot(dx, dy)
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.11
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(${GOLD},${alpha.toFixed(3)})`
            ctx.lineWidth   = 0.55
            ctx.stroke()
          }
        }
      }

      /* Particles */
      for (const p of pts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${GOLD},${p.op})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const onMove  = (e: MouseEvent) => { cursor.current = { x: e.clientX, y: e.clientY } }
    const onLeave = () => { cursor.current = { x: -999, y: -999 } }

    window.addEventListener('resize',        resize,  { passive: true })
    window.addEventListener('mousemove',     onMove,  { passive: true })
    document.addEventListener('mouseleave',  onLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize',       resize)
      window.removeEventListener('mousemove',    onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none"
      style={{ position: 'fixed', inset: 0, zIndex: 1 }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      />

      {/* Scanning beam — soft diagonal gold light sweep, every 22s */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          bottom:     0,
          left:       0,
          width:      '40%',
          background: [
            'linear-gradient(90deg,',
            '  transparent 0%,',
            '  rgba(212,168,67,0.025) 35%,',
            '  rgba(212,168,67,0.05)  50%,',
            '  rgba(212,168,67,0.025) 65%,',
            '  transparent 100%)',
          ].join(''),
          animationName:           'scan-beam',
          animationDuration:       '22s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      />
    </div>
  )
}
