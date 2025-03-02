import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Clock, Globe, Bell, Save, X, Edit } from "lucide-react";

const UserPreferences = () => {
  const VITE_BASE_API = import.meta.env.VITE_BASE_API || 'http://localhost:3000/api';
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


  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);

        const authTokensString = localStorage.getItem("authTokens");
        if (!authTokensString) {
          throw new Error("Authentication token not found");
        }

        const authTokens = JSON.parse(authTokensString);
        const token = authTokens.token;

        const response = await axios.get(
          `${VITE_BASE_API}/auth/preferences`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { preferences } = response.data;
        setFormData(preferences);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching preferences:", error);
        setError("Failed to load your preferences. Please refresh the page.");
        setLoading(false);
      }
    };

    fetchPreferences();
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

      const authTokensString = localStorage.getItem("authTokens");
      if (!authTokensString) {
        throw new Error("Authentication token not found");
      }

      const authTokens = JSON.parse(authTokensString);
      const token = authTokens.token;

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

  if (loading && !formData.email) {
    return <div className="loading">Loading your preferences...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-indigo-500">
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-800">Your Preferences</h2>
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

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105"
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit Preferences
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPreferences;
