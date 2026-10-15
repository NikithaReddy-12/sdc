import { useState, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { technologyContent, type TechnologyDomain } from '../data/sdcContent.ts'
import { useIsMobile, useReducedMotion } from '../hooks/index.ts'

const TechnologyNetworkScene = lazy(() =>
  import('../three/TechnologyNetworkScene.tsx').then((mod) => ({ default: mod.TechnologyNetworkScene }))
)

export function TechnologySection() {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Default active domain is 'ai'
  const [activeDomainId, setActiveDomainId] = useState<string>('ai')
  const [hoveredDomainId, setHoveredDomainId] = useState<string | null>(null)

  // On desktop, prioritize hovered node if present; otherwise fall back to activeDomainId
  const effectiveId = hoveredDomainId ?? activeDomainId
  const currentDomain: TechnologyDomain =
    technologyContent.domains.find((d) => d.id === effectiveId) ??
    technologyContent.domains[0]

  const handleSelectNode = (id: string) => {
    setActiveDomainId(id)
  }

  const handleHoverNode = (id: string | null) => {
    setHoveredDomainId(id)
  }

  return (
    <section
      ref={sectionRef}
      id="technology"
      aria-label="Technology Domains"
      className="relative w-full border-t border-white/10 bg-background px-4 py-24 sm:px-8 sm:py-32 md:px-12 lg:px-16"
    >
      {/* Background Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(95, 247, 240, 0.05) 0%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-accent-cyan uppercase">
              <span>{technologyContent.sectionBadge}</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {technologyContent.heading}
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs leading-relaxed text-text-muted sm:text-sm">
            {technologyContent.subheading}
          </p>
        </div>

        {/* ========================================================
            DESKTOP VIEW: 3D Node Network + Domain Detail Panel
           ======================================================== */}
        {!isMobile ? (
          <div className="mt-12 grid grid-cols-12 items-center gap-8 lg:gap-12">
            {/* 3D Network Canvas (Left / Center) */}
            <div className="col-span-7 relative flex h-[520px] w-full items-center justify-center rounded-sm border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-2">
              {/* Corner Watermarks */}
              <div className="absolute top-3 left-3 font-mono text-[10px] text-text-muted/40 tracking-wider">
                SDC_TECH_MATRIX // 4_NODES
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[10px] text-text-muted/60 tracking-wider">
                HOVER OR CLICK SATELLITE TO INSPECT
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-accent-green tracking-wider">
                ACTIVE: {currentDomain.name}
              </div>

              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-48 w-48 rounded-full opacity-20 blur-2xl bg-accent-cyan" />
                  </div>
                }
              >
                <TechnologyNetworkScene
                  activeNodeId={effectiveId}
                  onHoverNode={handleHoverNode}
                  onSelectNode={handleSelectNode}
                />
              </Suspense>
            </div>

            {/* Active Domain Info Card (Right Column) */}
            <div className="col-span-5 flex flex-col justify-center">
              {/* Quick Select Buttons */}
              <div className="mb-6 flex items-center gap-2">
                <span className="font-mono text-[10px] text-text-muted/60 tracking-widest uppercase mr-1">
                  DOMAINS:
                </span>
                {technologyContent.domains.map((dom) => {
                  const isSelected = effectiveId === dom.id
                  return (
                    <button
                      key={dom.id}
                      type="button"
                      onClick={() => handleSelectNode(dom.id)}
                      onMouseEnter={() => handleHoverNode(dom.id)}
                      onMouseLeave={() => handleHoverNode(null)}
                      className={`cursor-pointer rounded-none border px-2.5 py-1 font-mono text-xs uppercase transition-all duration-200 ${
                        isSelected
                          ? 'border-accent-green bg-accent-green/10 text-accent-green font-semibold'
                          : 'border-white/10 bg-white/[0.02] text-text-muted hover:border-white/25 hover:text-text-primary'
                      }`}
                    >
                      {dom.name}
                    </button>
                  )
                })}
              </div>

              {/* Dynamic Animated Content Panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDomain.id}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="rounded-sm border border-white/10 bg-white/[0.015] p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-xs tracking-wider uppercase font-semibold"
                      style={{ color: currentDomain.accentColor }}
                    >
                      // {currentDomain.code} · VERTICAL
                    </span>
                    <span className="rounded border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[10px] text-text-muted">
                      {currentDomain.stats}
                    </span>
                  </div>

                  <h3 className="mt-3 font-heading text-3xl font-bold tracking-tight text-text-primary">
                    {currentDomain.name}
                  </h3>

                  <div className="mt-1 font-mono text-xs text-accent-cyan tracking-wide">
                    {currentDomain.tagline}
                  </div>

                  <p className="mt-4 font-sans text-sm leading-relaxed text-text-muted">
                    {currentDomain.description}
                  </p>

                  {/* Core Toolchain / Stack */}
                  <div className="mt-6 border-t border-white/5 pt-4">
                    <span className="font-heading text-[10px] tracking-widest text-text-muted uppercase block mb-2.5">
                      Core Toolchain & Primitives:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentDomain.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-none border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* ========================================================
              MOBILE VIEW: Lightweight Touch-Friendly 2D Diagram
             ======================================================== */
          <div className="mt-8 space-y-6">
            {/* Domain Selection Tabs */}
            <div className="grid grid-cols-4 gap-1.5 border-b border-white/10 pb-3">
              {technologyContent.domains.map((dom) => {
                const isSelected = activeDomainId === dom.id
                return (
                  <button
                    key={dom.id}
                    type="button"
                    onClick={() => setActiveDomainId(dom.id)}
                    className={`flex flex-col items-center py-2 px-1 transition-all rounded cursor-pointer ${
                      isSelected
                        ? 'border-b-2 border-accent-green bg-white/[0.04] text-accent-green font-semibold'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-60">0{dom.code.slice(0, 2)}</span>
                    <span className="font-heading text-xs tracking-wider uppercase">
                      {dom.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Mobile SVG Interactive Node Diagram */}
            <div className="relative mx-auto flex h-64 w-full max-w-sm items-center justify-center rounded border border-white/10 bg-neutral-950/80 p-4">
              <svg className="absolute inset-0 h-full w-full" viewBox="-120 -80 240 160">
                {/* Connecting Lines */}
                <line
                  x1="0"
                  y1="0"
                  x2="-70"
                  y2="-45"
                  stroke={activeDomainId === 'ai' ? '#7cff7a' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={activeDomainId === 'ai' ? 2 : 1}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="70"
                  y2="-45"
                  stroke={activeDomainId === 'web' ? '#5ff7f0' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={activeDomainId === 'web' ? 2 : 1}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="-70"
                  y2="45"
                  stroke={activeDomainId === 'cloud' ? '#bbfefb' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={activeDomainId === 'cloud' ? 2 : 1}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="70"
                  y2="45"
                  stroke={activeDomainId === 'cyber' ? '#9bf3b4' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={activeDomainId === 'cyber' ? 2 : 1}
                />

                {/* Center Node (SDC) */}
                <circle cx="0" cy="0" r="22" fill="#0d1117" stroke="#7cff7a" strokeWidth="1.5" />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#7cff7a"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  SDC
                </text>

                {/* AI Node */}
                <g onClick={() => setActiveDomainId('ai')} className="cursor-pointer">
                  <circle
                    cx="-70"
                    cy="-45"
                    r="18"
                    fill="#0d1117"
                    stroke={activeDomainId === 'ai' ? '#7cff7a' : 'rgba(255,255,255,0.3)'}
                    strokeWidth={activeDomainId === 'ai' ? 2 : 1}
                  />
                  <text
                    x="-70"
                    y="-41"
                    textAnchor="middle"
                    fill={activeDomainId === 'ai' ? '#7cff7a' : '#9ca3af'}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    AI
                  </text>
                </g>

                {/* WEB Node */}
                <g onClick={() => setActiveDomainId('web')} className="cursor-pointer">
                  <circle
                    cx="70"
                    cy="-45"
                    r="18"
                    fill="#0d1117"
                    stroke={activeDomainId === 'web' ? '#5ff7f0' : 'rgba(255,255,255,0.3)'}
                    strokeWidth={activeDomainId === 'web' ? 2 : 1}
                  />
                  <text
                    x="70"
                    y="-41"
                    textAnchor="middle"
                    fill={activeDomainId === 'web' ? '#5ff7f0' : '#9ca3af'}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    WEB
                  </text>
                </g>

                {/* CLOUD Node */}
                <g onClick={() => setActiveDomainId('cloud')} className="cursor-pointer">
                  <circle
                    cx="-70"
                    cy="45"
                    r="18"
                    fill="#0d1117"
                    stroke={activeDomainId === 'cloud' ? '#bbfefb' : 'rgba(255,255,255,0.3)'}
                    strokeWidth={activeDomainId === 'cloud' ? 2 : 1}
                  />
                  <text
                    x="-70"
                    y="49"
                    textAnchor="middle"
                    fill={activeDomainId === 'cloud' ? '#bbfefb' : '#9ca3af'}
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    CLOUD
                  </text>
                </g>

                {/* CYBER Node */}
                <g onClick={() => setActiveDomainId('cyber')} className="cursor-pointer">
                  <circle
                    cx="70"
                    cy="45"
                    r="18"
                    fill="#0d1117"
                    stroke={activeDomainId === 'cyber' ? '#9bf3b4' : 'rgba(255,255,255,0.3)'}
                    strokeWidth={activeDomainId === 'cyber' ? 2 : 1}
                  />
                  <text
                    x="70"
                    y="49"
                    textAnchor="middle"
                    fill={activeDomainId === 'cyber' ? '#9bf3b4' : '#9ca3af'}
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    CYBER
                  </text>
                </g>
              </svg>
            </div>

            {/* Mobile Domain Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDomain.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="rounded border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-xs uppercase font-semibold"
                    style={{ color: currentDomain.accentColor }}
                  >
                    // {currentDomain.code} · VERTICAL
                  </span>
                  <span className="font-mono text-[10px] text-text-muted">
                    {currentDomain.stats}
                  </span>
                </div>

                <h3 className="mt-2 font-heading text-2xl font-bold text-text-primary">
                  {currentDomain.name}
                </h3>

                <div className="mt-0.5 font-mono text-[11px] text-accent-cyan">
                  {currentDomain.tagline}
                </div>

                <p className="mt-3 font-sans text-xs leading-relaxed text-text-muted">
                  {currentDomain.description}
                </p>

                <div className="mt-4 border-t border-white/5 pt-3">
                  <span className="font-heading text-[10px] tracking-widest text-text-muted uppercase block mb-1.5">
                    Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentDomain.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
