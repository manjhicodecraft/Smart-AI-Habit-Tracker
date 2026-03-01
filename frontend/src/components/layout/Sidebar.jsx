import React, { useState, useEffect } from 'react';
import { Home, BarChart3, CheckSquare, Settings, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import './Sidebar.css';

const Sidebar = ({ currentPage }) => {
  const [expandedHabits, setExpandedHabits] = useState(false);
  const { logout } = useUser();

  // Determine active section based on current page
  const getActiveSection = () => {
    if (currentPage === 'dashboard') return 'dashboard';
    if (currentPage === 'analytics') return 'analytics';
    if (currentPage === 'settings') return 'settings';
    if (currentPage.startsWith('habits')) {
      return currentPage;
    }
    return 'dashboard';
  };

  // Effect to expand habits menu when on habits page
  useEffect(() => {
    if (currentPage.startsWith('habits')) {
      setExpandedHabits(true);
    }
  }, [currentPage]);

  const activeSection = getActiveSection();

  const navigateTo = (section) => {
    window.location.hash = `#${section}`;
  };

  const toggleHabits = () => {
    setExpandedHabits(!expandedHabits);
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '#auth';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          <span className="title-smart">Smart</span>
          <span className="title-habit">Habit</span>
          <span className="title-tracker">Tracker</span>
        </h2>
      </div>
      
      <nav className="nav-menu">
        <ul className="nav-list">
          {/* Main Navigation */}
          <li className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}>
            <button 
              className="nav-link"
              onClick={() => navigateTo('dashboard')}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </button>
          </li>
          
          <li className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}>
            <button 
              className="nav-link"
              onClick={() => navigateTo('analytics')}
            >
              <BarChart3 size={20} />
              <span>Analytics</span>
            </button>
          </li>
          
          <li className={`nav-item ${activeSection.startsWith('habits') ? 'active has-submenu' : ''}`}>
            <button 
              className="nav-link"
              onClick={toggleHabits}
            >
              <CheckSquare size={20} />
              <span>Habits</span>
              {expandedHabits ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {expandedHabits && (
              <ul className="sub-nav-list">
                <li className={`sub-nav-item ${activeSection === 'habits/technical' ? 'active' : ''}`}>
                  <button 
                    className="sub-nav-link"
                    onClick={() => navigateTo('habits/technical')}
                  >
                    Technical habits
                  </button>
                </li>
                <li className={`sub-nav-item ${activeSection === 'habits/non-technical' ? 'active' : ''}`}>
                  <button 
                    className="sub-nav-link"
                    onClick={() => navigateTo('habits/non-technical')}
                  >
                    Non-Technical habits
                  </button>
                </li>
                <li className={`sub-nav-item ${activeSection === 'habits/physical' ? 'active' : ''}`}>
                  <button 
                    className="sub-nav-link"
                    onClick={() => navigateTo('habits/physical')}
                  >
                    Physical habits
                  </button>
                </li>
                <li className={`sub-nav-item ${activeSection === 'habits/non-physical' ? 'active' : ''}`}>
                  <button 
                    className="sub-nav-link"
                    onClick={() => navigateTo('habits/non-physical')}
                  >
                    Non-Physical habits
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Divider and Additional Options at Bottom */}
        <div className="nav-divider"></div>
        
        <ul className="nav-list bottom-nav">
          <li className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}>
            <button 
              className="nav-link"
              onClick={() => navigateTo('settings')}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </li>
          
          <li className="nav-item">
            <button 
              className="nav-link logout-link"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;