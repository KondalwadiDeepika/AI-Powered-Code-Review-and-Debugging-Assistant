import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { reviewAPI } from '../api/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SEV_COLORS = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#dc2626' };

function StatCard({ icon, label, value, color, sub, glow }) {
  return (
    <div className="card" style={{ textAlign: 'center', cursor: 'default', transition: 'all 0.3s', border: glow ? `1px solid ${color}40` : undefined, boxShadow: glow ? `0 0 20px ${color}20` : undefined }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 10px 30px ${color}25`; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = glow ? `0 0 20px ${color}20` : 'none'; }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ color, fontSize: 11, marginTop: 4, opacity: 0.7 }}>{sub}</div>}
    </div>
  );
}

function CircleProgress({ value, color, size = 80, label }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface3)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 4px ${color})` }} />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill={color} fontSize={14} fontWeight={700}>{value}%</text>
      </svg>
      <span style={{ color: 'var(--muted)', fontSize: 11, textAlign: 'center' }}>{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewAPI.history().then(r => setHistory(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalReviews = history.length;
  const criticalCount = history.filter(r => r.severityLevel === 'CRITICAL').length;
  const avgQuality = history.length ? Math.round(history.reduce((s, r) => s + (r.qualityScore || 0), 0) / history.length) : 0;
  const avgSecurity = history.length ? Math.round(history.reduce((s, r) => s + (r.securityScore || 0), 0) / history.length) : 0;
  const avgPerf = history.length ? Math.round(history.reduce((s, r) => s + (r.performanceScore || 0), 0) / history.length) : 0;

  const langMap = {};
  history.forEach(r => { langMap[r.languageDetected] = (langMap[r.languageDetected] || 0) + 1; });
  const topLang = Object.entries(langMap).sort((a,b) => b[1]-a[1])[0]?.[0] || '—';

  const chartData = history.slice(0, 10).reverse().map((r, i) => ({
    name: `#${i+1}`, quality: r.qualityScore, security: r.securityScore, performance: r.performanceScore
  }));

  const sevData = Object.entries(
    history.reduce((acc, r) => { acc[r.severityLevel] = (acc[r.severityLevel]||0)+1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const recentReviews = history.slice(0, 6);

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120 }} />)}
    </div>
  );

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Welcome back, <span className="gradient-text">{user?.username}</span> 👋</h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Your AI code intelligence dashboard — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon="🔬" label="Total Reviews" value={totalReviews} color="#818cf8" />
        <StatCard icon="🏆" label="Avg Quality" value={avgQuality + '%'} color="#10b981" />
        <StatCard icon="🛡" label="Avg Security" value={avgSecurity + '%'} color="#22d3ee" />
        <StatCard icon="⚡" label="Avg Perf" value={avgPerf + '%'} color="#f59e0b" />
        <StatCard icon="🔴" label="Critical Issues" value={criticalCount} color="#ef4444" glow={criticalCount > 0} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Area chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Code Quality Trends</div>
              <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>Last {chartData.length} reviews</div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[['Quality','#818cf8'],['Security','#22d3ee'],['Perf','#f59e0b']].map(([l,c]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  {[['q','#818cf8'],['s','#22d3ee'],['p','#f59e0b']].map(([id,c]) => (
                    <linearGradient key={id} id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={c} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f1320', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
                <Area type="monotone" dataKey="quality" stroke="#818cf8" fill="url(#gq)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="security" stroke="#22d3ee" fill="url(#gs)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="performance" stroke="#f59e0b" fill="url(#gp)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>No data yet — start reviewing code!</div>
          )}
        </div>

        {/* Scores + pie */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Score Overview</div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <CircleProgress value={avgQuality} color="#818cf8" label="Quality" />
              <CircleProgress value={avgSecurity} color="#22d3ee" label="Security" />
              <CircleProgress value={avgPerf} color="#f59e0b" label="Perf" />
            </div>
          </div>
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Top Language</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💻</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>{topLang}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>Most reviewed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent reviews */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Reviews</div>
            <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13 }}>View all →</button>
          </div>
          {recentReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <div>No reviews yet</div>
              <button onClick={() => navigate('/review')} className="btn btn-primary" style={{ marginTop: 12, fontSize: 13, padding: '7px 14px' }}>Start Reviewing</button>
            </div>
          ) : recentReviews.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
              onClick={() => navigate('/history')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEV_COLORS[r.severityLevel] || '#64748b', boxShadow: `0 0 6px ${SEV_COLORS[r.severityLevel] || '#64748b'}` }} />
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{r.languageDetected}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 11 }}>{new Date(r.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#818cf8' }}>Q:{r.qualityScore}%</span>
                <span className={`badge badge-${r.severityLevel?.toLowerCase()}`}>{r.severityLevel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Quick Actions</div>
          {[
            { icon: '⚡', label: 'New AI Review', sub: 'Paste or upload code for instant analysis', to: '/review', color: '#818cf8' },
            { icon: '📋', label: 'Review History', sub: 'Browse all past analyses with details', to: '/history', color: '#22d3ee' },
            { icon: '📊', label: 'Analytics', sub: 'Language stats & bug trends', to: '/analytics', color: '#10b981' },
          ].map(item => (
            <div key={item.to} onClick={() => navigate(item.to)}
              style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px', borderRadius: 12, cursor: 'pointer', marginBottom: 10, background: 'var(--surface2)', border: '1px solid var(--border)', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = item.color + '50'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>{item.sub}</div>
              </div>
              <span style={{ color: 'var(--muted)', fontSize: 18 }}>→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
