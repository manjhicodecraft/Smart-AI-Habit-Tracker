import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import './Settings.css';

const Settings = () => {
  const { currentUser, login } = useUser();
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    newPassword: ''
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user profile
    login({
      ...currentUser,
      name: profileData.name,
      email: profileData.email
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Settings</h2>
        
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={profileData.newPassword}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>
          
          <button type="submit" className="save-button">
            Save Changes
          </button>
          
          {saved && (
            <div className="success-message">
              Profile updated successfully!
            </div>
          )}
        </form>
        
        <div className="account-info">
          <h3>Account Information</h3>
          <p><strong>User ID:</strong> {currentUser?.id}</p>
          <p><strong>Login Time:</strong> {currentUser?.loginTime ? new Date(currentUser.loginTime).toLocaleString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;