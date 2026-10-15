import { useEffect, useRef, useState } from 'react'
import type { TeamMember } from '../data/sdcContent.ts'
import { TeamMemberCard } from './TeamMemberCard.tsx'
import { useReducedMotion } from '../hooks/index.ts'

interface TeamCarouselProps { members: TeamMember[] }

export function TeamCarousel({ members }: TeamCarouselProps) {
  const reducedMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const visible = Math.min(3, members.length)
  const maxIndex = Math.max(0, members.length - visible)

  const goTo = (next: number) => setIndex(Math.max(0, Math.min(maxIndex, next)))

  useEffect(() => {
    if (reducedMotion || members.length <= visible) return
    const timer = window.setInterval(() => {
      setIndex((current) => current >= maxIndex ? 0 : current + 1)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [reducedMotion, members.length, visible, maxIndex])

  useEffect(() => {
    viewportRef.current?.scrollTo({ left: 0, behavior: 'auto' })
  }, [])

  if (!members.length) return null

  return (
    <div className="team-showcase">
      <div className="team-carousel-viewport" ref={viewportRef}>
        <div className="team-carousel-clean-track" style={{ transform: `translateX(calc(-${index} * (var(--team-card-width) + var(--team-gap)))` }}>
          {members.map((member) => <div className="team-carousel-clean-item" key={member.id}><TeamMemberCard member={member} /></div>)}
        </div>
      </div>
      <div className="team-showcase-controls">
        <span>{String(index + 1).padStart(2, '0')} / {String(members.length).padStart(2, '0')}</span>
        <div><button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous team members">←</button><button type="button" onClick={() => goTo(index + 1)} disabled={index === maxIndex} aria-label="Next team members">→</button></div>
      </div>
      <div className="team-progress"><span style={{ width: `${((index + visible) / members.length) * 100}%` }} /></div>
    </div>
  )
}
