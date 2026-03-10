import { useState, useEffect } from 'react'
import './App.css'

const APP_VERSION = '1.7.0';
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

const ENV_META = {
  production:  { label: 'PRODUCTION',  color: '#ef4444', short: 'prod'    },
  staging:     { label: 'STAGING',     color: '#f59e0b', short: 'staging' },
  testing:     { label: 'TESTING',     color: '#17a2b8', short: 'test'    },
  development: { label: 'DEVELOPMENT', color: '#10b981', short: 'dev'     },
};
const env = ENV_META[NODE_ENV] || ENV_META.development;

const ENVIRONMENTS = [
  { key: 'dev',     label: 'Development', color: '#10b981', url: 'http://dev.localhost',     branch: 'dev',   desc: 'Active development & feature work' },
  { key: 'test',   label: 'Testing',     color: '#17a2b8', url: 'http://test.localhost',    branch: 'test',  desc: 'QA, integration & regression tests' },
  { key: 'stage',  label: 'Staging',     color: '#f59e0b', url: 'http://staging.localhost', branch: 'stage', desc: 'Pre-production mirror, final validation' },
  { key: 'prod',   label: 'Production',  color: '#ef4444', url: 'http://prod.localhost',    branch: 'prod',  desc: 'Live environment serving real traffic' },
];

const TECH_STACK = [
  { icon: '⚛️',  name: 'React 19',      role: 'Frontend UI'        },
  { icon: '⚡',  name: 'Vite 7',        role: 'Build Tool'         },
  { icon: '🟢',  name: 'Node.js',       role: 'Backend Runtime'    },
  { icon: '🚂',  name: 'Express',       role: 'REST API'           },
  { icon: '🍃',  name: 'MongoDB Atlas', role: 'Database'           },
  { icon: '🐳',  name: 'Docker',        role: 'Containerisation'   },
  { icon: '🔀',  name: 'GitHub Actions',role: 'CI/CD Pipeline'     },
  { icon: '🌐',  name: 'Nginx',         role: 'Reverse Proxy'      },
];

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <main className="main-content">

      {/* Purpose banner */}
      <section className="glass-card purpose-card">
        <div className="purpose-icon">🚀</div>
        <div>
          <h2 className="card-title" style={{ marginBottom: '0.4rem' }}>What is StackSphere?</h2>
          <p className="purpose-text">
            StackSphere is a <strong>live CI/CD pipeline demonstration</strong> built on a full-stack
            MERN architecture. Every code push to a Git branch automatically builds, containerises,
            and deploys to the matching environment — no manual steps required.
            This site itself is the artifact that travels through the pipeline.
          </p>
        </div>
      </section>

      {/* Pipeline flow */}
      <section className="glass-card">
        <h2 className="card-title">Deployment Pipeline</h2>
        <p className="section-sub">A commit merged to any branch triggers a full automated deploy to its environment.</p>
        <div className="pipeline">
          {ENVIRONMENTS.map((e, i) => (
            <>
              <div key={e.key} className="pipe-stage" style={{ '--env-color': e.color }}>
                <div className="pipe-branch">#{e.branch}</div>
                <div className="pipe-dot" style={{ background: e.color }} />
                <div className="pipe-label">{e.label}</div>
                <div className="pipe-desc">{e.desc}</div>
              </div>
              {i < ENVIRONMENTS.length - 1 && (
                <div key={`arrow-${i}`} className="pipe-arrow">→</div>
              )}
            </>
          ))}
        </div>
      </section>

      {/* Environment switcher */}
      <section className="glass-card">
        <h2 className="card-title">Switch Environment</h2>
        <p className="section-sub">Each environment runs isolated containers on the same host. Click to open.</p>
        <div className="env-grid">
          {ENVIRONMENTS.map(e => {
            const isCurrent = e.key === env.short || (e.key === 'prod' && NODE_ENV === 'production');
            return (
              <a
                key={e.key}
                href={e.url}
                className={`env-card ${isCurrent ? 'env-card-active' : ''}`}
                style={{ '--env-color': e.color }}
              >
                <div className="env-card-dot" style={{ background: e.color }} />
                <div className="env-card-label">{e.label}</div>
                <div className="env-card-url">{e.url}</div>
                <div className="env-card-desc">{e.desc}</div>
                {isCurrent && <span className="env-card-you">◀ You are here</span>}
              </a>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="glass-card">
        <h2 className="card-title">How It Works</h2>
        <ol className="steps-list">
          <li><strong>Push code</strong> to the <code>dev</code> branch on GitHub.</li>
          <li><strong>GitHub Actions</strong> triggers the CI/CD workflow automatically.</li>
          <li><strong>Tailscale VPN</strong> securely connects the runner to the local server.</li>
          <li><strong>SSH</strong> into the server and run <code>scripts/deploy.ps1</code>.</li>
          <li><strong>Docker Compose</strong> rebuilds and restarts only the changed profile's containers.</li>
          <li><strong>Nginx</strong> reloads its config — traffic is routed to the new containers instantly.</li>
          <li>Merge to <code>test</code> → <code>stage</code> → <code>prod</code> manually to promote releases.</li>
        </ol>
      </section>

      {/* Tech stack */}
      <section className="glass-card">
        <h2 className="card-title">Tech Stack</h2>
        <div className="tech-grid">
          {TECH_STACK.map(t => (
            <div key={t.name} className="tech-card">
              <span className="tech-icon">{t.icon}</span>
              <span className="tech-name">{t.name}</span>
              <span className="tech-role">{t.role}</span>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage() {
  const [health, setHealth] = useState(null);
  const [users, setUsers]   = useState([]);
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');

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
    <main className="main-content">

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
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
function App() {
  const [page, setPage]         = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };

  return (
    <div className="App">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <button className="navbar-brand" onClick={() => navigate('home')}>
            <span className="brand-icon">⚡</span>
            <span className="brand-name">StackSphere</span>
            <span className="brand-tag">CI/CD Demo</span>
          </button>

          <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <li>
              <button className={`nav-btn ${page === 'home' ? 'active' : ''}`}
                onClick={() => navigate('home')}>Home</button>
            </li>
            <li>
              <button className={`nav-btn ${page === 'dashboard' ? 'active' : ''}`}
                onClick={() => navigate('dashboard')}>Dashboard</button>
            </li>
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

      {/* HERO */}
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-badge" style={{ borderColor: env.color, color: env.color }}>
            <span className="hero-dot" style={{ background: env.color }} />
            {env.label} · v{APP_VERSION}
          </div>
          <h1 className="hero-title">StackSphere</h1>
          <p className="hero-subtitle">
            {page === 'home'
              ? 'A live MERN CI/CD pipeline demo — from code push to production in minutes.'
              : 'Live environment dashboard — health, API status & data for this deployment.'}
          </p>
        </div>
      </header>

      {page === 'home' ? <HomePage /> : <DashboardPage />}

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="navbar-brand" style={{ justifyContent: 'center' }}>
            <span className="brand-icon">⚡</span>
            <span className="brand-name">StackSphere</span>
          </div>
          <p className="footer-desc">A production-ready MERN multi-environment CI/CD platform.</p>
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
