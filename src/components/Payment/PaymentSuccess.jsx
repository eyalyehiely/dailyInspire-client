import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Home } from "lucide-react";
import Header from "../General/Header";

const PaymentSuccess = () => {
  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-xl border-t-4 border-green-500">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h2 className="text-center mt-6 text-2xl font-bold text-gray-800">
          All Set!
        </h2>

        <p className="text-center mt-4 text-gray-600">
          Thank you for subscribing to DailyInspire Premium! Your payment has
          been processed successfully.
        </p>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">What's Next?</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1 mr-2"></span>
              <span>
                You'll start receiving your daily inspirational quotes at your
                selected time.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1 mr-2"></span>
              <span>
                You can adjust your preferences anytime from your account
                settings.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1 mr-2"></span>
              <span>
                Your subscription will automatically renew each month, and you
                can cancel at any time.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
