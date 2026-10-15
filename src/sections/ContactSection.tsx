import { useState, useRef, useEffect } from 'react'
import { gsap } from '../lib/gsap.ts'
import { contactContent } from '../data/sdcContent.ts'
import { useReducedMotion } from '../hooks/index.ts'

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.contact-fade-up', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!formData.name.trim()) {
      errs.name = 'Please provide your full name.'
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide a message or inquiry.'
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Placeholder submit handler (easy to attach Formspree / Google Apps Script / Backend here)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormData({ name: '', email: '', message: '' })
    }, 800)
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact SDC"
      className="relative w-full border-t border-white/10 bg-background px-4 py-24 sm:px-8 sm:py-32 md:px-12 lg:px-16"
    >
      {/* Background Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(95, 247, 240, 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-heading text-xs tracking-[0.25em] text-accent-cyan uppercase">
              <span>{contactContent.sectionBadge}</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {contactContent.heading}
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs leading-relaxed text-text-muted sm:text-sm">
            {contactContent.subheading}
          </p>
        </div>

        {/* Contact Content Grid: Left Info, Right Form */}
        <div className="contact-fade-up mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Coordinates & Information */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Institution / Address */}
              <div className="rounded-sm border border-white/10 bg-white/[0.015] p-5">
                <span className="font-mono text-[10px] text-accent-cyan tracking-widest uppercase block mb-1">
                  // CAMPUS HEADQUARTERS
                </span>
                <h4 className="font-heading text-sm font-semibold text-text-primary">
                  {contactContent.institution}
                </h4>
                <p className="mt-2 font-sans text-xs leading-relaxed text-text-muted">
                  {contactContent.address}
                </p>
              </div>

              {/* Direct Communications */}
              <div className="rounded-sm border border-white/10 bg-white/[0.015] p-5 space-y-3">
                <span className="font-mono text-[10px] text-accent-green tracking-widest uppercase block mb-1">
                  // DIRECT LINES
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                  <span className="text-text-primary">EMAIL:</span>
                  <a
                    href={`mailto:${contactContent.email}`}
                    className="text-accent-green hover:underline focus-visible:outline focus-visible:outline-accent-cyan"
                  >
                    {contactContent.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                  <span className="text-text-primary">PHONE:</span>
                  <a
                    href={`tel:${contactContent.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-text-muted hover:text-text-primary focus-visible:outline focus-visible:outline-accent-cyan"
                  >
                    {contactContent.phone}
                  </a>
                </div>
              </div>

              {/* Official Social Links */}
              <div className="rounded-sm border border-white/10 bg-white/[0.015] p-5">
                <span className="font-mono text-[10px] text-text-muted/60 tracking-widest uppercase block mb-2.5">
                  // OFFICIAL CHANNELS
                </span>
                <div className="flex flex-wrap gap-2">
                  {contactContent.socials.map((soc) => (
                    <a
                      key={soc.name}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Official ${soc.name} page`}
                      className="inline-flex items-center gap-1.5 border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-xs text-text-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan focus-visible:outline focus-visible:outline-accent-cyan"
                    >
                      <span>{soc.name}</span>
                      <span className="text-[10px] opacity-60">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="font-mono text-[10px] text-text-muted/50 tracking-wider">
              OPERATIONAL MON–FRI · 09:00 – 17:00 IST · SDC SECRETARIAT
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 rounded-sm border border-white/10 bg-white/[0.015] p-6 sm:p-8 backdrop-blur-sm">
            <span className="font-mono text-[10px] text-accent-cyan tracking-widest uppercase block mb-2">
              // TRANSMIT INQUIRY
            </span>
            <h3 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">
              Send a Message to SDC Leads
            </h3>

            {isSuccess ? (
              <div className="mt-8 rounded border border-accent-green/40 bg-accent-green/10 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-green text-background text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-heading text-lg font-bold text-text-primary">
                  Message Transmitted Successfully
                </h4>
                <p className="font-sans text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. The SDC Secretariat has received your message and will follow up with you within 24 to 48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="mt-3 cursor-pointer border border-white/20 bg-white/[0.05] px-4 py-1.5 font-mono text-xs uppercase text-text-primary hover:bg-white/[0.1]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-xs text-text-muted uppercase mb-1.5"
                  >
                    Your Name <span className="text-accent-green">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Alex Turner"
                    value={formData.name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: undefined })
                    }}
                    className={`w-full rounded-none border bg-white/[0.02] px-3.5 py-2.5 font-sans text-xs text-text-primary placeholder:text-text-muted/40 transition-colors focus:outline-none ${
                      errors.name
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-white/15 focus:border-accent-green'
                    }`}
                  />
                  {errors.name ? (
                    <p id="contact-name-error" className="mt-1 font-mono text-[11px] text-red-400">{errors.name}</p>
                  ) : null}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-xs text-text-muted uppercase mb-1.5"
                  >
                    Email Address <span className="text-accent-green">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="alex@example.com"
                    value={formData.email}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: undefined })
                    }}
                    className={`w-full rounded-none border bg-white/[0.02] px-3.5 py-2.5 font-sans text-xs text-text-primary placeholder:text-text-muted/40 transition-colors focus:outline-none ${
                      errors.email
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-white/15 focus:border-accent-green'
                    }`}
                  />
                  {errors.email ? (
                    <p id="contact-email-error" className="mt-1 font-mono text-[11px] text-red-400">{errors.email}</p>
                  ) : null}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-xs text-text-muted uppercase mb-1.5"
                  >
                    Message / Inquiry <span className="text-accent-green">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell us about your project, query, or collaboration..."
                    value={formData.message}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value })
                      if (errors.message) setErrors({ ...errors, message: undefined })
                    }}
                    className={`w-full rounded-none border bg-white/[0.02] px-3.5 py-2.5 font-sans text-xs text-text-primary placeholder:text-text-muted/40 transition-colors focus:outline-none ${
                      errors.message
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-white/15 focus:border-accent-green'
                    }`}
                  />
                  {errors.message ? (
                    <p id="contact-message-error" className="mt-1 font-mono text-[11px] text-red-400">{errors.message}</p>
                  ) : null}
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-text-muted/60">
                    * ALL FIELDS REQUIRED
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group cursor-pointer inline-flex items-center gap-2 border border-accent-green bg-accent-green px-6 py-2.5 font-heading text-xs font-bold tracking-widest text-background uppercase transition-all duration-200 hover:bg-transparent hover:text-accent-green focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-cyan disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <span>{isSubmitting ? 'Transmitting...' : 'Submit Message'}</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
