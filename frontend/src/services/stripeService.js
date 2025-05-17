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

    // First, check if the backend is available
    try {
      const testResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/stripe-test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log('Stripe test response:', testData);

        // If we're using a mock Stripe in production, show a warning
        if (testData.mockStripe && import.meta.env.PROD) {
          console.warn('WARNING: Using mock Stripe in production environment!');
        }
      } else {
        console.warn('Stripe test endpoint not available or returned an error');
      }
    } catch (testError) {
      console.warn('Error testing Stripe configuration:', testError);
    }

    // Call the backend API to create a checkout session
    console.log('Sending checkout request with price ID:', import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1RKJ9LG4vQYDStWYwbdkHlvJ');

    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
        priceId: 'price_1RKJ9LG4vQYDStWYwbdkHlvJ', // Always use the new price ID
        successUrl: `${window.location.origin}/dashboard/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancel`,
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to create checkout session';
      let errorDetails = '';

      try {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        errorMessage = errorData.message || errorMessage;
        errorDetails = errorData.details || errorData.error || '';
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
        errorMessage += ` (Status: ${response.status})`;
      }

      // For development, provide more detailed error information
      if (import.meta.env.DEV) {
        throw new Error(`${errorMessage}\n${errorDetails}`);
      } else {
        throw new Error(errorMessage);
      }
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
    // The actual implementation is now directly in the SubscriptionManager component
    // This function is kept for API consistency
    throw new Error('This function has been moved to the component level');
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
};

export default {
  createCheckoutSession,
  handlePaymentSuccess,
  createCustomerPortalSession
};
