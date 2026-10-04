/* Logo still renderer — NOT shipped (tools/ is outside src; vite build only bundles index.html).
   Renders the SAME scene as src/components/Interlock3D.tsx (identical meshes, materials, lights, camera,
   Environment "sunset") with the animation frozen at a chosen Y rotation, so the 2048 px still is the hero
   itself. Interlock3D.tsx is not imported or modified. Query: ?ry=<radians>&rx=&size=<px>&glow=0|1&bg=transparent|navy */
import { createRoot } from 'react-dom/client'
import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

const q = new URLSearchParams(location.search)
const RY = parseFloat(q.get('ry') || '0'), RX = parseFloat(q.get('rx') || '0')
const SIZE = parseInt(q.get('size') || '2048', 10), GLOW = q.get('glow') === '1', NAVY = q.get('bg') === 'navy'
const ZOOM = parseFloat(q.get('zoom') || '1')
document.documentElement.style.setProperty('--s', SIZE + 'px')

const GOLD_PROPS = { color: '#C9983A', metalness: 0.88, roughness: 0.14, emissive: '#1A0E00', emissiveIntensity: 0.25, envMapIntensity: 1.8 }
const BRIGHT_PROPS = { color: '#E8C766', metalness: 0.92, roughness: 0.08, emissive: '#2A1800', emissiveIntensity: 0.50, envMapIntensity: 2.2 }

function Ready() {   // signal the capture script once the env map + first frames are in
  const { gl } = useThree()
  useEffect(() => { let n = 0; const tick = () => { if (++n > 20) { (window as any).__ready = gl.domElement; return } requestAnimationFrame(tick) }; tick() }, [gl])
  return null
}
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} color="#1B2E4E" />
      <directionalLight position={[2, 5, 3]} intensity={2.4} color="#F0D882" />
      <directionalLight position={[-3, -2, -2]} intensity={0.6} color="#2A4070" />
      <pointLight position={[0, 0, 2.5]} intensity={1.8} color="#D4A843" distance={7} decay={2} />
      <pointLight position={[0, 3, 1]} intensity={0.8} color="#E8C766" distance={5} decay={2} />
      {GLOW && (<>
        <mesh position={[0, 0, -0.6]}><sphereGeometry args={[1.5, 16, 16]} /><meshBasicMaterial color="#D4A843" transparent opacity={0.045} side={THREE.BackSide} /></mesh>
        <mesh position={[0, 0, -0.3]}><circleGeometry args={[0.9, 32]} /><meshBasicMaterial color="#D4A843" transparent opacity={0.07} /></mesh>
      </>)}
      <group rotation={[RX, RY, 0]}>
        <mesh position={[-1.05, 0, 0]}><boxGeometry args={[0.18, 2.64, 0.22]} /><meshStandardMaterial {...GOLD_PROPS} /></mesh>
        <mesh position={[-0.57, 1.23, 0]}><boxGeometry args={[1.14, 0.18, 0.22]} /><meshStandardMaterial {...GOLD_PROPS} /></mesh>
        <mesh position={[-0.57, -1.23, 0]}><boxGeometry args={[1.14, 0.18, 0.22]} /><meshStandardMaterial {...GOLD_PROPS} /></mesh>
        <mesh position={[1.05, 0, 0]}><boxGeometry args={[0.18, 2.64, 0.22]} /><meshStandardMaterial {...GOLD_PROPS} color="#D8AC48" /></mesh>
        <mesh position={[0.57, 1.23, 0]}><boxGeometry args={[1.14, 0.18, 0.22]} /><meshStandardMaterial {...GOLD_PROPS} color="#D8AC48" /></mesh>
        <mesh position={[0.57, -1.23, 0]}><boxGeometry args={[1.14, 0.18, 0.22]} /><meshStandardMaterial {...GOLD_PROPS} color="#D8AC48" /></mesh>
        <mesh position={[0, 0, 0.10]}><boxGeometry args={[0.52, 0.52, 0.44]} /><meshStandardMaterial {...BRIGHT_PROPS} /></mesh>
      </group>
    </>
  )
}
createRoot(document.getElementById('c')!).render(
  <Canvas dpr={1} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    camera={{ position: [0, 0, 4.6 / ZOOM], fov: 50 }} style={{ width: SIZE, height: SIZE, background: NAVY ? '#0A1628' : 'transparent' }}
    onCreated={({ gl }) => { if (NAVY) gl.setClearColor('#0A1628', 1) }}>
    <Suspense fallback={null}><Scene /><Environment preset="sunset" /><Ready /></Suspense>
  </Canvas>,
)
