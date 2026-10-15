import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { AdditiveBlending, Euler, Vector3, type Group, type Mesh } from 'three'
import { palette } from '../lib/constants.ts'

export interface HeroMarkProps {
  pointer: { x: number; y: number }
  reducedMotion: boolean
  isMobile: boolean
  isLowPower: boolean
}

interface OrbConfig {
  radiusX: number
  radiusZ: number
  tilt: [number, number, number]
  speed: number
  phase: number
  color: string
  size: number
}

const ORB_CONFIGS: OrbConfig[] = [
  {
    radiusX: 2.05,
    radiusZ: 1.45,
    tilt: [0.38, 0.42, 0.15],
    speed: 0.65,
    phase: 0,
    color: palette.accentGreen,
    size: 0.058,
  },
  {
    radiusX: 1.72,
    radiusZ: 2.15,
    tilt: [-0.48, -0.55, 0.28],
    speed: -0.48,
    phase: 2.1,
    color: palette.accentCyan,
    size: 0.052,
  },
  {
    radiusX: 2.38,
    radiusZ: 1.68,
    tilt: [0.55, -0.32, -0.42],
    speed: 0.42,
    phase: 4.2,
    color: '#bbfefb',
    size: 0.048,
  },
  {
    radiusX: 1.45,
    radiusZ: 1.85,
    tilt: [-0.28, 0.72, -0.48],
    speed: -0.75,
    phase: 1.4,
    color: '#a3f7b5',
    size: 0.044,
  },
]

export function HeroMark({ pointer, reducedMotion, isMobile, isLowPower }: HeroMarkProps) {
  const masterGroupRef = useRef<Group>(null)
  const logoGroupRef = useRef<Group>(null)
  const outerRingRef = useRef<Group>(null)
  const innerRingRef = useRef<Group>(null)
  const coreRef = useRef<Mesh>(null)

  const orbRefs = useRef<(Group | null)[]>([])

  const viewport = useThree((state) => state.viewport)
  // Scale dynamically to fit hero viewport comfortably on both desktop and mobile
  const fit = Math.min(1.18, Math.max(0.72, viewport.width / 3.8))

  // Determine active orbs and particle complexity based on mobile & device capability
  const activeOrbCount = isMobile || isLowPower ? 2 : 4
  const activeOrbs = ORB_CONFIGS.slice(0, activeOrbCount)
  const enableParticles = !isMobile && !isLowPower && !reducedMotion

  useFrame((state, delta) => {
    // 1. Mouse Parallax Tilt (clamped and lerped for gentle, restrained feel)
    if (masterGroupRef.current && !reducedMotion) {
      const targetTiltX = Math.max(-0.16, Math.min(0.16, pointer.y * 0.14))
      const targetTiltY = Math.max(-0.2, Math.min(0.2, pointer.x * 0.18))
      const lerpSpeed = 1 - Math.exp(-delta * 4.5)

      masterGroupRef.current.rotation.x += (targetTiltX - masterGroupRef.current.rotation.x) * lerpSpeed
      masterGroupRef.current.rotation.y += (targetTiltY - masterGroupRef.current.rotation.y) * lerpSpeed
    }

    // 2. Logo Centerpiece Subtle Rotations
    if (!reducedMotion) {
      if (outerRingRef.current) {
        outerRingRef.current.rotation.y += delta * 0.16
      }
      if (innerRingRef.current) {
        innerRingRef.current.rotation.x += delta * -0.12
        innerRingRef.current.rotation.z += delta * 0.08
      }
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.22
        coreRef.current.rotation.x += delta * 0.14
      }
    }

    // 3. Orbs Orbital Trajectories
    const elapsed = state.clock.getElapsedTime()
    activeOrbs.forEach((orb, i) => {
      const orbGroup = orbRefs.current[i]
      if (!orbGroup) return

      const angle = reducedMotion ? orb.phase : elapsed * orb.speed + orb.phase
      const rawX = orb.radiusX * Math.cos(angle)
      const rawZ = orb.radiusZ * Math.sin(angle)
      const rawY = Math.sin(angle * 2) * 0.12

      // Apply orbital inclination tilt
      const euler = new Euler(orb.tilt[0], orb.tilt[1], orb.tilt[2], 'XYZ')
      const pos = new Vector3(rawX, rawY, rawZ).applyEuler(euler)
      orbGroup.position.copy(pos)
    })
  })

  const ringSegments = isLowPower ? 24 : 64
  const radialSegments = isLowPower ? 80 : 144

  return (
    <group ref={masterGroupRef} scale={fit}>
      {/* SDC LOGO CENTERPIECE */}
      <group ref={logoGroupRef} rotation={reducedMotion ? [0.42, 0.28, 0] : [0.38, 0.22, 0]}>
        {/* Outer Primary Brand Torus Ring */}
        <group ref={outerRingRef}>
          <mesh>
            <torusGeometry args={[1.0, 0.034, ringSegments, radialSegments]} />
            <meshBasicMaterial color={palette.accentGreen} toneMapped={false} />
          </mesh>
          {/* Subtle Outer Additive Bloom Halo */}
          <mesh>
            <torusGeometry args={[1.0, 0.11, 14, isLowPower ? 48 : 84]} />
            <meshBasicMaterial
              color={palette.accentGreen}
              transparent
              opacity={0.16}
              blending={AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Inner Counter-Angled Orbital Ring */}
        <group ref={innerRingRef} rotation={[0.75, 0.45, 0.25]}>
          <mesh>
            <torusGeometry args={[0.76, 0.022, 20, isLowPower ? 60 : 110]} />
            <meshBasicMaterial color={palette.accentCyan} toneMapped={false} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.76, 0.075, 12, 60]} />
            <meshBasicMaterial
              color={palette.accentCyan}
              transparent
              opacity={0.14}
              blending={AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Center Faceted Technical Crystal Core */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.26, 0]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.18, 0]} />
          <meshBasicMaterial color={palette.accentGreen} toneMapped={false} />
        </mesh>

        {/* Gentle Core Point Light */}
        <pointLight color={palette.accentGreen} intensity={1.2} distance={3.8} />
      </group>

      {/* GLOWING ORBITING ORBS */}
      {activeOrbs.map((orb, index) => (
        <group
          key={index}
          ref={(el) => {
            orbRefs.current[index] = el
          }}
        >
          {/* Inner High-Intensity Core */}
          <mesh>
            <sphereGeometry args={[orb.size, 16, 16]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          {/* Glowing Outer Halo */}
          <mesh>
            <sphereGeometry args={[orb.size * 2.2, 16, 16]} />
            <meshBasicMaterial
              color={orb.color}
              transparent
              opacity={0.5}
              blending={AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          {/* Subtle orb point light (desktop/tablet only) */}
          {!isLowPower && index < 2 ? (
            <pointLight color={orb.color} intensity={0.5} distance={1.8} />
          ) : null}
        </group>
      ))}

      {/* BACKGROUND PARTICLE FIELD (Elegant, slow-moving particles) */}
      {enableParticles ? (
        <group>
          <Sparkles
            count={48}
            scale={[5.5, 4.0, 5.5]}
            size={2.2}
            speed={0.14}
            opacity={0.55}
            noise={0.16}
            color={palette.accentGreen}
          />
          <Sparkles
            count={24}
            scale={[4.2, 3.2, 4.2]}
            size={1.6}
            speed={0.1}
            opacity={0.4}
            noise={0.12}
            color={palette.accentCyan}
          />
        </group>
      ) : null}
    </group>
  )
}
