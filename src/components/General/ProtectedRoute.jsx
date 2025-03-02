import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  // Get auth data from localStorage
  const authTokensString = localStorage.getItem("authTokens");

  // Return to login if no auth data exists
  if (!authTokensString) {
    console.log("No auth tokens found");
    return <Navigate to="/login" />;
  }

  try {
    // Parse the JSON string to get the object
    const authTokens = JSON.parse(authTokensString);

    // Check if success is true and token exists
    if (!authTokens.success || !authTokens.token) {
      console.log("Invalid auth token structure");
      localStorage.removeItem("authTokens");
      return <Navigate to="/login" />;
    }

    // Extract the token
    const token = authTokens.token;

    // Decode and verify the token
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    if (decodedToken.exp < currentTime) {
      console.log("Token expired");
      localStorage.removeItem("authTokens");
      return <Navigate to="/login" />;
    }

    // Token is valid, allow access to protected route
    return <Outlet />;
  } catch (error) {
    console.error("Error processing token:", error);
    localStorage.removeItem("authTokens");
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
