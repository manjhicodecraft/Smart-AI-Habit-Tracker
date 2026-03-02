import React, { useState, useEffect } from 'react';
import { UserProvider } from './contexts/UserContext';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import AddHabit from './pages/AddHabit';
import Analytics from './pages/Analytics';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import Layout from './components/layout/Layout';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    setIsLoggedIn(!!storedUser);

    // Handle hash navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const page = hash.replace('/', '');
        setCurrentPage(page);
      } else {
        // If no hash, redirect to auth if not logged in
        if (!storedUser) {
          setCurrentPage('auth');
        } else {
          setCurrentPage('dashboard');
        }
      }
    };

    // Set initial page based on hash and login status
    if (!storedUser) {
      setCurrentPage('auth');
    } else {
      handleHashChange();
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <Auth />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'habits':
      case 'habits/technical':
      case 'habits/non-technical':
      case 'habits/physical':
      case 'habits/non-physical':
        return <Habits />;
      case 'add-habit':
        return <AddHabit />;
      default:
        return <Auth />;
    }
  };

  const storedUser = localStorage.getItem('currentUser');
  const isLoggedInUser = !!storedUser;

  return (
    <UserProvider>
      {isLoggedInUser ? (
        <Layout currentPage={currentPage}>
          {renderPage()}
        </Layout>
      ) : (
        renderPage()
      )}
    </UserProvider>
  );
}

export default App;