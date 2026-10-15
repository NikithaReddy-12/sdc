import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.ts'
import { aboutContent } from '../data/sdcContent.ts'
import { useReducedMotion } from '../hooks/index.ts'

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      // 1. Fade + upward movement for section text and cards
      gsap.from('.about-fade-up', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
        },
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power2.out',
      })

      // 2. Animated counters when entering viewport
      aboutContent.stats.forEach((stat) => {
        const el = document.getElementById(`stat-num-${stat.id}`)
        if (!el) return

        const counterObj = { value: 0 }
        gsap.to(counterObj, {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
          value: stat.targetNumber,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.floor(counterObj.value)}${stat.suffix}`
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About SDC"
      className="relative w-full border-t border-white/10 bg-background px-4 py-24 sm:px-8 sm:py-32 md:px-12 lg:px-16"
    >
      {/* Background Subtle Gradient Sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(95, 247, 240, 0.05) 0%, transparent 80%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="about-fade-up max-w-3xl">
          <div className="inline-flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-accent-cyan uppercase">
            <span>{aboutContent.sectionBadge}</span>
          </div>

          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
            {aboutContent.heading}
          </h2>

          <p className="mt-4 font-sans text-base leading-relaxed text-text-muted sm:text-lg">
            {aboutContent.subheading}
          </p>
        </div>

        {/* Narrative & Institutional Overview */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Paragraphs Column */}
          <div className="space-y-6 lg:col-span-7">
            {aboutContent.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="about-fade-up font-sans text-sm leading-relaxed text-text-muted sm:text-base"
              >
                {paragraph}
              </p>
            ))}

            <div className="about-fade-up border-l-2 border-accent-green/60 pl-4 py-1">
              <p className="font-heading text-xs tracking-wider text-text-primary uppercase sm:text-sm">
                Gokaraju Rangaraju Institute of Engineering and Technology
              </p>
              <p className="mt-1 font-sans text-xs text-text-muted">
                Bachupally, Kukatpally, Hyderabad, Telangana — 500090
              </p>
            </div>
          </div>

          {/* Pillars / Key Verticals Column */}
          <div className="space-y-4 lg:col-span-5">
            <h3 className="about-fade-up font-heading text-xs tracking-[0.2em] text-text-muted uppercase">
              Core Pillars //
            </h3>

            <div className="space-y-3">
              {aboutContent.pillars.map((pillar) => (
                <div
                  key={pillar.id}
                  className="about-fade-up group relative rounded-none border border-white/10 bg-white/[0.015] p-5 transition-all duration-300 hover:border-accent-green/40 hover:bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-accent-green">{pillar.index}</span>
                    <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-text-muted uppercase">
                      {pillar.tag}
                    </span>
                  </div>
                  <h4 className="mt-2 font-heading text-sm font-medium text-text-primary group-hover:text-accent-green transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-text-muted">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="mt-16 sm:mt-24">
          <div className="about-fade-up mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-heading text-xs tracking-[0.2em] text-text-muted uppercase">
              Key Metrics & Impact //
            </h3>
            <span className="font-mono text-[11px] text-accent-green">SDC_STATS_2026</span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutContent.stats.map((stat) => (
              <div
                key={stat.id}
                className="about-fade-up group relative flex flex-col justify-between border border-white/10 bg-white/[0.01] p-6 transition-all duration-300 hover:border-accent-cyan/40 hover:bg-white/[0.02]"
              >
                <div>
                  <div
                    id={`stat-num-${stat.id}`}
                    className="font-heading text-3xl font-bold tracking-tight text-accent-green sm:text-4xl md:text-5xl"
                  >
                    {stat.targetNumber}
                    {stat.suffix}
                  </div>
                  <h4 className="mt-2 font-heading text-xs font-semibold tracking-wide text-text-primary uppercase sm:text-sm">
                    {stat.label}
                  </h4>
                </div>

                <p className="mt-3 font-sans text-xs leading-relaxed text-text-muted">
                  {stat.sublabel}
                </p>

                <div className="absolute top-0 right-0 h-1 w-1 bg-white/20 group-hover:bg-accent-cyan transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
