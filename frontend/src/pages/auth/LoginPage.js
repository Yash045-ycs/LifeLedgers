import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme';
import { Btn, Input } from '../../components/ui';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = e => setForm(p=>({...p,[e.target.name]:e.target.value}));

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('Please enter email and password'); return; }
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/app/dashboard');
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:24, cursor:'pointer' }} onClick={()=>navigate('/')}>
            <div style={{ width:40, height:40, background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ color:'#fff', fontWeight:800, fontSize:18 }}>L</span></div>
            <span style={{ fontWeight:800, fontSize:22, color:C.primary }}>LifeLedger</span>
          </div>
          <h1 style={{ fontSize:28, fontWeight:800, color:C.text, marginBottom:8 }}>Welcome back</h1>
          <p style={{ color:C.muted, fontSize:14 }}>Sign in to your account</p>
        </div>

        <div style={{ background:C.card, borderRadius:20, border:`1px solid ${C.border}`, padding:'32px 28px', boxShadow:'0 4px 16px rgba(15,23,42,.10)' }}>
          {error && <div style={{ background:C.dangerBg, color:C.danger, padding:'10px 14px', borderRadius:10, fontSize:13, fontWeight:600, marginBottom:16 }}>{error}</div>}

          {/* Demo hint */}
          <div style={{ background:C.accentBg, color:C.accent, padding:'10px 14px', borderRadius:10, fontSize:12, fontWeight:600, marginBottom:18 }}>
            🔑 Demo: demo@lifeledger.com / demo1234
          </div>

          <Input label="Email address" type="email" name="email" value={form.email} onChange={set} placeholder="you@example.com" />
          <Input label="Password" type="password" name="password" value={form.password} onChange={set} placeholder="••••••••" />

          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
            <span style={{ fontSize:13, color:C.accent, cursor:'pointer', fontWeight:700 }}>Forgot password?</span>
          </div>

          <Btn variant="primary" onClick={handleLogin} loading={loading} style={{ width:'100%', padding:'13px', fontSize:15 }}>Sign In</Btn>

          <p style={{ textAlign:'center', marginTop:22, fontSize:13, color:C.muted }}>
            Don't have an account?{' '}
            <span style={{ color:C.accent, cursor:'pointer', fontWeight:700 }} onClick={()=>navigate('/signup')}>Create one</span>
          </p>
        </div>
      </div>
    </div>
  );
}