import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import AddObligationModal from '../AddObligationModal';
import { C } from '../../theme';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg }}>
      {/* Mobile overlay */}
      {mobileOpen && <div onClick={()=>setMobileOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.4)', zIndex:98 }} />}

      {/* Desktop sidebar */}
      <div style={{ display:'flex' }} className="ll-desktop-sidebar">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile sidebar */}
      <div style={{ position:'fixed', left:0, top:0, zIndex:99, height:'100vh', transform:`translateX(${mobileOpen?'0':'-100%'})`, transition:'transform .25s' }} className="ll-mobile-sidebar">
        <Sidebar collapsed={false} setCollapsed={()=>setMobileOpen(false)} />
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <Topbar onMenuClick={()=>setMobileOpen(true)} />
        <main style={{ flex:1, overflowY:'auto' }}>
          <Outlet context={{ openModal:()=>setShowModal(true) }} />
        </main>
      </div>

      {/* FAB */}
      <button onClick={()=>setShowModal(true)} title="Add Obligation"
        style={{ position:'fixed', bottom:28, right:28, width:54, height:54, background:C.accent, border:'none', borderRadius:'50%', color:'#fff', fontSize:28, cursor:'pointer', boxShadow:'0 4px 18px rgba(37,99,235,.42)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, transition:'transform .15s, box-shadow .15s', lineHeight:1 }}
        onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.1)';e.currentTarget.style.boxShadow='0 8px 28px rgba(37,99,235,.55)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 4px 18px rgba(37,99,235,.42)';}}
      >+</button>

      {showModal && <AddObligationModal onClose={()=>setShowModal(false)} onSaved={()=>setShowModal(false)} />}

      <style>{`
        @media(max-width:767px){.ll-desktop-sidebar{display:none!important}}
        @media(min-width:768px){.ll-mobile-sidebar{display:none!important}}
      `}</style>
    </div>
  );
}