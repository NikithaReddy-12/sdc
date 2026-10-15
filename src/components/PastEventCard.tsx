import type { PastEventItem } from '../data/sdcContent.ts'

export interface PastEventCardProps {
  event: PastEventItem
  isLeft?: boolean
  className?: string
  onViewEvent?: (event: PastEventItem) => void
}

export function PastEventCard({
  event,
  className = '',
  onViewEvent,
}: PastEventCardProps) {
  return (
    <article
      aria-label={event.name}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-white/[0.015] p-5 sm:p-6 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Accent glow orb */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-15 blur-2xl transition-opacity duration-300 group-hover:opacity-35"
        style={{ background: event.accentColor }}
      />

      <div>
        {/* Placeholder Graphic Header */}
        <div className="relative mb-4 flex h-36 w-full items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-950 to-background p-3">
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Technical schematic vector */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <span
              className="font-mono text-2xl font-bold tracking-wider"
              style={{ color: event.accentColor }}
            >
              {event.year}
            </span>
            <span className="font-mono text-[10px] text-text-muted/60 tracking-widest uppercase">
              // ARCHIVE_REF: {event.id}
            </span>
          </div>

          {/* Top Category Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className="inline-flex items-center gap-1.5 rounded-none border border-white/10 bg-black/70 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase backdrop-blur-md"
              style={{ color: event.accentColor }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: event.accentColor }}
              />
              {event.category}
            </span>
          </div>

          {/* Stats pill */}
          <div className="absolute bottom-2.5 right-2.5 font-mono text-[10px] text-accent-cyan bg-black/60 px-2 py-0.5 rounded border border-white/5">
            {event.stats}
          </div>
        </div>

        {/* Date */}
        <div className="font-mono text-xs text-accent-cyan tracking-wider">
          {event.date}
        </div>

        {/* Event Name */}
        <h3 className="mt-1.5 font-heading text-lg font-bold tracking-tight text-text-primary transition-colors group-hover:text-accent-green sm:text-xl">
          {event.name}
        </h3>

        {/* Description */}
        <p className="mt-2.5 font-sans text-xs leading-relaxed text-text-muted">
          {event.description}
        </p>

        {/* Technologies Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {event.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="rounded-none border border-white/10 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-text-primary/90"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action */}
      <div className="mt-5 border-t border-white/5 pt-3 flex items-center justify-between">
        <span className="font-mono text-[10px] text-text-muted/50 tracking-widest uppercase">
          SDC ARCHIVES
        </span>

        <button
          type="button"
          onClick={() => onViewEvent?.(event)}
          aria-label={`View archive details for ${event.name}`}
          className="group/btn cursor-pointer inline-flex items-center gap-1.5 font-heading text-xs font-medium tracking-wider text-accent-green uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-accent-cyan"
        >
          <span>View Event</span>
          <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">
            →
          </span>
        </button>
      </div>
    </article>
  )
}
