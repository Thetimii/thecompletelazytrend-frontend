import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handlePaymentSuccess } from '../services/stripeService';

const PaymentSuccess = () => {
  const { user, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);

  // Get the session_id from URL query parameters
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPayment = async () => {
      if (!sessionId || !user) {
        // If no session ID or user, still show the success page
        setProcessing(false);
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
      } catch (err) {
        console.error('Error processing payment success:', err);
        // Even if there's an error, show the success page
        setProcessing(false);
      }
    };

    processPayment();
  }, [sessionId, user, fetchUserProfile, navigate]);

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-primary-50 dark:bg-primary-950 fixed inset-0">
      <div className="max-w-2xl w-full bg-white dark:bg-primary-900 p-8 rounded-xl shadow-xl border border-primary-100 dark:border-primary-800 m-4">
        {processing ? (
          // Processing payment view
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100 mb-4">
              Processing Your Payment
            </h2>
            <p className="text-primary-600 dark:text-primary-400">
              Please wait while we confirm your payment details...
            </p>
          </div>
        ) : (
          // Payment success view
          <div>
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">LazyTrend</h1>
              <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100 mb-2">
                Welcome Aboard! 🎉
              </h2>
              <p className="text-primary-600 dark:text-primary-400 text-lg mb-6">
                Your payment has been processed successfully and your 7-day free trial has started!
              </p>
            </div>

            <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 rounded-lg">
              <h3 className="font-bold mb-2">What's happening now:</h3>
              <p className="mb-2">Our system is now automatically analyzing TikTok trends for you. Here's what we're doing:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Collecting and analyzing the latest TikTok trends</li>
                <li>Generating personalized content recommendations for your niche</li>
                <li>Creating AI-powered content ideas tailored to your business</li>
                <li>Setting up your daily email reports</li>
                <li>Preparing your dashboard with actionable insights</li>
              </ul>
              <p className="mt-2">This automated analysis is running in the background and will be ready for you when you access your dashboard.</p>
            </div>

            <div className="mb-8 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-lg">
              <h3 className="font-bold mb-2">What's included in your subscription:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Daily TikTok trend analysis</li>
                <li>Personalized content recommendations</li>
                <li>AI-powered content ideas</li>
                <li>Daily email reports</li>
                <li>Unlimited searches</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-primary-800 dark:text-primary-200 mb-3">Next steps:</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-accent-100 dark:bg-accent-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <span className="text-accent-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-800 dark:text-primary-200">Click "Go to Dashboard" below</h4>
                    <p className="text-primary-600 dark:text-primary-400">Your dashboard is now being prepared with your first set of trend insights.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-accent-100 dark:bg-accent-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <span className="text-accent-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-800 dark:text-primary-200">Explore your personalized trends</h4>
                    <p className="text-primary-600 dark:text-primary-400">Browse through the trending topics and content ideas we've automatically generated for you.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-accent-100 dark:bg-accent-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <span className="text-accent-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-800 dark:text-primary-200">Check your email</h4>
                    <p className="text-primary-600 dark:text-primary-400">We've sent you a welcome email with important information about your subscription and your first trend report.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/dashboard"
                className="btn btn-primary py-3 px-8 text-lg inline-flex items-center"
              >
                Go to Dashboard
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
