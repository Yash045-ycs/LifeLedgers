import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { C } from '../../theme';

const NAV = [
  { path:'/app/dashboard',     label:'Dashboard',     icon:'⊞' },
  { path:'/app/timeline',      label:'Timeline',      icon:'◷' },
  { path:'/app/obligations',   label:'Obligations',   icon:'☑' },
  { path:'/app/documents',     label:'Documents',     icon:'🗂' },
  { path:'/app/subscriptions', label:'Subscriptions', icon:'↻' },
  { path:'/app/analytics',     label:'Analytics',     icon:'◈' },
  { path:'/app/settings',      label:'Settings',      icon:'⚙' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [hov, setHov] = useState(null);

  return (
    <aside style={{ width:collapsed?64:220, background:C.card, borderRight:`1px solid ${C.border}`, height:'100vh', display:'flex', flexDirection:'column', transition:'width .25s', overflow:'hidden', flexShrink:0, position:'sticky', top:0 }}>
      {/* Logo */}
      <div style={{ padding:collapsed?'18px 0':'18px 20px', display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${C.border}`, justifyContent:collapsed?'center':'flex-start', height:64, flexShrink:0 }}>
        <div style={{ width:34, height:34, background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ color:'#fff', fontSize:16, fontWeight:800 }}>L</span>
        </div>
        {!collapsed && <span style={{ fontWeight:800, fontSize:17, color:C.primary, letterSpacing:-0.5, whiteSpace:'nowrap' }}>LifeLedger</span>}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'10px 0', overflowY:'auto' }}>
        {NAV.map(item => {
          const active = pathname===item.path;
          return (
            <div key={item.path} onClick={()=>navigate(item.path)}
              onMouseEnter={()=>setHov(item.path)} onMouseLeave={()=>setHov(null)}
              title={collapsed?item.label:''}
              style={{ display:'flex', alignItems:'center', gap:12, padding:collapsed?'12px 0':'11px 20px', justifyContent:collapsed?'center':'flex-start', cursor:'pointer', background:active?C.accentBg:hov===item.path?'#F8FAFC':'transparent', borderRight:`3px solid ${active?C.accent:'transparent'}`, transition:'background .15s' }}
            >
              <span style={{ fontSize:18, color:active?C.accent:C.muted }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize:14, fontWeight:active?700:500, color:active?C.accent:C.text, whiteSpace:'nowrap' }}>{item.label}</span>}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div onClick={()=>setCollapsed(!collapsed)}
        style={{ padding:14, display:'flex', justifyContent:collapsed?'center':'flex-end', borderTop:`1px solid ${C.border}`, cursor:'pointer', color:C.muted, fontSize:18, flexShrink:0 }}
        onMouseEnter={e=>(e.currentTarget.style.background=C.bg)}
        onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
      >{collapsed?'›':'‹'}</div>
    </aside>
  );
}