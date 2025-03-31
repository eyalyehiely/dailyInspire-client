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

    // Fetch checkout info
    const fetchCheckoutInfo = async () => {
      try {
        const response = await axios.get("/api/payments/checkout-info", {
          headers: { "x-auth-token": token },
        });

        console.log("Checkout info response:", response.data);
        console.log("Product ID from response:", response.data.productId);
        console.log(
          "Full response data:",
          JSON.stringify(response.data, null, 2)
        );

        if (response.data.isPaid) {
          console.log("User already has premium access");
          navigate("/dashboard");
          return;
        }

        setUserId(response.data.userId);
        setProductId(response.data.productId);
        console.log("Setting product ID in state:", response.data.productId);
        setDirectCheckoutUrl(response.data.directCheckoutUrl);
        setSubscriptionStatus(response.data.subscriptionStatus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching checkout info:", error);
        setError("Failed to load payment information");
        setLoading(false);
      }
    };

    fetchCheckoutInfo();
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

      // If no direct URL, construct one using environment variables
      const appUrl = import.meta.env.VITE_APP_URL;
      const paddleCheckoutUrl = import.meta.env.VITE_PADDLE_CHECKOUT_URL;
      const envProductId = import.meta.env.VITE_PADDLE_PRODUCT_ID;

      // Use product ID from server response or fallback to environment variable
      const finalProductId = productId || envProductId;

      // Ensure we have a product ID
      if (!finalProductId) {
        console.error("No product ID available");
        setError("Unable to generate checkout URL. Please try again later.");
        return;
      }

      // Construct the URL with the correct Paddle format
      const params = new URLSearchParams({
        "items[0][price_id]": finalProductId,
        "items[0][quantity]": "1",
        customer_id: currentUserId,
        success_url: `${appUrl}/payment-success`,
        cancel_url: `${appUrl}/payment`,
      });

      const checkoutUrl = `${paddleCheckoutUrl}/custom-checkout?${params.toString()}`;
      console.log("Generated checkout URL:", checkoutUrl);
      window.location.href = checkoutUrl;
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
