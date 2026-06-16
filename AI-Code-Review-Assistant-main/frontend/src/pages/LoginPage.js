import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../App';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(form); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed. Check credentials.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Theme toggle top-right */}
      <button onClick={toggle} title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: dark ? 'rgba(251,191,36,0.1)' : 'rgba(99,102,241,0.1)',
          border: `1px solid ${dark ? 'rgba(251,191,36,0.3)' : 'rgba(99,102,241,0.3)'}`,
          borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
          color: dark ? '#fbbf24' : '#6366f1',
          fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', zIndex: 10,
        }}>
        {dark ? '☀️ Light' : '🌙 Dark'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12, filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.5))' }}>⬡</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>CodeReviewer</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>AI-Powered Smart Code Analysis</p>
        </div>

        <div className="card" style={{ width: 400, padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>Sign in to your account</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Welcome back! Enter your credentials below</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--muted2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Username</label>
              <input type="text" placeholder="your_username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--muted2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            {error && <div className="error">⚠ {error}</div>}
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 4, padding: '11px', fontSize: 15 }} disabled={loading}>
              {loading ? '⟳ Signing in…' : '🔐 Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 24, fontSize: 13 }}>
            No account? <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Create one free →</Link>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 32, color: 'var(--muted)', fontSize: 12 }}>
          {['🤖 AI Analysis','🛡 Security Scan','⚡ Performance Check'].map(f => (
            <div key={f}>{f}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
