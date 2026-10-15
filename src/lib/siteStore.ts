import { pastEventsContent, teamContent, upcomingEventsContent, type EventItem, type PastEventItem, type TeamMember } from '../data/sdcContent.ts'

export interface TeamSectionMeta {
  image: string
  description: string
}

export interface SiteStoreData {
  upcomingEvents: EventItem[]
  pastEvents: PastEventItem[]
  teamMembers: TeamMember[]
  teamMeta: TeamSectionMeta
  pastTeamMeta: TeamSectionMeta
}

const STORAGE_KEY = 'gsdc-site-content-v1'
const ADMIN_SESSION_KEY = 'gsdc-admin-session'

const defaults: SiteStoreData = {
  upcomingEvents: upcomingEventsContent.events,
  pastEvents: pastEventsContent.events,
  teamMembers: teamContent.members,
  teamMeta: {
    image: '/sdc-logo.png',
    description:
      'Meet the current student engineers leading SDC across technical domains, projects, events, and peer mentorship.',
  },
  pastTeamMeta: {
    image: '/sdc-logo.png',
    description:
      'A separate archive celebrating the teams that built the foundation, projects, and legacy of SDC at GRIET.',
  },
}

function readStore(): SiteStoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<SiteStoreData>
    return {
      ...defaults,
      ...parsed,
      upcomingEvents: parsed.upcomingEvents ?? defaults.upcomingEvents,
      pastEvents: parsed.pastEvents ?? defaults.pastEvents,
      teamMembers: parsed.teamMembers ?? defaults.teamMembers,
      teamMeta: { ...defaults.teamMeta, ...(parsed.teamMeta ?? {}) },
      pastTeamMeta: { ...defaults.pastTeamMeta, ...(parsed.pastTeamMeta ?? {}) },
    }
  } catch {
    return defaults
  }
}

let currentStore: SiteStoreData = readStore()

export function getSiteStore(): SiteStoreData {
  return currentStore
}

export function saveSiteStore(next: SiteStoreData) {
  currentStore = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('gsdc-content-updated'))
}

export function resetSiteStore() {
  localStorage.removeItem(STORAGE_KEY)
  currentStore = defaults
  window.dispatchEvent(new CustomEvent('gsdc-content-updated'))
}

export function refreshSiteStore() {
  currentStore = readStore()
  window.dispatchEvent(new CustomEvent('gsdc-content-updated'))
}

export function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
}

export function setAdminLoggedIn(value: boolean) {
  if (value) sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
  else sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

export function subscribeToSiteStore(callback: () => void) {
  window.addEventListener('gsdc-content-updated', callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener('gsdc-content-updated', callback)
    window.removeEventListener('storage', callback)
  }
}
