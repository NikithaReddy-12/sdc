import { useMediaQuery } from './useMediaQuery.ts'

/** Viewports below this width are treated as mobile. */
export const MOBILE_BREAKPOINT_PX = 768

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`)
}
