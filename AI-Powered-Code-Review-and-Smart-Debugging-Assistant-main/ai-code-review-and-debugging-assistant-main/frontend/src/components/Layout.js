import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../App';

const navItems = [
  { to: '/', icon: '⊞', label: 'Dashboard', end: true },
  { to: '/review', icon: '⚡', label: 'AI Review' },
  { to: '/history', icon: '📋', label: 'History' },
  { to: '/analytics', icon: '📊', label: 'Analytics' },
];

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', padding: '8px 12px',
        background: dark ? 'rgba(251,191,36,0.08)' : 'rgba(99,102,241,0.08)',
        border: `1px solid ${dark ? 'rgba(251,191,36,0.2)' : 'rgba(99,102,241,0.2)'}`,
        borderRadius: 10, cursor: 'pointer',
        color: dark ? '#fbbf24' : '#6366f1',
        fontSize: 20, fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.25s', marginBottom: 8,
      }}
      onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
      onMouseOut={e => e.currentTarget.style.opacity = '1'}
    >
      {/* Toggle track */}
      <div style={{
        width: 36, height: 20, borderRadius: 10,
        background: dark ? 'rgba(251,191,36,0.2)' : 'rgba(99,102,241,0.2)',
        border: `1px solid ${dark ? 'rgba(251,191,36,0.4)' : 'rgba(99,102,241,0.4)'}`,
        position: 'relative', flexShrink: 0, transition: 'all 0.25s',
      }}>
        <div style={{
          position: 'absolute', top: 2,
          left: dark ? 18 : 2,
          width: 14, height: 14, borderRadius: '50%',
          background: dark ? '#fbbf24' : '#6366f1',
          transition: 'left 0.25s',
          boxShadow: dark ? '0 0 6px #fbbf24' : '0 0 6px #6366f1',
        }} />
      </div>
      <span style={{ fontSize: 26 }}>{dark ? '☀️' : '🌙'}</span>
      <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', top: '10%', left: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 240,
        background: dark ? 'rgba(10,13,26,0.95)' : 'rgba(255,255,255,0.95)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '0 0 16px 0', flexShrink: 0,
        transition: 'width 0.3s ease',
        backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 10,
        boxShadow: dark ? 'none' : '2px 0 20px rgba(99,102,241,0.06)',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 0' : '20px 20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⬡ CodeReviewer</div>
              <div style={{ fontSize: 18, color: 'var(--muted)', marginTop: 2 }}>AI-Powered Analysis</div>
            </div>
          )}
          {collapsed && <div style={{ fontSize: 30 }}>⬡</div>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 8px', color: 'var(--muted)', cursor: 'pointer', fontSize: 19, transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              title={collapsed ? item.label : undefined}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '12px 0' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 10, marginBottom: 4,
                color: isActive ? (dark ? '#fff' : '#4f46e5') : 'var(--muted)',
                background: isActive
                  ? (dark ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))' : 'rgba(99,102,241,0.08)')
                  : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 15px rgba(99,102,241,0.1)' : 'none',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s', textDecoration: 'none', fontSize: 20,
              })}>
              <span style={{ fontSize: 25 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', borderTop: '1px solid var(--border)' }}>
          {!collapsed && (
            <>
              {/* User info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '8px 10px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#fff', flexShrink: 0 }}>
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
                  <div style={{ fontSize: 18, color: 'var(--muted)' }}>{user?.role || 'USER'}</div>
                </div>
                <div className="glow-dot" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </div>

              {/* Theme toggle */}
              <ThemeToggle />
            </>
          )}

          {/* Logout */}
          <button onClick={handleLogout} style={{
            width: '100%', padding: collapsed ? '10px 0' : '8px 12px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, color: '#ef4444', cursor: 'pointer', fontSize: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
          }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
            🚪 {!collapsed && 'Sign out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '28px 32px', position: 'relative', zIndex: 1, background: 'var(--bg)' }}>
        <Outlet />
      </main>
    </div>
  );
}
