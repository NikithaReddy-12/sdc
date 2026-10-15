import { useMemo } from 'react'
import * as THREE from 'three'

export interface SectionWaypoint {
  /** Unique section id, matches the HTML section id */
  id: string
  /** Camera world position at this waypoint */
  position: [number, number, number]
  /** Camera looks at this world position */
  lookAt: [number, number, number]
  /** Normalised scroll range [start, end] within 0–1 */
  scrollRange: [number, number]
}

/**
 * Default section waypoints.
 * The camera flies along a CatmullRom curve through these positions
 * as the page scrolls from 0 → 1.
 *
 * Positions are hand-tuned to frame each section's 3D objects while
 * keeping the HTML overlay readable.
 */
export const SECTION_WAYPOINTS: SectionWaypoint[] = [
  {
    id: 'hero',
    position: [0, 1.5, 10],
    lookAt: [0, 0, 0],
    scrollRange: [0, 0.12],
  },
  {
    id: 'about',
    position: [4, 2.5, 7],
    lookAt: [0, 0, 0],
    scrollRange: [0.12, 0.22],
  },
  {
    id: 'work',
    position: [6, 1, 3],
    lookAt: [2, 0, -2],
    scrollRange: [0.22, 0.35],
  },
  {
    id: 'technology',
    position: [3, 3, -4],
    lookAt: [0, 0, -8],
    scrollRange: [0.35, 0.50],
  },
  {
    id: 'events',
    position: [-3, 2, -9],
    lookAt: [-1, 0, -14],
    scrollRange: [0.50, 0.62],
  },
  {
    id: 'team',
    position: [-6, 1.5, -15],
    lookAt: [-3, 0, -20],
    scrollRange: [0.62, 0.75],
  },
  {
    id: 'past-events',
    position: [-2, 3, -22],
    lookAt: [0, 0, -26],
    scrollRange: [0.75, 0.85],
  },
  {
    id: 'join',
    position: [0, 1, -28],
    lookAt: [0, 0, -32],
    scrollRange: [0.85, 1.0],
  },
]

/**
 * Build a CatmullRom spline for camera positions and a parallel one
 * for lookAt targets. Returns an interpolation function that, given
 * a scroll progress (0–1), returns { position, lookAt }.
 */
export function useCameraPath(waypoints: SectionWaypoint[] = SECTION_WAYPOINTS) {
  return useMemo(() => {
    const posPoints = waypoints.map((w) => new THREE.Vector3(...w.position))
    const lookPoints = waypoints.map((w) => new THREE.Vector3(...w.lookAt))

    // CatmullRom through the camera positions
    const posCurve = new THREE.CatmullRomCurve3(posPoints, false, 'catmullrom', 0.35)
    const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'catmullrom', 0.35)

    // Pre-allocate to avoid GC
    const _pos = new THREE.Vector3()
    const _look = new THREE.Vector3()

    /**
     * Interpolate camera position + lookAt for a given scroll progress (0–1).
     * The returned vectors are reused — copy them if you need persistence.
     */
    function interpolate(progress: number) {
      const t = THREE.MathUtils.clamp(progress, 0, 1)
      posCurve.getPoint(t, _pos)
      lookCurve.getPoint(t, _look)
      return { position: _pos, lookAt: _look }
    }

    return { interpolate, posCurve, lookCurve, waypoints }
  }, [waypoints])
}
