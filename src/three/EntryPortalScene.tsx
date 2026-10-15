import { Canvas } from '@react-three/fiber'
import type { RefObject } from 'react'
import { palette } from '../lib/constants.ts'
import { EntryMark, type EntryMotion } from './EntryMark.tsx'

type EntryPortalSceneProps = {
  motion: RefObject<EntryMotion>
  reducedMotion: boolean
  lightweight: boolean
}

export function EntryPortalScene({ motion, reducedMotion, lightweight }: EntryPortalSceneProps) {
  return (
    <Canvas
      className="pointer-events-none h-full w-full"
      frameloop={reducedMotion ? 'demand' : 'always'}
      dpr={lightweight ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0.05, 5.15], fov: 36 }}
      gl={{
        antialias: !lightweight,
        alpha: false,
        powerPreference: lightweight ? 'low-power' : 'default',
      }}
    >
      <color attach="background" args={[palette.background]} />
      <EntryMark motion={motion} reducedMotion={reducedMotion} lightweight={lightweight} />
    </Canvas>
  )
}

export type { EntryMotion }
