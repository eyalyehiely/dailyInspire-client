import { Link } from "react-router-dom";
import { CheckCircle, Home, UserPlus } from "lucide-react";
import Header from "../General/Header";

const AccountDeleted = () => {
  return (
    <>
      <Header />
      <div className="max-w-lg mx-auto mt-16 p-8 bg-white rounded-xl shadow-2xl border-t-4 border-green-500 animate-fadeIn">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Account Successfully Deleted
        </h2>

        <div className="text-center space-y-4 mb-8">
          <p className="text-gray-600">
            Your account and all associated data have been permanently deleted
            from our system.
          </p>
          <p className="text-gray-600">
            We're sorry to see you go. If you ever wish to use our service
            again, you're welcome to create a new account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:translate-y-[-2px] transition-all duration-200"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Create New Account
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-indigo-300 rounded-lg shadow-sm text-base font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default AccountDeleted;
