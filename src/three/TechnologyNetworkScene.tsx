import { Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { TechnologyNetworkObject } from './TechnologyNetworkObject.tsx'
import { palette } from '../lib/constants.ts'
import { useDeviceCapability, useReducedMotion } from '../hooks/index.ts'

interface SceneBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface SceneBoundaryState {
  failed: boolean
}

class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { failed: false }

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('TechnologyNetworkScene 3D error:', error)
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}

export interface TechnologyNetworkSceneProps {
  activeNodeId: string | null
  onHoverNode: (id: string | null) => void
  onSelectNode: (id: string) => void
}

export function TechnologyNetworkScene({
  activeNodeId,
  onHoverNode,
  onSelectNode,
}: TechnologyNetworkSceneProps) {
  const reducedMotion = useReducedMotion()
  const { isLowPower, webgl } = useDeviceCapability()

  if (!webgl) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div
          className="h-48 w-48 rounded-full opacity-20 blur-2xl"
          style={{ background: palette.accentCyan }}
        />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <SceneBoundary
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="h-48 w-48 rounded-full opacity-20 blur-2xl"
              style={{ background: palette.accentCyan }}
            />
          </div>
        }
      >
        <Canvas
          className="h-full w-full"
          frameloop={reducedMotion ? 'demand' : 'always'}
          dpr={isLowPower ? [1, 1.25] : [1, 1.5]}
          camera={{ position: [0, 0, 5.8], fov: 44 }}
          gl={{
            antialias: !isLowPower,
            alpha: true,
            powerPreference: isLowPower ? 'low-power' : 'default',
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 5, 4]} intensity={1} color="#ffffff" />
          <directionalLight position={[-4, -3, -2]} intensity={0.6} color={palette.accentGreen} />

          <TechnologyNetworkObject
            activeNodeId={activeNodeId}
            onHoverNode={onHoverNode}
            onSelectNode={onSelectNode}
            reducedMotion={reducedMotion}
            isLowPower={isLowPower}
          />
        </Canvas>
      </SceneBoundary>
    </div>
  )
}
