import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import './Layout.css';

const Layout = ({ children, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Desktop/Tablet Sidebar */}
      {!isMobile && <Sidebar currentPage={currentPage} />}
      
      {/* Main Content Area */}
      <div className={`main-content ${isMobile ? 'mobile-layout' : ''}`}>
        <Header 
          currentPage={currentPage} 
          isMobile={isMobile}
          isMenuOpen={isMobileMenuOpen}
          onMenuToggle={toggleMobileMenu}
        />
        <div className="content-wrapper">
          {children}
        </div>
        
        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <MobileNavigation 
            currentPage={currentPage}
            isOpen={isMobileMenuOpen}
            onClose={closeMobileMenu}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;