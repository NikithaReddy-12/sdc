import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap.ts'
import { pastEventsContent, type PastEventItem } from '../data/sdcContent.ts'
import { PastEventCard } from '../components/PastEventCard.tsx'
import { useIsMobile, useReducedMotion } from '../hooks/index.ts'
import { useSiteStore } from '../hooks/useSiteStore.ts'

export function PastEventsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { pastEvents } = useSiteStore()
  const lineRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const [selectedEvent, setSelectedEvent] = useState<PastEventItem | null>(null)

  useEffect(() => {
    if (!selectedEvent) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedEvent])

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      // 1. Vertical timeline line draw-down animation
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'bottom 85%',
              scrub: 0.5,
            },
          }
        )
      }

      // 2. Event items staggered entrance with ScrollTrigger
      const items = gsap.utils.toArray<HTMLElement>('.timeline-event-item')
      items.forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power2.out',
        })
      })

      // 3. Timeline dots pulse entrance
      const dots = gsap.utils.toArray<HTMLElement>('.timeline-dot')
      dots.forEach((dot) => {
        gsap.from(dot, {
          scrollTrigger: {
            trigger: dot,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          scale: 0,
          duration: 0.4,
          ease: 'back.out(2)',
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion, isMobile])

  return (
    <section
      ref={sectionRef}
      id="past-events"
      aria-label="Past Events"
      className="relative w-full border-t border-white/10 bg-background px-4 py-24 sm:px-8 sm:py-32 md:px-12 lg:px-16"
    >
      {/* Background Subtle Gradient Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(124, 255, 122, 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-accent-cyan uppercase">
              <span>{pastEventsContent.sectionBadge}</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {pastEventsContent.heading}
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs leading-relaxed text-text-muted sm:text-sm">
            {pastEventsContent.subheading}
          </p>
        </div>

        {/* ========================================================
            VERTICAL EVENT TIMELINE
           ======================================================== */}
        <div className="relative mt-16 sm:mt-24">
          {/* Vertical Timeline Guide Line */}
          <div
            className={`absolute top-0 bottom-0 w-[2px] bg-white/10 ${
              isMobile ? 'left-4 sm:left-6' : 'left-1/2 -translate-x-1/2'
            }`}
          >
            {/* Animated drawing line with GSAP */}
            <div
              ref={lineRef}
              className="h-full w-full origin-top bg-gradient-to-b from-accent-green via-accent-cyan to-accent-green"
              style={{
                transform: reducedMotion ? 'scaleY(1)' : undefined,
              }}
            />
          </div>

          {/* Timeline Events List */}
          <div className="space-y-12 sm:space-y-16">
            {pastEvents.map((event, index) => {
              const isEven = index % 2 === 0
              return (
                <div
                  key={event.id}
                  className={`timeline-event-item relative flex items-center ${
                    isMobile
                      ? 'pl-10 sm:pl-14'
                      : isEven
                      ? 'flex-row-reverse'
                      : 'flex-row'
                  }`}
                >
                  {/* Timeline Center Dot Indicator */}
                  <div
                    className={`timeline-dot absolute z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-neutral-950 transition-transform ${
                      isMobile
                        ? 'left-4 sm:left-6 -translate-x-1/2'
                        : 'left-1/2 -translate-x-1/2'
                    }`}
                    style={{ borderColor: event.accentColor }}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: event.accentColor }}
                    />
                  </div>

                  {/* Desktop Alternating Card Container */}
                  <div
                    className={`w-full ${
                      isMobile
                        ? 'w-full'
                        : isEven
                        ? 'w-[45%] pl-8 text-left'
                        : 'w-[45%] pr-8 text-left'
                    }`}
                  >
                    <PastEventCard
                      event={event}
                      isLeft={!isEven}
                      onViewEvent={(ev) => setSelectedEvent(ev)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Optional Event Detail Archive Modal */}
      {selectedEvent ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEvent(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg border border-white/20 bg-neutral-950 p-6 sm:p-8 shadow-2xl shadow-black/80 rounded-sm">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary focus-visible:outline focus-visible:outline-accent-cyan cursor-pointer"
              aria-label="Close archive modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-2 font-mono text-xs uppercase" style={{ color: selectedEvent.accentColor }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: selectedEvent.accentColor }} />
              <span>{selectedEvent.category} · {selectedEvent.year} ARCHIVE</span>
            </div>

            <h3 id="archive-modal-title" className="mt-2 font-heading text-2xl font-bold text-text-primary">
              {selectedEvent.name}
            </h3>

            <div className="mt-2 font-mono text-xs text-accent-cyan">
              📅 {selectedEvent.date} · {selectedEvent.stats}
            </div>

            <p className="mt-4 font-sans text-sm text-text-muted leading-relaxed">
              {selectedEvent.description}
            </p>

            <div className="mt-5 border-t border-white/10 pt-4">
              <span className="font-heading text-xs tracking-wider text-text-primary uppercase block mb-2">
                Technologies & Toolchains Used:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="border border-accent-green bg-accent-green px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-background hover:bg-accent-green/90 cursor-pointer"
              >
                Close Archive
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
