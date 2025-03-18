import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

// General:
import PageTitle from "./components/General/PageTitle.js";
import ErrorPage from "./components/General/ErrorPage.jsx";
import ProtectedRoute from "./components/General/ProtectedRoute.jsx";
import LoginForm from "./components/Login/LoginForm.jsx";
import Register from "./components/RegisterForm.jsx";
import Home from "./components/Home/Home.jsx";
import UserPreferences from "./components/preferences/UserPreferences";
import AccountDeleted from "./components/preferences/AccountDeleted";

// Auth:
import ForgotPassword from "./components/Login/ForgotPassword.jsx";
import ResetPassword from "./components/Login/ResetPassword.jsx";

// Payment Flow:
import PaymentPage from "./components/Payment/PaymentPage.jsx";
import PaymentSuccess from "./components/Payment/PaymentSuccess.jsx";

// Legal Pages:
import PrivacyPolicy from "./components/Legal/PrivacyPolicy";
import TermsOfService from "./components/Legal/TermsOfService";
import CookiePolicy from "./components/Legal/CookiePolicy";

// New Pages:
import About from "./components/About/About";
import Blog from "./components/Blog/Blog";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="Login | DailyInspire" />
              <LoginForm />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <PageTitle title="Register | DailyInspire" />
              <Register />
            </>
          }
        />
        
        {/* Password Reset Routes */}
        <Route
          path="/forgot-password"
          element={
            <>
              <PageTitle title="Forgot Password | DailyInspire" />
              <ForgotPassword />
            </>
          }
        />
        
        <Route
          path="/reset-password/:token"
          element={
            <>
              <PageTitle title="Reset Password | DailyInspire" />
              <ResetPassword />
            </>
          }
        />
        
        <Route
            path="/"
            element={
              <>
                <PageTitle title="Home | DailyInspire" />
                <Home />
              </>
            }
          />

        <Route
          path="/deleted"
          element={
            <>
              <PageTitle title="Account Deleted | DailyInspire" />
              <AccountDeleted />
            </>
          }
        />

        {/* About and Blog Routes */}
        <Route
          path="/about"
          element={
            <>
              <PageTitle title="About Us | DailyInspire" />
              <About />
            </>
          }
        />

        <Route
          path="/blog"
          element={
            <>
              <PageTitle title="Blog | DailyInspire" />
              <Blog />
            </>
          }
        />

        {/* Payment Flow Routes */}
        <Route
          path="/payment"
          element={
            <>
              <PageTitle title="Subscribe | DailyInspire" />
              <PaymentPage />
            </>
          }
        />
        
        <Route
          path="/payment-success"
          element={
            <>
              <PageTitle title="Payment Successful | DailyInspire" />
              <PaymentSuccess />
            </>
          }
        />

        {/* Legal Routes */}
        <Route
          path="/privacy-policy"
          element={
            <>
              <PageTitle title="Privacy Policy | DailyInspire" />
              <PrivacyPolicy />
            </>
          }
        />

        <Route
          path="/terms-of-service"
          element={
            <>
              <PageTitle title="Terms of Service | DailyInspire" />
              <TermsOfService />
            </>
          }
        />

        <Route
          path="/cookie-policy"
          element={
            <>
              <PageTitle title="Cookie Policy | DailyInspire" />
              <CookiePolicy />
            </>
          }
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute requiredRole="Talent" />}>

          <Route
            path="/preferences"
            element={
              <>
                <PageTitle title="Preferences | DailyInspire" />
                <UserPreferences token={localStorage.getItem('authToken') || ''} />
              </>
            }
          />

        </Route>

        {/* Catch-all route for 404 */}
        <Route
          path="*"
          element={
            <>
              <PageTitle title="Not Found | DailyInspire" />
              <ErrorPage />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
