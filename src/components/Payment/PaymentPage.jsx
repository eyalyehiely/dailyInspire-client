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

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("none");
  const [isNewUser, setIsNewUser] = useState(false);
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [checkoutJsLoaded, setCheckoutJsLoaded] = useState(false);

  // Get user data from location state (passed from registration)
  const userData = location.state?.userData;

  useEffect(() => {
    // Set isNewUser based on whether we came directly from registration
    setIsNewUser(!!userData && location.state?.from === "register");

    // If no auth token, redirect to register
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/register");
      return;
    }

    // Load Paddle checkout.js
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      console.log("Paddle checkout.js loaded");
      // Initialize Paddle with the client token
      const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
      if (clientToken) {
        window.Paddle.Environment.set("live");
        window.Paddle.Setup({
          token: clientToken,
          environment: "live",
          checkoutFrontEndBase: import.meta.env
            .VITE_PADDLE_CHECKOUT_FRONTEND_BASE,
          checkoutBackendBase: import.meta.env.VITE_PADDLE_CHECKOUT_URL,
          eventCallback: (data) => {
            console.log("Paddle event:", data);
          },
        });
        setCheckoutJsLoaded(true);
      } else {
        console.error("Missing Paddle client token");
        setError(
          "Payment system configuration is missing. Please try again later."
        );
      }
    };
    script.onerror = () => {
      console.error("Failed to load Paddle checkout.js");
      setError("Failed to load payment system. Please try again later.");
    };
    document.body.appendChild(script);

    // Fetch checkout info
    const fetchCheckoutInfo = async () => {
      try {
        const response = await axios.get("/api/payments/checkout-info", {
          headers: { "x-auth-token": token },
        });

        console.log("Checkout info response:", response.data);

        if (response.data.isPaid) {
          console.log("User already has premium access");
          navigate("/dashboard");
          return;
        }

        setUserId(response.data.userId);
        setProductId(response.data.productId);
        setSubscriptionStatus(response.data.subscriptionStatus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching checkout info:", error);
        setError("Failed to load payment information");
        setLoading(false);
      }
    };

    fetchCheckoutInfo();

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [userData, navigate, location.state]);

  const handleProceedToPayment = () => {
    try {
      if (!window.Paddle) {
        setError("Payment system not ready. Please try again.");
        return;
      }

      // Get client token from environment variables
      const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
      const productId = import.meta.env.VITE_PADDLE_PRODUCT_ID;

      if (!clientToken || !productId) {
        setError(
          "Payment system configuration is missing. Please try again later."
        );
        return;
      }

      // Initialize Paddle checkout
      window.Paddle.Checkout.open({
        items: [
          {
            priceId: productId,
            quantity: 1,
          },
        ],
        customData: {
          userId: userId,
        },
        success: (data) => {
          console.log("Checkout successful:", data);
          navigate("/payment-success");
        },
        close: () => {
          console.log("Checkout closed");
        },
        error: (error) => {
          console.error("Checkout error:", error);
          setError("Payment failed. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Unable to process payment. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">Loading payment information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Upgrade to Premium
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Get access to all premium features and unlimited daily quotes.
                </p>
              </div>
              <div className="mt-5">
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Premium Features
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Unlimited daily quotes</li>
                          <li>Custom quote preferences</li>
                          <li>Priority support</li>
                          <li>Ad-free experience</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {error && (
                <div className="mt-5">
                  <div className="rounded-md bg-red-50 p-4">
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
                </div>
              )}
              <div className="mt-5">
                <button
                  onClick={handleProceedToPayment}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Payment
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                By proceeding, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
