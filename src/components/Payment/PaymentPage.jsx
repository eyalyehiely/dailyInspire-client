import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  Check,
  AlertCircle,
  UserPlus,
  RefreshCw,
  Sparkles,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import Header from "../General/Header";
import axios from "axios";
import { SubscriptionButton } from "./SubscriptionButton";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Set isNewUser based on whether we came directly from registration
    setIsNewUser(!!location.state?.from === "register");

    // If no auth token, redirect to register
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No auth token found, redirecting to register");
      navigate("/register");
      return;
    }

    // Check subscription status
    const checkSubscriptionStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/payments/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        console.log("Subscription status:", response.data);

        if (response.data.success && response.data.isPay) {
          console.log(
            "User has active subscription, redirecting to preferences"
          );
          navigate("/preferences");
        } else {
          console.log("User needs to subscribe");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);

        if (error.response?.status === 401) {
          console.log("Token is invalid or expired, redirecting to register");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          if (isNewUser) {
            setError(
              "Registration completed but authentication failed. Please try registering again."
            );
          }
          navigate("/register");
        } else {
          setError("Failed to check subscription status. Please try again.");
        }
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [navigate, location.state, isNewUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin h-12 w-12 mx-auto text-blue-500" />
            <p className="mt-4 text-gray-600 text-lg">
              Checking subscription status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white rounded-full flex items-center justify-center shadow-lg">
      <Header />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 mt-4">
              Upgrade to DailyInspire Premium
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock the full potential of DailyInspire with our premium
              features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center justify-center">
            {/* Features Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.02] duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Premium Features
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Unlimited Daily Quotes
                    </h3>
                    <p className="text-gray-600">
                      Access our entire collection of inspiring quotes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Zap className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Exclusive Premium Content
                    </h3>
                    <p className="text-gray-600">
                      Get early access to new features and content
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Priority Support
                    </h3>
                    <p className="text-gray-600">
                      24/7 dedicated customer support
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Ad-free Experience
                    </h3>
                    <p className="text-gray-600">
                      Enjoy a clean, distraction-free interface
                    </p>
                  </div>
                </div>
              </div>
              <SubscriptionButton
                priceId={import.meta.env.VITE_PADDLE_PRICE_ID}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all hover:scale-[1.02] duration-200 shadow-lg mt-3"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Upgrade to Premium
              </SubscriptionButton>
            </div>
          </div>

          {error && (
            <div className="mt-8 rounded-xl bg-red-50 p-6 transform transition-all duration-300">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
