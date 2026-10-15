import { useState, useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.ts'
import { upcomingEventsContent, type EventItem } from '../data/sdcContent.ts'
import { EventCard } from '../components/EventCard.tsx'
import { EventModal } from '../components/EventModal.tsx'
import { useIsMobile, useReducedMotion } from '../hooks/index.ts'
import { useSiteStore } from '../hooks/useSiteStore.ts'

export function UpcomingEventsSection() {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()

  const sectionRef = useRef<HTMLElement>(null)
  const { upcomingEvents } = useSiteStore()
  const trackRef = useRef<HTMLDivElement>(null)
  const mobileCarouselRef = useRef<HTMLDivElement>(null)

  const [centerIndex, setCenterIndex] = useState<number>(0)
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number>(0)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [modalTab, setModalTab] = useState<'details' | 'register'>('details')
  const [paddingOffset, setPaddingOffset] = useState<number>(64)

  const totalEvents = upcomingEvents.length

  // Calculate dynamic responsive track padding to center cards on desktop
  useEffect(() => {
    if (isMobile || reducedMotion) return

    const updateOffset = () => {
      const cardWidth = window.innerWidth >= 1024 ? 420 : 380
      const offset = Math.max(32, (window.innerWidth - cardWidth) / 2)
      setPaddingOffset(offset)
    }

    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [isMobile, reducedMotion])

  // GSAP Kinetic Horizontal Scroll for Desktop
  useEffect(() => {
    if (isMobile || reducedMotion || !sectionRef.current || !trackRef.current) return

    const track = trackRef.current
    const section = sectionRef.current

    const ctx = gsap.context(() => {
      const cardWidth = window.innerWidth >= 1024 ? 420 : 380
      const gap = 32
      const step = cardWidth + gap
      const totalDistance = (totalEvents - 1) * step

      gsap.to(track, {
        x: -totalDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(1200, Math.round(totalDistance * 0.9))}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (totalEvents - 1),
            duration: { min: 0.2, max: 0.4 },
            delay: 0.05,
            ease: 'power1.out',
          },
          onUpdate: (self) => {
            const rawIdx = Math.round(self.progress * (totalEvents - 1))
            const clamped = Math.max(0, Math.min(totalEvents - 1, rawIdx))
            setCenterIndex(clamped)
          },
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile, reducedMotion, paddingOffset, totalEvents])

  // Track mobile carousel scroll to sync pagination dots
  const handleMobileScroll = () => {
    const el = mobileCarouselRef.current
    if (!el) return
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth : 300
    const scrollPos = el.scrollLeft
    const idx = Math.round(scrollPos / (cardWidth + 16))
    setMobileActiveIndex(Math.max(0, Math.min(totalEvents - 1, idx)))
  }

  const handleCardAction = (event: EventItem, action: 'register' | 'details') => {
    setSelectedEvent(event)
    setModalTab(action)
  }

  return (
    <section
      ref={sectionRef}
      id="events"
      aria-label="Upcoming Events"
      className={`relative w-full border-t border-white/10 bg-background overflow-hidden ${
        isMobile || reducedMotion
          ? 'py-20 px-4 sm:px-8'
          : 'min-h-screen flex flex-col justify-center'
      }`}
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(124, 255, 122, 0.06) 0%, transparent 80%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-accent-cyan uppercase">
              <span>{upcomingEventsContent.sectionBadge}</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {upcomingEventsContent.heading}
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs leading-relaxed text-text-muted sm:text-sm">
            {upcomingEventsContent.subheading}
          </p>
        </div>
      </div>

      {/* ========================================================
          DESKTOP KINETIC HORIZONTAL CAROUSEL
         ======================================================== */}
      {!isMobile && !reducedMotion ? (
        <div className="relative mt-12 w-full overflow-hidden pb-8 pt-4">
          {/* Scroll Track */}
          <div
            ref={trackRef}
            className="flex items-center gap-8 will-change-transform"
            style={{
              paddingLeft: `${paddingOffset}px`,
              paddingRight: `${paddingOffset}px`,
              width: 'max-content',
            }}
          >
            {upcomingEvents.map((event, index) => {
              const isCenter = index === centerIndex
              return (
                <div
                  key={event.id}
                  className={`w-[380px] lg:w-[420px] flex-shrink-0 transition-all duration-400 ease-out ${
                    isCenter
                      ? 'scale-[1.04] opacity-100 z-20'
                      : 'scale-[0.93] opacity-50 hover:opacity-85 z-10'
                  }`}
                >
                  <EventCard
                    event={event}
                    isCenter={isCenter}
                    onAction={handleCardAction}
                  />
                </div>
              )
            })}
          </div>

          {/* Desktop kinetic status and navigation hint */}
          <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between px-8 md:px-12 lg:px-16">
            <div className="flex items-center gap-2">
              {upcomingEvents.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    i === centerIndex ? 'w-8 bg-accent-green' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <div className="font-mono text-[11px] text-text-muted/70 tracking-widest uppercase flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-ping" />
              <span>
                SCROLL TO PROGRESS // EVENT 0{centerIndex + 1} OF 0{totalEvents}
              </span>
            </div>
          </div>
        </div>
      ) : isMobile ? (
        /* ========================================================
            MOBILE NATIVE TOUCH SWIPE CAROUSEL (CSS Scroll Snap)
           ======================================================== */
        <div className="mt-8 space-y-4">
          <div
            ref={mobileCarouselRef}
            onScroll={handleMobileScroll}
            className="flex w-full gap-4 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-none px-4 -mx-4"
          >
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="w-[85vw] max-w-[340px] flex-shrink-0 snap-center"
              >
                <EventCard
                  event={event}
                  isCenter={true}
                  onAction={handleCardAction}
                />
              </div>
            ))}
          </div>

          {/* Mobile Swipe Indicators */}
          <div className="flex items-center justify-between pt-2 px-2">
            <span className="font-mono text-[10px] text-text-muted tracking-wider uppercase">
              SWIPE TO BROWSE ({mobileActiveIndex + 1}/{totalEvents})
            </span>
            <div className="flex items-center gap-1.5">
              {upcomingEvents.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 transition-all duration-200 rounded-full ${
                    i === mobileActiveIndex ? 'w-4 bg-accent-green' : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
            REDUCED MOTION STATIC GRID
           ======================================================== */
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-8">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isCenter={false}
              onAction={handleCardAction}
            />
          ))}
        </div>
      )}

      {/* Interactive Event Modal */}
      <EventModal
        event={selectedEvent}
        initialTab={modalTab}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  )
}
