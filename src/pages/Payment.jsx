import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../services/supabaseService';

// Load Stripe outside of component to avoid recreating it on renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY, {
  stripeAccount: import.meta.env.VITE_STRIPE_CONNECT_ACCOUNT_ID
});

// Checkout form component
const CheckoutForm = () => {
  const { user, userProfile, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Create a payment intent when the component mounts
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError(null);

        // For development, we'll use a mock API endpoint
        // In production, this would call your actual API
        let response;

        if (import.meta.env.DEV) {
          // Mock response for development
          response = {
            ok: true,
            json: () => Promise.resolve({
              clientSecret: 'mock_client_secret',
              amount: 2999,
              currency: 'usd'
            })
          };
        } else {
          // Call your backend to create a payment intent
          response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
              userId: user?.id,
              email: user?.email
            }),
          });
        }

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError(err.message || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      createPaymentIntent();
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let paymentSucceeded = false;
      let paymentId = 'mock_payment_id';

      if (import.meta.env.DEV) {
        // In development mode, simulate a successful payment
        paymentSucceeded = true;
      } else {
        // In production, process the actual payment
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: user.email,
            },
          },
        });

        if (result.error) {
          throw result.error;
        } else if (result.paymentIntent.status === 'succeeded') {
          paymentSucceeded = true;
          paymentId = result.paymentIntent.id;
        }
      }

      if (paymentSucceeded) {
        // Payment succeeded, update user profile
        setPaymentSuccess(true);

        // Update user profile with payment information
        // Note: In a production environment, you should verify this on the server side
        // using webhooks to ensure the payment was actually successful
        const { error: updateError } = await supabase
          .from('users')
          .update({
            payment_completed: true,
            payment_date: new Date().toISOString(),
            payment_id: paymentId,
            onboarding_completed: true // Ensure onboarding is marked as complete
          })
          .eq('auth_id', user.id);

        if (updateError) {
          console.error('Error updating user profile:', updateError);
        } else {
          // Refresh user profile
          await fetchUserProfile(user.id);

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {paymentSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p>Payment successful! Redirecting to dashboard...</p>
        </div>
      )}

      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || paymentSuccess}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// Main Payment page component
const Payment = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user has already completed payment, redirect to dashboard
    if (userProfile?.payment_completed) {
      navigate('/', { replace: true });
    }
  }, [userProfile, navigate]);

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

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
