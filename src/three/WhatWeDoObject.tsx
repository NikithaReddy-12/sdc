import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, type Group, type Mesh, type Material } from 'three'
import { palette } from '../lib/constants.ts'

export interface WhatWeDoObjectProps {
  activeState: number
  reducedMotion: boolean
  isLowPower: boolean
}

export function WhatWeDoObject({ activeState, reducedMotion, isLowPower }: WhatWeDoObjectProps) {
  const masterGroupRef = useRef<Group>(null)

  const group0Ref = useRef<Group>(null)
  const group1Ref = useRef<Group>(null)
  const group2Ref = useRef<Group>(null)
  const group3Ref = useRef<Group>(null)

  // Smooth interpolated weights for each state: [w0, w1, w2, w3]
  const weights = useRef<number[]>([1, 0, 0, 0])

  useFrame((_, delta) => {
    // 1. Calculate target weight for each state
    const targetWeights = [0, 0, 0, 0]
    const clampedState = Math.max(0, Math.min(3, activeState))
    targetWeights[clampedState] = 1

    const lerpSpeed = reducedMotion ? 1 : 1 - Math.exp(-delta * 7)

    for (let i = 0; i < 4; i++) {
      weights.current[i] += (targetWeights[i] - weights.current[i]) * lerpSpeed
    }

    // 2. Apply scale, cross-fade opacity and visibility to each state group
    const groups = [group0Ref.current, group1Ref.current, group2Ref.current, group3Ref.current]
    groups.forEach((group, index) => {
      if (!group) return
      const w = weights.current[index]
      // Smooth scale transition: scales down slightly when inactive and up to 1 when active
      const scale = Math.max(0.001, 0.65 + 0.35 * w)
      group.scale.setScalar(scale)
      group.visible = w > 0.008

      // Lightweight cross-fade: modulate material opacities by weight
      group.traverse((child) => {
        const mesh = child as Mesh
        if (mesh.isMesh && mesh.material) {
          const mat = mesh.material as Material & { opacity?: number }
          if (mesh.userData.baseOpacity === undefined) {
            mesh.userData.baseOpacity = mat.opacity ?? 1
          }
          if (typeof mat.opacity === 'number') {
            mat.opacity = mesh.userData.baseOpacity * Math.min(1, Math.max(0, w))
            mat.transparent = true
          }
        }
      })

      // Subtle unique continuous ambient rotation for active state
      if (!reducedMotion) {
        if (index === 0) {
          group.rotation.y += delta * 0.35
          group.rotation.x += delta * 0.15
        } else if (index === 1) {
          group.rotation.y += delta * 0.28
          group.rotation.z += delta * 0.18
        } else if (index === 2) {
          group.rotation.y += delta * 0.55
          group.rotation.x += delta * 0.32
        } else if (index === 3) {
          group.rotation.y += delta * 0.22
          group.rotation.z += delta * 0.12
        }
      }
    })

    // Master group gentle float
    if (masterGroupRef.current && !reducedMotion) {
      masterGroupRef.current.rotation.y += delta * 0.08
    }
  })

  const segments = isLowPower ? 32 : 64

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]}>
      {/* ========================================================
          STATE 0: LEARN — Crystalline Octahedron & Orbit Ring
         ======================================================== */}
      <group ref={group0Ref}>
        {/* Outer wireframe octahedron */}
        <mesh>
          <octahedronGeometry args={[1.25, 0]} />
          <meshBasicMaterial
            color={palette.accentGreen}
            wireframe
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
        {/* Inner solid glowing core */}
        <mesh>
          <octahedronGeometry args={[0.72, 0]} />
          <meshBasicMaterial
            color={palette.accentGreen}
            transparent
            opacity={0.3}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        {/* Equatorial orbital ring */}
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[1.42, 0.02, 16, segments]} />
          <meshBasicMaterial color={palette.accentCyan} toneMapped={false} />
        </mesh>
      </group>

      {/* ========================================================
          STATE 1: BUILD — Isometric Interlocking Architecture Cubes
         ======================================================== */}
      <group ref={group1Ref} visible={false}>
        {/* Central main chassis */}
        <mesh>
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshBasicMaterial
            color={palette.accentCyan}
            wireframe
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshBasicMaterial
            color={palette.accentCyan}
            transparent
            opacity={0.25}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        {/* Satellite modular blocks */}
        <mesh position={[0.75, 0.75, 0.75]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshBasicMaterial color={palette.accentGreen} toneMapped={false} />
        </mesh>
        <mesh position={[-0.75, -0.75, -0.75]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshBasicMaterial color={palette.accentGreen} toneMapped={false} />
        </mesh>
        <mesh position={[-0.75, 0.75, -0.75]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>

      {/* ========================================================
          STATE 2: COMPETE — Dynamic Dual-Axis Gyroscope & Gem
         ======================================================== */}
      <group ref={group2Ref} visible={false}>
        {/* Outer Ring */}
        <mesh rotation={[0.4, 0.3, 0]}>
          <torusGeometry args={[1.35, 0.032, 16, segments]} />
          <meshBasicMaterial color="#bbfefb" toneMapped={false} />
        </mesh>
        {/* Inner Intersecting Ring */}
        <mesh rotation={[-0.7, 0.8, 0.4]}>
          <torusGeometry args={[1.05, 0.024, 16, segments]} />
          <meshBasicMaterial color={palette.accentGreen} toneMapped={false} />
        </mesh>
        {/* Center Stellation Core */}
        <mesh>
          <tetrahedronGeometry args={[0.65, 0]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <tetrahedronGeometry args={[0.42, 0]} />
          <meshBasicMaterial
            color="#bbfefb"
            transparent
            opacity={0.4}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ========================================================
          STATE 3: LEAD — Radiant Crown Torus & Compass Spindle
         ======================================================== */}
      <group ref={group3Ref} visible={false}>
        {/* Central Vertical Pillar / Spindle */}
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 1.85, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        {/* Elevated Crown Torus */}
        <mesh position={[0, 0.35, 0]} rotation={[0.25, 0, 0.2]}>
          <torusGeometry args={[1.18, 0.03, 16, segments]} />
          <meshBasicMaterial color="#9bf3b4" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.35, 0]} rotation={[-0.25, 0, -0.2]}>
          <torusGeometry args={[0.88, 0.022, 16, segments]} />
          <meshBasicMaterial color={palette.accentCyan} toneMapped={false} />
        </mesh>
        {/* Radiant Center Node */}
        <mesh>
          <dodecahedronGeometry args={[0.48, 0]} />
          <meshBasicMaterial
            color={palette.accentGreen}
            wireframe
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}
