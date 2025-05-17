import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../components/PublicNavbar';

const Payment = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode preference on component mount
  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);

    // Apply dark mode class to html element
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // If user has already completed payment, redirect to dashboard
  if (userProfile?.payment_completed) {
    navigate('/', { replace: true });
    return null;
  }

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Track InitiateCheckout event with Meta Pixel
      if (window.fbq) {
        fbq('track', 'InitiateCheckout', {
          content_name: 'subscription_checkout',
          currency: 'USD',
          value: 49.95
        });
      }

      // Define API URL with fallback
      const apiUrl = import.meta.env.VITE_API_URL || 'https://thecompletelazytrend-backend.onrender.com';
      console.log('Using API URL:', apiUrl);

      if (!apiUrl) {
        throw new Error('API URL is not configured. Please check your environment variables.');
      }

      // Create checkout session directly
      const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          priceId: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1RKJ9LG4vQYDStWYwbdkHlvJ',
          successUrl: `${window.location.origin}/dashboard/payment-success`,
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
    <div className="h-screen w-screen overflow-hidden bg-primary-50 dark:bg-primary-950 fixed inset-0">
      <PublicNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="flex items-center justify-center h-full pt-16">
        <div className="max-w-md w-full bg-white dark:bg-primary-900 p-8 rounded-xl shadow-xl border border-primary-100 dark:border-primary-800 m-4 overflow-y-auto max-h-[calc(100vh-6rem)]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">LazyTrend</h1>
          <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100 mb-2">Complete Your Subscription</h2>
        </div>

        <div className="mb-6">
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 rounded-lg">
            <p>You're almost there! Complete your subscription to access the dashboard.</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-primary-800 dark:text-primary-100">Subscription Details</h2>
            <p className="text-primary-700 dark:text-primary-300 mb-1">Plan: The Complete Lazy Trend</p>
            <p className="text-primary-700 dark:text-primary-300 mb-4">Price: $49.95/month</p>
            <ul className="list-disc pl-5 text-primary-700 dark:text-primary-300 mb-4 space-y-2">
              <li>Daily TikTok trend analysis</li>
              <li>Personalized content recommendations</li>
              <li>Daily email reports</li>
              <li>Cancel anytime</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="btn btn-primary w-full py-3 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
