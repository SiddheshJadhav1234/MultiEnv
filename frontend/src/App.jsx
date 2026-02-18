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

  return (
    <div className="App">
      <h1>MERN Multi-Environment App</h1>
      
      <div className="env-badge" style={{
        background: NODE_ENV === 'production' ? '#dc3545' : 
                   NODE_ENV === 'staging' ? '#ffc107' : 
                   NODE_ENV === 'testing' ? '#17a2b8' : '#28a745',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        margin: '20px 0'
      }}>
        🚀 Environment: {NODE_ENV?.toUpperCase() || 'UNKNOWN'}
      </div>

      {health && (
        <div className="health-status" style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          color: '#000'
        }}>
          <h3>System Health</h3>
          <p>Status: {health.status}</p>
          <p>Database: {health.database}</p>
          <p>API: {API_BASE_URL}</p>
        </div>
      )}

      <div className="user-form" style={{ marginBottom: '30px' }}>
        <h3>Add User</h3>
        <form onSubmit={addUser}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ margin: '5px', padding: '8px' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ margin: '5px', padding: '8px' }}
          />
          <button type="submit" style={{ margin: '5px', padding: '8px 20px' }}>
            Add User
          </button>
        </form>
      </div>

      <div className="users-list">
        <h3>Users ({users.length})</h3>
        {users.map((user) => (
          <div key={user._id} style={{
            background: '#f8f9fa',
            padding: '10px',
            margin: '5px 0',
            borderRadius: '5px',
            color: '#000'
          }}>
            <strong>{user.name}</strong> - {user.email}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
