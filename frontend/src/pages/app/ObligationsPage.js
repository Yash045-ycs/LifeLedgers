import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { C } from '../../theme';
import { StatusBadge, PriorityBadge, Btn, PageHeader, Spinner, useToast } from '../../components/ui';
import AddObligationModal from '../../components/AddObligationModal';
import { api } from '../../api';

export default function ObligationsPage() {
  const { openModal } = useOutletContext() || {};
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status,   setStatus]   = useState('All');
  const [category, setCategory] = useState('All');
  const [editItem, setEditItem] = useState(null);
  const { show, ToastEl } = useToast();

  const load = async () => {
    try { setObligations(await api.getObligations()); }
    catch(e) { show(e.message,'error'); }
    setLoading(false);
  };

  useEffect(()=>{ load(); },[]);

  const deleteObl = async (id) => {
    if (!window.confirm('Delete this obligation?')) return;
    try {
      await api.deleteObligation(id);
      setObligations(p=>p.filter(o=>o.id!==id));
      show('Obligation deleted');
    } catch(e) { show(e.message,'error'); }
  };

  const filtered = obligations.filter(o => {
    return (status==='All'||o.status===status) && (category==='All'||o.category===category);
  });

  if (loading) return <Spinner />;

  return (
    <div style={{ padding:'28px 32px' }}>
      {ToastEl}
      {editItem && <AddObligationModal editData={editItem} onClose={()=>setEditItem(null)} onSaved={()=>{setEditItem(null);load();}} />}

      <PageHeader title="Obligations" subtitle={`${filtered.length} record${filtered.length!==1?'s':''}`}
        action={
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {[{val:status,set:setStatus,opts:['All','Overdue','Due Today','Upcoming','Completed']},{val:category,set:setCategory,opts:['All','Utility','Insurance','Housing','Health','Subscription']}].map((f,i)=>(
              <select key={i} value={f.val} onChange={e=>f.set(e.target.value)} style={{ padding:'8px 14px', border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:13, color:C.text, background:'#fff', fontFamily:'inherit', cursor:'pointer', outline:'none' }}>
                {f.opts.map(o=><option key={o}>{o}</option>)}
              </select>
            ))}
            <Btn variant="primary" onClick={openModal} style={{ fontSize:13, padding:'8px 18px' }}>+ Add</Btn>
          </div>
        }
      />

      <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:'0 1px 4px rgba(15,23,42,.05)' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
            <thead>
              <tr style={{ background:C.bg, borderBottom:`1px solid ${C.border}` }}>
                {['Title','Category','Recurrence','Due Date','Amount','Priority','Status','Actions'].map(h=>(
                  <th key={h} style={{ textAlign:'left', padding:'12px 18px', fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:0.6, whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:'60px 0', color:C.muted }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>📭</div>
                  <div style={{ fontWeight:600 }}>No obligations match your filters</div>
                </td></tr>
              ) : filtered.map((o,i)=>(
                <tr key={o.id} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?'#fff':'#FAFBFC', transition:'background .12s' }}
                  onMouseEnter={e=>(e.currentTarget.style.background=C.accentBg)}
                  onMouseLeave={e=>(e.currentTarget.style.background=i%2===0?'#fff':'#FAFBFC')}
                >
                  <td style={{ padding:'13px 18px', fontWeight:700, color:C.text }}>{o.title}</td>
                  <td style={{ padding:'13px 18px', color:C.muted }}>{o.category}</td>
                  <td style={{ padding:'13px 18px', color:C.muted }}>{o.recurrence}</td>
                  <td style={{ padding:'13px 18px', color:C.muted, whiteSpace:'nowrap' }}>{o.due_date||'—'}</td>
                  <td style={{ padding:'13px 18px', fontWeight:800, color:C.text }}>${(o.amount||0).toLocaleString()}</td>
                  <td style={{ padding:'13px 18px' }}><PriorityBadge priority={o.priority} /></td>
                  <td style={{ padding:'13px 18px' }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding:'13px 18px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>setEditItem(o)} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:7, padding:'4px 10px', cursor:'pointer', fontSize:12, color:C.muted, fontFamily:'inherit' }}>Edit</button>
                      <button onClick={()=>deleteObl(o.id)} style={{ background:'none', border:'1px solid #FECACA', borderRadius:7, padding:'4px 10px', cursor:'pointer', fontSize:12, color:C.danger, fontFamily:'inherit' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}