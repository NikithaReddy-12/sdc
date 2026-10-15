import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.ts'
import { heroContent } from '../data/sdcContent.ts'
import { useLenis } from '../hooks/index.ts'

export function HeroSection() {
  const lenis = useLenis()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.clean-hero-reveal',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out', delay: 0.15 }
      )
      gsap.to('.clean-hero-glow', {
        scale: 1.08,
        opacity: 0.82,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.clean-hero-pulse', {
        scale: 1.035,
        opacity: 0.82,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const scrollTo = (id: string) => {
    if (lenis) {
      lenis.scrollTo(id, { offset: -20, duration: 1.1 })
    } else {
      document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="SDC GRIET landing section"
      className="clean-hero relative flex min-h-[calc(100svh-90px)] w-full items-center justify-center overflow-hidden px-5 py-24 sm:px-8"
    >
      <div className="clean-hero-grid pointer-events-none absolute inset-0" />
      <div className="clean-hero-vignette pointer-events-none absolute inset-0" />
      <div className="clean-hero-glow pointer-events-none absolute left-1/2 top-[42%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="clean-hero-line clean-hero-line-one pointer-events-none absolute left-1/2 top-[42%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="clean-hero-line clean-hero-line-two pointer-events-none absolute left-1/2 top-[42%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className="clean-hero-reveal relative mb-8 grid h-48 w-48 place-items-center sm:h-56 sm:w-56 md:h-64 md:w-64">
          <div className="clean-hero-pulse absolute inset-[-14%] rounded-full border border-accent-green/20" />
          <div className="clean-hero-logo-glow absolute inset-[-28%] rounded-full" />
          <img
            src="/sdc-logo.png"
            alt="Skill Development Cell, GRIET"
            className="relative z-10 h-full w-full rounded-full object-contain drop-shadow-[0_0_42px_rgba(124,255,122,0.16)]"
          />
        </div>

        <div className="clean-hero-reveal mb-4 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-text-muted/70 uppercase sm:text-xs">
          <span className="h-px w-10 bg-accent-green/60" />
          SKILL DEVELOPMENT CELL • GRIET
          <span className="h-px w-10 bg-accent-green/60" />
        </div>

        <h1 className="clean-hero-reveal font-heading text-4xl font-semibold tracking-[-0.04em] text-text-primary sm:text-6xl md:text-7xl">
          Build. Learn. <span className="text-accent-green">Lead.</span>
        </h1>

        <p className="clean-hero-reveal mt-5 max-w-2xl text-sm leading-7 text-text-muted sm:text-base md:text-lg">
          A student-driven technology community at GRIET where students build skills, projects, teams, and real-world experience.
        </p>

        <div className="clean-hero-reveal mt-9 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollTo('#about')}
            className="inline-flex min-h-12 items-center justify-center border border-accent-green bg-accent-green/10 px-8 font-heading text-xs font-semibold tracking-[0.18em] text-accent-green uppercase transition-all duration-300 hover:bg-accent-green hover:text-background"
          >
            Explore SDC ↓
          </button>
          <button
            type="button"
            onClick={() => scrollTo('#upcoming-events')}
            className="inline-flex min-h-12 items-center justify-center border border-white/15 bg-white/[0.02] px-8 font-heading text-xs font-semibold tracking-[0.18em] text-text-primary uppercase transition-all duration-300 hover:border-accent-cyan/50 hover:text-accent-cyan"
          >
            Upcoming Events
          </button>
        </div>

        <div className="clean-hero-reveal mt-10 flex items-center gap-3 text-[9px] font-mono tracking-[0.24em] text-text-muted/45 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green shadow-[0_0_10px_rgba(124,255,122,0.7)]" />
          {heroContent.institutionBadge}
        </div>
      </div>
    </section>
  )
}
