import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const links = [['about','About'],['work','What We Do'],['events','Events'],['team','Team'],['past-team','Legacy'],['contact','Contact']]
export function Navbar(){
 const [open,setOpen]=useState(false); const navigate=useNavigate()
 const go=(id:string)=>{setOpen(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}
 return <header className="site-nav"><button className="brand" onClick={()=>go('hero')}><img src="/sdc-logo.png" alt="SDC GRIET"/><span><b>SDC GRIET</b><small>SKILL DEVELOPMENT CELL</small></span></button><nav>{links.map(([id,label])=><button key={id} onClick={()=>go(id)}>{label}</button>)}</nav><div className="nav-actions"><button className="admin-nav" onClick={()=>navigate('/admin')}>Admin Login</button><button className="join-nav" onClick={()=>go('join')}>Join SDC</button><button className="menu-btn" onClick={()=>setOpen(!open)}>{open?'×':'☰'}</button></div>{open&&<div className="mobile-menu">{links.map(([id,label])=><button key={id} onClick={()=>go(id)}>{label}</button>)}<button onClick={()=>navigate('/admin')}>Admin Login</button></div>}</header>
}
