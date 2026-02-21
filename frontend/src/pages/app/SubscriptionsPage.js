import { useState, useEffect } from 'react';
import { C } from '../../theme';
import { Card, StatusBadge, Btn, PageHeader, Spinner, useToast } from '../../components/ui';
import { api } from '../../api';

function AddSubModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name:'', cost:'', renewal:'', icon:'↻' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const inp = { width:'100%', padding:'10px 14px', border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, background:C.card, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  const save = async () => {
    if (!form.name) { setError('Name is required'); return; }
    setLoading(true);
    try { await api.createSubscription(form); onSaved(); onClose(); }
    catch(e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.45)', backdropFilter:'blur(5px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:C.card, borderRadius:20, width:'100%', maxWidth:440, padding:32, boxShadow:'0 20px 60px rgba(15,23,42,.2)', animation:'slideUp .25s ease' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:C.text }}>Add Subscription</h2>
          <button onClick={onClose} style={{ background:'none', border:`1px solid ${C.border}`, cursor:'pointer', fontSize:16, color:C.muted, padding:'4px 10px', borderRadius:8 }}>✕</button>
        </div>
        {error && <div style={{ background:C.dangerBg, color:C.danger, padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16 }}>{error}</div>}
        {[{name:'name',label:'Service Name',placeholder:'e.g. Netflix'},{name:'cost',label:'Monthly Cost ($)',placeholder:'9.99',type:'number'},{name:'renewal',label:'Next Renewal',placeholder:'Mar 15, 2025'},{name:'icon',label:'Icon (emoji)',placeholder:'▶'}].map(f=>(
          <div key={f.name} style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>{f.label}</label>
            <input name={f.name} type={f.type||'text'} value={form[f.name]} onChange={set} placeholder={f.placeholder} style={inp} onFocus={e=>(e.target.style.borderColor=C.accent)} onBlur={e=>(e.target.style.borderColor=C.border)} />
          </div>
        ))}
        <div style={{ display:'flex', gap:12, justifyContent:'flex-end', marginTop:8 }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={save} loading={loading}>Add Subscription</Btn>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const { show, ToastEl } = useToast();

  const load = async () => {
    try { setSubs(await api.getSubscriptions()); }
    catch(e) { show(e.message,'error'); }
    setLoading(false);
  };

  useEffect(()=>{ load(); },[]);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this subscription?')) return;
    try {
      await api.cancelSubscription(id);
      setSubs(p=>p.map(s=>s.id===id?{...s,status:'Cancelled'}:s));
      show('Subscription cancelled');
    } catch(e) { show(e.message,'error'); }
  };

  const deleteSub = async (id) => {
    if (!window.confirm('Delete this subscription?')) return;
    try {
      await api.deleteSubscription(id);
      setSubs(p=>p.filter(s=>s.id!==id));
      show('Subscription deleted');
    } catch(e) { show(e.message,'error'); }
  };

  const active = subs.filter(s=>s.status==='Active');
  const total  = active.reduce((s,sub)=>s+(sub.cost||0), 0);

  if (loading) return <Spinner />;

  return (
    <div style={{ padding:'28px 32px' }}>
      {ToastEl}
      {showAdd && <AddSubModal onClose={()=>setShowAdd(false)} onSaved={load} />}
      <PageHeader title="Subscriptions" subtitle="Track all recurring services"
        action={<Btn variant="primary" onClick={()=>setShowAdd(true)} style={{ fontSize:13 }}>+ Add Subscription</Btn>}
      />

      <div style={{ background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:18, padding:'28px 32px', marginBottom:28, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20 }}>
        <div>
          <div style={{ color:'rgba(255,255,255,.65)', fontSize:13, fontWeight:600, marginBottom:6 }}>Total Monthly Recurring Cost</div>
          <div style={{ fontSize:44, fontWeight:900, color:'#fff', letterSpacing:-1.5 }}>${total.toFixed(2)}</div>
          <div style={{ color:'rgba(255,255,255,.55)', fontSize:13, marginTop:4 }}>${(total*12).toFixed(2)} per year</div>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          <div style={{ textAlign:'center' }}><div style={{ fontSize:28, fontWeight:800, color:'#fff' }}>{active.length}</div><div style={{ fontSize:12, color:'rgba(255,255,255,.6)', marginTop:2 }}>Active</div></div>
          <div style={{ textAlign:'center' }}><div style={{ fontSize:28, fontWeight:800, color:'#fff' }}>{subs.length-active.length}</div><div style={{ fontSize:12, color:'rgba(255,255,255,.6)', marginTop:2 }}>Cancelled</div></div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {subs.map(sub=>(
          <Card key={sub.id} hover style={{ opacity:sub.status==='Cancelled'?.65:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
              <div style={{ width:46, height:46, background:sub.status==='Cancelled'?C.bg:C.accentBg, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0, border:`1px solid ${C.border}` }}>{sub.icon||'↻'}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:16, color:C.text }}>{sub.name}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Renews {sub.renewal||'—'}</div>
              </div>
              <StatusBadge status={sub.status} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <span style={{ fontSize:24, fontWeight:900, color:sub.status==='Cancelled'?C.muted:C.text }}>${(sub.cost||0).toFixed(2)}</span>
                <span style={{ fontSize:12, color:C.muted }}>/mo</span>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {sub.status==='Active' && <button onClick={()=>cancel(sub.id)} style={{ background:'none', border:'1px solid #FECACA', borderRadius:7, padding:'5px 10px', cursor:'pointer', fontSize:11, color:C.danger, fontFamily:'inherit' }}>Cancel</button>}
                <button onClick={()=>deleteSub(sub.id)} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:7, padding:'5px 10px', cursor:'pointer', fontSize:11, color:C.muted, fontFamily:'inherit' }}>Delete</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}