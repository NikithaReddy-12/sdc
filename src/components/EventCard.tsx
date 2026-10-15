import type { EventItem, EventType } from '../data/sdcContent.ts'

export interface EventCardProps {
  event: EventItem
  isCenter?: boolean
  className?: string
  onAction?: (event: EventItem, action: 'register' | 'details') => void
}

export function EventCard({
  event,
  isCenter = false,
  className = '',
  onAction,
}: EventCardProps) {
  return (
    <article
      aria-label={event.title}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-sm border transition-all duration-300 ${
        isCenter
          ? 'border-accent-green/60 bg-white/[0.04] shadow-[0_0_35px_rgba(124,255,122,0.14)] ring-1 ring-accent-green/30'
          : 'border-white/10 bg-white/[0.015] hover:border-white/25 hover:bg-white/[0.025]'
      } ${className}`}
    >
      {/* Top Banner / Placeholder Image Graphic Area */}
      <div className="relative h-44 w-full overflow-hidden border-b border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-950 to-background p-4 flex flex-col justify-between">
        {/* Subtle Geometric Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.25) 1px, transparent 0)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Ambient Glow Orb */}
        <div
          className="absolute -top-10 -right-10 h-36 w-36 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-50"
          style={{ background: event.accentColor }}
        />

        {/* Decorative Technical Vector Graphic based on Event Type */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none transition-opacity duration-300 group-hover:opacity-45">
          <EventTypeGraphic type={event.type} accentColor={event.accentColor} />
        </div>

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-none border border-white/15 bg-black/70 px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase backdrop-blur-md"
            style={{ color: event.accentColor }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: event.accentColor }}
            />
            {event.type}
          </span>

          <span className="font-mono text-[10px] tracking-wider text-text-muted/80 bg-black/60 px-2 py-0.5 rounded border border-white/5">
            {event.status}
          </span>
        </div>

        {/* Watermark Typo / Seats info */}
        <div className="relative z-10 flex items-end justify-between">
          <div>
            <span className="font-mono text-[9px] text-text-muted/40 tracking-widest block uppercase">
              // SDC_EVENT_ID
            </span>
            <span className="font-mono text-xs text-text-muted font-medium">
              {event.id}
            </span>
          </div>
          <span className="font-mono text-[11px] text-accent-cyan/90 font-medium bg-black/40 px-2 py-0.5 rounded">
            {event.seats}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-2 font-mono text-xs text-accent-cyan">
            <span>{event.date}</span>
            <span>•</span>
            <span className="text-text-muted">{event.time}</span>
          </div>

          {/* Title */}
          <h3 className="mt-2.5 font-heading text-lg font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent-green sm:text-xl line-clamp-2 min-h-[3.25rem]">
            {event.title}
          </h3>

          {/* Description */}
          <p className="mt-2.5 font-sans text-xs leading-relaxed text-text-muted line-clamp-3">
            {event.description}
          </p>
        </div>

        {/* Card Footer: Location & Dual CTA Buttons */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-text-muted font-sans text-[11px]">
            <svg
              className="h-3.5 w-3.5 flex-shrink-0 text-text-muted/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate max-w-[200px]">{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAction?.(event, 'details')}
              aria-label={`View details for ${event.title}`}
              className="flex-1 cursor-pointer border border-white/15 bg-white/[0.03] py-2 px-3 text-center font-heading text-[11px] font-medium tracking-wider text-text-muted uppercase transition-all duration-200 hover:border-white/30 hover:text-text-primary hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-accent-cyan"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => onAction?.(event, 'register')}
              aria-label={`Register for ${event.title}`}
              className="flex-1 group/btn cursor-pointer inline-flex items-center justify-center gap-1.5 border border-accent-green/60 bg-accent-green/10 py-2 px-3 font-heading text-[11px] font-medium tracking-wider text-accent-green uppercase transition-all duration-200 hover:bg-accent-green hover:text-background focus-visible:outline focus-visible:outline-accent-cyan"
            >
              <span>Register</span>
              <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function EventTypeGraphic({ type, accentColor }: { type: EventType; accentColor: string }) {
  if (type === 'HACKATHON') {
    return (
      <svg className="w-48 h-32" viewBox="0 0 200 120" fill="none" stroke={accentColor}>
        <circle cx="40" cy="60" r="8" strokeWidth="1.5" />
        <circle cx="100" cy="30" r="12" strokeWidth="1.5" />
        <circle cx="100" cy="90" r="10" strokeWidth="1.5" />
        <circle cx="160" cy="60" r="14" strokeWidth="1.5" />
        <path d="M48 60 L88 30 M48 60 L90 90 M112 30 L146 60 M110 90 L146 60" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <path d="M70 15 L130 15 M70 105 L130 105" strokeWidth="0.75" opacity="0.4" />
      </svg>
    )
  }
  if (type === 'WORKSHOP') {
    return (
      <svg className="w-48 h-32" viewBox="0 0 200 120" fill="none" stroke={accentColor}>
        <rect x="30" y="35" width="40" height="50" rx="2" strokeWidth="1.5" />
        <rect x="80" y="25" width="40" height="70" rx="2" strokeWidth="1.5" />
        <rect x="130" y="40" width="40" height="40" rx="2" strokeWidth="1.5" />
        <path d="M70 60 H80 M120 60 H130" strokeWidth="1.5" />
        <path d="M40 50 H60 M40 60 H55 M90 40 H110 M90 50 H105 M90 60 H110 M140 55 H160" strokeWidth="1" opacity="0.5" />
      </svg>
    )
  }
  if (type === 'CONTEST') {
    return (
      <svg className="w-48 h-32" viewBox="0 0 200 120" fill="none" stroke={accentColor}>
        <polygon points="100,20 125,75 180,75 135,105 155,160 100,125 45,160 65,105 20,75 75,75" strokeWidth="1.5" transform="scale(0.55) translate(40, -10)" />
        <path d="M30 100 L170 100 M60 25 L60 40 M140 25 L140 40" strokeWidth="1" opacity="0.5" />
        <path d="M50 70 L75 50 L90 60 L120 35 L145 50" strokeWidth="1.25" strokeDasharray="2 2" opacity="0.7" />
      </svg>
    )
  }
  return (
    <svg className="w-48 h-32" viewBox="0 0 200 120" fill="none" stroke={accentColor}>
      <path d="M30 60 C50 30, 70 90, 90 60 C110 30, 130 90, 150 60 C165 40, 175 70, 185 60" strokeWidth="1.5" />
      <path d="M30 60 C50 45, 70 75, 90 60 C110 45, 130 75, 150 60" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
      <circle cx="90" cy="60" r="28" strokeWidth="0.75" opacity="0.3" />
      <circle cx="90" cy="60" r="44" strokeWidth="0.5" opacity="0.2" />
    </svg>
  )
}
