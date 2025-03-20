import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("authToken");
    const userDataString = localStorage.getItem("userData");

    if (token && userDataString) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userDataString));
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);

      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));

      setIsAuthenticated(true);
      setUser(user);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
