import React from 'react';
import { Home, BarChart3, CheckSquare, Settings, LogOut, Plus, Menu, X } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import './MobileNavigation.css';

const MobileNavigation = ({ currentPage, isOpen, onClose }) => {
  const { logout } = useUser();

  const getActiveSection = () => {
    if (currentPage === 'dashboard') return 'dashboard';
    if (currentPage === 'analytics') return 'analytics';
    if (currentPage === 'settings') return 'settings';
    if (currentPage.startsWith('habits')) return 'habits';
    return 'dashboard';
  };

  const activeSection = getActiveSection();

  const navigateTo = (section) => {
    window.location.hash = `#${section}`;
    onClose();
  };

  const handleAddHabit = () => {
    window.location.hash = '#add-habit';
    onClose();
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '#auth';
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="mobile-nav-overlay" onClick={onClose}></div>
      )}
      
      {/* Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <div className="nav-items-container">
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigateTo('dashboard')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => navigateTo('analytics')}
          >
            <BarChart3 size={20} />
            <span>Stats</span>
          </button>
          
          <button 
            className="nav-item add-habit-trigger"
            onClick={handleAddHabit}
          >
            <Plus size={24} />
            <span>Add</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'habits' ? 'active' : ''}`}
            onClick={() => navigateTo('habits')}
          >
            <CheckSquare size={20} />
            <span>Habits</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => navigateTo('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu (when overlay is clicked) */}
      {isOpen && (
        <div className="mobile-full-menu">
          <div className="menu-header">
            <h2>Menu</h2>
            <button className="close-menu" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          <div className="menu-content">
            <div className="menu-section">
              <h3>Main Navigation</h3>
              <button 
                className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                onClick={() => navigateTo('dashboard')}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </button>
              
              <button 
                className={`menu-item ${activeSection === 'analytics' ? 'active' : ''}`}
                onClick={() => navigateTo('analytics')}
              >
                <BarChart3 size={20} />
                <span>Analytics</span>
              </button>
              
              <button 
                className={`menu-item ${activeSection === 'habits' ? 'active' : ''}`}
                onClick={() => navigateTo('habits')}
              >
                <CheckSquare size={20} />
                <span>All Habits</span>
              </button>
            </div>
            
            <div className="menu-section">
              <h3>Quick Actions</h3>
              <button 
                className="menu-item"
                onClick={handleAddHabit}
              >
                <Plus size={20} />
                <span>Add New Habit</span>
              </button>
            </div>
            
            <div className="menu-section">
              <h3>Account</h3>
              <button 
                className={`menu-item ${activeSection === 'settings' ? 'active' : ''}`}
                onClick={() => navigateTo('settings')}
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
              
              <button 
                className="menu-item logout-item"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;