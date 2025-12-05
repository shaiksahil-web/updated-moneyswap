import React, { useEffect, useState } from 'react';
import api from '../api';
import './ProfilePage.css';

const ProfilePage = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const userId = user?.userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/api/users/${userId}`);
        setProfile(res.data.user);
      } catch (e) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setMessage('');
      const { name, phone } = profile;
      const res = await api.put(`/api/users/${userId}`, { name, phone });
      setProfile(res.data.user);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      setError('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card loading-card">
          <div className="spinner-large"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="profile-card error-card">
          <span className="error-icon-large">⚠️</span>
          <p>Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
          </div>
          <h2 className="profile-title">{profile.name || 'User Profile'}</h2>
        </div>

        <div className="rating-badge">
          <div className="stars">
            {'⭐'.repeat(Math.round(profile.rating || 0))}
            {'☆'.repeat(5 - Math.round(profile.rating || 0))}
          </div>
          <div className="rating-info">
            <span className="rating-number">{profile.rating || 0}</span>
            <span className="rating-count">({profile.ratingCount || 0} ratings)</span>
          </div>
        </div>

        <div className="profile-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={profile.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={!isEditing}
              className={`input-field ${!isEditing ? 'disabled' : ''}`}
              placeholder="Enter your name"
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={!isEditing}
              className={`input-field ${!isEditing ? 'disabled' : ''}`}
              placeholder="Enter your phone"
            />
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? (
                    <>
                      <span className="spinner"></span> Saving...
                    </>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {message && (
          <div className="success-message">
            <span className="success-icon">✓</span> {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
