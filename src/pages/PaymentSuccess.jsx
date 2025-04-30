import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handlePaymentSuccess } from '../services/stripeService';

const PaymentSuccess = () => {
  const { user, userProfile, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trialInfo, setTrialInfo] = useState(null);

  // Get the session_id from URL query parameters
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPayment = async () => {
      if (!sessionId || !user) {
        setLoading(false);
        return;
      }

      try {
        // Update user profile with payment information
        await handlePaymentSuccess(sessionId, user.id);

        // Refresh user profile
        const updatedProfile = await fetchUserProfile(user.id);

        // Check if user is in trial
        if (updatedProfile?.subscription_status === 'trialing' && updatedProfile?.trial_end) {
          const trialEndDate = new Date(updatedProfile.trial_end);
          setTrialInfo({
            isTrialing: true,
            trialEndDate,
            daysLeft: Math.ceil((trialEndDate - new Date()) / (1000 * 60 * 60 * 24))
          });
        }

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 5000);
      } catch (err) {
        console.error('Error processing payment success:', err);
        setError(err.message || 'Failed to process payment');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [sessionId, user, fetchUserProfile, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Payment Successful!</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">Processing your payment...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
            <button
              onClick={() => navigate('/payment')}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              {trialInfo ? (
                <>
                  <p className="font-bold mb-2">Your 7-Day Free Trial Has Started!</p>
                  <p>Your trial will end on {trialInfo.trialEndDate.toLocaleDateString()}.</p>
                  <p>You have {trialInfo.daysLeft} days to explore all features.</p>
                  <p className="mt-2">You won't be charged until your trial ends.</p>
                </>
              ) : (
                <p>Thank you for your payment! Your subscription is now active.</p>
              )}
            </div>

            <p className="mb-6">You will be redirected to the dashboard in a few seconds...</p>

            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Go to Dashboard Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
