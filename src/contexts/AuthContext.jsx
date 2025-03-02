import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on page load
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      try {
        const tokens = JSON.parse(storedTokens);
        setUser(tokens.user || { isLoggedIn: true });
      } catch (e) {
        console.error("Error parsing stored tokens:", e);
        localStorage.removeItem('authTokens');
      }
    }
    setLoading(false);
  }, []);

  const login = async (formData) => {
    // Your login logic here
    // On success: setUser(userData)
  };

  const logout = () => {
    localStorage.removeItem('authTokens');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 