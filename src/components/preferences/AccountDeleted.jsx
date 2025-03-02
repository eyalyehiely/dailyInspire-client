import { Link } from 'react-router-dom';

const AccountDeleted = () => {
  return (
    <div className="account-deleted">
      <h2>Account Successfully Deleted</h2>
      <p>Your account and all associated data have been permanently deleted from our system.</p>
      <p>We're sorry to see you go. If you ever wish to use our service again, you're welcome to create a new account.</p>
      <div className="actions">
        <Link to="/signup" className="signup-btn">Create New Account</Link>
        <Link to="/" className="home-btn">Return to Home</Link>
      </div>
    </div>
  );
};

export default AccountDeleted; 