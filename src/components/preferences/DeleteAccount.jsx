import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2, AlertOctagon } from "lucide-react";

const DeleteAccount = ({ token, onLogout }) => {
  const VITE_BASE_API =
    import.meta.env.VITE_BASE_API || "http://localhost:3000/api";
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleDeleteRequest = () => {
    setShowConfirmation(true);
    setError("");
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setPassword("");
    setError("");
  };

  const confirmDelete = async () => {
    if (!password) {
      setError("Please enter your password to confirm deletion");
      return;
    }

    if (!user || !user.email) {
      setError(
        "User information is not available. Please try logging in again."
      );
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${VITE_BASE_API}/auth/delete-account`,
        {
          email: user.email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      // Account deleted successfully
      onLogout(); // Call the logout function to clear user data
      navigate("/deleted"); // Redirect to a "account deleted" page
    } catch (error) {
      console.error("Error deleting account:", error);
      setError(
        error.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!showConfirmation ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Delete Account
          </h3>
          <p className="text-gray-600 mb-4">
            Warning: Deleting your account will permanently remove all your data
            and preferences. This action cannot be undone.
          </p>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleDeleteRequest}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete My Account
          </button>
        </div>
      ) : (
        <div className="bg-red-100 p-5 rounded-lg border border-red-300">
          <div className="flex items-center mb-4">
            <AlertOctagon className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-bold text-red-800">
              Are you sure you want to delete your account?
            </h3>
          </div>
          <p className="text-red-700 mb-4">
            This action is permanent and cannot be undone.
          </p>

          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter your password to confirm:
            </label>
            <input
              type="password"
              id="confirm-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={cancelDelete}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Yes, Delete My Account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
