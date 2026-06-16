import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend } from 'recharts';
import { reviewAPI } from '../api/api';

const SEV_COLORS = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#dc2626' };
const COLORS = ['#818cf8','#22d3ee','#a855f7','#10b981','#f59e0b','#ec4899'];

function TopCard({ icon, label, value, color, sub }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = color + '50'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 28 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
      <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ color, fontSize: 11, marginTop: 3, opacity: 0.7 }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) return (
    <div style={{ background: '#0f1320', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 25}}>
      <div style={{ color: 'var(--muted2)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>)}
    </div>
  );
  return null;
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([reviewAPI.analytics(), reviewAPI.history()])
      .then(([aRes, hRes]) => { setAnalytics(aRes.data); setHistory(hRes.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
      {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}
    </div>
  );

  const langData = analytics ? Object.entries(analytics.languageBreakdown || {}).map(([name, value]) => ({ name, value })) : [];
  const sevData = analytics ? Object.entries(analytics.severityBreakdown || {}).map(([name, value]) => ({ name, value })) : [];

  const totalReviews = history.length;
  const avgQuality = history.length ? Math.round(history.reduce((s,r) => s+(r.qualityScore||0),0)/history.length) : 0;
  const avgSecurity = history.length ? Math.round(history.reduce((s,r) => s+(r.securityScore||0),0)/history.length) : 0;
  const criticalCount = history.filter(r => r.severityLevel === 'CRITICAL').length;

  const trendData = history.slice(0,12).reverse().map((r,i) => ({
    name: `#${i+1}`, quality: r.qualityScore, security: r.securityScore, performance: r.performanceScore
  }));

  const radarData = [
    { subject: 'Quality', value: avgQuality },
    { subject: 'Security', value: avgSecurity },
    { subject: 'Performance', value: history.length ? Math.round(history.reduce((s,r)=>s+(r.performanceScore||0),0)/history.length) : 0 },
    { subject: 'Reliability', value: Math.max(0, 100 - criticalCount * 20) },
    { subject: 'Coverage', value: Math.min(100, totalReviews * 10) },
  ];

  if (totalReviews === 0) return (
    <div className="animate-in">
      <h1 className="page-title">📊 Analytics</h1>
      <p className="page-sub">Insights from your code review history</p>
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.5 }}>📊</div>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>No data yet</div>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Submit code reviews to see analytics</div>
      </div>
    </div>
  );

  return (
    <div className="animate-in">
      <h1 className="page-title">📊 Analytics</h1>
      <p className="page-sub">AI-powered code intelligence insights</p>

      {/* Top cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <TopCard icon="🔬" label="Total Analyses" value={totalReviews} color="#818cf8" />
        <TopCard icon="🏆" label="Avg Quality" value={avgQuality + '%'} color="#10b981" />
        <TopCard icon="🛡" label="Avg Security" value={avgSecurity + '%'} color="#22d3ee" />
        <TopCard icon="🔴" label="Critical Issues" value={criticalCount} color="#ef4444" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Bar chart */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Languages Reviewed</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 20 }}>Distribution by programming language</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={langData} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {langData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 25, marginBottom: 4 }}>Severity Breakdown</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 20 }}>Distribution by issue severity</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width="60%" height={180}>
              <PieChart>
                <Pie data={sevData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {sevData.map((entry, i) => <Cell key={i} fill={SEV_COLORS[entry.name] || COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sevData.map(entry => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: SEV_COLORS[entry.name] || '#818cf8', boxShadow: `0 0 6px ${SEV_COLORS[entry.name]}60` }} />
                  <span style={{ fontSize: 12, color: 'var(--muted2)' }}>{entry.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: SEV_COLORS[entry.name], marginLeft: 'auto' }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Trend */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Score Trends</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 20 }}>Quality, Security & Performance over time</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                {[['q','#818cf8'],['s','#22d3ee'],['p','#f59e0b']].map(([id,c]) => (
                  <linearGradient key={id} id={`ag${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="quality" name="Quality" stroke="#818cf8" fill="url(#agq)" strokeWidth={2} dot={false}/>
              <Area type="monotone" dataKey="security" name="Security" stroke="#22d3ee" fill="url(#ags)" strokeWidth={2} dot={false}/>
              <Area type="monotone" dataKey="performance" name="Performance" stroke="#f59e0b" fill="url(#agp)" strokeWidth={2} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 25, marginBottom: 4 }}>Code Health</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 10 }}>Overall code quality radar</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(99,102,241,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Score" dataKey="value" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 25, marginBottom: 16 }}>Severity Distribution Table</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Severity','Count','Percentage','Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--muted)', fontSize: 18, fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sevData.map(row => (
              <tr key={row.name} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 14px', fontWeight: 600 }}>{row.name}</td>
                <td style={{ padding: '12px 14px', color: SEV_COLORS[row.name], fontWeight: 700 }}>{row.value}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 4, background: 'var(--surface3)', borderRadius: 2 }}>
                      <div style={{ width: `${Math.round((row.value/totalReviews)*100)}%`, height: '100%', background: SEV_COLORS[row.name], borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--muted2)', width: 35 }}>{Math.round((row.value/totalReviews)*100)}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px 14px' }}><span className={`badge badge-${row.name.toLowerCase()}`}>{row.name}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
