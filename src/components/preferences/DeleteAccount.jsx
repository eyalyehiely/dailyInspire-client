import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = ({ token, onLogout }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteRequest = () => {
    setShowConfirmation(true);
    setError('');
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setPassword('');
    setError('');
  };

  const confirmDelete = async () => {
    if (!password) {
      setError('Please enter your password to confirm deletion');
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete(`${BASE_API}/auth/delete-account`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      // Account deleted successfully
      onLogout(); // Call the logout function to clear user data
      navigate('/deleted'); // Redirect to a "account deleted" page
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.response?.data?.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="delete-account-container">
      <h2>Delete Account</h2>
      
      {!showConfirmation ? (
        <div>
          <p>
            Warning: Deleting your account will permanently remove all your data and preferences.
            This action cannot be undone.
          </p>
          <button 
            className="delete-btn"
            onClick={handleDeleteRequest}
          >
            Delete My Account
          </button>
        </div>
      ) : (
        <div className="confirmation-dialog">
          <h3>Are you sure you want to delete your account?</h3>
          <p>This action is permanent and cannot be undone.</p>
          
          <div className="password-confirmation">
            <label htmlFor="confirm-password">Enter your password to confirm:</label>
            <input
              type="password"
              id="confirm-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="action-buttons">
            <button 
              className="cancel-btn"
              onClick={cancelDelete}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="confirm-delete-btn"
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount; 