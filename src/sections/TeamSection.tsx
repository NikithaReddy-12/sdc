import { useState, useRef, useEffect } from 'react'
import { gsap } from '../lib/gsap.ts'
import { teamContent } from '../data/sdcContent.ts'
import { TeamCarousel } from '../components/TeamCarousel.tsx'
import { useReducedMotion } from '../hooks/index.ts'
import { useSiteStore } from '../hooks/useSiteStore.ts'

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const [activeFilter, setActiveFilter] = useState<string>('ALL')
  const { teamMembers, teamMeta } = useSiteStore()

  const filterDomains = ['ALL', 'LEADERSHIP', 'AI', 'WEB', 'CLOUD', 'CYBER']

  const filteredMembers =
    activeFilter === 'ALL'
      ? teamMembers
      : teamMembers.filter((m) => m.domain === activeFilter)

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.team-fade-up', {
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
      id="team"
      aria-label="Our Team"
      className="relative w-full border-t border-white/10 bg-background px-4 py-24 sm:px-8 sm:py-32 md:px-12 lg:px-16"
    >
      {/* Background Subtle Gradient Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(95, 247, 240, 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-accent-cyan uppercase">
              <span>{teamContent.sectionBadge}</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {teamContent.heading}
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs leading-relaxed text-text-muted sm:text-sm">
            {teamContent.subheading}
          </p>
        </div>

        {/* Present Team Intro — one image + short description */}
        <div className="mt-10 grid gap-6 overflow-hidden border border-white/10 bg-white/[0.015] md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-64 overflow-hidden bg-neutral-950">
            <img src={teamMeta.image} alt="Present SDC team" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/45 via-transparent to-accent-cyan/10" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <span className="font-mono text-[10px] tracking-[0.25em] text-accent-green">// PRESENT TEAM</span>
            <h3 className="mt-2 font-heading text-2xl font-bold text-text-primary sm:text-3xl">CURRENT SDC DIRECTORATE</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">{teamMeta.description}</p>
          </div>
        </div>

        {/* Filter Pills with Horizontal Scroll on Mobile */}
        <div className="mt-8 flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
          <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase mr-2 flex-shrink-0">
            FILTER POD:
          </span>
          {filterDomains.map((domain) => {
            const isActive = activeFilter === domain
            return (
              <button
                key={domain}
                type="button"
                onClick={() => setActiveFilter(domain)}
                className={`cursor-pointer px-3 py-1 font-mono text-xs uppercase tracking-wider transition-all duration-200 rounded-none border flex-shrink-0 ${
                  isActive
                    ? 'border-accent-green bg-accent-green/10 text-accent-green font-semibold'
                    : 'border-white/10 bg-white/[0.02] text-text-muted hover:border-white/25 hover:text-text-primary'
                }`}
              >
                {domain}
              </button>
            )
          })}
        </div>

        {/* Rotating horizontal team carousel */}
        <div className="team-fade-up mt-10">
          <TeamCarousel members={filteredMembers} />
        </div>

        {/* Recruitment / Callout Strip */}
        <div className="mt-16 rounded-sm border border-white/10 bg-white/[0.015] p-6 text-center sm:p-8">
          <h3 className="font-heading text-lg font-semibold text-text-primary sm:text-xl">
            Want to build with the Skill Development Cell?
          </h3>
          <p className="mx-auto mt-2 max-w-lg font-sans text-xs leading-relaxed text-text-muted sm:text-sm">
            SDC opens recruitment pods and student apprenticeships at the beginning of each semester. We look for builder mindsets, curiosity, and execution velocity.
          </p>
          <div className="mt-5">
            <a
              href="mailto:sdc@griet.ac.in"
              className="inline-flex items-center gap-2 border border-accent-cyan/60 bg-accent-cyan/10 px-6 py-2.5 font-heading text-xs font-medium tracking-wider text-accent-cyan uppercase transition-all duration-200 hover:bg-accent-cyan hover:text-background"
            >
              <span>Contact SDC Secretariat</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
