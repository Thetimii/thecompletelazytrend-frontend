import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createCheckoutSession } from '../services/stripeService';

const Payment = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If user has already completed payment, redirect to dashboard
    if (userProfile?.payment_completed) {
      navigate('/', { replace: true });
    }
  }, [userProfile, navigate]);

  // Redirect to Stripe Checkout when the component mounts
  useEffect(() => {
    const redirectToCheckout = async () => {
      if (user && !userProfile?.payment_completed) {
        try {
          setLoading(true);
          setError(null);

          // Get checkout URL from backend
          const checkoutUrl = await createCheckoutSession(user.id, user.email);

          // Redirect to Stripe Checkout
          window.location.href = checkoutUrl;
        } catch (err) {
          console.error('Error redirecting to checkout:', err);
          setError(err.message || 'Failed to initialize checkout');
          setLoading(false);
        }
      }
    };

    redirectToCheckout();
  }, [user, userProfile]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Complete Your Subscription</h1>

        <div className="mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
            <p>You're almost there! Complete your subscription to access the dashboard.</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Subscription Details</h2>
            <p className="text-gray-700 mb-1">Plan: The Complete Lazy Trend</p>
            <p className="text-gray-700 mb-4">Price: $29.99/month</p>
            <ul className="list-disc pl-5 text-gray-700 mb-4">
              <li>Unlimited TikTok trend analysis</li>
              <li>Personalized content recommendations</li>
              <li>Weekly email reports</li>
              <li>Cancel anytime</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Try Again
            </button>
          </div>
        )}

        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">Redirecting to secure payment page...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
