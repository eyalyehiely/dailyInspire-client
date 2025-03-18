import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="text-white text-xl font-bold">
                  DailyInspire
                </span>
              </div>
            </div>
            <p className="mt-2 text-base text-gray-300">
              Start your day with positivity and motivation.
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-base text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-base text-gray-300 hover:text-white transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-base text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="mailto:support@dailyinspire.xyz"
                  className="text-base text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  support@dailyinspire.xyz
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-base text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-base text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="text-base text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} DailyInspire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
