import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handlePaymentSuccess } from '../services/stripeService';

const PaymentSuccess = () => {
  const { user, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get the session_id from URL query parameters
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPayment = async () => {
      if (!sessionId || !user) {
        // If no session ID or user, redirect to dashboard anyway
        navigate('/dashboard', { replace: true });
        return;
      }

      try {
        // Update user profile with payment information
        await handlePaymentSuccess(sessionId, user.id);

        // Refresh user profile
        await fetchUserProfile(user.id);

        // Redirect to dashboard immediately
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Error processing payment success:', err);
        // Even if there's an error, redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    };

    processPayment();
  }, [sessionId, user, fetchUserProfile, navigate]);

  // Return null since this component will immediately redirect
  return null;
};

export default PaymentSuccess;
