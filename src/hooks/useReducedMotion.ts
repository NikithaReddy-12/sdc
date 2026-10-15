import { useMediaQuery } from './useMediaQuery.ts'

/** True when the OS requests reduced motion. Animated sections should fade, or skip motion. */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
