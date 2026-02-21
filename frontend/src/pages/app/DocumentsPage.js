import { useState, useEffect } from 'react';
import { C } from '../../theme';
import { Card, Btn, PageHeader, Spinner, useToast } from '../../components/ui';
import { api } from '../../api';

function AddDocModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name:'', expiry_date:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const inp = { width:'100%', padding:'10px 14px', border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, background:C.card, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color .15s' };

  const save = async () => {
    if (!form.name) { setError('Name is required'); return; }
    setLoading(true);
    try { await api.createDocument(form); onSaved(); onClose(); }
    catch(e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.45)', backdropFilter:'blur(5px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:C.card, borderRadius:20, width:'100%', maxWidth:440, padding:32, boxShadow:'0 20px 60px rgba(15,23,42,.2)', animation:'slideUp .25s ease' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:C.text }}>Add Document</h2>
          <button onClick={onClose} style={{ background:'none', border:`1px solid ${C.border}`, cursor:'pointer', fontSize:16, color:C.muted, padding:'4px 10px', borderRadius:8 }}>✕</button>
        </div>
        {error && <div style={{ background:C.dangerBg, color:C.danger, padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16 }}>{error}</div>}
        <div style={{ marginBottom:18 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>Document Name *</label>
          <input name="name" value={form.name} onChange={set} placeholder="e.g. Passport" style={inp} onFocus={e=>(e.target.style.borderColor=C.accent)} onBlur={e=>(e.target.style.borderColor=C.border)} />
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>Expiry Date</label>
          <input name="expiry_date" type="date" value={form.expiry_date} onChange={set} style={inp} onFocus={e=>(e.target.style.borderColor=C.accent)} onBlur={e=>(e.target.style.borderColor=C.border)} />
        </div>
        <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={save} loading={loading}>Add Document</Btn>
        </div>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const { show, ToastEl } = useToast();

  const load = async () => {
    try { setDocs(await api.getDocuments()); }
    catch(e) { show(e.message,'error'); }
    setLoading(false);
  };

  useEffect(()=>{ load(); },[]);

  const deleteDoc = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await api.deleteDocument(id);
      setDocs(p=>p.filter(d=>d.id!==id));
      show('Document deleted');
    } catch(e) { show(e.message,'error'); }
  };

  if (loading) return <Spinner />;

  const expiringSoon = docs.filter(d=>d.days_left<=60).length;

  return (
    <div style={{ padding:'28px 32px' }}>
      {ToastEl}
      {showAdd && <AddDocModal onClose={()=>setShowAdd(false)} onSaved={load} />}
      <PageHeader title="Document Vault" subtitle={expiringSoon>0?`${expiringSoon} document${expiringSoon>1?'s':''} expiring soon`:'All documents tracked'}
        action={<Btn variant="primary" onClick={()=>setShowAdd(true)} style={{ fontSize:13 }}>+ Add Document</Btn>}
      />

      {expiringSoon>0 && (
        <div style={{ background:C.warningBg, border:'1px solid #FDE68A', borderRadius:12, padding:'12px 18px', marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:16 }}>⚠</span>
          <span style={{ fontSize:13, fontWeight:600, color:'#92400E' }}>{expiringSoon} document{expiringSoon>1?'s':''} expiring within 60 days. Review and renew promptly.</span>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:18 }}>
        {docs.map(doc=>{
          const urgent = doc.days_left<=14;
          const warn   = doc.days_left<=60&&!urgent;
          const color  = urgent?C.danger:warn?C.warning:C.success;
          const bg     = urgent?C.dangerBg:warn?C.warningBg:C.successBg;
          return (
            <Card key={doc.id} hover>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                <div style={{ width:48, height:48, background:C.bg, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, border:`1px solid ${C.border}` }}>📄</div>
                <button onClick={()=>deleteDoc(doc.id)} style={{ background:'none', border:'1px solid #FECACA', borderRadius:7, padding:'5px 10px', cursor:'pointer', color:C.danger, fontSize:13 }}>✕</button>
              </div>
              <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:4 }}>{doc.name}</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>Expires {doc.expiry_date||'—'}</div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ flex:1, height:6, background:`${color}22`, borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.min(100,Math.max(4,(doc.days_left/365)*100))}%`, background:color, borderRadius:3 }} />
                </div>
                <span style={{ background:bg, color, padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>{doc.days_left}d left</span>
              </div>
            </Card>
          );
        })}

        <div onClick={()=>setShowAdd(true)} style={{ border:`2px dashed ${C.border}`, borderRadius:16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, cursor:'pointer', transition:'border-color .15s, background .15s', minHeight:180 }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.background=C.accentBg;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background='transparent';}}
        >
          <div style={{ fontSize:32, marginBottom:10, color:C.muted }}>+</div>
          <div style={{ fontSize:13, fontWeight:700, color:C.muted }}>Add Document</div>
        </div>
      </div>
    </div>
  );
}