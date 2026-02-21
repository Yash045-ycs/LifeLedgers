import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme';
import { Btn, Input } from '../../components/ui';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = e => setForm(p=>({...p,[e.target.name]:e.target.value}));

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) { setError('All fields are required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await signup(form.name, form.email, form.password);
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
          <h1 style={{ fontSize:28, fontWeight:800, color:C.text, marginBottom:8 }}>Create your account</h1>
          <p style={{ color:C.muted, fontSize:14 }}>Start managing life admin with clarity</p>
        </div>

        <div style={{ background:C.card, borderRadius:20, border:`1px solid ${C.border}`, padding:'32px 28px', boxShadow:'0 4px 16px rgba(15,23,42,.10)' }}>
          {error && <div style={{ background:C.dangerBg, color:C.danger, padding:'10px 14px', borderRadius:10, fontSize:13, fontWeight:600, marginBottom:16 }}>{error}</div>}

          <Input label="Full name"        name="name"            value={form.name}            onChange={set} placeholder="Jane Smith" />
          <Input label="Email address"    name="email"           value={form.email}           onChange={set} placeholder="you@example.com" type="email" />
          <Input label="Password"         name="password"        value={form.password}        onChange={set} placeholder="Min 6 characters" type="password" />
          <Input label="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={set} placeholder="••••••••" type="password" />

          <Btn variant="primary" onClick={handleSignup} loading={loading} style={{ width:'100%', padding:'13px', fontSize:15, marginTop:6 }}>Create Account</Btn>

          <p style={{ textAlign:'center', marginTop:22, fontSize:13, color:C.muted }}>
            Already have an account?{' '}
            <span style={{ color:C.accent, cursor:'pointer', fontWeight:700 }} onClick={()=>navigate('/login')}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}