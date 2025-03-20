import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("Token from storage:", token ? "Found token" : "No token");

        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        console.log("Verifying token...");
        // Verify the token
        const VITE_BASE_API =
          import.meta.env.VITE_BASE_API || "http://localhost:3000/api";
        const response = await axios.get(`${VITE_BASE_API}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Token verification response:", response.data);

        // Check if verification was successful and registration is complete
        if (response.data.isValid) {
          console.log("Token is valid!");
          setIsAuthenticated(true);

          // Check if payment is required
          if (
            response.data.isPay === false ||
            response.data.registrationComplete === false
          ) {
            console.log("User needs to complete payment");
            setRegistrationComplete(false);
          } else {
            setRegistrationComplete(true);
          }
        } else {
          // Token is invalid
          console.log("Token is invalid!");
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        }

        setLoading(false);
      } catch (error) {
        console.error(
          "Authentication error details:",
          error.response?.data || error.message
        );

        // Handle different types of errors
        if (
          error.response &&
          error.response.status === 403 &&
          error.response.data.registrationStatus === "incomplete"
        ) {
          // Registration is incomplete, user needs to subscribe
          console.log("Registration incomplete, redirecting to payment");
          setIsAuthenticated(true);
          setRegistrationComplete(false);
          navigate("/payment");
        } else {
          // Other errors: token invalid, server error, etc.
          console.error("Authentication error:", error);
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

  if (loading) {
    // Loading state while verifying token
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but registration incomplete, redirect to payment
  if (!registrationComplete) {
    return <Navigate to="/payment" replace />;
  }

  // If authenticated and registration complete, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
