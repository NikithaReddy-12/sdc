import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { technologyContent } from '../data/sdcContent.ts'
import { palette } from '../lib/constants.ts'

export interface TechnologyNetworkObjectProps {
  activeNodeId: string | null
  onHoverNode: (id: string | null) => void
  onSelectNode: (id: string) => void
  reducedMotion: boolean
  isLowPower: boolean
}

export function TechnologyNetworkObject({
  activeNodeId,
  onHoverNode,
  onSelectNode,
  reducedMotion,
  isLowPower,
}: TechnologyNetworkObjectProps) {
  const centerGroupRef = useRef<THREE.Group>(null)
  const nodeRefs = useRef<(THREE.Group | null)[]>([])
  const lineMeshRefs = useRef<(THREE.Mesh | null)[]>([])

  const domains = technologyContent.domains

  // Pre-calculate line connections from origin [0,0,0] to each node
  const connections = useMemo(() => {
    return domains.map((domain) => {
      const target = new THREE.Vector3(...domain.position)
      const length = target.length()
      const midpoint = target.clone().multiplyScalar(0.5)

      const orientation = new THREE.Quaternion()
      orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), target.clone().normalize())

      return {
        id: domain.id,
        target,
        length,
        midpoint,
        orientation,
        accentColor: domain.accentColor,
      }
    })
  }, [domains])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // 1. Subtle idle floating animation for satellite nodes
    if (!reducedMotion) {
      domains.forEach((domain, idx) => {
        const group = nodeRefs.current[idx]
        const lineMesh = lineMeshRefs.current[idx]
        if (!group) return

        const offsetTime = time * 0.75 + idx * 1.57
        const floatY = Math.sin(offsetTime) * 0.08
        const floatX = Math.cos(offsetTime * 0.8) * 0.05

        const currentX = domain.position[0] + floatX
        const currentY = domain.position[1] + floatY
        const currentZ = domain.position[2]

        group.position.set(currentX, currentY, currentZ)

        // Update connecting line geometry orientation to follow floating node
        if (lineMesh) {
          const currentTarget = new THREE.Vector3(currentX, currentY, currentZ)
          lineMesh.position.copy(currentTarget.clone().multiplyScalar(0.5))
          lineMesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            currentTarget.clone().normalize()
          )
        }
      })

      // Center SDC node gentle rotation
      if (centerGroupRef.current) {
        centerGroupRef.current.rotation.y += delta * 0.3
        centerGroupRef.current.rotation.x += delta * 0.15
      }
    }

    // 2. Smooth scale interpolation for active node
    domains.forEach((domain, idx) => {
      const group = nodeRefs.current[idx]
      if (!group) return
      const isActive = activeNodeId === domain.id
      const targetScale = isActive ? 1.25 : 1.0
      const lerpSpeed = 1 - Math.exp(-delta * 8)
      group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), lerpSpeed)
    })
  })

  const segments = isLowPower ? 16 : 32

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================
          CONNECTING GLOWING LINES (SDC Center to Satellite Nodes)
         ======================================================== */}
      {connections.map((conn, idx) => {
        const isActive = activeNodeId === conn.id
        return (
          <mesh
            key={conn.id}
            ref={(el) => {
              lineMeshRefs.current[idx] = el
            }}
            position={conn.midpoint}
            quaternion={conn.orientation}
          >
            <cylinderGeometry
              args={[
                isActive ? 0.024 : 0.012,
                isActive ? 0.024 : 0.012,
                conn.length,
                8,
              ]}
            />
            <meshBasicMaterial
              color={isActive ? conn.accentColor : palette.accentGreen}
              transparent
              opacity={isActive ? 0.95 : 0.2}
              toneMapped={false}
            />
          </mesh>
        )
      })}

      {/* ========================================================
          CENTER NODE: SDC CORE
         ======================================================== */}
      <group position={[0, 0, 0]}>
        <group ref={centerGroupRef}>
          {/* Wireframe outer shell */}
          <mesh>
            <icosahedronGeometry args={[0.75, 0]} />
            <meshBasicMaterial
              color={palette.accentGreen}
              wireframe
              transparent
              opacity={0.8}
              toneMapped={false}
            />
          </mesh>
          {/* Inner glowing core */}
          <mesh>
            <octahedronGeometry args={[0.42, 0]} />
            <meshBasicMaterial
              color={palette.accentCyan}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
          {/* Orbital ring */}
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <torusGeometry args={[0.95, 0.015, 12, segments]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} toneMapped={false} />
          </mesh>
        </group>

        {/* Central SDC Label */}
        <Html center position={[0, 0, 0]} className="pointer-events-none select-none">
          <div className="flex flex-col items-center justify-center">
            <span className="rounded-none border border-accent-green/60 bg-black/85 px-3 py-1 font-heading text-xs font-bold tracking-widest text-accent-green shadow-[0_0_15px_rgba(124,255,122,0.3)]">
              SDC
            </span>
          </div>
        </Html>
      </group>

      {/* ========================================================
          SATELLITE DOMAIN NODES: AI, WEB, CLOUD, CYBER
         ======================================================== */}
      {domains.map((domain, idx) => {
        const isActive = activeNodeId === domain.id
        return (
          <group
            key={domain.id}
            ref={(el) => {
              nodeRefs.current[idx] = el
            }}
            position={domain.position}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHoverNode(domain.id)
            }}
            onPointerOut={() => {
              onHoverNode(null)
            }}
            onClick={(e) => {
              e.stopPropagation()
              onSelectNode(domain.id)
            }}
          >
            {/* Interactive Outer Target Mesh */}
            <mesh visible={false}>
              <sphereGeometry args={[0.85, 8, 8]} />
            </mesh>

            {/* Glowing Node Geometry */}
            <mesh>
              <dodecahedronGeometry args={[0.42, 0]} />
              <meshBasicMaterial
                color={domain.accentColor}
                wireframe
                transparent
                opacity={isActive ? 0.95 : 0.65}
                toneMapped={false}
              />
            </mesh>

            <mesh>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshBasicMaterial
                color={domain.accentColor}
                transparent
                opacity={isActive ? 0.65 : 0.25}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
              />
            </mesh>

            {/* Orbit ring around satellite */}
            <mesh rotation={[Math.PI / 3, idx * 0.5, 0]}>
              <torusGeometry args={[0.54, 0.012, 8, 24]} />
              <meshBasicMaterial
                color={isActive ? domain.accentColor : '#ffffff'}
                transparent
                opacity={isActive ? 0.8 : 0.25}
                toneMapped={false}
              />
            </mesh>

            {/* Node HTML Tag / Label */}
            <Html center position={[0, -0.65, 0]} className="select-none">
              <button
                type="button"
                onClick={() => onSelectNode(domain.id)}
                className={`cursor-pointer rounded-none border px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 backdrop-blur-md ${
                  isActive
                    ? 'border-accent-green bg-black/90 text-accent-green shadow-[0_0_20px_rgba(124,255,122,0.4)] scale-110'
                    : 'border-white/15 bg-black/65 text-text-muted hover:border-white/35 hover:text-text-primary'
                }`}
              >
                {domain.name}
              </button>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
