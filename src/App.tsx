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
