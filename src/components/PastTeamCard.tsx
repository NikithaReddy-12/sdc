import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { PastTeamBatch } from '../data/sdcContent.ts'
import { useIsMobile, useReducedMotion } from '../hooks/index.ts'

export interface PastTeamCardProps {
  batch: PastTeamBatch
  className?: string
}

export function PastTeamCard({ batch, className = '' }: PastTeamCardProps) {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  // Framer Motion cursor-relative tilt calculation
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 180, mass: 0.5 }
  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig)
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || reducedMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    if (isMobile || reducedMotion) return
    mouseX.set(0)
    mouseY.set(0)
  }

  const disableTilt = isMobile || reducedMotion

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: disableTilt ? 0 : rotateXSpring,
        rotateY: disableTilt ? 0 : rotateYSpring,
        transformStyle: disableTilt ? 'flat' : 'preserve-3d',
      }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-white/[0.015] p-6 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.03] hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* Background glow accent */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-15 blur-3xl transition-opacity duration-300 group-hover:opacity-30"
        style={{ background: batch.accentColor }}
      />

      <div>
        {/* Batch Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: batch.accentColor }}
            />
            <span
              className="font-mono text-xs font-bold tracking-widest uppercase"
              style={{ color: batch.accentColor }}
            >
              {batch.batch}
            </span>
          </div>
          <span className="font-mono text-[11px] text-text-muted/70 bg-black/40 px-2 py-0.5 rounded border border-white/5">
            {batch.teamName}
          </span>
        </div>

        {/* Major Project Showcase Area */}
        <div className="mt-5 rounded-sm border border-white/10 bg-neutral-950/80 p-4 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.25) 1px, transparent 0)',
              backgroundSize: '14px 14px',
            }}
          />

          <span className="relative z-10 font-mono text-[9px] text-accent-cyan tracking-widest uppercase block mb-1">
            // FLAGSHIP PROJECT DELIVERED
          </span>

          <h3 className="relative z-10 font-heading text-lg font-bold text-text-primary transition-colors group-hover:text-accent-green">
            {batch.majorProject}
          </h3>

          <p className="relative z-10 mt-1 font-sans text-xs text-text-muted leading-relaxed">
            {batch.projectTagline}
          </p>

          <p className="relative z-10 mt-3 font-sans text-xs text-text-muted/90 leading-relaxed">
            {batch.projectDescription}
          </p>

          {/* Project Tech Stack */}
          <div className="relative z-10 mt-4 flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
            {batch.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="rounded-none border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-text-primary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Work / Initiatives Completed List */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-heading text-xs uppercase tracking-wider text-text-primary">
              Key Initiatives & Milestones:
            </span>
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              aria-label={expanded ? `Collapse initiatives for ${batch.batch}` : `View all initiatives for ${batch.batch}`}
              className="font-mono text-[10px] text-accent-cyan uppercase tracking-wider hover:underline focus-visible:outline focus-visible:outline-accent-cyan cursor-pointer"
            >
              {expanded ? '[- Collapse]' : '[+ View All]'}
            </button>
          </div>

          <ul className="space-y-1.5 font-sans text-xs text-text-muted">
            {(expanded ? batch.workCompleted : batch.workCompleted.slice(0, 2)).map((work, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-green flex-shrink-0" />
                <span className="leading-relaxed">{work}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Leadership Roster */}
        <div className="mt-6 border-t border-white/5 pt-4">
          <span className="font-mono text-[10px] text-text-muted/60 tracking-widest uppercase block mb-2">
            DIRECTORATE LEADS:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {batch.leads.map((lead, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded border border-white/5 bg-white/[0.015] p-2"
              >
                <span className="font-heading text-xs font-semibold text-text-primary">
                  {lead.name}
                </span>
                <span className="font-mono text-[10px] text-accent-cyan/90">
                  {lead.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Repository / Links */}
      <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
        <span className="font-mono text-[10px] text-text-muted/50 tracking-widest uppercase">
          SDC ARCHIVAL RECORD
        </span>

        <div className="flex items-center gap-3">
          {batch.githubLink ? (
            <a
              href={batch.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${batch.majorProject}`}
              className="inline-flex items-center gap-1.5 font-heading text-xs text-text-muted transition-colors hover:text-accent-green focus-visible:outline focus-visible:outline-accent-cyan"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>Code</span>
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-label={expanded ? `Show less details for ${batch.batch}` : `View full work details for ${batch.batch}`}
            className="cursor-pointer border border-accent-cyan/60 bg-accent-cyan/10 px-3 py-1 font-heading text-[11px] font-medium tracking-wider text-accent-cyan uppercase transition-colors hover:bg-accent-cyan hover:text-background focus-visible:outline focus-visible:outline-accent-cyan"
          >
            {expanded ? 'Less Details' : 'Full Work →'}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
