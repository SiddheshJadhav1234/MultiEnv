import { useState, useEffect } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";
const NODE_ENV = import.meta.env.VITE_ENV;



function App() {
  const [health, setHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchHealth();
    fetchUsers();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      const data = await res.json();
      setHealth(data);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Fetch users failed:', error);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      setUsers([...users, data]);
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Add user failed:', error);
    }
  };

  const getEnvClass = () => {
    if (NODE_ENV === 'production') return 'env-prod';
    if (NODE_ENV === 'staging') return 'env-stage';
    if (NODE_ENV === 'testing') return 'env-test';
    return 'env-dev';
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1 className="title">MERN Multi-Environment</h1>
          <p className="subtitle">Professional Dashboard</p>
        </header>

        <div className={`env-badge glass-card ${getEnvClass()}`}>
          <span className="env-icon">🚀</span>
          <span className="env-text">{NODE_ENV?.toUpperCase() || 'UNKNOWN'}</span>
        </div>

        {health && (
          <div className="health-card glass-card">
            <h3 className="card-title">System Health</h3>
            <div className="health-grid">
              <div className="health-item">
                <span className="label">Status</span>
                <span className="value status-ok">{health.status}</span>
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
          </div>
        )}

        <div className="user-form glass-card">
          <h3 className="card-title">Add New User</h3>
          <form onSubmit={addUser}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-submit">
              <span>Add User</span>
            </button>
          </form>
        </div>

        <div className="users-section glass-card">
          <div className="users-header">
            <h3 className="card-title">Users</h3>
            <span className="user-count">{users.length}</span>
          </div>
          <div className="users-list">
            {users.length === 0 ? (
              <p className="empty-state">No users yet. Add one above!</p>
            ) : (
              users.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
