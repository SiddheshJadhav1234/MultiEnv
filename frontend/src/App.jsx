import { useState, useEffect } from 'react'
import './App.css'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_VERSION = '1.6.0';

const ENV_META = {
  production:  { label: 'PRODUCTION',  color: '#ef4444', cls: 'env-red'    },
  staging:     { label: 'STAGING',     color: '#f59e0b', cls: 'env-yellow' },
  testing:     { label: 'TESTING',     color: '#17a2b8', cls: 'env-blue'   },
  development: { label: 'DEVELOPMENT', color: '#10b981', cls: 'env-green'  },
};
const env = ENV_META[NODE_ENV] || ENV_META.development;

function App() {
  const [health, setHealth]   = useState(null);
  const [users, setUsers]     = useState([]);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { fetchHealth(); fetchUsers(); }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      setHealth(await res.json());
    } catch (e) { console.error('Health check failed:', e); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      setUsers(await res.json());
    } catch (e) { console.error('Fetch users failed:', e); }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      setUsers([...users, await res.json()]);
      setName(''); setEmail('');
    } catch (e) { console.error('Add user failed:', e); }
  };

  return (
    <div className="App">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-name">StackSphere</span>
            <span className="brand-tag">by Siddhesh & Vivek</span>
          </div>

          <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <li><a href="#health" onClick={() => setMenuOpen(false)}>Health</a></li>
            <li><a href="#users" onClick={() => setMenuOpen(false)}>Users</a></li>
            <li>
              <span className="nav-env-badge" style={{ background: env.color }}>
                {env.label}
              </span>
            </li>
          </ul>

          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── HERO HEADER ── */}
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-badge" style={{ borderColor: env.color, color: env.color }}>
            <span className="hero-dot" style={{ background: env.color }} />
            {env.label} · v{APP_VERSION}
          </div>
          <h1 className="hero-title">StackSphere</h1>
          <p className="hero-subtitle">
            Full-stack MERN multi-environment platform — dev, test, staging & production, all from one codebase.
          </p>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">

        {/* Health Card */}
        <section id="health" className="glass-card">
          <h2 className="card-title">System Health</h2>
          {health ? (
            <div className="health-grid">
              <div className="health-item">
                <span className="label">Status</span>
                <span className={`value ${health.status === 'OK' ? 'status-ok' : ''}`}>{health.status}</span>
              </div>
              <div className="health-item">
                <span className="label">Database</span>
                <span className="value">{health.database}</span>
              </div>
              <div className="health-item full-width">
                <span className="label">API Endpoint</span>
                <span className="value api-url">{API_BASE_URL}</span>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-tertiary)' }}>Checking…</p>
          )}
        </section>

        {/* Add User Card */}
        <section className="glass-card user-form">
          <h2 className="card-title">Add User</h2>
          <form onSubmit={addUser}>
            <div className="form-group">
              <input className="input-field" type="text" placeholder="Full Name"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <input className="input-field" type="email" placeholder="Email Address"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button className="btn-submit" type="submit">Add User</button>
          </form>
        </section>

        {/* Users List Card */}
        <section id="users" className="glass-card">
          <div className="users-header">
            <h2 className="card-title" style={{ marginBottom: 0 }}>Users</h2>
            <span className="user-count">{users.length}</span>
          </div>
          <div className="users-list">
            {users.length === 0 ? (
              <p className="empty-state">No users yet — add one above.</p>
            ) : users.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-avatar">{user.name?.[0]?.toUpperCase() ?? '?'}</div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-name">StackSphere</span>
          </div>
          <p className="footer-desc">
            A production-ready MERN multi-environment CI/CD platform.
          </p>
          <div className="footer-meta">
            <span>v{APP_VERSION}</span>
            <span className="footer-dot">·</span>
            <span style={{ color: env.color }}>{env.label}</span>
            <span className="footer-dot">·</span>
            <span>Built by <strong>Siddhesh Jadhav &amp; Vivek Jangam</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App
