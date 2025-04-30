import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Middleware component to check subscription status and restrict access
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if access is allowed
 * @returns {React.ReactNode} - Either the children or a redirect
 */
const SubscriptionMiddleware = ({ children }) => {
  const { user, userProfile, loading } = useAuth();
  const [accessGranted, setAccessGranted] = useState(null);

  useEffect(() => {
    // If still loading, wait
    if (loading) {
      return;
    }

    // If no user, deny access
    if (!user) {
      setAccessGranted(false);
      return;
    }

    // If no user profile, deny access
    if (!userProfile) {
      setAccessGranted(false);
      return;
    }

    // Check if subscription is active or in trial
    const isSubscriptionActive = 
      userProfile.subscription_status === 'active' || 
      userProfile.subscription_status === 'trialing';

    // Check if subscription is canceled but still in the paid period
    const isCanceledButValid = 
      userProfile.subscription_status === 'cancelled' && 
      userProfile.cancel_at && 
      new Date(userProfile.cancel_at) > new Date();

    // Grant access if subscription is active or in valid canceled state
    setAccessGranted(isSubscriptionActive || isCanceledButValid);
  }, [user, userProfile, loading]);

  // If still determining access, show loading
  if (accessGranted === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If access denied, redirect to payment page
  if (!accessGranted) {
    return <Navigate to="/payment" replace />;
  }

  // If access granted, render children
  return children;
};

export default SubscriptionMiddleware;
