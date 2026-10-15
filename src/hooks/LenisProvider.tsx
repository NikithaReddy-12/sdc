import { useEffect, type ReactNode } from 'react'
import { ReactLenis, useLenis as useRootLenis } from 'lenis/react'
import { gsap, ScrollTrigger } from '../lib/gsap.ts'

const lenisOptions = {
  autoRaf: false,
  anchors: true,
}

function LenisGsapSync() {
  const lenis = useRootLenis()

  useEffect(() => {
    if (!lenis) return

    const unsubscribe = lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      unsubscribe()
      gsap.ticker.remove(ticker)
    }
  }, [lenis])

  return null
}

type LenisProviderProps = {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis root autoRaf={false} options={lenisOptions}>
      <LenisGsapSync />
      {children}
    </ReactLenis>
  )
}
