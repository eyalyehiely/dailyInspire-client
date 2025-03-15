import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ variant = "default", className = "", size = "md" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove all authentication-related items from localStorage
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");

    // Navigate to login page
    navigate("/login");
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Variant classes
  const variantClasses = {
    default:
      "border border-transparent text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
    outline:
      "border border-indigo-300 text-indigo-700 bg-white hover:bg-indigo-50",
    danger:
      "border border-transparent text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700",
    ghost:
      "border border-transparent text-gray-700 bg-transparent hover:bg-gray-100",
  };

  return (
    <button
      onClick={handleLogout}
      className={`
        inline-flex items-center justify-center 
        ${sizeClasses[size]}
        font-medium rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        transition-all duration-200
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <LogOut
        className={`mr-2 ${
          size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"
        }`}
      />
      Logout
    </button>
  );
};

export default LogoutButton;
