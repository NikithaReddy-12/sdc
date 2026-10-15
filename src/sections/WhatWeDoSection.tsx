import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap, ScrollTrigger } from '../lib/gsap.ts'
import { whatWeDoContent, type WhatWeDoActivity } from '../data/sdcContent.ts'
import { useIsMobile, useReducedMotion } from '../hooks/index.ts'

const WhatWeDoScene = lazy(() =>
  import('../three/WhatWeDoScene.tsx').then((mod) => ({ default: mod.WhatWeDoScene }))
)

export function WhatWeDoSection() {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  const [activeState, setActiveState] = useState<number>(0)
  const [slideDirection, setSlideDirection] = useState<number>(1)
  const currentActivity: WhatWeDoActivity = whatWeDoContent.activities[activeState]

  // GSAP ScrollTrigger Desktop Pinning
  useEffect(() => {
    // Only pin on desktop and when reduced motion is not requested
    if (isMobile || reducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=240%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.35,
        onUpdate: (self) => {
          // Map scroll progress (0 to 1) to 4 states
          const rawIdx = Math.floor(self.progress * 4)
          const clamped = Math.max(0, Math.min(3, rawIdx))
          setActiveState((prev) => {
            if (prev !== clamped) {
              setSlideDirection(clamped > prev ? 1 : -1)
            }
            return clamped
          })
        },
      })
      scrollTriggerRef.current = st
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile, reducedMotion])

  const handleSelectState = (index: number) => {
    if (index === activeState) return
    setSlideDirection(index > activeState ? 1 : -1)
    setActiveState(index)

    // If pinned on desktop, smooth scroll to corresponding trigger progress
    if (!isMobile && !reducedMotion && scrollTriggerRef.current) {
      const st = scrollTriggerRef.current
      const targetProgress = index / 3.2
      const targetScroll = st.start + (st.end - st.start) * targetProgress
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  const handleNextMobile = () => {
    if (activeState < whatWeDoContent.activities.length - 1) {
      setSlideDirection(1)
      setActiveState((prev) => prev + 1)
    }
  }

  const handlePrevMobile = () => {
    if (activeState > 0) {
      setSlideDirection(-1)
      setActiveState((prev) => prev - 1)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      aria-label="What We Do"
      className={`relative w-full border-t border-white/10 bg-background ${
        isMobile ? 'py-20 px-4' : 'min-h-screen px-8 md:px-12 lg:px-16'
      }`}
    >
      <div
        ref={pinContainerRef}
        className={`mx-auto flex w-full max-w-6xl flex-col ${
          isMobile ? '' : 'min-h-screen justify-center py-16'
        }`}
      >
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-accent-cyan uppercase">
              <span>{whatWeDoContent.sectionBadge}</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {whatWeDoContent.heading}
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs leading-relaxed text-text-muted sm:text-sm">
            {whatWeDoContent.subheading}
          </p>
        </div>

        {/* ========================================================
            DESKTOP LAYOUT (Split Screen with 3D Centerpiece)
           ======================================================== */}
        {!isMobile ? (
          <div className="mt-12 grid grid-cols-12 items-center gap-12 lg:gap-16">
            {/* Left Column: Interactive State Navigation & Dynamic Text */}
            <div className="col-span-6 flex flex-col justify-center space-y-8">
              {/* Stepper Progress Bar */}
              <div className="flex items-center gap-3">
                {whatWeDoContent.activities.map((act, index) => {
                  const isActive = index === activeState
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => handleSelectState(index)}
                      className="group flex items-center gap-2 text-left focus-visible:outline focus-visible:outline-accent-cyan cursor-pointer"
                    >
                      <div
                        className={`h-1.5 transition-all duration-300 rounded-full ${
                          isActive
                            ? 'w-12 bg-accent-green'
                            : 'w-4 bg-white/20 group-hover:bg-white/40'
                        }`}
                      />
                      <span
                        className={`font-mono text-[10px] tracking-wider uppercase transition-colors ${
                          isActive ? 'text-accent-green font-semibold' : 'text-text-muted/60'
                        }`}
                      >
                        0{index + 1} {act.title}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Dynamic State Info with AnimatePresence */}
              <div className="min-h-[290px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentActivity.id}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: slideDirection * 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -slideDirection * 14 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="flex flex-col"
                  >
                    {/* Supporting Visual Icon & Stage Badge */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded border border-accent-green/40 bg-accent-green/10">
                        <StateIcon state={currentActivity.id} />
                      </div>
                      <div className="inline-block rounded border border-white/10 bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] tracking-widest text-accent-cyan uppercase">
                        STAGE {currentActivity.index} // {currentActivity.subtitle}
                      </div>
                    </div>

                    <h3 className="mt-4 font-heading text-4xl font-bold tracking-tight text-text-primary lg:text-5xl">
                      {currentActivity.title}
                    </h3>

                    <p className="mt-4 font-sans text-base leading-relaxed text-text-muted">
                      {currentActivity.description}
                    </p>

                    {/* Key Deliverables Pills */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {currentActivity.deliverables.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-none border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-xs text-text-primary"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: 3D Visualization */}
            <div className="col-span-6 relative flex h-[480px] w-full items-center justify-center rounded-sm border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-4">
              {/* Corner Accents */}
              <div className="absolute top-3 left-3 font-mono text-[10px] text-text-muted/50 tracking-wider">
                SDC_METHODOLOGY_CORE
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-accent-green tracking-wider">
                STATE: {currentActivity.title} // 0{activeState + 1}
              </div>

              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-48 w-48 rounded-full opacity-20 blur-2xl bg-accent-green" />
                  </div>
                }
              >
                <WhatWeDoScene activeState={activeState} />
              </Suspense>
            </div>
          </div>
        ) : (
          /* ========================================================
              MOBILE LAYOUT (Accessible 2D Interactive with Framer Motion & Swipe)
             ======================================================== */
          <div className="mt-8 space-y-6">
            {/* Interactive Tab Selectors */}
            <div className="grid grid-cols-4 gap-1.5 border-b border-white/10 pb-3">
              {whatWeDoContent.activities.map((act, index) => {
                const isActive = index === activeState
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleSelectState(index)}
                    className={`flex flex-col items-center py-2 px-1 transition-all rounded cursor-pointer ${
                      isActive
                        ? 'border-b-2 border-accent-green bg-white/[0.04] text-accent-green font-semibold'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-60">0{index + 1}</span>
                    <span className="font-heading text-xs tracking-wider uppercase">
                      {act.title}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 2D Animated Card Content with Touch Swipe Support */}
            <div className="relative touch-pan-y">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentActivity.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, { offset, velocity }) => {
                    const swipeThreshold = 40
                    const swipeVelocity = 0.2
                    if (offset.x < -swipeThreshold || velocity.x < -swipeVelocity) {
                      handleNextMobile()
                    } else if (offset.x > swipeThreshold || velocity.x > swipeVelocity) {
                      handlePrevMobile()
                    }
                  }}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: slideDirection * 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -slideDirection * 30 }}
                  transition={{ duration: 0.26, ease: 'easeOut' }}
                  className="rounded border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm select-none"
                >
                  {/* Supporting Visual Indicator & Phase */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded border border-accent-green/40 bg-accent-green/10">
                      <StateIcon state={currentActivity.id} />
                    </div>
                    <span className="font-mono text-xs text-accent-cyan tracking-wider">
                      PHASE 0{activeState + 1}/04
                    </span>
                  </div>

                  <div className="font-mono text-[10px] tracking-wider text-text-muted uppercase">
                    {currentActivity.subtitle}
                  </div>

                  <h3 className="mt-1 font-heading text-2xl font-bold text-text-primary">
                    {currentActivity.title}
                  </h3>

                  <p className="mt-3 font-sans text-xs leading-relaxed text-text-muted">
                    {currentActivity.description}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-white/5 pt-4">
                    <span className="font-heading text-[10px] tracking-widest text-text-muted uppercase">
                      Deliverables:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentActivity.deliverables.map((item, idx) => (
                        <span
                          key={idx}
                          className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-text-primary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile Navigation Controls (Swipe Hint & Prev/Next Chevrons) */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handlePrevMobile}
                disabled={activeState === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 text-xs font-mono text-text-muted disabled:opacity-30 disabled:pointer-events-none hover:text-text-primary hover:border-white/20"
              >
                ← PREV
              </button>

              <div className="flex items-center gap-1.5">
                {whatWeDoContent.activities.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 transition-all duration-200 rounded-full ${
                      i === activeState ? 'w-5 bg-accent-green' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextMobile}
                disabled={activeState === whatWeDoContent.activities.length - 1}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 text-xs font-mono text-text-muted disabled:opacity-30 disabled:pointer-events-none hover:text-text-primary hover:border-white/20"
              >
                NEXT →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function StateIcon({ state }: { state: string }) {
  if (state === 'learn') {
    return (
      <svg className="h-6 w-6 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  }
  if (state === 'build') {
    return (
      <svg className="h-6 w-6 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  }
  if (state === 'compete') {
    return (
      <svg className="h-6 w-6 text-[#bbfefb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
  return (
    <svg className="h-6 w-6 text-[#9bf3b4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )
}
