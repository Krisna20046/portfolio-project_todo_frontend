// Layout.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../auth';

const Layout = ({ children, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Auto show sidebar when switching to desktop
      if (!mobile) setSidebarVisible(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
    },
    {
      path: '/projects',
      label: 'Proyek',
      icon: '📁',
    },
    {
      path: '/tasks',
      label: 'Tugas',
      icon: '✅',
    },
  ];

  if (currentUser?.role === 'admin') {
    menuItems.push({
      path: '/users',
      label: 'Pengguna',
      icon: '👥',
    });
  }

  return (
    <div className="app-container">
      {/* Mobile Sidebar Toggle */}
      {isMobile && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      {/* Sidebar */}
      <nav 
        className={`sidebar ${!sidebarVisible && isMobile ? 'mobile-hidden' : ''}`}
        style={!isMobile ? { transform: 'none' } : {}}
      >
        <div className="sidebar-header">
          <h2>TaskManager</h2>
          <p>Manajemen Tugas & Proyek</p>
          {currentUser && (
            <div style={{ marginTop: '15px', fontSize: '0.9rem', opacity: '0.9' }}>
              <strong>{currentUser.name}</strong>
              <br />
              <span style={{ fontSize: '0.8rem', opacity: '0.7' }}>
                {currentUser.role === 'admin' ? 'Administrator' : 'Member'}
              </span>
            </div>
          )}
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setSidebarVisible(false);
                }}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
          
          <li style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' }}>
            <button onClick={handleLogout}>
              <span className="icon">🚪</span>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content" style={!isMobile ? { marginLeft: '280px' } : {}}>
        {children}
      </main>

      {/* Mobile Overlay */}
      {sidebarVisible && isMobile && (
        <div 
          className="mobile-overlay" 
          onClick={() => setSidebarVisible(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default Layout;
