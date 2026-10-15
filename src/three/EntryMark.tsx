import { useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { useRef, type RefObject } from 'react'
import { AdditiveBlending, DoubleSide, type Group, type Mesh } from 'three'
import { palette } from '../lib/constants.ts'

export type EntryMotion = {
  hover: number
  spin: number
  collapse: number
  pulseScale: number
  pulseOpacity: number
  pulseScale2: number
  pulseOpacity2: number
}

type EntryMarkProps = {
  motion: RefObject<EntryMotion>
  reducedMotion: boolean
  lightweight: boolean
}

const FULL_PARTICLE_COUNT = 84
const ACCENT_PARTICLE_COUNT = 28
const LIGHT_PARTICLE_COUNT = 26

function LogoMark({ lightweight }: { lightweight: boolean }) {
  const tubeSegments = lightweight ? 12 : 28
  const radialSegments = lightweight ? 72 : 144

  return (
    <group rotation={[0.58, 0.2, 0]}>
      <mesh>
        <torusGeometry args={[0.96, 0.032, tubeSegments, radialSegments]} />
        <meshBasicMaterial color={palette.accentGreen} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.96, 0.11, 12, lightweight ? 48 : 80]} />
        <meshBasicMaterial
          color={palette.accentGreen}
          transparent
          opacity={0.18}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function EnergyPulse({
  pulseRef,
  color,
  inner,
  outer,
}: {
  pulseRef: RefObject<Mesh | null>
  color: string
  inner: number
  outer: number
}) {
  return (
    <mesh ref={pulseRef} rotation={[0.58, 0.2, 0]} renderOrder={2}>
      <ringGeometry args={[inner, outer, 96]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0}
        blending={AdditiveBlending}
        depthWrite={false}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  )
}

export function EntryMark({ motion, reducedMotion, lightweight }: EntryMarkProps) {
  const ringRef = useRef<Group>(null)
  const fieldRef = useRef<Group>(null)
  const pulseRef = useRef<Mesh>(null)
  const pulseRef2 = useRef<Mesh>(null)

  useFrame((_, delta) => {
    const state = motion.current
    if (!state) return

    if (ringRef.current && !reducedMotion) {
      const spinRate = 0.42 + state.hover * 2.35 + state.spin * 9.5
      ringRef.current.rotation.y += delta * spinRate
      const charge = 1 + state.spin * 0.08
      ringRef.current.scale.setScalar(charge)
    }

    if (fieldRef.current) {
      const pull = Math.max(0, (1 - state.hover * 0.18) * (1 - state.collapse))
      fieldRef.current.scale.setScalar(pull)
      if (!reducedMotion) fieldRef.current.rotation.y += delta * 0.08 * (1 - state.collapse)
    }

    applyPulse(pulseRef.current, state.pulseScale, state.pulseOpacity)
    applyPulse(pulseRef2.current, state.pulseScale2, state.pulseOpacity2)
  })

  const viewport = useThree((state) => state.viewport)
  const fit = Math.min(1, viewport.width / 2.85)
  const particleCount = lightweight ? LIGHT_PARTICLE_COUNT : FULL_PARTICLE_COUNT

  return (
    <group position={[0, -0.22 * fit, 0]} scale={fit}>
      <group ref={ringRef}>
        <LogoMark lightweight={lightweight} />
      </group>

      {reducedMotion ? null : (
        <group ref={fieldRef}>
          <Sparkles
            count={particleCount}
            scale={lightweight ? 2.5 : [3.25, 2.35, 3.25]}
            size={lightweight ? 4.2 : 2.5}
            speed={0.28}
            opacity={0.72}
            noise={0.22}
            color={palette.accentGreen}
          />
          {lightweight ? null : (
            <Sparkles
              count={ACCENT_PARTICLE_COUNT}
              scale={[2.15, 1.55, 2.15]}
              size={1.7}
              speed={0.18}
              opacity={0.5}
              noise={0.16}
              color={palette.accentCyan}
            />
          )}
        </group>
      )}

      <EnergyPulse pulseRef={pulseRef} color="#f4fff8" inner={0.78} outer={0.9} />
      <EnergyPulse pulseRef={pulseRef2} color={palette.accentCyan} inner={0.66} outer={0.72} />
    </group>
  )
}

function applyPulse(mesh: Mesh | null, scale: number, opacity: number) {
  if (!mesh) return
  mesh.scale.setScalar(Math.max(scale, 0.001))
  const material = mesh.material
  if (!Array.isArray(material)) {
    material.opacity = opacity
  }
}
