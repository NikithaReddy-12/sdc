import { useMemo, useState } from 'react'
import { isAdminLoggedIn, resetSiteStore, saveSiteStore, setAdminLoggedIn, getSiteStore, type SiteStoreData } from '../lib/siteStore.ts'
import type { EventItem, PastEventItem, TeamMember } from '../data/sdcContent.ts'
import { useNavigate } from 'react-router-dom'

const EMPTY_TEAM: TeamMember = {
  id: '', name: '', role: '', domain: 'WEB', bio: '', avatarAccent: '#7cff7a', initials: '', socials: {},
}

const EMPTY_EVENT: EventItem = {
  id: '', title: '', date: '', time: '', type: 'WORKSHOP', description: '', location: '', seats: '', status: 'UPCOMING', accentColor: '#7cff7a',
}

const EMPTY_PAST_EVENT: PastEventItem = {
  id: '', name: '', year: '', date: '', category: 'WORKSHOP', description: '', stats: '', accentColor: '#7cff7a', technologies: [], link: '',
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function AdminPage() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn())
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [store, setStore] = useState<SiteStoreData>(getSiteStore())
  const [tab, setTab] = useState<'events' | 'team' | 'archive'>('events')
  const [eventDraft, setEventDraft] = useState<EventItem>(EMPTY_EVENT)
  const [pastEventDraft, setPastEventDraft] = useState<PastEventItem>(EMPTY_PAST_EVENT)
  const [teamDraft, setTeamDraft] = useState<TeamMember>(EMPTY_TEAM)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [editingPastEventId, setEditingPastEventId] = useState<string | null>(null)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const persist = (next: SiteStoreData) => {
    setStore(next)
    saveSiteStore(next)
    setMessage('Saved successfully.')
    window.setTimeout(() => setMessage(''), 1800)
  }

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    // Front-end demo gate. Replace with Supabase/Firebase auth before public production use.
    const valid = username.trim() === 'admin' && password === 'sdcadmin'
    if (!valid) {
      setLoginError('Invalid admin credentials. Demo: admin / sdcadmin')
      return
    }
    setAdminLoggedIn(true)
    setLoggedIn(true)
    setLoginError('')
  }

  const logout = () => {
    setAdminLoggedIn(false)
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return (
      <main className="min-h-svh bg-background px-4 py-12 text-text-primary">
        <div className="mx-auto flex min-h-[80svh] max-w-md items-center justify-center">
          <form onSubmit={login} className="w-full border border-white/10 bg-white/[0.025] p-7 shadow-2xl shadow-black/40">
            <button type="button" onClick={() => navigate('/')} className="mb-8 font-mono text-xs text-accent-cyan hover:text-accent-green">← BACK TO WEBSITE</button>
            <p className="font-mono text-[10px] tracking-[0.25em] text-accent-cyan">// ADMIN CONTROL CENTER</p>
            <h1 className="mt-2 font-heading text-3xl font-bold">SDC ADMIN LOGIN</h1>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">Manage upcoming events, past events, and the present team from one dashboard.</p>
            <label className="mt-7 block font-mono text-xs text-text-muted">USERNAME<input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 outline-none focus:border-accent-green" /></label>
            <label className="mt-4 block font-mono text-xs text-text-muted">PASSWORD<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 outline-none focus:border-accent-green" /></label>
            {loginError ? <p className="mt-3 text-xs text-red-300">{loginError}</p> : null}
            <button className="mt-6 w-full border border-accent-green bg-accent-green px-4 py-3 font-heading text-xs font-bold tracking-widest text-background transition hover:bg-transparent hover:text-accent-green">LOGIN AS ADMIN →</button>
            <p className="mt-5 border-t border-white/10 pt-4 font-mono text-[10px] leading-relaxed text-text-muted/60">Local demo authentication is included for this static build. For a public deployment, connect the login to Supabase or Firebase before using it as a real administrator account.</p>
          </form>
        </div>
      </main>
    )
  }

  const startEditEvent = (event: EventItem) => { setEventDraft(event); setEditingEventId(event.id) }
  const startEditPastEvent = (event: PastEventItem) => { setPastEventDraft(event); setEditingPastEventId(event.id) }
  const startEditTeam = (member: TeamMember) => { setTeamDraft(member); setEditingTeamId(member.id) }

  const saveEvent = (e: React.FormEvent) => {
    e.preventDefault()
    const id = editingEventId ?? uid('event')
    const nextEvent = { ...eventDraft, id }
    const next = { ...store, upcomingEvents: editingEventId ? store.upcomingEvents.map((x) => x.id === id ? nextEvent : x) : [nextEvent, ...store.upcomingEvents] }
    persist(next)
    setEventDraft(EMPTY_EVENT); setEditingEventId(null)
  }

  const savePastEvent = (e: React.FormEvent) => {
    e.preventDefault()
    const id = editingPastEventId ?? uid('past')
    const nextEvent = { ...pastEventDraft, id, technologies: typeof pastEventDraft.technologies === 'string' ? String(pastEventDraft.technologies).split(',').map((x) => x.trim()).filter(Boolean) : pastEventDraft.technologies }
    const next = { ...store, pastEvents: editingPastEventId ? store.pastEvents.map((x) => x.id === id ? nextEvent : x) : [nextEvent, ...store.pastEvents] }
    persist(next)
    setPastEventDraft(EMPTY_PAST_EVENT); setEditingPastEventId(null)
  }

  const saveTeam = (e: React.FormEvent) => {
    e.preventDefault()
    const id = editingTeamId ?? uid('member')
    const nextMember = { ...teamDraft, id, initials: teamDraft.initials || teamDraft.name.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase() }
    const next = { ...store, teamMembers: editingTeamId ? store.teamMembers.map((x) => x.id === id ? nextMember : x) : [...store.teamMembers, nextMember] }
    persist(next)
    setTeamDraft(EMPTY_TEAM); setEditingTeamId(null)
  }

  const updateMeta = (kind: 'teamMeta' | 'pastTeamMeta', key: 'image' | 'description', value: string) => {
    persist({ ...store, [kind]: { ...store[kind], [key]: value } })
  }

  const uploadImage = async (file: File, callback: (data: string) => void) => {
    const data = await fileToDataUrl(file)
    callback(data)
  }

  const tabs = useMemo(() => [
    ['events', 'UPCOMING EVENTS'], ['team', 'PRESENT TEAM'], ['archive', 'PAST EVENTS'],
  ] as const, [])

  return (
    <main className="min-h-svh bg-background text-text-primary">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/90 px-4 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div><p className="font-mono text-[10px] tracking-[0.25em] text-accent-cyan">SDC · ADMIN</p><h1 className="font-heading text-lg font-bold">CONTROL CENTER</h1></div>
          <div className="flex items-center gap-2"><button onClick={() => navigate('/')} className="border border-white/10 px-3 py-2 font-mono text-[10px] text-text-muted hover:text-text-primary">VIEW SITE</button><button onClick={logout} className="border border-red-400/30 px-3 py-2 font-mono text-[10px] text-red-300 hover:bg-red-400/10">LOGOUT</button></div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        {message ? <div className="fixed right-5 top-20 z-50 border border-accent-green/40 bg-neutral-950 px-4 py-3 font-mono text-xs text-accent-green shadow-xl">{message}</div> : null}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {tabs.map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={`border px-4 py-2 font-mono text-xs tracking-wider ${tab === key ? 'border-accent-green bg-accent-green/10 text-accent-green' : 'border-white/10 text-text-muted hover:text-text-primary'}`}>{label}</button>)}
        </div>

        {tab === 'events' ? <section className="grid gap-8 py-8 lg:grid-cols-[380px_1fr]">
          <form onSubmit={saveEvent} className="h-fit border border-white/10 bg-white/[0.02] p-5">
            <p className="font-mono text-[10px] text-accent-cyan">// {editingEventId ? 'EDIT' : 'ADD'} UPCOMING EVENT</p>
            <h2 className="mt-1 font-heading text-xl font-bold">{editingEventId ? 'Update Event' : 'Create Event'}</h2>
            <div className="mt-5 space-y-3">
              <input placeholder="Event title" value={eventDraft.title} onChange={(e) => setEventDraft({...eventDraft,title:e.target.value})} required className="admin-input" />
              <div className="grid grid-cols-2 gap-2"><input placeholder="Date" value={eventDraft.date} onChange={(e) => setEventDraft({...eventDraft,date:e.target.value})} required className="admin-input" /><input placeholder="Time" value={eventDraft.time} onChange={(e) => setEventDraft({...eventDraft,time:e.target.value})} required className="admin-input" /></div>
              <select value={eventDraft.type} onChange={(e) => setEventDraft({...eventDraft,type:e.target.value as EventItem['type']})} className="admin-input"><option>WORKSHOP</option><option>HACKATHON</option><option>CONTEST</option><option>SESSION</option></select>
              <input placeholder="Location" value={eventDraft.location} onChange={(e) => setEventDraft({...eventDraft,location:e.target.value})} className="admin-input" /><input placeholder="Seats" value={eventDraft.seats} onChange={(e) => setEventDraft({...eventDraft,seats:e.target.value})} className="admin-input" /><input placeholder="Status" value={eventDraft.status} onChange={(e) => setEventDraft({...eventDraft,status:e.target.value})} className="admin-input" />
              <textarea placeholder="Short description" value={eventDraft.description} onChange={(e) => setEventDraft({...eventDraft,description:e.target.value})} required className="admin-input min-h-28" />
              <div className="flex gap-2"><button className="flex-1 border border-accent-green bg-accent-green px-4 py-3 font-heading text-xs font-bold text-background">{editingEventId ? 'UPDATE EVENT' : 'ADD EVENT'}</button>{editingEventId ? <button type="button" onClick={() => {setEventDraft(EMPTY_EVENT);setEditingEventId(null)}} className="border border-white/10 px-4">CANCEL</button> : null}</div>
            </div>
          </form>
          <div className="space-y-3">{store.upcomingEvents.map((event) => <div key={event.id} className="flex items-center justify-between gap-4 border border-white/10 bg-white/[0.015] p-4"><div><p className="font-heading font-semibold">{event.title}</p><p className="mt-1 font-mono text-[10px] text-text-muted">{event.date} · {event.type} · {event.status}</p></div><div className="flex gap-2"><button onClick={() => startEditEvent(event)} className="border border-accent-cyan/30 px-3 py-2 font-mono text-[10px] text-accent-cyan">EDIT</button><button onClick={() => persist({...store,upcomingEvents:store.upcomingEvents.filter((x)=>x.id!==event.id)})} className="border border-red-400/20 px-3 py-2 font-mono text-[10px] text-red-300">DELETE</button></div></div>)}</div>
        </section> : null}

        {tab === 'team' ? <section className="grid gap-8 py-8 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <form onSubmit={saveTeam} className="border border-white/10 bg-white/[0.02] p-5">
              <p className="font-mono text-[10px] text-accent-cyan">// {editingTeamId ? 'EDIT' : 'ADD'} PRESENT TEAM MEMBER</p>
              <h2 className="mt-1 font-heading text-xl font-bold">{editingTeamId ? 'Update Member' : 'Add Member'}</h2>
              <div className="mt-5 space-y-3">
                <input placeholder="Full name" value={teamDraft.name} onChange={(e)=>setTeamDraft({...teamDraft,name:e.target.value})} required className="admin-input" />
                <input placeholder="Role" value={teamDraft.role} onChange={(e)=>setTeamDraft({...teamDraft,role:e.target.value})} required className="admin-input" />
                <select value={teamDraft.domain} onChange={(e)=>setTeamDraft({...teamDraft,domain:e.target.value as TeamMember['domain']})} className="admin-input"><option>LEADERSHIP</option><option>AI</option><option>WEB</option><option>CLOUD</option><option>CYBER</option><option>COMPETITIVE</option></select>
                <textarea placeholder="Short bio" value={teamDraft.bio} onChange={(e)=>setTeamDraft({...teamDraft,bio:e.target.value})} className="admin-input min-h-24" />
                <input placeholder="Photo URL (optional)" value={(teamDraft as TeamMember & {photo?:string}).photo ?? ''} onChange={(e)=>setTeamDraft({...teamDraft,photo:e.target.value} as TeamMember)} className="admin-input" />
                <label className="block border border-dashed border-white/15 p-3 text-center font-mono text-[10px] text-text-muted hover:border-accent-cyan"><input type="file" accept="image/*" className="hidden" onChange={async (e)=>{const f=e.target.files?.[0];if(f) await uploadImage(f,(data)=>setTeamDraft({...teamDraft,photo:data} as TeamMember))}} />UPLOAD MEMBER PHOTO</label>
                <div className="flex gap-2"><button className="flex-1 border border-accent-green bg-accent-green px-4 py-3 font-heading text-xs font-bold text-background">{editingTeamId ? 'UPDATE MEMBER' : 'ADD MEMBER'}</button>{editingTeamId ? <button type="button" onClick={()=>{setTeamDraft(EMPTY_TEAM);setEditingTeamId(null)}} className="border border-white/10 px-4">CANCEL</button> : null}</div>
              </div>
            </form>
            <div className="border border-white/10 bg-white/[0.02] p-5"><p className="font-mono text-[10px] text-accent-cyan">// PRESENT TEAM INTRO</p><textarea value={store.teamMeta.description} onChange={(e)=>updateMeta('teamMeta','description',e.target.value)} className="admin-input mt-3 min-h-24" /><label className="mt-3 block border border-dashed border-white/15 p-3 text-center font-mono text-[10px] text-text-muted"><input type="file" accept="image/*" className="hidden" onChange={async(e)=>{const f=e.target.files?.[0];if(f) await uploadImage(f,(data)=>updateMeta('teamMeta','image',data))}} />UPLOAD TEAM IMAGE</label></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">{store.teamMembers.map((member) => { const photo=(member as TeamMember & {photo?:string}).photo; return <div key={member.id} className="border border-white/10 bg-white/[0.015] p-4">{photo ? <img src={photo} alt="" className="h-40 w-full object-cover grayscale hover:grayscale-0" /> : <div className="flex h-40 items-center justify-center bg-white/[0.03] font-heading text-4xl text-accent-green">{member.initials}</div>}<h3 className="mt-4 font-heading font-semibold">{member.name}</h3><p className="mt-1 font-mono text-[10px] text-accent-cyan">{member.role}</p><p className="mt-2 text-xs leading-relaxed text-text-muted">{member.bio}</p><div className="mt-4 flex gap-2"><button onClick={()=>startEditTeam(member)} className="border border-accent-cyan/30 px-3 py-2 font-mono text-[10px] text-accent-cyan">EDIT</button><button onClick={()=>persist({...store,teamMembers:store.teamMembers.filter((x)=>x.id!==member.id)})} className="border border-red-400/20 px-3 py-2 font-mono text-[10px] text-red-300">DELETE</button></div></div>})}</div>
        </section> : null}

        {tab === 'archive' ? <section className="grid gap-8 py-8 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <form onSubmit={savePastEvent} className="border border-white/10 bg-white/[0.02] p-5">
              <p className="font-mono text-[10px] text-accent-cyan">// {editingPastEventId ? 'EDIT' : 'ADD'} PAST EVENT</p>
              <h2 className="mt-1 font-heading text-xl font-bold">{editingPastEventId ? 'Update Archive' : 'Archive Event'}</h2>
              <div className="mt-5 space-y-3">
                <input placeholder="Event name" value={pastEventDraft.name} onChange={(e)=>setPastEventDraft({...pastEventDraft,name:e.target.value})} required className="admin-input" /><div className="grid grid-cols-2 gap-2"><input placeholder="Year" value={pastEventDraft.year} onChange={(e)=>setPastEventDraft({...pastEventDraft,year:e.target.value})} className="admin-input" /><input placeholder="Date" value={pastEventDraft.date} onChange={(e)=>setPastEventDraft({...pastEventDraft,date:e.target.value})} className="admin-input" /></div><select value={pastEventDraft.category} onChange={(e)=>setPastEventDraft({...pastEventDraft,category:e.target.value as PastEventItem['category']})} className="admin-input"><option>HACKATHON</option><option>WORKSHOP</option><option>BOOTCAMP</option><option>CONFERENCE</option><option>TECH SUMMIT</option></select><input placeholder="Stats" value={pastEventDraft.stats} onChange={(e)=>setPastEventDraft({...pastEventDraft,stats:e.target.value})} className="admin-input" /><input placeholder="Technologies: React, AI, Node" value={pastEventDraft.technologies.join(', ')} onChange={(e)=>setPastEventDraft({...pastEventDraft,technologies:e.target.value.split(',').map((x)=>x.trim()).filter(Boolean)})} className="admin-input" /><textarea placeholder="Description" value={pastEventDraft.description} onChange={(e)=>setPastEventDraft({...pastEventDraft,description:e.target.value})} className="admin-input min-h-24" /><input placeholder="Link (optional)" value={pastEventDraft.link ?? ''} onChange={(e)=>setPastEventDraft({...pastEventDraft,link:e.target.value})} className="admin-input" /><button className="w-full border border-accent-green bg-accent-green px-4 py-3 font-heading text-xs font-bold text-background">{editingPastEventId ? 'UPDATE PAST EVENT' : 'ADD PAST EVENT'}</button>
              </div>
            </form>
            <div className="border border-white/10 bg-white/[0.02] p-5"><p className="font-mono text-[10px] text-accent-cyan">// PAST TEAM INTRO</p><textarea value={store.pastTeamMeta.description} onChange={(e)=>updateMeta('pastTeamMeta','description',e.target.value)} className="admin-input mt-3 min-h-24" /><label className="mt-3 block border border-dashed border-white/15 p-3 text-center font-mono text-[10px] text-text-muted"><input type="file" accept="image/*" className="hidden" onChange={async(e)=>{const f=e.target.files?.[0];if(f) await uploadImage(f,(data)=>updateMeta('pastTeamMeta','image',data))}} />UPLOAD PAST TEAM IMAGE</label></div>
            <button onClick={()=>{if(confirm('Reset all editable website content to the original data?')) {resetSiteStore();setStore(getSiteStore())}}} className="w-full border border-red-400/20 px-4 py-3 font-mono text-[10px] text-red-300 hover:bg-red-400/10">RESET EDITABLE CONTENT</button>
          </div>
          <div className="space-y-3">{store.pastEvents.map((event)=><div key={event.id} className="border border-white/10 bg-white/[0.015] p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-heading font-semibold">{event.name}</p><p className="mt-1 font-mono text-[10px] text-text-muted">{event.year} · {event.category} · {event.date}</p><p className="mt-2 text-xs text-text-muted">{event.description}</p></div><div className="flex gap-2"><button onClick={()=>startEditPastEvent(event)} className="border border-accent-cyan/30 px-3 py-2 font-mono text-[10px] text-accent-cyan">EDIT</button><button onClick={()=>persist({...store,pastEvents:store.pastEvents.filter((x)=>x.id!==event.id)})} className="border border-red-400/20 px-3 py-2 font-mono text-[10px] text-red-300">DELETE</button></div></div></div>)}</div>
        </section> : null}
      </div>
    </main>
  )
}