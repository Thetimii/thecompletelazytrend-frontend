import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If user has already completed payment, redirect to dashboard
  if (userProfile?.payment_completed) {
    navigate('/', { replace: true });
    return null;
  }

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Define API URL with fallback
      const apiUrl = import.meta.env.VITE_API_URL || '';
      console.log('Using API URL:', apiUrl);

      // Create checkout session directly
      const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          priceId: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1REaY3G4vQYDStWYZu4rRLu5',
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment-cancel`,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Failed to create checkout session (Status: ${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      // Parse the response
      const data = await response.json();
      console.log('Checkout session created:', data);

      if (!data.url) {
        throw new Error('No checkout URL returned from server');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Error redirecting to checkout:', err);
      setError(err.message || 'Failed to initialize checkout');
      setLoading(false);
    }
  };

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
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              <span>Processing...</span>
            </div>
          ) : (
            'Proceed to Payment'
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;
