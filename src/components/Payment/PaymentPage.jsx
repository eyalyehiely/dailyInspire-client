import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  Check,
  AlertCircle,
  UserPlus,
  RefreshCw,
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
          `${import.meta.env.VITE_BASE_API}/payments/verify-subscription`,
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">
              Checking subscription status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                Upgrade to Premium
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto text-center">
                <p>
                  Get access to all premium features and unlimited daily quotes.
                </p>
              </div>
              <div className="mt-5">
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Premium Features
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Unlimited daily quotes</li>
                          <li>Exclusive premium content</li>
                          <li>Priority support</li>
                          <li>Ad-free experience</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <SubscriptionButton
                  priceId={import.meta.env.VITE_PADDLE_PRICE_ID}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Subscribe Now
                </SubscriptionButton>
              </div>
              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
