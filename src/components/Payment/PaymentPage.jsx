import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Check, AlertCircle } from "lucide-react";
import Header from "../General/Header";
import axios from "axios";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");

  // Get user data from location state (passed from registration)
  const userData = location.state?.userData;

  useEffect(() => {
    // If no user data was passed, redirect to register
    if (!userData) {
      navigate("/register");
      return;
    }

    // Fetch checkout info
    const fetchCheckoutInfo = async () => {
      try {
        setLoading(true);
        // We'll use the token from local storage (set during registration)
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await axios.get("/api/payments/checkout-info", {
          headers: {
            "x-auth-token": token,
          },
        });

        // If user is already paid, go to success page
        if (response.data.isPaid) {
          navigate("/payment-success");
          return;
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
  }, [userData, navigate]);

  const handleProceedToPayment = () => {
    // For demonstration purposes, we'll just navigate to success page directly
    // In a real app, you would redirect to the payment processor

    // Option 1: Redirect to external payment page
    // window.location.href = checkoutUrl + `?checkout[custom][user_id]=${userData.id}`;

    // Option 2: For this demo, we'll just go to success page
    navigate("/payment-success", { state: { userData } });
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
          Complete Your Subscription
        </h2>

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
          Proceed to Payment
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          By proceeding, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </>
  );
};

export default PaymentPage;
