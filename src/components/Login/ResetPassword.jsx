import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";
import Header from "../General/Header";

const ResetPassword = () => {
  const VITE_BASE_API =
    import.meta.env.VITE_BASE_API || "http://localhost:3000/api";
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validate token when component mounts
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setError("Invalid or missing reset token");
        return;
      }

      try {
        await axios.get(`${VITE_BASE_API}/reset-password/validate/${token}`);
        // If we get here, token is valid
      } catch (err) {
        console.error("Token validation error:", err);
        setIsValidToken(false);
        setError("This password reset link is invalid or has expired");
      }
    };

    validateToken();
  }, [token, VITE_BASE_API]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await axios.post(`${VITE_BASE_API}/reset-password`, {
        token,
        newPassword: formData.password,
      });

      setSuccess(true);

      // After 3 seconds, redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while resetting your password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return (
      <>
        <Header />
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg border-t-4 border-red-500">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>

          <h2 className="text-center mt-6 text-2xl font-bold text-gray-800">
            Invalid Reset Link
          </h2>

          <p className="text-center mt-4 text-gray-600">
            {error || "This password reset link is invalid or has expired."}
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/forgot-password"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Header />
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg border-t-4 border-green-500">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h2 className="text-center mt-6 text-2xl font-bold text-gray-800">
            Password Reset Successful!
          </h2>

          <p className="text-center mt-4 text-gray-600">
            Your password has been successfully reset. You will be redirected to
            the login page shortly.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg border-t-4 border-indigo-500">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Reset Your Password
        </h2>

        <p className="text-gray-600 mb-6">
          Please enter your new password below.
        </p>

        {error && (
          <div className="mb-4 p-3 flex items-start bg-red-50 border border-red-200 text-red-700 rounded">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-indigo-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="New password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-indigo-500" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
