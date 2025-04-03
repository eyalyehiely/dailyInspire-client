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
        const transaction_id = params.get("transaction_id");

        if (!transaction_id) {
          console.error("PaymentSuccess: No transaction_id found in URL");
          setError("Transaction ID is required");
          setLoading(false);
          return;
        }

        console.log("PaymentSuccess: Starting payment verification process...");

        try {
          console.log("PaymentSuccess: Checking payment status...");
          const response = await axios.get(
            `${
              import.meta.env.VITE_PADDLE_API_URL
            }/transactions/${transaction_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const transaction = response.data.data;
          console.log("PaymentSuccess: Transaction data:", transaction);

          // Check if the transaction is completed
          if (transaction.status === "completed") {
            console.log("PaymentSuccess: Payment verified successfully");
            setSubscriptionStatus("active");

            // Update user data in localStorage
            const userDataString = localStorage.getItem("user");
            if (userDataString) {
              const userData = JSON.parse(userDataString);
              userData.isPay = true;
              userData.subscriptionStatus = "active";
              userData.subscriptionDetails = {
                subscriptionId: transaction.subscription_id,
                transactionId: transaction.id,
                status: transaction.status,
                currencyCode: transaction.currency_code,
                billingPeriod: transaction.billing_period,
              };
              localStorage.setItem("user", JSON.stringify(userData));
            }

            // Update database
            setUpdateStatus("updating");
            try {
              const updateResponse = await axios.post(
                `${import.meta.env.VITE_BASE_API}/payments/update-user-data`,
                {
                  subscriptionId: transaction.subscription_id,
                  subscriptionStatus: "active",
                  transactionId: transaction.id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (updateResponse.data.success) {
                console.log("PaymentSuccess: Database updated successfully");
                setUpdateStatus("completed");
                setLoading(false);

                // Redirect to preferences after a short delay
                console.log(
                  "PaymentSuccess: Scheduling redirect to preferences..."
                );
                setTimeout(() => {
                  console.log("PaymentSuccess: Redirecting to preferences...");
                  navigate("/preferences");
                }, 2000);
                return;
              } else {
                throw new Error("Database update failed");
              }
            } catch (updateError) {
              console.error(
                "PaymentSuccess: Error updating database:",
                updateError
              );
              setError(
                "Payment verified but database update failed. Please contact support."
              );
              setLoading(false);
              return;
            }
          } else if (transaction.status === "past_due") {
            console.error("PaymentSuccess: Payment past due");
            setError(
              "Your payment is past due. Please update your payment method."
            );
            setLoading(false);
            return;
          } else {
            console.log("PaymentSuccess: Payment not verified yet");
            console.log("PaymentSuccess: Current status:", transaction.status);

            // If we haven't exceeded max retries, retry after a delay
            if (retryCount < maxRetries) {
              console.log(
                `PaymentSuccess: Retrying verification (attempt ${
                  retryCount + 1
                }/${maxRetries})...`
              );
              setRetryCount((prev) => prev + 1);
              setTimeout(fetchSubscriptionStatus, 2000); // Retry after 2 seconds
              return;
            }
          }

          // If we get here, all retries failed
          console.error(
            "PaymentSuccess: Payment verification failed after all retries"
          );
          setError("Payment verification failed. Please contact support.");
          setLoading(false);
        } catch (error) {
          console.error(
            "PaymentSuccess: Error in payment verification process:",
            error
          );
          console.error(
            "PaymentSuccess: Error details:",
            error.response?.data || error.message
          );

          // If we haven't exceeded max retries and it's a server error, retry
          if (retryCount < maxRetries && error.response?.status === 500) {
            console.log(
              `PaymentSuccess: Retrying after server error (attempt ${
                retryCount + 1
              }/${maxRetries})...`
            );
            setRetryCount((prev) => prev + 1);
            setTimeout(fetchSubscriptionStatus, 2000);
            return;
          }

          setError(
            error.response?.data?.message || "Failed to verify payment status"
          );
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "PaymentSuccess: Error in payment verification process:",
          error
        );
        console.error(
          "PaymentSuccess: Error details:",
          error.response?.data || error.message
        );
        setError("Failed to verify payment status");
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

  if (error) {
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
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
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