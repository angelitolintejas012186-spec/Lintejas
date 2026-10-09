/**
 * SceneJourney — fixed R3F canvas behind all public pages.
 * Scroll-linked camera parallax + particle color journey:
 *   hero → slate-blue  |  content → bronze  |  CTA → gold
 *
 * Desktop-only (≥ 1024px).  Reduced-motion: null.
 * No WebGL (or software-only GL), a renderer throw, or a lost context → null: it is a decorative
 * background, so the page simply renders without it (an uncaught R3F error here used to blank every page).
 * Transparent WebGL canvas composites over AuroraBackground.
 */
import { useRef, useMemo, useEffect, useState, Component } from 'react'
import type { ReactNode } from 'react'
import { captureException } from '@sentry/react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useScroll } from 'framer-motion'
import * as THREE from 'three'
import { useReducedMotion } from '../../lib/useReducedMotion'

/* ── Scene constants ───────────────────────────────────────────── */
const COUNT     = 72
const COLOR_A   = new THREE.Color('#29447b')   // slate-blue at scroll 0
const COLOR_B   = new THREE.Color('#9A7A2E')   // bronze at scroll 0.5
const COLOR_C   = new THREE.Color('#D4A843')   // gold at scroll 1

function lerpColor(t: number): THREE.Color {
  if (t < 0.5) return COLOR_A.clone().lerp(COLOR_B, t * 2)
  return COLOR_B.clone().lerp(COLOR_C, (t - 0.5) * 2)
}

/* ── Inner R3F scene ───────────────────────────────────────────── */
function Scene({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { camera, scene, gl } = useThree()
  const pointsRef = useRef<THREE.Points>(null)
  const matRef    = useRef<THREE.PointsMaterial>(null)

  /* One-time scene setup */
  useEffect(() => {
    scene.background = null
    gl.setClearColor(0x000000, 0)
  }, [scene, gl])

  /* Stable particle positions */
  const [geo] = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22
      arr[i * 3 + 1] = (Math.random() - 0.5) * 13
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return [g]
  }, [])

  useFrame((_, delta) => {
    const scroll  = scrollRef.current
    const smooth  = 1 - Math.pow(0.018, delta)

    /* Camera — dolly in + tilt up as user scrolls */
    const cam = camera as THREE.PerspectiveCamera
    cam.position.y  = THREE.MathUtils.lerp(cam.position.y,  scroll * 2.0,     smooth)
    cam.position.z  = THREE.MathUtils.lerp(cam.position.z,  10 - scroll * 1.4, smooth * 0.6)
    cam.rotation.x  = THREE.MathUtils.lerp(cam.rotation.x,  scroll * -0.055,  smooth)

    /* Slow passive rotation on the point cloud */
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.016
      pointsRef.current.rotation.x += delta * 0.005
    }

    /* Particle color journey */
    if (matRef.current) {
      const target = lerpColor(scroll)
      matRef.current.color.lerp(target, smooth * 0.6)
    }
  })

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        ref={matRef}
        color={COLOR_A.clone()}
        size={0.048}
        sizeAttenuation
        transparent
        opacity={0.42}
        depthWrite={false}
      />
    </points>
  )
}

/* ── WebGL pre-check (desktop only, once per page load). failIfMajorPerformanceCaveat: no 3D background
   on software-only GL. The probe context is released immediately. ─── */
let webglChecked: boolean | null = null
function webglOk(): boolean {
  if (webglChecked !== null) return webglChecked
  webglChecked = false
  try {
    const probe = document.createElement('canvas')
    const opts = { failIfMajorPerformanceCaveat: true }
    const gl = (probe.getContext('webgl2', opts) || probe.getContext('webgl', opts)) as WebGLRenderingContext | null
    if (gl) { webglChecked = true; gl.getExtension('WEBGL_lose_context')?.loseContext() }
  } catch { webglChecked = false }
  return webglChecked
}

/* ── Error boundary: a renderer throw hides the background instead of unmounting the whole app ── */
class SceneGuard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err: unknown) {
    console.warn('[scene] background 3D failed — hidden', err)
    captureException(err, { tags: { webgl_fallback: 'background' } })
  }
  render() { return this.state.failed ? null : this.props.children }
}

/* ── Inner wrapper (has hooks; only rendered on desktop) ───────── */
function SceneJourneyInner() {
  const [lost, setLost]      = useState(false)   // WebGL context lost (GPU reset / tab pressure) → hide
  const scrollRef            = useRef(0)
  const { scrollYProgress }  = useScroll()

  useEffect(() => {
    return scrollYProgress.on('change', v => { scrollRef.current = v })
  }, [scrollYProgress])

  if (lost) return null
  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 46 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', () => setLost(true), { once: true })}
      >
        <Scene scrollRef={scrollRef} />
      </Canvas>
    </div>
  )
}

/* ── Public export — gates on screen width + reduced-motion ────── */
export default function SceneJourney() {
  const reduced   = useReducedMotion()
  const [desktop, setDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  )

  useEffect(() => {
    const check = () => setDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  if (reduced || !desktop || !webglOk()) return null
  return <SceneGuard><SceneJourneyInner /></SceneGuard>
}
