import { useState } from 'react';
import { C } from '../theme';
import { Btn, useToast } from './ui';
import { api } from '../api';

const INIT = { title:'', category:'Utility', amount:'', due_date:'', recurrence:'Monthly', priority:'Medium', reminder:'1 week before', notes:'' };

export default function AddObligationModal({ onClose, onSaved, editData }) {
  const [form, setForm]   = useState(editData ? { ...editData, amount: editData.amount||'', due_date: editData.due_date||'' } : INIT);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { show, ToastEl }     = useToast();

  const set = e => setForm(p=>({...p,[e.target.name]:e.target.value}));

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    setLoading(true); setError('');
    try {
      if (editData) {
        await api.updateObligation(editData.id, form);
      } else {
        await api.createObligation(form);
      }
      onSaved?.();
      onClose();
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const inp = { width:'100%', padding:'10px 12px', border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, background:C.card, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color .15s' };
  const focus = e=>(e.target.style.borderColor=C.accent);
  const blur  = e=>(e.target.style.borderColor=C.border);

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.45)', backdropFilter:'blur(5px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      {ToastEl}
      <div style={{ background:C.card, borderRadius:20, width:'100%', maxWidth:560, padding:32, boxShadow:'0 20px 60px rgba(15,23,42,.2)', animation:'slideUp .25s ease', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text }}>{editData?'Edit':'Add'} Obligation</h2>
            <p style={{ fontSize:13, color:C.muted, marginTop:3 }}>Track a bill, renewal, or payment</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:`1px solid ${C.border}`, cursor:'pointer', fontSize:16, color:C.muted, padding:'4px 10px', borderRadius:8 }}>✕</button>
        </div>

        {error && <div style={{ background:C.dangerBg, color:C.danger, padding:'10px 14px', borderRadius:10, fontSize:13, fontWeight:600, marginBottom:16 }}>{error}</div>}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>Title <span style={{color:C.danger}}>*</span></label>
            <input name="title" value={form.title} onChange={set} placeholder="e.g. Electricity Bill" style={inp} onFocus={focus} onBlur={blur} />
          </div>
          {[
            { name:'category',  label:'Category',  type:'select', opts:['Utility','Insurance','Housing','Health','Subscription','Other'] },
            { name:'priority',  label:'Priority',  type:'select', opts:['Critical','High','Medium','Low'] },
            { name:'recurrence',label:'Recurrence',type:'select', opts:['One-time','Weekly','Monthly','Quarterly','Annual'] },
            { name:'reminder',  label:'Reminder',  type:'select', opts:['1 day before','3 days before','1 week before','2 weeks before','1 month before'] },
          ].map(f=>(
            <div key={f.name}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6, textTransform:'capitalize' }}>{f.label}</label>
              <select name={f.name} value={form[f.name]} onChange={set} style={inp} onFocus={focus} onBlur={blur}>
                {f.opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>Amount ($)</label>
            <input name="amount" type="number" value={form.amount} onChange={set} placeholder="0.00" style={inp} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>Due Date</label>
            <input name="due_date" type="date" value={form.due_date} onChange={set} style={inp} onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={set} placeholder="Optional notes..." rows={3} style={{ ...inp, resize:'vertical' }} onFocus={focus} onBlur={blur} />
          </div>
        </div>

        <div style={{ display:'flex', gap:12, justifyContent:'flex-end', marginTop:24 }}>
          <Btn variant="ghost"   onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={handleSave} loading={loading}>{editData?'Save Changes':'Add Obligation'}</Btn>
        </div>
      </div>
    </div>
  );
}