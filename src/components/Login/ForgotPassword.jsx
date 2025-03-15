import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";
import Header from "../General/Header";

const ForgotPassword = () => {
  const VITE_BASE_API =
    import.meta.env.VITE_BASE_API || "http://localhost:3000/api";
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await axios.post(`${VITE_BASE_API}/forgot-password`, {
        email: email.trim(),
      });

      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg border-t-4 border-green-500">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h2 className="text-center mt-6 text-2xl font-bold text-gray-800">
            Check Your Email
          </h2>

          <p className="text-center mt-4 text-gray-600">
            If an account exists with the email you provided, we've sent
            instructions to reset your password.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Login
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
          Enter your email address below and we'll send you instructions to
          reset your password.
        </p>

        {error && (
          <div className="mb-4 p-3 flex items-start bg-red-50 border border-red-200 text-red-700 rounded">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-indigo-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              {isSubmitting ? "Sending..." : "Send Reset Instructions"}
            </button>

            <Link
              to="/login"
              className="inline-flex items-center justify-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
