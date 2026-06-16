import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await signup(form); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', right: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12, filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.5))' }}>⬡</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>CodeReviewer</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Start reviewing code with AI today</p>
        </div>

        <div className="card" style={{ width: 420, padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Create Account</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Join AI CodeReviewer — free forever</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[['text','Username','username','👤'],['email','Email','email','📧'],['password','Password','password','🔒']].map(([type, label, field, icon]) => (
              <div key={field}>
                <label style={{ fontSize: 13, color: 'var(--muted2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>{icon} {label}</label>
                <input type={type} placeholder={label} value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required />
              </div>
            ))}
            {error && <div className="error">⚠ {error}</div>}
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 4, padding: '11px', fontSize: 15 }} disabled={loading}>
              {loading ? '⟳ Creating account…' : '🚀 Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 24, fontSize: 13 }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
