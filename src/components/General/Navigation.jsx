import React from 'react';

const Navigation = ({ isAuthenticated, onLogout }) => {
  // Use regular anchor tags instead of React Router's Link
  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <a href="/">Daily Quotes</a>
      </div>
      
      <div className="nav-links">
        <a href="/" className="nav-link">Home</a>
        
        {isAuthenticated ? (
          <>
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/preferences" className="nav-link">
              <i className="fas fa-cog"></i> Preferences
            </a>
            <button onClick={onLogout} className="nav-link logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="nav-link">Login</a>
            <a href="/signup" className="nav-link signup-btn">Sign Up</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 