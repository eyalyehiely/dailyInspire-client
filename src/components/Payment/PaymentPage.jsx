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

    // Add a small delay to ensure token is stored
    const initializePayment = async () => {
      // If no auth token, redirect to register
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found, redirecting to register");
        navigate("/register");
        return;
      }

      // Load Paddle checkout.js
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;

      // Create a promise to handle script loading
      const scriptLoadPromise = new Promise((resolve, reject) => {
        script.onload = () => {
          console.log("Paddle checkout.js loaded");
          resolve();
        };
        script.onerror = (error) => {
          console.error("Failed to load Paddle checkout.js:", error);
          reject(error);
        };
      });

      // Remove any existing Paddle script
      const existingScript = document.querySelector('script[src*="paddle.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }

      // Add the script to the document
      document.body.appendChild(script);

      // Wait for script to load before initializing
      scriptLoadPromise
        .then(() => {
          // Initialize Paddle with the client token
          const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
          const priceId = import.meta.env.VITE_PADDLE_PRICE_ID;

          console.log("Initializing Paddle with:", {
            clientToken: clientToken ? "present" : "missing",
            priceId: priceId ? "present" : "missing",
          });

          if (!clientToken || !priceId) {
            console.error("Missing required configuration:", {
              clientToken: !!clientToken,
              priceId: !!priceId,
            });
            setError(
              "Payment system configuration is missing. Please try again later."
            );
            return;
          }

          try {
            // Wait for Paddle to be fully loaded
            if (typeof window.Paddle === "undefined") {
              throw new Error("Paddle is not loaded yet");
            }

            // Initialize Paddle with minimal configuration
            window.Paddle.Setup({
              token: clientToken,
              environment: "live",
              checkout: {
                theme: "light",
                locale: "en",
                successUrl: `${window.location.origin}/payment-success`,
                closeOnSuccess: true,
              },
            });

            // Verify Paddle is properly initialized
            if (typeof window.Paddle.Checkout === "undefined") {
              throw new Error("Paddle Checkout not properly initialized");
            }

            console.log("Paddle initialized successfully");
            setCheckoutJsLoaded(true);
          } catch (error) {
            console.error("Error initializing Paddle:", error);
            setError(
              `Failed to initialize payment system: ${
                error.message || "Unknown error"
              }`
            );
          }
        })
        .catch((error) => {
          console.error("Failed to load Paddle script:", error);
          setError("Failed to load payment system. Please try again later.");
        });

      // Fetch checkout info
      try {
        console.log("Fetching checkout info with token:", token);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/payments/checkout-info`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

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
        if (error.response?.status === 401) {
          console.log("Token is invalid or expired, redirecting to register");
          localStorage.removeItem("authToken");
          navigate("/register");
        } else {
          setError("Failed to load payment information");
        }
        setLoading(false);
      }
    };

    // Add a small delay before initializing
    const timer = setTimeout(initializePayment, 500);

    return () => {
      clearTimeout(timer);
      const script = document.querySelector('script[src*="paddle.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [userData, navigate, location.state]);

  const handleProceedToPayment = () => {
    try {
      // Check if Paddle is loaded and initialized
      if (typeof window.Paddle === "undefined") {
        console.error("Paddle is not loaded");
        setError("Payment system not ready. Please try again.");
        return;
      }

      if (!checkoutJsLoaded) {
        console.error("Checkout JS not loaded yet");
        setError(
          "Payment system is still initializing. Please wait and try again."
        );
        return;
      }

      if (!userId) {
        console.error("Missing userId");
        setError("User information is missing. Please try again.");
        return;
      }

      // Get client token from environment variables
      const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
      const priceId = import.meta.env.VITE_PADDLE_PRICE_ID;

      console.log("Starting payment process with:", {
        userId,
        priceId: priceId ? "present" : "missing",
        clientToken: clientToken ? "present" : "missing",
      });

      if (!clientToken || !priceId) {
        console.error("Missing configuration:", {
          clientToken: !!clientToken,
          priceId: !!priceId,
        });
        setError(
          "Payment system configuration is missing. Please try again later."
        );
        return;
      }

      // Initialize Paddle checkout with minimal configuration
      window.Paddle.Checkout.open({
        items: [
          {
            priceId: priceId,
            quantity: 1,
          },
        ],
        customData: {
          userId: userId,
        },
        theme: "light",
        locale: "en",
        successUrl: `${window.location.origin}/payment-success`,
        closeOnSuccess: true,
        success: (data) => {
          console.log("Checkout successful:", data);
          navigate("/payment-success");
        },
        close: () => {
          console.log("Checkout closed");
        },
        error: (error) => {
          console.error("Checkout error details:", error);
          setError(`Payment failed: ${error.message || "Unknown error"}`);
        },
      });
    } catch (error) {
      console.error("Detailed payment error:", error);
      setError(
        `Unable to process payment: ${error.message || "Unknown error"}`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">Loading payment information...</p>
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
              <div className="mt-5 flex justify-center">
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
