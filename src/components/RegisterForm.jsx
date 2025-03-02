import React, { useState } from "react";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { signup } from "../functions/signup";
import Header from "./General/Header";
import { Link } from "react-router-dom";

const RegisterForm = ({ onLoginClick }) => {
  const supportedTimeZones = Intl.supportedValuesOf("timeZone");
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    notificationTime: "08:00",
    termsAccepted: false,
    timeZone: userTimeZone,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(""); // Clear any previous API errors

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(formData, setIsSuccess, setIsSubmitting);
      // Success is handled inside the signup function
    } catch (error) {
      console.error("Signup error:", error);
      setApiError(
        error.message ||
          "An error occurred during registration. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-xl p-8 border-t-4 border-green-500">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-md">
          <svg
            className="h-8 w-8 text-white"
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
        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Registration successful!
        </h2>
        <p className="mt-3 text-lg text-gray-600">
          Thank you for registering with DailyInspire. You will start receiving
          inspirational quotes at your selected time.
        </p>
        <div className="mt-8">
          <Link to="/login">
            <button
              type="button"
              onClick={onLoginClick}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go to login
          </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header/>
    <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10 border-t-4 border-indigo-500 transform transition-all duration-300 hover:shadow-2xl mt-4">
      <h2 className="mb-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        Register for DailyInspire
      </h2>
      <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-indigo-500" />
            </div>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.first_name
                  ? "border-red-300 ring-1 ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
              placeholder="John"
            />
          </div>
          {errors.first_name && (
            <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-indigo-500" />
            </div>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.last_name
                  ? "border-red-300 ring-1 ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
              placeholder="Doe"
            />
          </div>
          {errors.last_name && (
            <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-indigo-500" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.email
                  ? "border-red-300 ring-1 ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-indigo-500" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.password
                  ? "border-red-300 ring-1 ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
            />
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-indigo-500" />
            </div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.confirmPassword
                  ? "border-red-300 ring-1 ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="notificationTime"
            className="block text-sm font-medium text-gray-700"
          >
            When would you like to receive your daily quote?
          </label>
          <div className="mt-1">
            <input
              type="time"
              id="notificationTime"
              name="notificationTime"
              value={formData.notificationTime}
              onChange={handleChange}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              Time is based on your selected time zone: {formData.timeZone}
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="timeZone"
            className="block text-sm font-medium text-gray-700"
          >
            Time Zone
          </label>
          <div className="mt-1">
            <select
              id="timeZone"
              name="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {supportedTimeZones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="termsAccepted"
            className="ml-2 block text-sm text-gray-900"
          >
            I agree to the{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="mt-2 text-sm text-red-600">{errors.termsAccepted}</p>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-200 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
      {apiError && (
        <div className="mt-3">
          <p className="text-center text-red-600">{apiError}</p>
        </div>
      )}
    </div>
    </>
  );
};

export default RegisterForm;
