import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { C } from '../../theme';
import { Card, StatusBadge, PriorityBadge, Btn, Spinner, useToast } from '../../components/ui';
import { api } from '../../api';

const STAT_ICONS = { payments:'💳', subs:'↻', docs:'🗂', obligations:'☑' };

export default function DashboardPage() {
  const { openModal } = useOutletContext() || {};
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { show, ToastEl } = useToast();

  const load = useCallback(async () => {
    try {
      const data = await api.getObligations();
      setObligations(data);
    } catch(e) { show(e.message, 'error'); }
    setLoading(false);
  }, []);

  useEffect(()=>{ load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await api.updateObligationStatus(id, status);
      setObligations(p => p.map(o => o.id===id ? {...o, status} : o));
      show(`Marked as ${status}`, 'success');
    } catch(e) { show(e.message,'error'); }
  };

  const overdue  = obligations.filter(o=>o.status==='Overdue');
  const dueToday = obligations.filter(o=>o.status==='Due Today');
  const upcoming = obligations.filter(o=>o.status==='Upcoming');

  const totalUpcoming = upcoming.reduce((s,o)=>s+(o.amount||0), 0);

  if (loading) return <Spinner />;

  return (
    <div style={{ padding:'28px 32px', maxWidth:1100, margin:'0 auto' }}>
      {ToastEl}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.5 }}>Dashboard</h1>
        <p style={{ color:C.muted, fontSize:14, marginTop:4 }}>{new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>

      {/* Needs Attention */}
      {(overdue.length>0||dueToday.length>0) && (
        <section style={{ marginBottom:28 }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:14, display:'flex', alignItems:'center', gap:7 }}>
            <span style={{color:C.danger}}>⚠</span> Needs Attention
            <span style={{ background:C.dangerBg, color:C.danger, fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>{overdue.length+dueToday.length}</span>
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[...overdue,...dueToday].map(o=>(
              <div key={o.id} style={{ background:o.status==='Overdue'?'#FFF5F5':'#FFFBEB', border:`1px solid ${o.status==='Overdue'?'#FECACA':'#FDE68A'}`, borderRadius:12, padding:'14px 20px', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:160 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{o.title}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{o.category} · Due {o.due_date}</div>
                </div>
                <div style={{ fontWeight:800, fontSize:16, color:C.text }}>${(o.amount||0).toLocaleString()}</div>
                <StatusBadge status={o.status} />
                <div style={{ display:'flex', gap:8 }}>
                  <Btn variant="primary" onClick={()=>updateStatus(o.id,'Completed')} style={{ padding:'6px 14px', fontSize:12 }}>✓ Done</Btn>
                  <Btn variant="ghost" onClick={()=>updateStatus(o.id,'Upcoming')} style={{ padding:'6px 14px', fontSize:12 }}>⏸ Snooze</Btn>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:18, marginBottom:28 }}>
        {[
          { label:'Total Upcoming Payments', value:`$${totalUpcoming.toLocaleString(undefined,{maximumFractionDigits:0})}`, sub:'All upcoming', color:C.accent, icon:'💳' },
          { label:'Overdue Items',           value:overdue.length,   sub:'Need attention',     color:C.danger,  icon:'⚠' },
          { label:'Upcoming This Month',     value:upcoming.length,  sub:'Scheduled',          color:C.accent,  icon:'◷' },
          { label:'Completed',               value:obligations.filter(o=>o.status==='Completed').length, sub:'All time', color:C.success, icon:'✓' },
        ].map(s=>(
          <Card key={s.label}>
            <div style={{ fontSize:22, marginBottom:12 }}>{s.icon}</div>
            <div style={{ fontSize:30, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:3 }}>{s.label}</div>
            <div style={{ fontSize:12, color:C.muted }}>{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Upcoming */}
      <section>
        <h2 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:14 }}>Upcoming Obligations</h2>
        {upcoming.length===0 ? (
          <Card style={{ textAlign:'center', padding:40 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🎉</div>
            <div style={{ fontWeight:700, color:C.text, marginBottom:8 }}>All caught up!</div>
            <div style={{ color:C.muted, fontSize:14, marginBottom:16 }}>No upcoming obligations.</div>
            <Btn variant="primary" onClick={openModal}>+ Add Obligation</Btn>
          </Card>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
            {upcoming.slice(0,6).map(o=>(
              <Card key={o.id} hover>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:3 }}>{o.title}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{o.category} · {o.recurrence}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:22, fontWeight:800, color:C.text }}>${(o.amount||0).toLocaleString()}</div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Due {o.due_date||'—'}</div>
                  </div>
                  <PriorityBadge priority={o.priority} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}