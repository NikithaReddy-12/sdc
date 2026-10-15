import { useState } from 'react'

export type DeviceCapability = {
  isLowPower: boolean
  cores: number
  deviceMemoryGb: number | null
  webgl: boolean
  renderer: string | null
}

const unknownCapability: DeviceCapability = {
  isLowPower: false,
  cores: 0,
  deviceMemoryGb: null,
  webgl: false,
  renderer: null,
}

let cached: DeviceCapability | null = null

function readDeviceMemoryGb() {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  return typeof memory === 'number' ? memory : null
}

function readRenderer(gl: WebGLRenderingContext) {
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  if (!debugInfo) return null
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
  return typeof renderer === 'string' ? renderer : null
}

function isSoftwareRenderer(renderer: string | null) {
  if (!renderer) return false
  return /swiftshader|llvmpipe|softpipe|software rasterizer|microsoft basic render/i.test(renderer)
}

function readWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')
    if (!gl) return { webgl: false, renderer: null }
    const renderer = readRenderer(gl)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return { webgl: true, renderer }
  } catch {
    return { webgl: false, renderer: null }
  }
}

/**
 * One-shot probe. A device is low power when WebGL is missing, the renderer is
 * software, reported memory is 4GB or less, or there are two cores or fewer.
 */
function detectDeviceCapability(): DeviceCapability {
  if (cached) return cached
  if (typeof navigator === 'undefined' || typeof document === 'undefined') {
    return unknownCapability
  }

  const cores = navigator.hardwareConcurrency ?? 0
  const deviceMemoryGb = readDeviceMemoryGb()
  const { webgl, renderer } = readWebGL()
  const lowMemory = deviceMemoryGb !== null && deviceMemoryGb <= 4
  const weakCpu = cores > 0 && cores <= 2
  const isLowPower = !webgl || isSoftwareRenderer(renderer) || lowMemory || weakCpu

  cached = { isLowPower, cores, deviceMemoryGb, webgl, renderer }
  return cached
}

export function useDeviceCapability() {
  const [capability] = useState(detectDeviceCapability)
  return capability
}
