import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap.ts'
import { markEnteredPortal } from '../lib/entry.ts'
import { useReducedMotion } from '../hooks/index.ts'

interface EntryPortalProps {
  onEntered: () => void
}

export function EntryPortal({ onEntered }: EntryPortalProps) {
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const leavingRef = useRef(false)
  const finishedRef = useRef(false)
  const [leaving, setLeaving] = useState(false)

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    markEnteredPortal()
    onEntered()
  }

  useEffect(() => {
    const root = rootRef.current
    const logo = logoRef.current
    const ring = ringRef.current
    const progress = progressRef.current
    if (!root || !logo || !ring || !progress) return

    if (reducedMotion) {
      progress.style.width = '100%'
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(logo,
        { opacity: 0, scale: 0.86, filter: 'blur(12px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.15, ease: 'power3.out' }
      )
      gsap.fromTo('.entry-copy',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.35, stagger: 0.08, ease: 'power2.out' }
      )
      gsap.to(ring, { rotate: 360, duration: 22, repeat: -1, ease: 'none' })
      gsap.to('.entry-glow', { scale: 1.12, opacity: 0.8, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to(progress, { width: '100%', duration: 2.8, ease: 'power1.inOut' })
    }, root)

    const timer = window.setTimeout(() => enter(), 2900)
    return () => {
      window.clearTimeout(timer)
      timeline.current?.kill()
      ctx.revert()
    }
  }, [reducedMotion])

  const enter = () => {
    if (leavingRef.current || !rootRef.current) return
    leavingRef.current = true
    setLeaving(true)

    if (reducedMotion) {
      finish()
      return
    }

    const root = rootRef.current
    const tl = gsap.timeline({ onComplete: finish })
    timeline.current = tl
    tl.to('.entry-content', { y: -18, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
    tl.to('.entry-flash', { opacity: 0.75, duration: 0.16, ease: 'power2.out' }, 0.18)
    tl.to('.entry-flash', { opacity: 0, duration: 0.55, ease: 'power2.in' }, 0.34)
    tl.to(root, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 0.28)
  }

  const skip = () => enter()

  return (
    <div ref={rootRef} className="entry-portal" role="dialog" aria-modal="true" aria-labelledby="entry-title">
      <div className="entry-noise" />
      <div className="entry-grid" />
      <div className="entry-glow" />
      <div ref={ringRef} className="entry-ring entry-ring-outer" />

      <button
        type="button"
        onClick={skip}
        className="entry-skip"
        disabled={leaving}
      >
        SKIP <span>→</span>
      </button>

      <div className="entry-content">
        <div className="entry-logo-wrap">
          <div className="entry-logo-halo" />
          <img
            ref={logoRef}
            src="/sdc-logo.png"
            alt="Skill Development Cell, GRIET logo"
            className="entry-logo"
          />
        </div>

        <div className="entry-copy entry-kicker">SKILL DEVELOPMENT CELL • GRIET</div>
        <h1 id="entry-title" className="entry-copy entry-title">SDC GRIET</h1>
        <p className="entry-copy entry-subtitle">
          Build skills. Create projects. Grow together.
        </p>

        <div className="entry-copy entry-progress" aria-hidden="true">
          <span>LOADING</span>
          <div className="entry-progress-track"><div ref={progressRef} /></div>
          <span>SDC</span>
        </div>

        <button
          type="button"
          onClick={enter}
          disabled={leaving}
          className="entry-button entry-copy"
        >
          ENTER SDC <span>↗</span>
        </button>
      </div>

      <div className="entry-flash" />
    </div>
  )
}
