import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { technologyContent } from '../data/sdcContent.ts'
import { useDeviceCapability, useIsMobile, useReducedMotion } from '../hooks/index.ts'

// Scroll progress 0..1 across the whole page
const scrollProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}

function Sun({ offset }: { offset: [number, number] }) {
  const tex = useTexture('/sdc-logo.png')
  const ref = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.4) * 0.25
  })
  return (
    <group position={[offset[0], offset[1], 0]} ref={ref}>
      <mesh>
        <sphereGeometry args={[1.55, 48, 48]} />
        <meshBasicMaterial color="#16c79a" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}

function Planet({ i, color, offset, reduced }: { i: number; color: string; offset: [number, number]; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const radius = 2.6 + i * 0.85
  useFrame((s) => {
    if (!ref.current) return
    const a = (reduced ? 0 : s.clock.elapsedTime) * (0.32 - i * 0.05) + i * 1.57
    ref.current.position.set(offset[0] + Math.cos(a) * radius, Math.sin(a * 0.7) * 0.5, Math.sin(a) * radius)
  })
  return (
    <>
      <mesh position={[offset[0], offset[1], 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.006, radius + 0.006, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.2 + (i % 2) * 0.06, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.38, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </>
  )
}

// Camera orbits the cell as the page scrolls; pointer adds parallax
function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  const smooth = useRef(0)
  useFrame((s, dt) => {
    pointer.current.x = s.pointer.x
    pointer.current.y = s.pointer.y
    smooth.current += (scrollProgress() - smooth.current) * (reduced ? 1 : 1 - Math.exp(-dt * 3))
    const p = smooth.current
    const angle = p * Math.PI * 1.6
    const r = 8.5 - p * 2.5
    camera.position.set(
      Math.sin(angle) * r + pointer.current.x * 0.5,
      1.4 - p * 3 + pointer.current.y * 0.3,
      Math.cos(angle) * r,
    )
    camera.lookAt(0, 0, 0)
  })
  return null
}

// Drifting wireframe shards + neon floor grid: depth cues for the whole page
function Shards({ colors, count, reduced }: { colors: string[]; count: number; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const items = useMemo(() => Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 * 3.1, r = 6.5 + (i * 37 % 9)
    return { pos: [Math.cos(a) * r, ((i * 53) % 11) - 5, Math.sin(a) * r] as [number, number, number], size: 0.25 + (i % 4) * 0.18, color: colors[i % colors.length] }
  }), [colors, count])
  useFrame((_, dt) => {
    if (reduced || !ref.current) return
    ref.current.rotation.y += dt * 0.02
    ref.current.children.forEach((c, i) => { c.rotation.x += dt * 0.15 * (1 + (i % 3)); c.rotation.y += dt * 0.2 })
  })
  return (
    <>
      <gridHelper args={[80, 80, '#16f2b3', '#0a3b44']} position={[0, -5.5, 0]} />
      <group ref={ref}>
        {items.map((it, i) => (
          <mesh key={i} position={it.pos}>
            <icosahedronGeometry args={[it.size, i % 2]} />
            <meshBasicMaterial color={it.color} wireframe transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </>
  )
}

export function UniverseScene() {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const { isLowPower, webgl } = useDeviceCapability()
  const domains = technologyContent.domains
  // Sun sits right of the hero text on desktop, above it on mobile
  const offset = useMemo<[number, number]>(() => (isMobile ? [0, 1.6] : [2.2, 0]), [isMobile])
  const colors = useMemo(() => domains.map((d) => d.accentColor), [domains])

  // Pointer FX: 3D card tilt + neon spotlight, delegated so every card gets it
  useEffect(() => {
    if (reduced) return
    const sel = '.editorial-home :is(article,[class*="card"],.editorial-stat)'
    let last: HTMLElement | null = null
    const move = (e: PointerEvent) => {
      document.documentElement.style.setProperty('--cx', e.clientX + 'px')
      document.documentElement.style.setProperty('--cy', e.clientY + 'px')
      const el = (e.target as HTMLElement).closest?.(sel) as HTMLElement | null
      if (last && last !== el) { last.style.removeProperty('--rx'); last.style.removeProperty('--ry') }
      last = el
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
      el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%')
      el.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg'); el.style.setProperty('--ry', ((x - 0.5) * 9).toFixed(2) + 'deg')
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [reduced])

  if (!webgl) return null

  return (
    <div className="universe-canvas" aria-hidden="true">
      <Canvas
        frameloop={reduced ? 'demand' : 'always'}
        dpr={isLowPower || isMobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 1.4, 8.5], fov: 45 }}
        gl={{ antialias: !isLowPower, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[offset[0], 0, 0]} intensity={30} color="#9ffcd8" />
        <Stars radius={60} depth={40} count={isMobile || isLowPower ? 800 : 2600} factor={3} fade speed={reduced ? 0 : 0.6} />
        <Shards colors={colors} count={isMobile || isLowPower ? 8 : 18} reduced={reduced} />
        <Sun offset={offset} />
        {domains.map((d, i) => (
          <Planet key={d.id} i={i} color={d.accentColor} offset={offset} reduced={reduced} />
        ))}
        <CameraRig reduced={reduced} />
      </Canvas>
    </div>
  )
}
