import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SubscriptionMiddleware from './middleware/SubscriptionMiddleware';
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a preference stored
    const savedMode = localStorage.getItem('darkMode');
    // Check if browser prefers dark mode
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedMode ? savedMode === 'true' : prefersDark;
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Effect to apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen bg-primary-50 dark:bg-primary-900 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Only show Navbar on non-dashboard pages */}
      {window.location.pathname !== '/' && (
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      )}
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
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-cancel"
            element={
              <ProtectedRoute>
                <PaymentCancel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <SubscriptionMiddleware>
                    <Dashboard />
                  </SubscriptionMiddleware>
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
