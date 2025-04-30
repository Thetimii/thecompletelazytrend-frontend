import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Payment from './pages/Payment';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './services/supabaseService';

// OnboardingCheck component to redirect users to onboarding or payment if needed
const OnboardingCheck = ({ children }) => {
  const { user, userProfile, loading, fetchUserProfile } = useAuth();
  const location = useLocation();
  const [checkingProfile, setCheckingProfile] = useState(true);

  // Re-fetch user profile when component mounts to ensure we have the latest data
  useEffect(() => {
    const checkProfile = async () => {
      if (user?.id) {
        try {
          await fetchUserProfile(user.id);
        } catch (error) {
          console.error("Error re-fetching user profile:", error);
        } finally {
          setCheckingProfile(false);
        }
      } else {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user, fetchUserProfile]);

  if (loading || checkingProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated but hasn't completed onboarding, redirect to onboarding
  // Skip this check if already on the onboarding page
  if (user && userProfile && !userProfile.onboarding_completed && location.pathname !== '/onboarding') {
    console.log("Redirecting to onboarding, profile:", userProfile);
    return <Navigate to="/onboarding" />;
  }

  // If user has completed onboarding but hasn't completed payment, redirect to payment
  // Skip this check if already on the payment page
  if (
    user &&
    userProfile &&
    userProfile.onboarding_completed &&
    !userProfile.payment_completed &&
    location.pathname !== '/payment'
  ) {
    console.log("Redirecting to payment, profile:", userProfile);
    return <Navigate to="/payment" />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <Dashboard />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      try {
        await supabase.auth.getSession();
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
