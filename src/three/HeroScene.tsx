import { Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { HeroMark } from './HeroMark.tsx'
import { palette } from '../lib/constants.ts'
import { useDeviceCapability, useIsMobile, useReducedMotion } from '../hooks/index.ts'

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
    console.warn('HeroScene 3D rendering error caught by boundary:', error)
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}

export interface HeroSceneProps {
  pointer: { x: number; y: number }
}

export function HeroScene({ pointer }: HeroSceneProps) {
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const { isLowPower, webgl } = useDeviceCapability()

  // Graceful fallback if WebGL is unavailable on device
  if (!webgl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${palette.accentGreen} 0%, ${palette.accentCyan} 60%, transparent 100%)` }}
        />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <SceneBoundary
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-80 h-80 rounded-full opacity-25 blur-3xl"
              style={{ background: `radial-gradient(circle, ${palette.accentGreen} 0%, transparent 70%)` }}
            />
          </div>
        }
      >
        <Canvas
          className="w-full h-full"
          frameloop={reducedMotion ? 'demand' : 'always'}
          dpr={isLowPower || isMobile ? [1, 1.25] : [1, 1.75]}
          camera={{ position: [0, 0, 4.9], fov: 38 }}
          gl={{
            antialias: !isLowPower,
            alpha: true,
            powerPreference: isLowPower ? 'low-power' : 'default',
          }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 5, 4]} intensity={0.8} color="#ffffff" />
          <directionalLight position={[-4, -3, -2]} intensity={0.4} color={palette.accentCyan} />

          <HeroMark
            pointer={pointer}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
            isLowPower={isLowPower}
          />
        </Canvas>
      </SceneBoundary>
    </div>
  )
}
