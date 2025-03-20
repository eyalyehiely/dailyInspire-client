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
    isPaid: false,
    subscriptionStatus: "none",
    productId: "",
    variantId: "",
    userId: "",
  });

  // Add state for checkout URL
  const [checkoutId, setCheckoutId] = useState("");

  // Add state to track if checkout.js is loaded
  const [checkoutJsLoaded, setCheckoutJsLoaded] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }

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

    // Add a function to fetch subscription data
    const fetchSubscriptionData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        console.log("Fetching subscription data...");
        const response = await axios.get(`${VITE_BASE_API}/payments/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Subscription data response:", response.data);

        const checkoutId = response.data.checkoutId;
        setCheckoutId(checkoutId);

        // Use the product and variant IDs from the server response instead of hardcoded values
        setSubscriptionData({
          isPaid: response.data.isPaid,
          subscriptionStatus: response.data.subscriptionStatus || "none",
          productId: response.data.productId,
          variantId: response.data.variantId,
          userId: response.data.userId,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load user preferences. Please try again."
        );
        setLoading(false);
      }
    };

    fetchPreferences();
    fetchSubscriptionData(); // Call the new function
  }, []);

  useEffect(() => {
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

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  // Function to handle subscription checkout
  const handleSubscribeClick = (e) => {
    // Stop all event propagation and default behavior
    e.preventDefault();
    e.stopPropagation();

    // Add detailed logging to see what values we have
    console.log("===== SUBSCRIPTION DEBUG =====");
    console.log("Subscribe button clicked");
    console.log("checkoutId:", checkoutId);
    console.log("subscriptionData:", subscriptionData);
    console.log("userId:", subscriptionData.userId);
    console.log("productId:", subscriptionData.productId);
    console.log("variantId:", subscriptionData.variantId);
    console.log("formData:", formData);
    console.log("Window LemonSqueezy available:", !!window.createLemonSqueezy);
    console.log("===== END DEBUG =====");

    if (window.createLemonSqueezy && checkoutId) {
      try {
        console.log("Opening Lemon Squeezy checkout overlay");
        window
          .createLemonSqueezy()
          .Setup({
            checkoutId: checkoutId,
            customData: { user_id: subscriptionData.userId || formData._id },
          })
          .open();
        return false;
      } catch (error) {
        console.error("Error opening Lemon Squeezy checkout overlay:", error);
        // Fall through to direct URL method
      }
    } else {
      console.error(
        "Lemon Squeezy checkout not available or checkout ID missing",
        { checkoutId, checkoutJsLoaded }
      );

      // Fallback: If the overlay doesn't work, use the direct URL
      const storeName = "dailyinspire"; // Your Lemon Squeezy store name
      // Use product and variant IDs from server response
      const productId = subscriptionData.productId;
      const variantId = subscriptionData.variantId;

      if (!productId || !variantId) {
        console.error("Missing product or variant ID");
        setError("Unable to process payment. Please try again later.");
        return false;
      }

      // Create a fallback URL with the user ID
      const fallbackUrl = `https://${storeName}.lemonsqueezy.com/checkout/buy/${productId}?variant=${variantId}&checkout[custom][user_id]=${
        subscriptionData.userId || formData._id || "unknown"
      }`;

      console.log("Navigating to fallback URL:", fallbackUrl);

      // Navigate directly
      window.location.href = fallbackUrl;
    }

    // Return false to prevent any other behavior
    return false;
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
                  {subscriptionData.isPaid ? (
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

                      {subscriptionData.subscriptionStatus === "active" && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Plan
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            Premium ($1.99/month)
                          </span>
                        </div>
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
