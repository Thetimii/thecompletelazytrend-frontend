import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCustomerPortalSession } from '../services/stripeService';

const SubscriptionManager = ({ userProfile }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format trial end date if available
  const trialEndDate = userProfile?.trial_end_date
    ? new Date(userProfile.trial_end_date).toLocaleDateString()
    : null;

  // Calculate days left in trial
  const daysLeftInTrial = userProfile?.trial_end_date
    ? Math.max(0, Math.ceil((new Date(userProfile.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Format subscription status for display
  const formatStatus = (status) => {
    switch (status) {
      case 'trialing':
        return 'Trial Period';
      case 'active':
        return 'Active';
      case 'canceled':
      case 'cancelled':
        return 'Canceled';
      case 'past_due':
        return 'Past Due';
      case 'unpaid':
        return 'Unpaid';
      default:
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    }
  };

  // Handle opening Stripe Customer Portal
  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the backend to create a customer portal session
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          returnUrl: window.location.origin,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create portal session: ${response.status}`);
      }

      const data = await response.json();

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (err) {
      console.error('Error opening customer portal:', err);
      setError(err.message || 'Failed to open subscription management portal');
    } finally {
      setLoading(false);
    }
  };

  // If no subscription data is available
  if (!userProfile?.subscription_status && !userProfile?.payment_completed) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-primary-500 dark:text-primary-400 text-sm">Status:</p>
            <p className="font-semibold text-primary-800 dark:text-primary-100">
              {formatStatus(userProfile.subscription_status)}
              {userProfile.subscription_status === 'trialing' && (
                <span className="ml-2 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 text-xs font-medium px-2.5 py-0.5 rounded">
                  {daysLeftInTrial} days left
                </span>
              )}
            </p>
          </div>

          {userProfile.payment_date && (
            <div>
              <p className="text-primary-500 dark:text-primary-400 text-sm">Started:</p>
              <p className="font-semibold text-primary-800 dark:text-primary-100">{new Date(userProfile.payment_date).toLocaleDateString()}</p>
            </div>
          )}

          {trialEndDate && userProfile.subscription_status === 'trialing' && (
            <div>
              <p className="text-primary-500 dark:text-primary-400 text-sm">Trial Ends:</p>
              <p className="font-semibold text-primary-800 dark:text-primary-100">{trialEndDate}</p>
            </div>
          )}

          {userProfile.subscription_status === 'cancelled' && (
            <div>
              <p className="text-primary-500 dark:text-primary-400 text-sm">Access Until:</p>
              <p className="font-semibold text-primary-800 dark:text-primary-100">{userProfile.cancel_at ? new Date(userProfile.cancel_at).toLocaleDateString() : 'End of billing period'}</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleManageSubscription}
          disabled={loading}
          className="btn btn-primary disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Manage Subscription'}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionManager;
