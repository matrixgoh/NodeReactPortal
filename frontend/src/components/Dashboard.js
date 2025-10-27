import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ token, user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>NodeReact Portal</h2>
        </div>
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link active">Dashboard</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <button onClick={onLogout} className="btn btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.username || 'User'}! 👋</h1>
          <p className="welcome-subtitle">Here's what's happening with your account</p>
        </div>

        {loading ? (
          <div className="loading">Loading dashboard...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{stats?.totalUsers || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-content">
                <h3>Your Username</h3>
                <p className="stat-value">{stats?.currentUser || user?.username}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🕐</div>
              <div className="stat-content">
                <h3>Last Login</h3>
                <p className="stat-value">
                  {stats?.loginTime ? new Date(stats.loginTime).toLocaleString() : 'Just now'}
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✉️</div>
              <div className="stat-content">
                <h3>Email</h3>
                <p className="stat-value">{user?.email || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/profile" className="action-card">
              <div className="action-icon">👤</div>
              <h3>Edit Profile</h3>
              <p>Update your personal information</p>
            </Link>

            <div className="action-card">
              <div className="action-icon">📊</div>
              <h3>View Analytics</h3>
              <p>See your account statistics</p>
            </div>

            <div className="action-card">
              <div className="action-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Manage your preferences</p>
            </div>

            <div className="action-card">
              <div className="action-icon">💬</div>
              <h3>Support</h3>
              <p>Get help and support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
