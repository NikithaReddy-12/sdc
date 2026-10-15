import { Component, type ReactNode } from 'react'

interface SceneBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  label?: string
}

interface SceneBoundaryState {
  failed: boolean
}

/**
 * Shared error boundary for R3F scenes.
 * Catches WebGL context loss, shader compilation failures, etc.
 * and falls back to a placeholder instead of crashing the whole page.
 */
export class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { failed: false }

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    const label = this.props.label ?? 'SceneBoundary'
    console.warn(`[${label}] 3D rendering error caught:`, error)
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
