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

        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Verify the token
        const response = await axios.get("/api/auth/verify", {
          headers: {
            "x-auth-token": token,
          },
        });

        // Check if verification was successful and registration is complete
        if (response.data.isValid) {
          setIsAuthenticated(true);
          setRegistrationComplete(true);
        } else {
          // Token is invalid
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        }

        setLoading(false);
      } catch (error) {
        // Handle different types of errors
        if (
          error.response &&
          error.response.status === 403 &&
          error.response.data.registrationStatus === "incomplete"
        ) {
          // Registration is incomplete, user needs to subscribe
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
