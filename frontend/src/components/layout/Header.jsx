import React, { useState } from 'react';
import { Plus, Bell, User, Menu } from 'lucide-react';
import SearchInput from '../SearchInput';
import { useUser } from '../../contexts/UserContext';
import './Header.css';

const Header = ({ currentPage = 'dashboard', isMobile = false, isMenuOpen = false, onMenuToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useUser();

  const handleAddHabit = () => {
    window.location.hash = '#add-habit';
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getGreetingName = () => {
    if (!currentUser) return 'User';
    return currentUser.name || currentUser.username || 'User';
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Left Section - Mobile Menu Button + Logo/Greeting */}
        <div className="header-left">
          {isMobile && (
            <button 
              className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          )}
          <div className="page-title">
            <h1 className="greeting-text">
              Hello, <span className="user-name">{getGreetingName()}</span>
            </h1>
          </div>
        </div>
        
        {/* Right Section - Search + Actions */}
        <div className="header-right">
          {/* Search Bar */}
          <div className="search-container">
            <SearchInput 
              placeholder="Search habits, analytics..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="header-actions">
            <button 
              className="action-button add-habit-btn"
              onClick={handleAddHabit}
              title="Add new habit"
              aria-label="Add new habit"
            >
              <Plus size={20} />
            </button>
            
            <button 
              className="action-button notification-btn"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            
            <button 
              className="action-button profile-btn"
              title="User profile"
              aria-label="User profile"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;