import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Home, AlertCircle, RefreshCw } from "lucide-react";
import Header from "../General/Header";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("active");
  const [retryCount, setRetryCount] = useState(0);
  const [updateStatus, setUpdateStatus] = useState("verifying");
  const [transactionVerified, setTransactionVerified] = useState(false);
  const maxRetries = 3;

  useEffect(() => {
    console.log("PaymentSuccess: Component mounted");
    console.log("PaymentSuccess: URL parameters:", location.search);

    const fetchSubscriptionStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("PaymentSuccess: Auth token present:", !!token);

        if (!token) {
          console.error("PaymentSuccess: No auth token found");
          setError("Authentication required");
          setLoading(false);
          return;
        }

        // Get transaction_id from URL parameters
        const params = new URLSearchParams(location.search);
        let transaction_id = params.get("transaction_id");
        const cardBrand = params.get("cardbrand");
        const cardLastFour = params.get("cardlastfour");

        // If no transaction_id in URL, try to get it from localStorage
        if (!transaction_id) {
          transaction_id = localStorage.getItem("transactionId");
          console.log(
            "PaymentSuccess: Retrieved transaction_id from localStorage:",
            transaction_id
          );
        }

        console.log("PaymentSuccess: Extracted parameters:", {
          transaction_id,
          cardBrand,
          cardLastFour,
          allParams: Object.fromEntries(params.entries()),
        });

        if (!transaction_id) {
          console.error("PaymentSuccess: No transaction_id found");
          setError(
            "No transaction ID found. Please contact support if you believe this is an error."
          );
          setLoading(false);
          return;
        }

        if (!cardBrand || !cardLastFour) {
          console.warn("PaymentSuccess: Missing card information:", {
            cardBrand,
            cardLastFour,
          });
        }

        console.log("PaymentSuccess: Starting payment verification process...");

        // Add a delay before verification to ensure Paddle has processed the transaction
        setTimeout(async () => {
          try {
            console.log("PaymentSuccess: Checking payment status...");
            const response = await axios.get(
              `${
                import.meta.env.VITE_BASE_API
              }/payments/verify-transaction/${transaction_id}?cardBrand=${cardBrand}&cardLastFour=${cardLastFour}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (
              response.data &&
              response.data.message === "Transaction verified successfully"
            ) {
              console.log("PaymentSuccess: Payment verified successfully");
              setTransactionVerified(true);
              setSubscriptionStatus("active");
              setLoading(false);

              // Update user data in localStorage
              const userDataString = localStorage.getItem("user");
              if (userDataString) {
                const userData = JSON.parse(userDataString);
                userData.isPay = true;
                userData.subscriptionStatus = "active";
                localStorage.setItem("user", JSON.stringify(userData));
              }

              // Redirect to preferences after a short delay
              setTimeout(() => {
                navigate("/preferences");
              }, 2000);
            } else {
              throw new Error(
                response.data.message || "Payment verification failed"
              );
            }
          } catch (error) {
            console.error(
              "PaymentSuccess: Error in payment verification:",
              error
            );

            if (retryCount < maxRetries) {
              setRetryCount((prev) => prev + 1);
              setTimeout(fetchSubscriptionStatus, 2000);
            } else {
              setError(
                error.response?.data?.message ||
                  "Failed to verify payment status. Please contact support if you believe this is an error."
              );
              setLoading(false);
            }
          }
        }, 4000);
      } catch (error) {
        console.error("PaymentSuccess: Error:", error);
        setError(
          "Failed to verify payment status. Please contact support if you believe this is an error."
        );
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [navigate, retryCount, location.search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RefreshCw className="animate-spin h-12 w-12 text-blue-500 mx-auto" />
            <p className="mt-4 text-gray-600">
              {updateStatus === "verifying"
                ? retryCount > 0
                  ? `Verifying payment status... (Attempt ${
                      retryCount + 1
                    }/${maxRetries})`
                  : "Verifying payment status..."
                : "Updating your account..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !transactionVerified) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Payment Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    to="/payment"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Return to Payment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Payment Successful
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Thank you for your subscription! You now have access to
                      all premium features. Redirecting to preferences...
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  to="/preferences"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Go to Preferences
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
