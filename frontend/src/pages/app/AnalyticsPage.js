import { useState, useEffect } from 'react';
import { C } from '../../theme';
import { Card, PageHeader, SimpleBarChart, Spinner, useToast } from '../../components/ui';
import { api } from '../../api';

const MONTHLY_OBL  = [{month:'Sep',count:12},{month:'Oct',count:15},{month:'Nov',count:10},{month:'Dec',count:18},{month:'Jan',count:14},{month:'Feb',count:18}];
const MONTHLY_COST = [{month:'Sep',cost:1980},{month:'Oct',cost:2100},{month:'Nov',cost:2050},{month:'Dec',cost:2400},{month:'Jan',cost:2200},{month:'Feb',cost:2437}];

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { show, ToastEl } = useToast();

  useEffect(()=>{
    api.getAnalytics().then(setSummary).catch(e=>show(e.message,'error')).finally(()=>setLoading(false));
  },[]);

  if (loading) return <Spinner />;
  const s = summary || {};

  return (
    <div style={{ padding:'28px 32px', maxWidth:1100, margin:'0 auto' }}>
      {ToastEl}
      <PageHeader title="Analytics" subtitle="Insights into your life admin patterns" />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:18, marginBottom:28 }}>
        {[
          { label:'Completed',      value:s.completed||0,  sub:'Total completed',      color:C.success, icon:'✓',  bg:C.successBg },
          { label:'Overdue',        value:s.overdue||0,    sub:'Need attention',        color:C.danger,  icon:'⚠',  bg:C.dangerBg  },
          { label:'Total Tracked',  value:s.total||0,      sub:'All obligations',       color:C.accent,  icon:'◷',  bg:C.accentBg  },
          { label:'Total Spend',    value:`$${(s.totalSpend||0).toLocaleString(undefined,{maximumFractionDigits:0})}`, sub:'All obligations', color:C.primary, icon:'💳', bg:'#E0E7FF' },
        ].map(stat=>(
          <Card key={stat.label}>
            <div style={{ width:42, height:42, background:stat.bg, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, fontSize:18, color:stat.color }}>{stat.icon}</div>
            <div style={{ fontSize:30, fontWeight:900, color:stat.color, letterSpacing:-1, marginBottom:4 }}>{stat.value}</div>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:3 }}>{stat.label}</div>
            <div style={{ fontSize:12, color:C.muted }}>{stat.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <Card>
          <h3 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:20 }}>Obligations by Month</h3>
          <SimpleBarChart data={MONTHLY_OBL} valueKey="count" labelKey="month" color={C.accent} />
        </Card>
        <Card>
          <h3 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:20 }}>Monthly Spend (USD)</h3>
          <SimpleBarChart data={MONTHLY_COST} valueKey="cost" labelKey="month" color={C.primary} />
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:20 }}>Completed vs Overdue</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:28, marginBottom:24 }}>
          {[
            { label:'Completed', value:s.completed||0, total:s.total||1, color:C.success },
            { label:'Overdue',   value:s.overdue||0,   total:s.total||1, color:C.danger  },
          ].map(m=>(
            <div key={m.label}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:13, color:C.muted, fontWeight:600 }}>{m.label}</span>
                <span style={{ fontSize:13, fontWeight:800, color:m.color }}>{m.value} / {m.total}</span>
              </div>
              <div style={{ height:10, background:`${m.color}20`, borderRadius:5, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${m.total?((m.value/m.total)*100):0}%`, background:m.color, borderRadius:5 }} />
              </div>
              <div style={{ fontSize:11, color:C.muted, marginTop:5 }}>{m.total?Math.round((m.value/m.total)*100):0}% rate</div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        {s.byCategory && s.byCategory.length>0 && (
          <>
            <h4 style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14, borderTop:`1px solid ${C.border}`, paddingTop:20 }}>By Category</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {s.byCategory.map((c,i)=>{
                const COLORS=['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444','#6B7280'];
                const color=COLORS[i%COLORS.length];
                const maxCount=Math.max(...s.byCategory.map(x=>x.count),1);
                return (
                  <div key={c.category} style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:100, fontSize:12, color:C.muted, fontWeight:600, flexShrink:0 }}>{c.category}</div>
                    <div style={{ flex:1, height:8, background:`${color}20`, borderRadius:4, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(c.count/maxCount)*100}%`, background:color, borderRadius:4 }} />
                    </div>
                    <div style={{ fontSize:12, fontWeight:700, color, width:20 }}>{c.count}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}