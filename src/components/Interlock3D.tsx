import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import type { RefObject } from 'react'
import TheInterlockLogo from './TheInterlockLogo'

/* ── Shared material props ─────────────────────────────────────── */
const GOLD_PROPS = {
  color:             '#C9983A' as const,
  metalness:         0.88,
  roughness:         0.14,
  emissive:          '#1A0E00' as const,
  emissiveIntensity: 0.25,
  envMapIntensity:   1.8,
}
const BRIGHT_PROPS = {
  color:             '#E8C766' as const,
  metalness:         0.92,
  roughness:         0.08,
  emissive:          '#2A1800' as const,
  emissiveIntensity: 0.50,
  envMapIntensity:   2.2,
}

/* ── Floating dust motes ───────────────────────────────────────── */
function Particles() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(80 * 3)
    for (let i = 0; i < 80; i++) {
      const r     = 1.9 + Math.random() * 1.3
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = (r * Math.cos(phi)) * 0.35        // flatten to disc
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.022
      ref.current.rotation.x = clock.elapsedTime * 0.008
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.024} color="#E8C766" transparent opacity={0.55} sizeAttenuation />
    </points>
  )
}

/* ── Logo geometry + animation ─────────────────────────────────── */
function InterlockScene({ mouseRef }: { mouseRef: RefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }, delta) => {
    const g = groupRef.current
    if (!g) return
    const m = mouseRef.current ?? { x: 0, y: 0 }

    g.rotation.y += delta * 0.13
    g.position.y  = Math.sin(clock.elapsedTime * 0.38) * 0.07

    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x,  m.y * 0.16, 0.045)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -m.x * 0.06, 0.045)
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight      intensity={0.5}  color="#1B2E4E" />
      <directionalLight  position={[2, 5, 3]} intensity={2.4} color="#F0D882" castShadow />
      <directionalLight  position={[-3, -2, -2]} intensity={0.6} color="#2A4070" />
      <pointLight        position={[0, 0, 2.5]} intensity={1.8} color="#D4A843" distance={7} decay={2} />
      <pointLight        position={[0, 3, 1]}   intensity={0.8} color="#E8C766" distance={5} decay={2} />

      {/* Soft volumetric glow disc behind the logo */}
      <mesh position={[0, 0, -0.6]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#D4A843" transparent opacity={0.045} side={THREE.BackSide} />
      </mesh>
      <mesh position={[0, 0, -0.3]}>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color="#D4A843" transparent opacity={0.07} />
      </mesh>

      {/* ── Interlock mark ─────────────────────────────────── */}
      <group ref={groupRef}>
        {/* Left bracket — vertical bar */}
        <mesh position={[-1.05, 0, 0]}>
          <boxGeometry args={[0.18, 2.64, 0.22]} />
          <meshStandardMaterial {...GOLD_PROPS} />
        </mesh>
        {/* Left bracket — top bar */}
        <mesh position={[-0.57, 1.23, 0]}>
          <boxGeometry args={[1.14, 0.18, 0.22]} />
          <meshStandardMaterial {...GOLD_PROPS} />
        </mesh>
        {/* Left bracket — bottom bar */}
        <mesh position={[-0.57, -1.23, 0]}>
          <boxGeometry args={[1.14, 0.18, 0.22]} />
          <meshStandardMaterial {...GOLD_PROPS} />
        </mesh>

        {/* Right bracket — vertical bar */}
        <mesh position={[1.05, 0, 0]}>
          <boxGeometry args={[0.18, 2.64, 0.22]} />
          <meshStandardMaterial {...GOLD_PROPS} color="#D8AC48" />
        </mesh>
        {/* Right bracket — top bar */}
        <mesh position={[0.57, 1.23, 0]}>
          <boxGeometry args={[1.14, 0.18, 0.22]} />
          <meshStandardMaterial {...GOLD_PROPS} color="#D8AC48" />
        </mesh>
        {/* Right bracket — bottom bar */}
        <mesh position={[0.57, -1.23, 0]}>
          <boxGeometry args={[1.14, 0.18, 0.22]} />
          <meshStandardMaterial {...GOLD_PROPS} color="#D8AC48" />
        </mesh>

        {/* Central interlock square — brighter, sits "through" both brackets */}
        <mesh position={[0, 0, 0.10]}>
          <boxGeometry args={[0.52, 0.52, 0.44]} />
          <meshStandardMaterial {...BRIGHT_PROPS} />
        </mesh>
      </group>

      <Particles />
    </>
  )
}

/* ── SVG fallback (reduced-motion / no-WebGL) ─────────────────── */
function InterlockFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div style={{ filter: 'drop-shadow(0 0 32px rgba(212,168,67,0.35))' }}>
        <TheInterlockLogo size={160} className="opacity-80" />
      </div>
    </div>
  )
}

/* ── Public API ────────────────────────────────────────────────── */
export default function Interlock3D({
  mouseRef,
}: {
  mouseRef: RefObject<{ x: number; y: number }>
}) {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (reduced) return <InterlockFallback />

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 4.6], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <InterlockScene mouseRef={mouseRef} />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  )
}
