import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C } from '../theme';
import { Btn, Card } from '../components/ui';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>40); window.addEventListener('scroll',h); return()=>window.removeEventListener('scroll',h); },[]);

  return (
    <div style={{ background:C.bg, minHeight:'100vh' }}>
      <nav style={{ position:'sticky', top:0, zIndex:100, background:scrolled?'rgba(248,250,252,.95)':'transparent', backdropFilter:'blur(12px)', borderBottom:scrolled?`1px solid ${C.border}`:'none', transition:'all .3s' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 32px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#fff', fontWeight:800, fontSize:16 }}>L</span>
            </div>
            <span style={{ fontWeight:800, fontSize:18, color:C.primary }}>LifeLedger</span>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Btn variant="ghost"   onClick={()=>navigate('/login')}  style={{ padding:'8px 20px' }}>Login</Btn>
            <Btn variant="primary" onClick={()=>navigate('/signup')} style={{ padding:'8px 20px' }}>Get Started</Btn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'96px 32px 80px', textAlign:'center' }}>
        <div style={{ display:'inline-block', background:C.accentBg, color:C.accent, padding:'5px 18px', borderRadius:20, fontSize:13, fontWeight:700, marginBottom:28, border:`1px solid #BFDBFE` }}>Life Administration, Simplified</div>
        <h1 style={{ fontSize:'clamp(40px,6vw,72px)', fontWeight:900, color:C.text, lineHeight:1.08, letterSpacing:-2, marginBottom:24 }}>Never Miss<br /><span style={{color:C.accent}}>What Matters.</span></h1>
        <p style={{ fontSize:20, color:C.muted, maxWidth:540, margin:'0 auto 44px', lineHeight:1.65 }}>LifeLedger tracks every bill, subscription, renewal, and expiration—so you never face a late fee, lapsed policy, or expired document again.</p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Btn variant="primary" onClick={()=>navigate('/signup')} style={{ padding:'14px 36px', fontSize:16 }}>Get Started — Free</Btn>
          <Btn variant="ghost"   onClick={()=>navigate('/login')}  style={{ padding:'14px 36px', fontSize:16 }}>Sign In</Btn>
        </div>
        <div style={{ marginTop:64, background:C.card, borderRadius:20, border:`1px solid ${C.border}`, padding:24, boxShadow:'0 24px 80px rgba(15,23,42,.13)', textAlign:'left', maxWidth:820, margin:'64px auto 0' }}>
          <div style={{ display:'flex', gap:7, marginBottom:18 }}>{['#FF5F57','#FFBD2E','#28C840'].map(c=><div key={c} style={{ width:12, height:12, borderRadius:'50%', background:c }}/>)}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:14 }}>
            {[{label:'Upcoming Payments',value:'$2,289',sub:'Next 30 days',color:C.accent},{label:'Active Subscriptions',value:'6',sub:'$95.96/mo',color:C.success},{label:'Expiring Documents',value:'2',sub:'Next 30 days',color:C.warning}].map(s=>(
              <div key={s.label} style={{ background:C.bg, borderRadius:12, padding:'16px 18px', border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11, color:C.muted, marginBottom:8, fontWeight:600 }}>{s.label}</div>
                <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'#FEE2E2', borderRadius:10, padding:'12px 16px' }}><span style={{ color:C.danger, fontWeight:700, fontSize:13 }}>⚠ 2 items need immediate attention</span></div>
        </div>
      </section>

      {/* Problem */}
      <section style={{ background:C.primary, padding:'80px 32px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:36, fontWeight:800, color:'#fff', marginBottom:12, letterSpacing:-1 }}>Sound familiar?</h2>
          <p style={{ color:'rgba(255,255,255,.6)', marginBottom:48, fontSize:17 }}>The real cost of life admin chaos</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20 }}>
            {[{icon:'💸',text:"A late payment fee you didn't see coming"},{icon:'📄',text:'A policy lapsed because the renewal slipped by'},{icon:'🪪',text:'An expired ID that disrupted your travel plans'},{icon:'📱',text:"Subscriptions you forgot you were still paying for"}].map(p=>(
              <div key={p.text} style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius:14, padding:'28px 20px' }}>
                <div style={{ fontSize:36, marginBottom:14 }}>{p.icon}</div>
                <p style={{ color:'rgba(255,255,255,.85)', fontSize:15, lineHeight:1.6 }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding:'80px 32px', maxWidth:1100, margin:'0 auto' }}>
        <h2 style={{ textAlign:'center', fontSize:36, fontWeight:800, color:C.text, marginBottom:52, letterSpacing:-1 }}>How It Works</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:40 }}>
          {[{step:'01',title:'Add Your Obligations',desc:'Import bills, subscriptions, renewals. Takes minutes to set up.'},{step:'02',title:'Set Smart Reminders',desc:'Configure when you want notifications—days, weeks, or months in advance.'},{step:'03',title:'Stay Ahead, Always',desc:'Unified timeline with timely alerts before things fall through the cracks.'}].map(s=>(
            <div key={s.step}>
              <div style={{ fontSize:52, fontWeight:900, color:C.border, lineHeight:1, marginBottom:16, letterSpacing:-2 }}>{s.step}</div>
              <h3 style={{ fontSize:20, fontWeight:700, marginBottom:10, color:C.text }}>{s.title}</h3>
              <p style={{ color:C.muted, lineHeight:1.65, fontSize:15 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background:'#F1F5F9', padding:'80px 32px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', fontSize:36, fontWeight:800, color:C.text, marginBottom:52, letterSpacing:-1 }}>Everything you need</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {[{icon:'◷',title:'Timeline View',desc:'All obligations in one chronological feed. Overdue and upcoming at a glance.'},{icon:'🔔',title:'Smart Reminders',desc:'Rules-based reminders that escalate as deadlines approach.'},{icon:'🗂',title:'Document Vault',desc:'Track documents with expiry dates. Know when your ID or visa expires.'},{icon:'↻',title:'Subscription Insights',desc:'See every recurring charge and cancel what you no longer use.'}].map(f=>(
              <Card key={f.title}>
                <div style={{ width:46, height:46, background:C.accentBg, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:16 }}>{f.icon}</div>
                <h3 style={{ fontSize:17, fontWeight:700, marginBottom:8, color:C.text }}>{f.title}</h3>
                <p style={{ color:C.muted, fontSize:14, lineHeight:1.65 }}>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 32px', textAlign:'center' }}>
        <h2 style={{ fontSize:40, fontWeight:900, color:C.text, marginBottom:16, letterSpacing:-1 }}>Take control of your life admin.</h2>
        <p style={{ color:C.muted, fontSize:18, marginBottom:36 }}>Join thousands who trust LifeLedger to stay organized.</p>
        <Btn variant="primary" onClick={()=>navigate('/signup')} style={{ padding:'15px 44px', fontSize:17 }}>Start for Free</Btn>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${C.border}`, padding:'32px', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:16 }}>
          <div style={{ width:26, height:26, background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ color:'#fff', fontSize:12, fontWeight:800 }}>L</span></div>
          <span style={{ fontWeight:800, color:C.primary }}>LifeLedger</span>
        </div>
        <div style={{ display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap', marginBottom:14 }}>
          {['Privacy Policy','Terms of Service','Help Center','Contact'].map(l=><span key={l} style={{ fontSize:13, color:C.muted, cursor:'pointer' }}>{l}</span>)}
        </div>
        <p style={{ color:C.muted, fontSize:13 }}>© 2025 LifeLedger. All rights reserved.</p>
      </footer>
    </div>
  );
}