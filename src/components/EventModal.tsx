import { useState, useEffect } from 'react'
import type { EventItem } from '../data/sdcContent.ts'

export interface EventModalProps {
  event: EventItem | null
  initialTab?: 'register' | 'details'
  onClose: () => void
}

export function EventModal({
  event,
  initialTab = 'details',
  onClose,
}: EventModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'register'>(initialTab)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    branch: 'CSE',
  })

  useEffect(() => {
    if (!event) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [event, onClose])

  if (!event) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-event-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl border border-white/20 bg-neutral-950 p-6 sm:p-8 shadow-2xl shadow-black/80 rounded-sm">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary focus-visible:outline focus-visible:outline-accent-cyan cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 font-mono text-xs text-accent-cyan tracking-wider uppercase">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: event.accentColor }}
          />
          <span>{event.type}</span>
          <span>•</span>
          <span>{event.status}</span>
        </div>

        <h3 id="modal-event-title" className="mt-2 font-heading text-2xl font-bold text-text-primary sm:text-3xl">
          {event.title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-4 font-mono text-xs text-text-muted">
          <span>📅 {event.date}</span>
          <span>⏰ {event.time}</span>
          <span>📍 {event.location}</span>
          <span>👥 {event.seats}</span>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex border-b border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-2 px-4 font-heading text-xs tracking-wider uppercase cursor-pointer border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-accent-green text-accent-green font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Event Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-2 px-4 font-heading text-xs tracking-wider uppercase cursor-pointer border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-accent-green text-accent-green font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Register Now
          </button>
        </div>

        {/* Tab Body */}
        {activeTab === 'details' ? (
          <div className="mt-6 space-y-4">
            <p className="font-sans text-sm leading-relaxed text-text-primary/90">
              {event.description}
            </p>

            <div className="rounded border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <h4 className="font-heading text-xs uppercase tracking-wider text-accent-green">
                What to Expect:
              </h4>
              <ul className="list-disc list-inside font-sans text-xs text-text-muted space-y-1">
                <li>Production-level technical mentorship from domain specialists</li>
                <li>Hands-on code sprint with deployment pipeline walkthrough</li>
                <li>Official SDC certificate of participation and merit recognition</li>
                <li>Access to private community channels and resource repositories</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="border border-accent-green bg-accent-green/10 px-6 py-2 font-heading text-xs tracking-wider text-accent-green uppercase transition-colors hover:bg-accent-green hover:text-background cursor-pointer"
              >
                Proceed to Registration →
              </button>
            </div>
          </div>
        ) : submitted ? (
          <div className="mt-8 text-center py-6 space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/20 text-accent-green text-xl font-bold">
              ✓
            </div>
            <h4 className="font-heading text-xl text-text-primary">Registration Confirmed!</h4>
            <p className="font-sans text-xs text-text-muted max-w-sm mx-auto">
              You are confirmed for <strong className="text-text-primary">{event.title}</strong>. Check your institutional GRIET email for calendar invites and lab prerequisites.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 border border-white/20 bg-white/[0.04] px-5 py-2 font-mono text-xs uppercase tracking-wider text-text-primary hover:bg-white/[0.1] cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="reg-name" className="block font-mono text-[11px] text-text-muted uppercase mb-1">
                Full Name
              </label>
              <input
                id="reg-name"
                required
                type="text"
                placeholder="Rikin Patel"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-none border border-white/15 bg-white/[0.03] px-3 py-2 font-sans text-xs text-text-primary placeholder:text-text-muted/40 focus:border-accent-green focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-roll" className="block font-mono text-[11px] text-text-muted uppercase mb-1">
                  Roll / Student ID
                </label>
                <input
                  id="reg-roll"
                  required
                  type="text"
                  placeholder="24241A05XX"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full rounded-none border border-white/15 bg-white/[0.03] px-3 py-2 font-sans text-xs text-text-primary placeholder:text-text-muted/40 focus:border-accent-green focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="reg-branch" className="block font-mono text-[11px] text-text-muted uppercase mb-1">
                  Department / Branch
                </label>
                <select
                  id="reg-branch"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full rounded-none border border-white/15 bg-neutral-900 px-3 py-2 font-sans text-xs text-text-primary focus:border-accent-green focus:outline-none"
                >
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="CSBS">CSBS</option>
                  <option value="AIML">AIML / DS</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block font-mono text-[11px] text-text-muted uppercase mb-1">
                GRIET Institutional Email
              </label>
              <input
                id="reg-email"
                required
                type="email"
                placeholder="student@grietcollege.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-none border border-white/15 bg-white/[0.03] px-3 py-2 font-sans text-xs text-text-primary placeholder:text-text-muted/40 focus:border-accent-green focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="border border-white/15 px-4 py-2 font-heading text-xs uppercase tracking-wider text-text-muted hover:text-text-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border border-accent-green bg-accent-green px-6 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-background hover:bg-accent-green/90 cursor-pointer"
              >
                Confirm RSVP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
