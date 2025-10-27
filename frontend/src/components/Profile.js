import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

function Profile({ token, user, setUser, onLogout }) {
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          fullName: response.data.fullName || '',
          bio: response.data.bio || '',
          avatar: response.data.avatar || ''
        });
      } catch (err) {
        setError('Failed to load profile');
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.put('/api/user/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>NodeReact Portal</h2>
        </div>
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/profile" className="nav-link active">Profile</Link>
          <button onClick={onLogout} className="btn btn-logout">Logout</button>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="avatar-display">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.username?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div className="avatar-info">
              <h2>{user?.username}</h2>
              <p>{user?.email}</p>
            </div>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar">Avatar URL</label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <Link to="/dashboard" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>

        <div className="profile-info-card">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
