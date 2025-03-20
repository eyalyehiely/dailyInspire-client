import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Home, AlertCircle } from "lucide-react";
import Header from "../General/Header";
import axios from "axios";

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("active");

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/payments/status", {
          headers: {
            "x-auth-token": token,
          },
        });

        setSubscriptionStatus(response.data.subscriptionStatus || "active");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching subscription status:", err);
        setError("Unable to load subscription information.");
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Loading subscription details...
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg border-t-4 border-red-500">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-center mt-4 text-xl font-bold text-gray-800">
            Error
          </h2>
          <p className="text-center mt-2 text-gray-600">{error}</p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </>
    );
  }

  const renderStatusMessage = () => {
    switch (subscriptionStatus) {
      case "active":
        return (
          <>
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-center mt-6 text-2xl font-bold text-gray-800">
              All Set!
            </h2>
            <p className="text-center mt-4 text-gray-600">
              Thank you for subscribing to DailyInspire Premium! Your
              subscription is active.
            </p>
          </>
        );
      case "cancelled":
        return (
          <>
            <div className="flex justify-center">
              <AlertCircle className="h-16 w-16 text-yellow-500" />
            </div>
            <h2 className="text-center mt-6 text-2xl font-bold text-gray-800">
              Subscription Cancelled
            </h2>
            <p className="text-center mt-4 text-gray-600">
              Your subscription has been cancelled but will remain active until
              the end of the current billing period.
            </p>
          </>
        );
      case "paused":
        return (
          <>
            <div className="flex justify-center">
              <AlertCircle className="h-16 w-16 text-blue-500" />
            </div>
            <h2 className="text-center mt-6 text-2xl font-bold text-gray-800">
              Subscription Paused
            </h2>
            <p className="text-center mt-4 text-gray-600">
              Your subscription is currently paused. You can resume it anytime
              from your account settings.
            </p>
          </>
        );
      default:
        return (
          <>
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-center mt-6 text-2xl font-bold text-gray-800">
              Thank You!
            </h2>
            <p className="text-center mt-4 text-gray-600">
              Your payment has been processed.
            </p>
          </>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-xl border-t-4 border-green-500">
        {renderStatusMessage()}

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">What's Next?</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1 mr-2"></span>
              <span>
                You'll receive your daily inspirational quotes at your selected
                time.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1 mr-2"></span>
              <span>
                You can adjust your preferences anytime from your account
                settings.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1 mr-2"></span>
              <span>
                Your subscription will automatically renew each month, and you
                can cancel at any time.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
