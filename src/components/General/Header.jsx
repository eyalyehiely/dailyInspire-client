import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  ChevronDown,
  Layout,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    // Update isAuthenticated state
    if (authToken && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const closeAllDropdowns = () => {
    setIsHomeDropdownOpen(false);
  };

  // Close home dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside dropdown elements
      if (!event.target.closest(".dropdown-container")) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Function to handle section navigation
  const scrollToSection = (sectionId) => {
    closeAllDropdowns();
    setIsMenuOpen(false);

    if (isHomePage) {
      // If already on home page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home page with the section hash
      navigate(`/#${sectionId}`);
    }
  };

  // Links that work on any page
  const mainNavLinks = (
    <>
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
    </>
  );

  // Links that are specific to the home page (Explore dropdown)
  const homePageLinks = (
    <div className="relative dropdown-container">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsHomeDropdownOpen(!isHomeDropdownOpen);
        }}
        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <Layout className="h-4 w-4 mr-1" />
        Explore
        <ChevronDown
          className={`h-4 w-4 ml-1 transition-transform ${
            isHomeDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isHomeDropdownOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 dropdown-container">
          <button
            onClick={() => scrollToSection("features")}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Features
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <Star className="h-4 w-4 mr-2" />
            Testimonials
          </button>
        </div>
      )}
    </div>
  );

  // Auth links
  const authLinks = !isAuthenticated ? (
    <>
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
      <Link
        to="/preferences"
        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
      >
        <User className="h-4 w-4 mr-1" />
        My Account
      </Link>
      <LogoutButton variant="outline" size="sm" />
    </>
  );

  // Mobile menu links for home page sections
  const mobileHomePageLinks = (
    <>
      <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-100">
        <span className="flex items-center">
          <Layout className="h-4 w-4 mr-2" />
          Explore Home
        </span>
      </div>
      <button
        onClick={() => scrollToSection("features")}
        className="block w-full text-left px-3 py-2 pl-8 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Features
      </button>
      <button
        onClick={() => scrollToSection("testimonials")}
        className="block w-full text-left px-3 py-2 pl-8 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
      >
        <Star className="h-4 w-4 mr-2" />
        Testimonials
      </button>
    </>
  );

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
          <nav className="hidden md:flex items-center space-x-4">
            {mainNavLinks}
            {homePageLinks}
            {authLinks}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
                closeAllDropdowns();
              }}
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

            {/* Submenu for Home sections */}
            {mobileHomePageLinks}

            {/* Auth links */}
            {!isAuthenticated ? (
              <>
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
