import { supabase } from './supabaseService';

/**
 * Create a Stripe Checkout session
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {Promise<string>} - Checkout URL
 */
export const createCheckoutSession = async (userId, email) => {
  try {
    // For development mode, return a mock URL if API_URL is not set
    if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
      console.log('Development mode detected, using mock checkout URL');
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return 'https://example.com/mock-checkout';
    }

    console.log('Creating checkout session with API URL:', import.meta.env.VITE_API_URL || '');

    // Call the backend API to create a checkout session
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
        priceId: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1REaY3G4vQYDStWYZu4rRLu5',
        successUrl: `${window.location.origin}/payment-success?redirect=true`,
        cancelUrl: `${window.location.origin}/payment-cancel`,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create checkout session';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
        errorMessage += ` (Status: ${response.status})`;
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing response:', jsonError);
      throw new Error('Invalid response from server');
    }
    return data.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Handle successful payment
 * @param {string} sessionId - Stripe session ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Updated user profile
 */
export const handlePaymentSuccess = async (sessionId, userId) => {
  try {
    // First, check if the user already has payment information
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', userId)
      .single();

    // If the user already has payment information, just return the existing data
    if (existingUser?.payment_completed) {
      return existingUser;
    }

    // Update user profile with payment information
    const { data, error } = await supabase
      .from('users')
      .update({
        payment_completed: true,
        payment_date: new Date().toISOString(),
        payment_id: sessionId,
        subscription_status: 'trialing', // Default to trialing for new subscriptions
        trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        onboarding_completed: true // Ensure onboarding is marked as complete
      })
      .eq('auth_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
};

/**
 * Create a Stripe Customer Portal session
 * @returns {Promise<string>} - Customer portal URL
 */
export const createCustomerPortalSession = async () => {
  try {
    // Call the backend API to create a customer portal session
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnUrl: window.location.origin,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create customer portal session';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
        errorMessage += ` (Status: ${response.status})`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
};

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Subscription ID
 * @returns {Promise<Object>} - Cancellation result
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }

    // Call the backend API to cancel the subscription
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to cancel subscription';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
        errorMessage += ` (Status: ${response.status})`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export default {
  createCheckoutSession,
  handlePaymentSuccess,
  createCustomerPortalSession,
  cancelSubscription
};
