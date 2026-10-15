import { useRef, useEffect } from 'react'
import { gsap } from '../lib/gsap.ts'
import { joinSdcContent } from '../data/sdcContent.ts'
import { useReducedMotion } from '../hooks/index.ts'

export function JoinSdcSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.join-fade-up', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="join-sdc"
      aria-label="Join SDC"
      className="relative w-full border-t border-white/10 bg-background px-4 py-24 sm:px-8 sm:py-32 md:px-12 lg:px-16"
    >
      {/* Background Subtle Gradient Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(124, 255, 122, 0.08) 0%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="join-fade-up overflow-hidden rounded-sm border border-white/15 bg-gradient-to-b from-white/[0.03] to-white/[0.005] p-8 sm:p-12 md:p-16 backdrop-blur-sm relative">
          {/* Subtle Technical Grid Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-accent-cyan uppercase">
              <span>{joinSdcContent.sectionBadge}</span>
            </div>

            {/* Main Heading */}
            <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
              {joinSdcContent.heading}
            </h2>

            {/* Tagline */}
            <p className="mt-3 font-mono text-xs text-accent-green tracking-wider uppercase max-w-xl">
              {joinSdcContent.tagline}
            </p>

            {/* Explanatory Paragraph */}
            <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-text-muted sm:text-base">
              {joinSdcContent.paragraph}
            </p>

            {/* Core Benefits Grid */}
            <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
              {joinSdcContent.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="rounded-none border border-white/10 bg-black/40 p-4 transition-colors hover:border-white/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                    <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-primary">
                      {benefit.title}
                    </span>
                  </div>
                  <p className="mt-1.5 font-sans text-xs text-text-muted leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Prominent CTA Button linking to Google Form Placeholder */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <a
                href={joinSdcContent.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 border border-accent-green bg-accent-green px-8 py-3.5 font-heading text-xs font-bold tracking-[0.2em] text-background uppercase transition-all duration-300 hover:bg-transparent hover:text-accent-green hover:shadow-[0_0_25px_rgba(124,255,122,0.3)] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-accent-cyan"
              >
                <span>{joinSdcContent.ctaButtonText}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#about"
                className="inline-flex items-center justify-center border border-white/15 bg-white/[0.02] px-6 py-3.5 font-heading text-xs font-medium tracking-[0.18em] text-text-muted uppercase transition-all duration-200 hover:border-white/30 hover:text-text-primary"
              >
                Explore Syllabus
              </a>
            </div>

            {/* Reassurance text */}
            <span className="mt-5 font-mono text-[10px] text-text-muted/60 tracking-widest uppercase">
              // OPEN TO ALL GRIET ENGINEERING UNDERGRADUATES · AUTONOMOUS COHORT
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
