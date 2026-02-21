import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUser, setShowUser] = useState(false);

  const initials = user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'LL';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header style={{ background:C.card, borderBottom:`1px solid ${C.border}`, height:64, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', flexShrink:0, position:'sticky', top:0, zIndex:50 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {onMenuClick && <button onClick={onMenuClick} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color:C.muted }}>☰</button>}
        <span style={{ fontSize:14, color:C.muted }}>Good day, {user?.name?.split(' ')[0] || 'there'} 👋</span>
      </div>

      <div style={{ position:'relative' }}>
        <div onClick={()=>setShowUser(p=>!p)} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'6px 12px', borderRadius:10, border:`1px solid ${C.border}`, background:showUser?C.bg:C.card }}>
          <div style={{ width:30, height:30, background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'#fff', fontSize:12, fontWeight:700 }}>{initials}</span>
          </div>
          <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{user?.name || 'User'}</span>
          <span style={{ color:C.muted, fontSize:11 }}>▾</span>
        </div>

        {showUser && (
          <div style={{ position:'absolute', right:0, top:'calc(100% + 10px)', width:200, background:C.card, border:`1px solid ${C.border}`, borderRadius:14, boxShadow:'0 20px 60px rgba(15,23,42,.15)', zIndex:100, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:`1px solid ${C.border}`, fontSize:12, color:C.muted }}>
              <div style={{ fontWeight:700, color:C.text, fontSize:13 }}>{user?.name}</div>
              <div>{user?.email}</div>
            </div>
            {[{ label:'Settings', path:'/app/settings' }].map(i=>(
              <div key={i.label} onClick={()=>{setShowUser(false);navigate(i.path);}} style={{ padding:'11px 16px', fontSize:13, color:C.text, cursor:'pointer' }}
                onMouseEnter={e=>(e.currentTarget.style.background=C.bg)} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>{i.label}</div>
            ))}
            <div style={{ borderTop:`1px solid ${C.border}` }}>
              <div onClick={handleLogout} style={{ padding:'11px 16px', fontSize:13, color:C.danger, cursor:'pointer', fontWeight:600 }}
                onMouseEnter={e=>(e.currentTarget.style.background=C.dangerBg)} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>Sign Out</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}