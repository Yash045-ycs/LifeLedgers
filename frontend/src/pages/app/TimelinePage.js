import { useState, useEffect } from 'react';
import { C } from '../../theme';
import { TabBar, StatusBadge, PriorityBadge, Card, PageHeader, Spinner, useToast } from '../../components/ui';
import AddObligationModal from '../../components/AddObligationModal';
import { api } from '../../api';

const CATEGORY_ICONS = { Utility:'⚡', Insurance:'🛡', Housing:'🏠', Health:'❤', Subscription:'↻', Other:'📋' };
const TABS = ['All','Today','This Week','This Month','Overdue'];

export default function TimelinePage() {
  const [tab, setTab] = useState('All');
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const { show, ToastEl } = useToast();

  const load = async () => {
    try { setObligations(await api.getObligations()); }
    catch(e) { show(e.message,'error'); }
    setLoading(false);
  };

  useEffect(()=>{ load(); },[]);

  const updateStatus = async (id, status) => {
    try {
      await api.updateObligationStatus(id, status);
      setObligations(p=>p.map(o=>o.id===id?{...o,status}:o));
      show(`Marked as ${status}`);
    } catch(e) { show(e.message,'error'); }
  };

  const filtered = obligations.filter(o => {
    if (tab==='Overdue')    return o.status==='Overdue';
    if (tab==='Today')      return o.status==='Due Today';
    if (tab==='This Week')  return ['Overdue','Due Today','Upcoming'].includes(o.status);
    if (tab==='This Month') return o.status!=='Completed';
    return true;
  });

  if (loading) return <Spinner />;

  return (
    <div style={{ padding:'28px 32px', maxWidth:900, margin:'0 auto' }}>
      {ToastEl}
      {editItem && <AddObligationModal editData={editItem} onClose={()=>setEditItem(null)} onSaved={()=>{setEditItem(null);load();}} />}
      <PageHeader title="Timeline" subtitle="All your obligations in chronological order" />
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {filtered.length===0 ? (
        <div style={{ textAlign:'center', padding:'60px 0' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
          <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>All clear!</div>
          <div style={{ fontSize:14, color:C.muted }}>No obligations for this period.</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(o=>(
            <Card key={o.id} style={{ padding:'18px 22px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
                <div style={{ width:42, height:42, background:C.bg, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, border:`1px solid ${C.border}` }}>
                  {CATEGORY_ICONS[o.category]||'📋'}
                </div>
                <div style={{ flex:1, minWidth:140 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{o.title}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{o.category} · {o.recurrence} · Due {o.due_date||'—'}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                  <span style={{ fontWeight:800, fontSize:16, color:C.text }}>${(o.amount||0).toLocaleString()}</span>
                  <PriorityBadge priority={o.priority} />
                  <StatusBadge status={o.status} />
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  {o.status!=='Completed' && (
                    <button onClick={()=>updateStatus(o.id,'Completed')} style={{ background:C.successBg, border:'none', borderRadius:8, padding:'7px 12px', cursor:'pointer', fontSize:12, fontWeight:700, color:C.success, fontFamily:'inherit' }}>✓ Done</button>
                  )}
                  {o.status!=='Upcoming' && o.status!=='Completed' && (
                    <button onClick={()=>updateStatus(o.id,'Upcoming')} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:'7px 12px', cursor:'pointer', fontSize:12, fontWeight:600, color:C.muted, fontFamily:'inherit' }}>⏸ Snooze</button>
                  )}
                  <button onClick={()=>setEditItem(o)} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:'7px 12px', cursor:'pointer', fontSize:12, fontWeight:600, color:C.muted, fontFamily:'inherit' }}>✎ Edit</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}