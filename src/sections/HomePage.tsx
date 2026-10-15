import { motion, type Variants } from 'framer-motion'
import { Navbar } from '../components/Navbar.tsx'
import { Footer } from '../components/Footer.tsx'
import { useSiteStore } from '../hooks/useSiteStore.ts'
import { aboutContent, pastTeamContent, whatWeDoContent } from '../data/sdcContent.ts'
import { UniverseScene } from '../three/UniverseScene.tsx'
import { TeamCarousel } from '../components/TeamCarousel.tsx'

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-90px' }}>
      {children}
    </motion.div>
  )
}

export function HomePage() {
  const store = useSiteStore()
  const events = store.upcomingEvents.slice(0, 3)

  return (
    <div className="site-shell editorial-home">
      <UniverseScene />
      <Navbar />
      <main>
        {/* HERO — intentionally simple: one message, one logo, two actions */}
        <section id="hero" className="editorial-hero">
          <div className="editorial-hero-noise" />
          <div className="editorial-hero-orb editorial-hero-orb-a" />
          <div className="editorial-hero-orb editorial-hero-orb-b" />
          <div className="editorial-hero-inner">
            <motion.div className="editorial-hero-copy" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
              <motion.p className="editorial-label" variants={reveal}>GSDC · GRIET</motion.p>
              <motion.h1 variants={reveal}>Build skills.<br /><span>Build the future.</span></motion.h1>
              <motion.p className="editorial-hero-text" variants={reveal}>
                The Skill Development Cell at GRIET is a student-led community for learning, building, competing and leading.
              </motion.p>
              <motion.div className="editorial-actions" variants={reveal}>
                <a href="#about" className="editorial-btn editorial-btn-primary">Discover SDC <span>↘</span></a>
                <a href="#events" className="editorial-btn editorial-btn-secondary">See what's next</a>
              </motion.div>
            </motion.div>

            <motion.div className="editorial-logo-wrap" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <div className="editorial-logo-halo" />
              <div className="editorial-logo-circle"><img src="/sdc-logo.png" alt="Skill Development Cell GRIET" /></div>
              <span className="logo-caption">SKILL DEVELOPMENT CELL · GRIET</span>
            </motion.div>
          </div>
          <div className="editorial-hero-footer"><span>Student-led technology community</span><span>Scroll to explore ↓</span></div>
        </section>

        {/* ABOUT */}
        <section id="about" className="editorial-section editorial-light">
          <div className="editorial-container">
            <div className="editorial-section-intro">
              <Reveal><p className="editorial-label">01 / ABOUT SDC</p><h2>Learn together.<br /><em>Build together.</em></h2></Reveal>
              <Reveal><p className="editorial-lead">{aboutContent.paragraphs[0]}</p><p className="editorial-muted">{aboutContent.paragraphs[1]}</p></Reveal>
            </div>
            <div className="editorial-stats">
              {aboutContent.stats.slice(0, 4).map((stat, i) => (
                <motion.div key={stat.id} className="editorial-stat" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <strong>{stat.targetNumber}<small>{stat.suffix}</small></strong><span>{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE DO / INITIATIVES */}
        <section id="work" className="editorial-section editorial-dark">
          <div className="editorial-container">
            <Reveal><p className="editorial-label">02 / WHAT WE DO</p><div className="editorial-heading-row"><h2>Ideas become<br /><em>experience.</em></h2><p>From first concepts to real projects, SDC gives students a place to learn by doing.</p></div></Reveal>
            <div className="initiative-grid">
              {whatWeDoContent.activities.map((item, i) => (
                <motion.article key={item.id} className="initiative-card" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <span>0{i + 1}</span><h3>{item.title}</h3><p>{item.description}</p><div className="initiative-line" />
                  <small>{item.deliverables[0]}</small>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="events" className="editorial-section editorial-light">
          <div className="editorial-container">
            <Reveal><p className="editorial-label">03 / UPCOMING EVENTS</p><div className="editorial-heading-row"><h2>What's<br /><em>coming up.</em></h2><p>Workshops, hackathons, sessions and competitions that turn curiosity into practical skills.</p></div></Reveal>
            <div className="editorial-event-list">
              {events.map((event, i) => (
                <motion.article key={event.id} className="editorial-event" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="event-number">0{i + 1}</div><div className="event-main"><small>{event.type} · {event.date}</small><h3>{event.title}</h3><p>{event.description}</p></div><div className="event-arrow">↗</div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" className="editorial-section editorial-dark editorial-team-section">
          <div className="editorial-container">
            <Reveal><p className="editorial-label">04 / PRESENT TEAM</p><div className="editorial-heading-row"><h2>The people<br /><em>behind SDC.</em></h2><p>{store.teamMeta.description}</p></div></Reveal>
            <TeamCarousel members={store.teamMembers} />
          </div>
        </section>

        {/* PAST EVENTS */}
        <section id="past-events" className="editorial-section editorial-light">
          <div className="editorial-container">
            <Reveal><p className="editorial-label">05 / PAST EVENTS</p><div className="editorial-heading-row"><h2>What we've<br /><em>already built.</em></h2><p>A growing archive of workshops, competitions and experiences from the SDC community.</p></div></Reveal>
            <div className="archive-list editorial-archive">{store.pastEvents.slice(0, 6).map((event) => <div className="archive-row" key={event.id}><span>{event.year}</span><div><small>{event.category}</small><h3>{event.name}</h3><p>{event.description}</p></div><strong>{event.stats}</strong></div>)}</div>
          </div>
        </section>

        {/* PAST TEAM */}
        <section id="past-team" className="editorial-section editorial-dark">
          <div className="editorial-container">
            <Reveal><p className="editorial-label">06 / PAST TEAM & THEIR WORK</p><div className="editorial-heading-row"><h2>Built by many.<br /><em>Passed forward.</em></h2><p>{store.pastTeamMeta.description}</p></div></Reveal>
            <div className="legacy-grid">{pastTeamContent.batches.slice(0, 2).map((batch) => <article className="legacy-card" key={batch.id}><span>{batch.year}</span><h3>{batch.teamName}</h3><h4>{batch.majorProject}</h4><p>{batch.projectDescription}</p><div className="tag-row">{batch.technologies.slice(0, 5).map((t) => <span key={t}>{t}</span>)}</div></article>)}</div>
          </div>
        </section>

        {/* JOIN */}
        <section id="join" className="editorial-join"><div className="editorial-container join-content"><p className="editorial-label">07 / JOIN SDC</p><h2>Have an idea?<br /><em>Let's build it.</em></h2><p>Join a student community that turns learning into projects, teams and opportunities.</p><a href="mailto:sdc@griet.ac.in" className="editorial-btn editorial-btn-dark">Join SDC ↗</a></div></section>

        <section id="contact" className="editorial-contact"><div className="editorial-container contact-grid"><div><p className="editorial-label">08 / CONTACT</p><h2>Let's build<br /><em>together.</em></h2></div><div className="contact-details"><p>Skill Development Cell, GRIET</p><p>Gokaraju Rangaraju Institute of Engineering & Technology<br />Hyderabad, Telangana</p><a href="mailto:sdc@griet.ac.in">sdc@griet.ac.in</a></div></div></section>
      </main>
      <Footer />
    </div>
  )
}