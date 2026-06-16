import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { reviewAPI } from '../api/api';

const SEV_COLORS = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#dc2626' };

export default function HistoryPage() {
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSev, setFilterSev] = useState('ALL');
  const [filterLang, setFilterLang] = useState('ALL');

  useEffect(() => {
    reviewAPI.history()
      .then(r => { setReviews(r.data); if (r.data.length) setSelected(r.data[0]); })
      .finally(() => setLoading(false));
  }, []);

  const languages = ['ALL', ...new Set(reviews.map(r => r.languageDetected).filter(Boolean))];

  const filtered = reviews.filter(r => {
    const matchSearch = search === '' || r.languageDetected?.toLowerCase().includes(search.toLowerCase());
    const matchSev = filterSev === 'ALL' || r.severityLevel === filterSev;
    const matchLang = filterLang === 'ALL' || r.languageDetected === filterLang;
    return matchSearch && matchSev && matchLang;
  });

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
    </div>
  );

  return (
    <div className="animate-in" style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">📋 Review History</h1>
        <p className="page-sub">Browse and search all your past AI code analyses</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input placeholder="🔍 Search by language..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: 220, padding: '8px 14px', fontSize: 13, borderRadius: 10 }} />
        <select value={filterSev} onChange={e => setFilterSev(e.target.value)}
          style={{ width: 140, padding: '8px 12px', fontSize: 13, borderRadius: 10 }}>
          <option value="ALL">All Severities</option>
          {['LOW','MEDIUM','HIGH','CRITICAL'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterLang} onChange={e => setFilterLang(e.target.value)}
          style={{ width: 140, padding: '8px 12px', fontSize: 13, borderRadius: 10 }}>
          {languages.map(l => <option key={l} value={l}>{l === 'ALL' ? 'All Languages' : l}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13 }}>
          <span>{filtered.length} of {reviews.length} reviews</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.5 }}>📭</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>No reviews yet</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Start by submitting code on the AI Review page</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, flex: 1, minHeight: 0 }}>
          {/* List */}
          <div className="card" style={{ padding: 0, overflow: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 24, color: 'var(--muted)', textAlign: 'center', fontSize: 13 }}>No matches found</div>
            ) : filtered.map((r, idx) => (
              <div key={r.id} onClick={() => setSelected(r)}
                style={{
                  padding: '14px 16px', cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  background: selected?.id === r.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                  borderLeft: `3px solid ${selected?.id === r.id ? '#818cf8' : 'transparent'}`,
                  transition: 'all 0.15s', animation: `fadeIn 0.3s ease ${idx * 0.05}s both`,
                }}
                onMouseOver={e => { if (selected?.id !== r.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseOut={e => { if (selected?.id !== r.id) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEV_COLORS[r.severityLevel] || '#64748b', boxShadow: `0 0 6px ${SEV_COLORS[r.severityLevel] || '#64748b'}` }} />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{r.languageDetected}</span>
                  </div>
                  <span className={`badge badge-${r.severityLevel?.toLowerCase()}`}>{r.severityLevel}</span>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 8 }}>
                  {new Date(r.createdAt).toLocaleString()}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[['Q', r.qualityScore, '#818cf8'], ['S', r.securityScore, '#22d3ee'], ['P', r.performanceScore, '#f59e0b']].map(([l, v, c]) => (
                    <div key={l} style={{ flex: 1, background: `${c}10`, border: `1px solid ${c}20`, borderRadius: 6, padding: '3px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{l}</div>
                      <div style={{ fontWeight: 700, color: c, fontSize: 12 }}>{v}%</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="card" style={{ overflow: 'auto' }}>
            {selected ? (
              <div className="animate-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{selected.languageDetected} Review</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(selected.createdAt).toLocaleString()}</div>
                  </div>
                  <span className={`badge badge-${selected.severityLevel?.toLowerCase()}`}>{selected.severityLevel}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  {[['Quality', selected.qualityScore, '#818cf8'], ['Security', selected.securityScore, '#22d3ee'], ['Performance', selected.performanceScore, '#f59e0b']].map(([l, v, c]) => (
                    <div key={l} style={{ flex: 1, background: `${c}10`, border: `1px solid ${c}20`, borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}%</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{selected.reviewResult}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 40 }}>👈</div>
                <div>Select a review to see details</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
