import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Clock,
  Globe,
  Bell,
  Save,
  X,
  Edit,
  AlertTriangle,
  Loader,
  CreditCard,
} from "lucide-react";
import Header from "../General/Header";
import Footer from "../General/Footer";
import DeleteAccount from "./DeleteAccount";
import Layout from "../General/Layout";
import { useNavigate } from "react-router-dom";

const UserPreferences = () => {
  const VITE_BASE_API =
    import.meta.env.VITE_BASE_API || "http://localhost:3000/api";
  const VITE_PADDLE_API_URL =
    import.meta.env.VITE_PADDLE_API_URL || "https://api.paddle.com";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    preferredTime: "",
    timezone: "",
    quotesEnabled: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  const timezones = Intl.supportedValuesOf("timeZone");

  const navigate = useNavigate();

  // Add subscription status state
  const [subscriptionData, setSubscriptionData] = useState({
    isPay: false,
    subscriptionStatus: "none",
    productId: "",
    variantId: "",
    userId: "",
    directCheckoutUrl: "",
    subscriptionId: "",
    cardBrand: "",
    cardLastFour: "",
    customerPortalUrl: "",
    cancelSubscriptionUrl: "",
  });

  // Add state for checkout URL
  const [checkoutId, setCheckoutId] = useState("");

  // Add state to track if checkout.js is loaded
  const [checkoutJsLoaded, setCheckoutJsLoaded] = useState(false);

  // Add subscription check flag to prevent duplicate redirects
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Log the token format to debug
        console.log("Using auth token format:", token.substring(0, 10) + "...");

        const response = await axios.get(`${VITE_BASE_API}/auth/preferences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { preferences } = response.data;
        setFormData(preferences);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching preferences:", error);
        setError("Failed to load your preferences. Please refresh the page.");
        setLoading(false);
      }
    };

    const fetchSubscriptionData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        console.log("Fetching subscription data...");

        // Use correct header format based on API
        const response = await axios.get(`${VITE_BASE_API}/payments/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Subscription data response:", response.data);
        // Add more detailed logging
        console.log("isPaid from response:", response.data.isPaid);
        console.log("isPay from response:", response.data.isPay);

        const checkoutId = response.data.checkoutId;
        setCheckoutId(checkoutId);

        // Update subscription data with correct property name
        const newSubscriptionData = {
          isPay: response.data.isPay || false,
          subscriptionStatus: response.data.subscriptionStatus || "none",
          productId: response.data.productId || "",
          variantId: response.data.variantId || "",
          userId: response.data.userId || formData._id || "",
          directCheckoutUrl: response.data.directCheckoutUrl || "",
          subscriptionId: response.data.subscriptionId || "",
          cardBrand: response.data.cardBrand || "",
          cardLastFour: response.data.cardLastFour || "",
          customerPortalUrl: response.data.customerPortalUrl || "",
          cancelSubscriptionUrl: response.data.cancelSubscriptionUrl || "",
        };

        console.log("Setting subscription data:", newSubscriptionData);
        setSubscriptionData(newSubscriptionData);

        // Check subscription status and redirect if not paid
        const isPaid = response.data.isPay;
        const status = response.data.subscriptionStatus;

        // Only allow users with active subscriptions to access preferences
        if (!isPaid || (status !== "active" && status !== "cancelled")) {
          console.log(
            "User does not have an active subscription, redirecting to payment page"
          );
          navigate("/payment");
        }

        setSubscriptionChecked(true);

        // Log subscription data state after update
        setTimeout(() => {
          console.log("Current subscriptionData state:", subscriptionData);
        }, 100);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        // Don't set error for subscription data to allow preferences to still load
      }
    };

    // Call both functions
    fetchPreferences();
    fetchSubscriptionData();
  }, [VITE_BASE_API, formData._id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.put(
        `${VITE_BASE_API}/auth/preferences`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Your preferences have been updated successfully!");
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating preferences:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update preferences. Please try again."
      );
      setLoading(false);
    }
  };

  const formatTimeForDisplay = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/deleted");
  };

  const getSubscriptionStatusDisplay = () => {
    const status = subscriptionData.subscriptionStatus;

    switch (status) {
      case "active":
        return {
          label: "Active",
          color: "text-green-600",
          bg: "bg-green-50",
          description: "Your premium subscription is active",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          description:
            "Your subscription is cancelled but active until the end of the billing period",
        };
      case "expired":
        return {
          label: "Expired",
          color: "text-gray-600",
          bg: "bg-gray-50",
          description: "Your subscription has expired",
        };
      case "paused":
        return {
          label: "Paused",
          color: "text-blue-600",
          bg: "bg-blue-50",
          description: "Your subscription is paused",
        };
      case "payment_failed":
        return {
          label: "Payment Failed",
          color: "text-red-600",
          bg: "bg-red-50",
          description: "Your last payment failed",
        };
      default:
        return {
          label: "Not Subscribed",
          color: "text-gray-600",
          bg: "bg-gray-50",
          description: "You don't have an active subscription",
        };
    }
  };

  // Function to format card brand for display
  const formatCardBrand = (brand) => {
    if (!brand) return "Card";
    // Capitalize first letter and handle common card brands
    const formattedBrand =
      brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
    switch (formattedBrand.toLowerCase()) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      case "amex":
        return "American Express";
      case "discover":
        return "Discover";
      default:
        return formattedBrand;
    }
  };

  // Function to format card number for display
  const formatCardNumber = (lastFour) => {
    if (!lastFour) return "••••";
    return `•••• ${lastFour}`;
  };

  // Function to handle subscription cancellation
  const handleCancelSubscription = async () => {
    // Show confirmation dialog
    if (
      !window.confirm(
        "Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // First, cancel in Paddle
      const response = await axios.post(
        `${VITE_PADDLE_API_URL}/subscriptions/${subscriptionData.subscriptionId}/cancel`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.VITE_PADDLE_API_KEY}`,
          },
        }
      );

      console.log("Subscription cancellation response:", response.data);

      // Update local user data
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        userData.subscriptionStatus = "cancelled";
        userData.isPay = false;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Update subscription data state
      setSubscriptionData((prev) => ({
        ...prev,
        subscriptionStatus: "cancelled",
        isPay: false,
        quotesEnabled: false,

      }));

      setSuccessMessage(
        "Your subscription has been cancelled successfully. You will continue to have access until the end of your current billing period."
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      setError(
        "Failed to cancel subscription. Please try again or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to handle opening customer portal
  const handleManageSubscription = () => {
    if (subscriptionData.customerPortalUrl) {
      window.open(subscriptionData.customerPortalUrl, "_blank");
    } else {
      setError("Unable to access customer portal. Please contact support.");
    }
  };

  // Function to handle subscription checkout
  const handleSubscribeClick = (e) => {
    window.location.href = import.meta.env.VITE_CHECKOUT_URL;
  };

  if (loading && !formData.email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-10 w-10 text-indigo-500" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-indigo-500">
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Preferences
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Customize your daily inspiration experience
            </p>
          </div>

          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 divide-y divide-gray-200">
              {/* Subscription Information Section */}
              <div className="py-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-indigo-500" />
                  Subscription Information
                </h3>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  {subscriptionData.isPay ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Status
                        </span>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            getSubscriptionStatusDisplay().bg
                          } ${getSubscriptionStatusDisplay().color}`}
                        >
                          {getSubscriptionStatusDisplay().label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {getSubscriptionStatusDisplay().description}
                      </p>

                      {subscriptionData.subscriptionStatus === "cancelled" && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-yellow-600 font-medium">
                                Your subscription has been cancelled
                              </p>
                              <p className="text-sm text-yellow-600 mt-1">
                                You will continue to receive quotes until the
                                end of your billing period. After that, quotes
                                will be disabled until you resubscribe.
                              </p>
                              <button
                                onClick={handleSubscribeClick}
                                type="button"
                                className="mt-2 text-sm px-3 py-1.5 border border-yellow-300 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors"
                              >
                                Reactivate Subscription
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {subscriptionData.subscriptionStatus === "active" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Plan
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              Premium ($1.99/month)
                            </span>
                          </div>

                          {/* Payment Method Information */}
                          {subscriptionData.cardBrand &&
                          subscriptionData.cardLastFour ? (
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-medium text-gray-700">
                                Payment Method
                              </span>
                              <span className="text-sm font-medium text-gray-700 flex items-center">
                                <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                                {formatCardBrand(subscriptionData.cardBrand)}{" "}
                                {formatCardNumber(
                                  subscriptionData.cardLastFour
                                )}
                              </span>
                            </div>
                          ) : (
                            subscriptionData.isPay && (
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-medium text-gray-700">
                                  Payment Method
                                </span>
                                <span className="text-sm text-gray-500 italic">
                                  Card information not available
                                </span>
                              </div>
                            )
                          )}

                          {/* Subscription Management Buttons */}
                          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                            <button
                              onClick={handleManageSubscription}
                              type="button"
                              className="text-sm px-3 py-1.5 border border-indigo-300 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                            >
                              Manage Subscription
                            </button>

                            <button
                              onClick={handleCancelSubscription}
                              type="button"
                              className="text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                            >
                              Cancel Subscription
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-600 mb-4">
                        You don't have an active subscription
                      </p>
                      <button
                        onClick={handleSubscribeClick}
                        onMouseDown={(e) => e.stopPropagation()}
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        Subscribe Now
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="py-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-indigo-500" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 bg-gray-50 rounded-md px-3 py-2 text-gray-600">
                      {formData.email || "Not available"}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <div className="mt-1 bg-gray-50 rounded-md px-3 py-2 text-gray-600">
                        {formData.first_name || "Not set"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <div className="mt-1 bg-gray-50 rounded-md px-3 py-2 text-gray-600">
                        {formData.last_name || "Not set"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quote Delivery Preferences Section */}
              <div className="py-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-indigo-500" />
                  Quote Delivery Preferences
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center">
                      <label
                        htmlFor="quotesEnabled"
                        className="block text-sm font-medium text-gray-700 mr-3"
                      >
                        Receive Daily Quotes
                      </label>
                      {isEditing ? (
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="quotesEnabled"
                            name="quotesEnabled"
                            checked={formData.quotesEnabled}
                            onChange={handleChange}
                            className="checked:bg-indigo-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="quotesEnabled"
                            className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                          ></label>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                            formData.quotesEnabled
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formData.quotesEnabled ? "Enabled" : "Disabled"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="preferredTime"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      <Clock className="h-4 w-4 mr-1 text-indigo-500" />
                      Preferred Time
                    </label>
                    {isEditing ? (
                      <input
                        type="time"
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <div className="mt-1 bg-gray-50 rounded-md px-3 py-2 text-gray-600">
                        {formData.preferredTime
                          ? formatTimeForDisplay(formData.preferredTime)
                          : "Not set"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="timezone"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      <Globe className="h-4 w-4 mr-1 text-indigo-500" />
                      Timezone
                    </label>
                    {isEditing ? (
                      <select
                        id="timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="mt-1 bg-gray-50 rounded-md px-3 py-2 text-gray-600">
                        {timezones.find((tz) => tz === formData.timezone)
                          ?.label ||
                          formData.timezone ||
                          "Not set"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Add Delete Account Section */}
            <div className="py-6 px-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Danger Zone
              </h3>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <DeleteAccount
                  token={localStorage.getItem("authToken")}
                  onLogout={handleLogout}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Preferences
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserPreferences;
