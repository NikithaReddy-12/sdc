import { useRef, useCallback } from 'react'
import { useLenis } from 'lenis/react'

/**
 * Returns a mutable ref containing the normalised scroll progress (0 → 1)
 * of the entire page, driven by the Lenis smooth-scroll instance.
 *
 * We use a ref (not state) because this value is read inside useFrame at 60fps;
 * triggering React re-renders every frame would be disastrous for perf.
 */
export function useScrollProgress() {
  const progress = useRef(0)

  // Lenis fires its scroll callback on every animation frame
  useLenis(
    useCallback(
      (lenis: { progress: number }) => {
        progress.current = lenis.progress
      },
      [],
    ),
  )

  return progress
}
