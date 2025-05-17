import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handlePaymentSuccess } from '../services/stripeService';

const PaymentSuccess = () => {
  const { user, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [countdown, setCountdown] = useState(3);

  // Get the session_id from URL query parameters
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPayment = async () => {
      if (!sessionId || !user) {
        // If no session ID or user, redirect to dashboard/payment-success after a short delay
        setTimeout(() => {
          navigate('/dashboard/payment-success', { replace: true });
        }, 3000);
        return;
      }

      try {
        // Update user profile with payment information
        await handlePaymentSuccess(sessionId, user.id);

        // Refresh user profile
        await fetchUserProfile(user.id);

        // Track purchase event with Meta Pixel
        if (window.fbq) {
          fbq('track', 'Purchase', {
            currency: "USD",
            value: 49.95,
            content_name: "LazyTrend Subscription",
            content_type: "product",
            content_ids: ["subscription_trial"],
            num_items: 1
          });
        }

        // Set processing to false to show success message
        setProcessing(false);

        // Start countdown for redirect
        const countdownInterval = setInterval(() => {
          setCountdown(prevCount => {
            if (prevCount <= 1) {
              clearInterval(countdownInterval);
              // Redirect to dashboard/payment-success after countdown
              navigate('/dashboard/payment-success', { replace: true });
              return 0;
            }
            return prevCount - 1;
          });
        }, 1000);

        // Cleanup interval if component unmounts
        return () => clearInterval(countdownInterval);
      } catch (err) {
        console.error('Error processing payment success:', err);
        // Even if there's an error, redirect to dashboard/payment-success after a delay
        setTimeout(() => {
          navigate('/dashboard/payment-success', { replace: true });
        }, 3000);
      }
    };

    processPayment();
  }, [sessionId, user, fetchUserProfile, navigate]);

  // Display a success message while waiting for redirect
  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-primary-50 dark:bg-primary-950 fixed inset-0">
      <div className="max-w-md w-full bg-white dark:bg-primary-900 p-8 rounded-xl shadow-xl border border-primary-100 dark:border-primary-800 m-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">LazyTrend</h1>
          <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100 mb-2">
            Payment Successful! Your Trial Has Started
          </h2>
        </div>

        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-lg">
          <p>Your payment has been processed successfully. Your 7-day free trial has started!</p>
          {!processing && (
            <p className="mt-2">Redirecting to your dashboard in {countdown} seconds...</p>
          )}
        </div>

        {processing && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            <span className="ml-2">Processing your payment...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
