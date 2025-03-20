import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Check, AlertCircle, UserPlus } from "lucide-react";
import Header from "../General/Header";
import axios from "axios";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("none");
  const [isNewUser, setIsNewUser] = useState(false);

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
        setLoading(true);

        const response = await axios.get("/api/payments/checkout-info", {
          headers: {
            "x-auth-token": token,
          },
        });

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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching checkout info:", err);
        setError("Unable to load payment information. Please try again later.");
        setLoading(false);
      }
    };

    fetchCheckoutInfo();
  }, [userData, navigate, location.state]);

  const handleProceedToPayment = () => {
    // Redirect to the Lemon Squeezy checkout URL with user_id included
    // This is essential for the webhook to associate the subscription with the user
    if (checkoutUrl) {
      window.location.href = `${checkoutUrl}?checkout[custom][user_id]=${
        userData?.id || localStorage.getItem("userId")
      }`;
    } else {
      // Fallback if checkout URL is not available
      setError("Checkout URL is not available. Please try again later.");
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
    <>
      <Header />
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
                To complete your registration and activate your account, please
                subscribe to our premium service below. Your account will not be
                fully activated until subscription is complete.
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
            Get daily personalized inspirational quotes delivered to your inbox.
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

        <p className="text-center text-sm text-gray-500 mt-4">
          By proceeding, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </>
  );
};

export default PaymentPage;
