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
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [checkoutId, setCheckoutId] = useState("");
  const [checkoutJsLoaded, setCheckoutJsLoaded] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("none");
  const [isNewUser, setIsNewUser] = useState(false);
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [directCheckoutUrl, setDirectCheckoutUrl] = useState("");

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

    // Load the LemonSqueezy checkout.js script
    const script = document.createElement("script");
    script.src = "https://app.lemonsqueezy.com/js/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Lemon Squeezy checkout.js loaded");
      setCheckoutJsLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Lemon Squeezy checkout.js");
    };
    document.body.appendChild(script);

    // Fetch checkout info
    const fetchCheckoutInfo = async () => {
      try {
        setLoading(true);

        const response = await axios.get("/api/payments/checkout-info", {
          headers: {
            "x-auth-token": token,
          },
        });

        console.log("Checkout info response:", response.data);

        // Store product and variant IDs
        setProductId(response.data.productId || "471688");
        setVariantId(response.data.variantId || "730358");
        setDirectCheckoutUrl(response.data.directCheckoutUrl || "");

        // Store user ID explicitly and in localStorage as a backup
        if (response.data.userId) {
          console.log("Setting user ID for checkout:", response.data.userId);
          setUserId(response.data.userId);
          localStorage.setItem("userId", response.data.userId);
        }

        // Store subscription ID if available
        if (response.data.subscriptionId) {
          console.log("Storing subscription ID:", response.data.subscriptionId);
          localStorage.setItem("subscriptionId", response.data.subscriptionId);
        }

        // Check subscription status
        if (response.data.isPaid) {
          // If user already has an active paid subscription, go to success page
          navigate("/payment-success");
          return;
        }

        // If subscription is in another state, we might want to handle differently
        if (response.data.subscriptionStatus) {
          setSubscriptionStatus(response.data.subscriptionStatus);
        }

        setCheckoutUrl(response.data.checkoutUrl);
        setCheckoutId(response.data.checkoutId);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching checkout info:", err);
        setError("Unable to load payment information. Please try again later.");
        setLoading(false);
      }
    };

    fetchCheckoutInfo();

    return () => {
      // Clean up the script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [userData, navigate, location.state]);

  const handleProceedToPayment = () => {
    try {
      // Get the current user ID with clear logging for each check
      let currentUserId = null;

      // Try to get from state first
      if (userId) {
        console.log("Using user ID from state:", userId);
        currentUserId = userId;
      }
      // Then from userData (if coming from registration)
      else if (userData?.id) {
        console.log("Using user ID from registration flow:", userData.id);
        currentUserId = userData.id;
      }
      // Then from localStorage as fallback
      else if (localStorage.getItem("userId")) {
        console.log(
          "Using user ID from localStorage:",
          localStorage.getItem("userId")
        );
        currentUserId = localStorage.getItem("userId");
      }
      // Last resort fallback
      else {
        console.warn("No user ID found, cannot proceed with payment");
        setError(
          "Unable to identify your account. Please try logging in again."
        );
        return;
      }

      console.log("Final user ID for checkout:", currentUserId);

      // For 100% sure we have a variant ID
      const currentVariantId =
        variantId || "9e44dcc7-edab-43f0-b9a2-9d663d4af336";
      console.log("Using variant ID:", currentVariantId);

      // Store in local storage for potential webhook fallback
      localStorage.setItem("userId", currentUserId);

      // Use directCheckoutUrl if available from server
      if (directCheckoutUrl) {
        console.log(
          "Using server-provided direct checkout URL:",
          directCheckoutUrl
        );
        window.location.href = directCheckoutUrl;
        return;
      }

      // Build the URL with the correct format as fallback
      // Base URL must include the variant ID in the path
      const baseUrl = `https://dailyinspire.lemonsqueezy.com/buy/${currentVariantId}`;

      // Properly formatted query string with ? separator
      const finalUrl = `${baseUrl}?checkout[custom][user_id]=${encodeURIComponent(
        currentUserId
      )}&discount=0`;

      console.log("Final checkout URL:", finalUrl);

      // Log to server for debugging
      try {
        const token = localStorage.getItem("authToken");
        axios
          .post(
            "/api/payments/log-checkout",
            {
              checkoutUrl: finalUrl,
              userId: currentUserId,
            },
            {
              headers: {
                "x-auth-token": token,
              },
            }
          )
          .catch((err) => console.error("Error logging checkout:", err));
      } catch (e) {
        console.error("Error logging checkout URL:", e);
      }

      // Navigate directly to the checkout page
      window.location.href = finalUrl;
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Unable to process payment. Please try again later.");
    }
  };

  // Add function to check subscription status
  const handleCheckSubscription = async () => {
    try {
      setLoading(true);
      setError("");

      // Get subscription ID from state or prompt user
      let subscriptionId = localStorage.getItem("subscriptionId");

      if (!subscriptionId) {
        // Prompt user for subscription ID if not stored
        subscriptionId = prompt(
          "Enter your subscription ID to verify payment status:"
        );
        if (!subscriptionId) {
          setLoading(false);
          return; // User cancelled
        }
      }

      console.log("Checking subscription status:", subscriptionId);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to check subscription status");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "/api/payments/check-subscription",
        { subscriptionId },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      console.log("Subscription check response:", response.data);

      if (response.data.success) {
        // If subscription is active, show success and redirect
        if (response.data.subscriptionStatus === "active") {
          alert("Your subscription is active! Redirecting to dashboard.");
          navigate("/dashboard");
        } else {
          // If not active, update UI to show current status
          setSubscriptionStatus(response.data.subscriptionStatus);
          setError(
            `Subscription status: ${response.data.subscriptionStatus}. Please subscribe to access premium features.`
          );
        }
      } else {
        setError(response.data.message || "Failed to verify subscription");
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
      setError("Unable to verify subscription status. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  // Render subscription status message if applicable
  const renderSubscriptionStatus = () => {
    switch (subscriptionStatus) {
      case "cancelled":
        return (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">
              Subscription Cancelled
            </h3>
            <p className="text-yellow-700">
              Your subscription has been cancelled but is still active until the
              end of the billing period. You can resubscribe to continue
              receiving premium benefits after that.
            </p>
          </div>
        );
      case "payment_failed":
        return (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-medium text-red-800 mb-2">Payment Failed</h3>
            <p className="text-red-700">
              Your last payment failed. Please update your payment information
              to continue your subscription.
            </p>
          </div>
        );
      case "paused":
        return (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">
              Subscription Paused
            </h3>
            <p className="text-blue-700">
              Your subscription is currently paused. You can resume your
              subscription to continue receiving premium benefits.
            </p>
          </div>
        );
      case "expired":
        return (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">
              Subscription Expired
            </h3>
            <p className="text-gray-700">
              Your subscription has expired. Subscribe again to continue
              receiving premium benefits.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Loading payment details...
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
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Back to Registration
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isNewUser ? "Complete Your Subscription" : "Subscription"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isNewUser
              ? "You're almost done! Subscribe now to start receiving daily inspirational quotes."
              : "Subscribe to receive daily inspirational quotes tailored just for you."}
          </p>
        </div>

        {/* Display error message if any */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Check subscription button for troubleshooting */}
        <div className="mb-6 text-center">
          <button
            onClick={handleCheckSubscription}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {loading ? "Checking..." : "Check Subscription Status"}
          </button>
        </div>

        <div className="max-w-lg mx-auto mt-8 p-8 bg-white rounded-lg shadow-xl border-t-4 border-indigo-500">
          <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {isNewUser ? "Complete Your Registration" : "Subscribe to Premium"}
          </h2>

          {isNewUser && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
              <UserPlus className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800 mb-2">
                  One More Step to Activate Your Account
                </h3>
                <p className="text-blue-700">
                  To complete your registration and activate your account,
                  please subscribe to our premium service below. Your account
                  will not be fully activated until subscription is complete.
                </p>
              </div>
            </div>
          )}

          {renderSubscriptionStatus()}

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">
              DailyInspire Premium
            </h3>
            <p className="text-gray-600 mb-2">
              Get daily personalized inspirational quotes delivered to your
              inbox.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">$4.99/month</span>
              <span className="text-sm text-gray-500">Billed monthly</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">What you'll get:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Daily personalized quotes</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Delivery at your preferred time</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Access to premium content</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Cancel anytime</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleProceedToPayment}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            {isNewUser
              ? "Complete Registration"
              : subscriptionStatus === "none"
              ? "Subscribe Now"
              : "Update Subscription"}
          </button>

          {/* Test link for debugging */}
          <div className="mt-4 text-xs text-center">
            <a
              href={`https://dailyinspire.lemonsqueezy.com/buy/9e44dcc7-edab-43f0-b9a2-9d663d4af336?checkout[custom][user_id]=${encodeURIComponent(
                userId || "test"
              )}&discount=0`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Test Direct Checkout Link
            </a>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
