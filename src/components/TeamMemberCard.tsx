import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { TeamMember } from '../data/sdcContent.ts'
import { useIsMobile, useReducedMotion } from '../hooks/index.ts'

export interface TeamMemberCardProps {
  member: TeamMember
  className?: string
}

export function TeamMemberCard({ member, className = '' }: TeamMemberCardProps) {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Framer Motion cursor-relative tilt calculation
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 180, mass: 0.5 }
  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig)
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig)

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
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => isMobile && setIsExpanded((prev) => !prev)}
      style={{
        rotateX: disableTilt ? 0 : rotateXSpring,
        rotateY: disableTilt ? 0 : rotateYSpring,
        transformStyle: disableTilt ? 'flat' : 'preserve-3d',
      }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-sm border border-white/10 bg-white/[0.015] p-5 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.03] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] ${
        isMobile ? 'cursor-pointer active:bg-white/[0.04]' : ''
      } ${className}`}
    >
      {/* Ambient subtle glow based on member avatarAccent */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: member.avatarAccent }}
      />

      <div>
        {/* Photo Placeholder Area */}
        <div className="relative mb-5 flex h-48 w-full items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-950 to-background">
          {/* Subtle Grid texture */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Member Initials Portrait Graphic */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-sm border transition-transform duration-300 group-hover:scale-105"
              style={{
                borderColor: `${member.avatarAccent}40`,
                backgroundColor: `${member.avatarAccent}10`,
              }}
            >
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
              ) : (
                <span
                  className="font-heading text-2xl font-bold tracking-wider"
                  style={{ color: member.avatarAccent }}
                >
                  {member.initials}
                </span>
              )}
            </div>
            <div className="mt-2.5 font-mono text-[9px] text-text-muted/60 tracking-widest uppercase">
              // ARCHITECT_ID: {member.id}
            </div>
          </div>

          {/* Top Domain Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className="inline-flex items-center gap-1.5 rounded-none border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase backdrop-blur-md"
              style={{ color: member.avatarAccent }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: member.avatarAccent }}
              />
              {member.domain}
            </span>
          </div>

          {/* Top Right Corner Status */}
          <div className="absolute top-2.5 right-2.5 font-mono text-[9px] text-accent-green/80 bg-black/50 px-1.5 py-0.5 rounded">
            ACTIVE
          </div>
        </div>

        {/* Member Name */}
        <h3 className="font-heading text-lg font-bold tracking-tight text-text-primary transition-colors group-hover:text-accent-green">
          {member.name}
        </h3>

        {/* Role / Designation */}
        <div className="mt-1 font-mono text-xs text-accent-cyan tracking-wide">
          {member.role}
        </div>

        {/* Short Description */}
        <p
          className={`mt-3 font-sans text-xs leading-relaxed text-text-muted transition-all duration-200 ${
            isMobile && !isExpanded ? 'line-clamp-2' : ''
          }`}
        >
          {member.bio}
        </p>

        {isMobile ? (
          <span className="mt-2 block font-mono text-[10px] text-accent-cyan/80">
            {isExpanded ? '▲ Show less' : '▼ Tap to view full bio'}
          </span>
        ) : null}
      </div>

      {/* Card Footer: Social / Contact Icons */}
      <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between">
        <span className="font-mono text-[10px] text-text-muted/50 tracking-widest uppercase">
          CONNECT
        </span>

        <div className="flex items-center gap-2">
          {member.socials.github ? (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub profile of ${member.name}`}
              className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-white/[0.02] text-text-muted transition-colors hover:border-accent-green hover:text-accent-green focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
          ) : null}

          {member.socials.linkedin ? (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn profile of ${member.name}`}
              className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-white/[0.02] text-text-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          ) : null}

          {member.socials.twitter ? (
            <a
              href={member.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`X / Twitter profile of ${member.name}`}
              className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-white/[0.02] text-text-muted transition-colors hover:border-[#bbfefb] hover:text-[#bbfefb] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          ) : null}

          {member.socials.email ? (
            <a
              href={`mailto:${member.socials.email}`}
              aria-label={`Send email to ${member.name}`}
              className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-white/[0.02] text-text-muted transition-colors hover:border-accent-green hover:text-accent-green focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}
