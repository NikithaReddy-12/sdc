import { useState, useRef, useEffect } from 'react'
import { gsap } from '../lib/gsap.ts'
import { pastTeamContent, type PastTeamBatch } from '../data/sdcContent.ts'
import { PastTeamCard } from '../components/PastTeamCard.tsx'
import { useReducedMotion } from '../hooks/index.ts'
import { useSiteStore } from '../hooks/useSiteStore.ts'

export function PastTeamSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const [activeBatch, setActiveBatch] = useState<string>('ALL')
  const { pastTeamMeta } = useSiteStore()

  const batchOptions = ['ALL', '2024–2025', '2023–2024', '2022–2023']

  const filteredBatches =
    activeBatch === 'ALL'
      ? pastTeamContent.batches
      : pastTeamContent.batches.filter((b) => b.year === activeBatch)

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.past-team-card-wrapper', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion, activeBatch])

  return (
    <section
      ref={sectionRef}
      id="past-team"
      aria-label="Past Team & Their Work"
      className="relative w-full border-t border-white/10 bg-background px-4 py-24 sm:px-8 sm:py-32 md:px-12 lg:px-16"
    >
      {/* Background Subtle Gradient Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 50% 30%, rgba(95, 247, 240, 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-accent-cyan uppercase">
              <span>{pastTeamContent.sectionBadge}</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {pastTeamContent.heading}
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs leading-relaxed text-text-muted sm:text-sm">
            {pastTeamContent.subheading}
          </p>
        </div>

        {/* Past Team Intro — deliberately separated from the present team */}
        <div className="mt-10 grid gap-6 overflow-hidden border border-white/10 bg-white/[0.015] md:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <span className="font-mono text-[10px] tracking-[0.25em] text-accent-cyan">// PAST TEAM · ARCHIVE</span>
            <h3 className="mt-2 font-heading text-2xl font-bold text-text-primary sm:text-3xl">THE SDC LEGACY</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">{pastTeamMeta.description}</p>
          </div>
          <div className="relative min-h-64 overflow-hidden bg-neutral-950">
            <img src={pastTeamMeta.image} alt="Past SDC team" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/45 via-transparent to-accent-green/10" />
          </div>
        </div>

        {/* Batch Filter Bar */}
        <div className="mt-8 flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
          <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase mr-2 flex-shrink-0">
            BATCH FILTER:
          </span>
          {batchOptions.map((batchYear) => {
            const isActive = activeBatch === batchYear
            return (
              <button
                key={batchYear}
                type="button"
                onClick={() => setActiveBatch(batchYear)}
                className={`cursor-pointer px-3 py-1 font-mono text-xs uppercase tracking-wider transition-all duration-200 rounded-none border flex-shrink-0 ${
                  isActive
                    ? 'border-accent-green bg-accent-green/10 text-accent-green font-semibold'
                    : 'border-white/10 bg-white/[0.02] text-text-muted hover:border-white/25 hover:text-text-primary'
                }`}
              >
                {batchYear === 'ALL' ? 'ALL BATCHES' : `BATCH ${batchYear}`}
              </button>
            )
          })}
        </div>

        {/* Past Team Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {filteredBatches.map((batch: PastTeamBatch) => (
            <div key={batch.id} className="past-team-card-wrapper">
              <PastTeamCard batch={batch} />
            </div>
          ))}
        </div>

        {/* Legacy Strip */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded border border-white/10 bg-white/[0.015] p-6 sm:flex-row sm:p-8">
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wide text-text-primary uppercase sm:text-base">
              SDC ALUMNI NETWORK & ADVISORY COUNCIL
            </h4>
            <p className="mt-1 font-sans text-xs text-text-muted max-w-xl">
              Our past leads and contributors continue to mentor current cohorts, conduct mock technical interviews, and sponsor collegiate engineering initiatives from leading technology firms worldwide.
            </p>
          </div>
          <a
            href="mailto:sdc@griet.ac.in?subject=SDC%20Alumni%20Network"
            className="flex-shrink-0 inline-flex items-center gap-2 border border-accent-cyan/60 bg-accent-cyan/10 px-4 py-2 font-heading text-xs tracking-wider text-accent-cyan uppercase transition-colors hover:bg-accent-cyan hover:text-background"
          >
            <span>Connect as Alumni</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
