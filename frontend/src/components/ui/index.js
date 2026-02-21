import { useState } from 'react';
import { C } from '../../theme';

export const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: '20px 24px', boxShadow: '0 1px 4px rgba(15,23,42,.05)', cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow .2s', ...style }}
    onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,23,42,.10)')}
    onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = '0 1px 4px rgba(15,23,42,.05)')}
  >{children}</div>
);

export const Btn = ({ children, variant = 'primary', onClick, style = {}, type = 'button', disabled = false, loading = false }) => {
  const v = {
    primary:   { background: C.accent,  color:'#fff', border:'none' },
    secondary: { background:'transparent', color:C.accent, border:`1.5px solid ${C.accent}` },
    ghost:     { background:'transparent', color:C.muted,  border:`1.5px solid ${C.border}` },
    danger:    { background: C.danger,  color:'#fff', border:'none' },
  }[variant] || {};
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      style={{ ...v, padding:'9px 20px', borderRadius:10, fontWeight:600, fontSize:14, cursor:(disabled||loading)?'not-allowed':'pointer', opacity:(disabled||loading)?.6:1, transition:'opacity .15s', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6, ...style }}
      onMouseEnter={e => !(disabled||loading) && (e.currentTarget.style.opacity='.82')}
      onMouseLeave={e => !(disabled||loading) && (e.currentTarget.style.opacity='1')}
    >
      {loading && <span style={{ width:14, height:14, border:`2px solid rgba(255,255,255,.4)`, borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} />}
      {children}
    </button>
  );
};

export const Input = ({ label, type='text', placeholder, value, onChange, name, required }) => (
  <div style={{ marginBottom:18 }}>
    {label && <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
    <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required}
      style={{ width:'100%', padding:'10px 14px', border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, background:C.card, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color .15s' }}
      onFocus={e=>(e.target.style.borderColor=C.accent)} onBlur={e=>(e.target.style.borderColor=C.border)}
    />
  </div>
);

export const Select = ({ label, options, value, onChange, name }) => (
  <div style={{ marginBottom:18 }}>
    {label && <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>{label}</label>}
    <select name={name} value={value} onChange={onChange}
      style={{ width:'100%', padding:'10px 14px', border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, background:C.card, outline:'none', fontFamily:'inherit', boxSizing:'border-box', cursor:'pointer' }}
      onFocus={e=>(e.target.style.borderColor=C.accent)} onBlur={e=>(e.target.style.borderColor=C.border)}
    >
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  </div>
);

export const StatusBadge = ({ status }) => {
  const m = { Overdue:{bg:C.dangerBg,color:C.danger}, 'Due Today':{bg:C.warningBg,color:'#B45309'}, Upcoming:{bg:C.accentBg,color:C.accent}, Completed:{bg:C.successBg,color:C.success}, Active:{bg:C.successBg,color:C.success}, Cancelled:{bg:'#F1F5F9',color:C.muted} };
  const s = m[status]||m.Upcoming;
  return <span style={{ background:s.bg, color:s.color, padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700, whiteSpace:'nowrap' }}>{status}</span>;
};

export const PriorityBadge = ({ priority }) => {
  const m = { Critical:C.danger, High:'#EA580C', Medium:C.warning, Low:C.muted };
  const color = m[priority]||C.muted;
  return <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color, fontWeight:700 }}><span style={{ width:7, height:7, borderRadius:'50%', background:color, display:'inline-block' }}/>{priority}</span>;
};

export const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display:'flex', gap:4, background:C.bg, borderRadius:12, padding:4, border:`1px solid ${C.border}`, width:'fit-content', marginBottom:24, flexWrap:'wrap' }}>
    {tabs.map(t=>(
      <button key={t} onClick={()=>onChange(t)} style={{ padding:'8px 18px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, background:active===t?C.card:'transparent', color:active===t?C.accent:C.muted, boxShadow:active===t?'0 1px 4px rgba(15,23,42,.08)':'none', transition:'all .15s', fontFamily:'inherit' }}>{t}</button>
    ))}
  </div>
);

export const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:12 }}>
    <div>
      <h1 style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.5 }}>{title}</h1>
      {subtitle && <p style={{ color:C.muted, fontSize:14, marginTop:4 }}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const Spinner = ({ size=32 }) => (
  <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:40 }}>
    <div style={{ width:size, height:size, border:`3px solid ${C.border}`, borderTopColor:C.accent, borderRadius:'50%', animation:'spin .7s linear infinite' }} />
  </div>
);

export const Toast = ({ message, type='success', onClose }) => {
  const bg = type==='success'?C.success : type==='error'?C.danger : C.warning;
  return (
    <div style={{ position:'fixed', bottom:80, right:28, background:bg, color:'#fff', padding:'12px 20px', borderRadius:12, fontSize:14, fontWeight:600, zIndex:2000, boxShadow:'0 4px 20px rgba(0,0,0,.2)', animation:'slideUp .25s ease', display:'flex', alignItems:'center', gap:12, maxWidth:340 }}>
      <span style={{ flex:1 }}>{message}</span>
      <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,.8)', cursor:'pointer', fontSize:16 }}>✕</button>
    </div>
  );
};

export const Toggle = ({ on, onChange }) => (
  <div onClick={()=>onChange(!on)} style={{ width:44, height:24, background:on?C.accent:C.border, borderRadius:99, position:'relative', cursor:'pointer', transition:'background .2s', flexShrink:0 }}>
    <div style={{ position:'absolute', top:3, left:on?23:3, width:18, height:18, background:'#fff', borderRadius:'50%', boxShadow:'0 1px 4px rgba(0,0,0,.2)', transition:'left .2s' }} />
  </div>
);

export const SimpleBarChart = ({ data, valueKey, labelKey, color }) => {
  const max = Math.max(...data.map(d=>d[valueKey]), 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:140, paddingTop:8 }}>
      {data.map(d=>(
        <div key={d[labelKey]} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5, height:'100%', justifyContent:'flex-end' }}>
          <div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>{d[valueKey]}</div>
          <div style={{ width:'100%', height:`${(d[valueKey]/max)*90}%`, background:color, borderRadius:'5px 5px 0 0', minHeight:4 }} />
          <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>{d[labelKey]}</div>
        </div>
      ))}
    </div>
  );
};

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, type='success') => {
    setToast({ message, type });
    setTimeout(()=>setToast(null), 3500);
  };
  const ToastEl = toast ? <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} /> : null;
  return { show, ToastEl };
}