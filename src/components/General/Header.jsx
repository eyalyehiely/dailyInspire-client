import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Info,
  BookOpen,
  Home,
  Sparkles,
  Star,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const authTokens = localStorage.getItem("authTokens");
    const userData = localStorage.getItem("user");

    if (authTokens && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  return (
    <header className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                DailyInspire
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>

            <Link
              to="/about"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Info className="h-4 w-4 mr-1" />
              About
            </Link>

            <Link
              to="/blog"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Blog
            </Link>

            {/* Show these links only if not logged in */}
            {!isLoggedIn ? (
              <>
                <a
                  href="#features"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Star className="h-4 w-4 mr-1" />
                  Testimonials
                </a>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Show these links when logged in */}
                <Link
                  to="/preferences"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  My Account
                </Link>
                <LogoutButton variant="outline" size="sm" />
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>

            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="h-4 w-4 mr-2" />
              About
            </Link>

            <Link
              to="/blog"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </Link>

            {/* Show these links only if not logged in */}
            {!isLoggedIn ? (
              <>
                <a
                  href="#features"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Testimonials
                </a>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Show these links when logged in */}
                <Link
                  to="/preferences"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </Link>
                <div className="px-3 py-2">
                  <LogoutButton
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
