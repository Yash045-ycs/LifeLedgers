import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme';
import { Card, TabBar, Input, Btn, Toggle, PageHeader, useToast } from '../../components/ui';
import { api } from '../../api';

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tab,   setTab]   = useState('Account');
  const [notif, setNotif] = useState({ email_reminders:true, push_notifications:true, weekly_digest:true, overdue_alerts:true, doc_expiry_alerts:false });
  const [profile, setProfile] = useState({ name: user?.name||'', timezone:'UTC+5:30' });
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [saving, setSaving] = useState(false);
  const { show, ToastEl } = useToast();

  useEffect(()=>{
    api.getNotifSettings().then(s=>{
      setNotif({ email_reminders:!!s.email_reminders, push_notifications:!!s.push_notifications, weekly_digest:!!s.weekly_digest, overdue_alerts:!!s.overdue_alerts, doc_expiry_alerts:!!s.doc_expiry_alerts });
    }).catch(()=>{});
  },[]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.updateMe(profile);
      setUser(u=>({...u, name:profile.name}));
      show('Profile saved!');
    } catch(e) { show(e.message,'error'); }
    setSaving(false);
  };

  const saveNotif = async () => {
    setSaving(true);
    try { await api.saveNotifSettings(notif); show('Preferences saved!'); }
    catch(e) { show(e.message,'error'); }
    setSaving(false);
  };

  const changePassword = async () => {
    if (pwForm.newPassword!==pwForm.confirmPassword) { show('Passwords do not match','error'); return; }
    if (pwForm.newPassword.length<6) { show('Password must be at least 6 characters','error'); return; }
    setSaving(true);
    try { await api.updatePassword({ currentPassword:pwForm.currentPassword, newPassword:pwForm.newPassword }); show('Password updated!'); setPwForm({currentPassword:'',newPassword:'',confirmPassword:''}); }
    catch(e) { show(e.message,'error'); }
    setSaving(false);
  };

  const deleteAccount = async () => {
    if (!window.confirm('This will permanently delete your account and all data. Are you sure?')) return;
    try { await api.deleteAccount(); logout(); navigate('/'); }
    catch(e) { show(e.message,'error'); }
  };

  return (
    <div style={{ padding:'28px 32px', maxWidth:720, margin:'0 auto' }}>
      {ToastEl}
      <PageHeader title="Settings" subtitle="Manage your account preferences" />
      <TabBar tabs={['Account','Notifications','Security','Danger Zone']} active={tab} onChange={setTab} />

      {tab==='Account' && (
        <Card>
          <h3 style={{ fontSize:17, fontWeight:700, color:C.text, marginBottom:22 }}>Account Information</h3>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:64, height:64, background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#fff', fontSize:22, fontWeight:700 }}>{user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)||'LL'}</span>
            </div>
            <div style={{ fontSize:13, color:C.muted }}>{user?.email}</div>
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>Full Name</label>
            <input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} style={{ width:'100%', padding:'10px 14px', border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, background:C.card, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }} onFocus={e=>(e.target.style.borderColor=C.accent)} onBlur={e=>(e.target.style.borderColor=C.border)} />
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>Timezone</label>
            <select value={profile.timezone} onChange={e=>setProfile(p=>({...p,timezone:e.target.value}))} style={{ width:'100%', padding:'10px 14px', border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, background:'#fff', fontFamily:'inherit', outline:'none' }}>
              {['UTC-5 (Eastern)','UTC-6 (Central)','UTC-8 (Pacific)','UTC+0 (GMT)','UTC+5:30 (IST)','UTC+8 (CST)'].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <Btn variant="primary" onClick={saveProfile} loading={saving}>Save Changes</Btn>
        </Card>
      )}

      {tab==='Notifications' && (
        <Card>
          <h3 style={{ fontSize:17, fontWeight:700, color:C.text, marginBottom:22 }}>Notification Preferences</h3>
          {[
            { key:'email_reminders',    label:'Email reminders',       desc:'Receive obligation reminders via email' },
            { key:'push_notifications', label:'Push notifications',     desc:'Browser push notifications for urgent items' },
            { key:'weekly_digest',      label:'Weekly digest',          desc:'Summary of upcoming obligations every Monday' },
            { key:'overdue_alerts',     label:'Overdue alerts',         desc:'Immediate alerts when obligations become overdue' },
            { key:'doc_expiry_alerts',  label:'Document expiry alerts', desc:'Alerts when documents are about to expire' },
          ].map(n=>(
            <div key={n.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ flex:1, paddingRight:20 }}>
                <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{n.label}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{n.desc}</div>
              </div>
              <Toggle on={notif[n.key]} onChange={val=>setNotif(p=>({...p,[n.key]:val}))} />
            </div>
          ))}
          <div style={{ marginTop:22 }}>
            <Btn variant="primary" onClick={saveNotif} loading={saving}>Save Preferences</Btn>
          </div>
        </Card>
      )}

      {tab==='Security' && (
        <Card>
          <h3 style={{ fontSize:17, fontWeight:700, color:C.text, marginBottom:22 }}>Change Password</h3>
          {[{label:'Current Password',key:'currentPassword'},{label:'New Password',key:'newPassword'},{label:'Confirm New Password',key:'confirmPassword'}].map(f=>(
            <div key={f.key} style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>{f.label}</label>
              <input type="password" value={pwForm[f.key]} onChange={e=>setPwForm(p=>({...p,[f.key]:e.target.value}))} placeholder="••••••••"
                style={{ width:'100%', padding:'10px 14px', border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, color:C.text, background:C.card, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
                onFocus={e=>(e.target.style.borderColor=C.accent)} onBlur={e=>(e.target.style.borderColor=C.border)}
              />
            </div>
          ))}
          <Btn variant="primary" onClick={changePassword} loading={saving}>Update Password</Btn>
        </Card>
      )}

      {tab==='Danger Zone' && (
        <Card style={{ border:`1.5px solid #FECACA` }}>
          <h3 style={{ fontSize:17, fontWeight:700, color:C.danger, marginBottom:8 }}>Danger Zone</h3>
          <p style={{ color:C.muted, fontSize:14, marginBottom:24, lineHeight:1.7 }}>Deleting your account is <strong>permanent and irreversible</strong>. All obligations, documents, and subscription data will be permanently removed.</p>
          <div style={{ display:'flex', gap:12 }}>
            <Btn variant="danger" onClick={deleteAccount}>Delete My Account</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}