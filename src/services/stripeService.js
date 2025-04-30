import { supabase } from './supabaseService';

/**
 * Create a Stripe Checkout session
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {Promise<string>} - Checkout URL
 */
export const createCheckoutSession = async (userId, email) => {
  try {
    // Call the backend API to create a checkout session
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
        priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancel`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create checkout session');
    }

    const data = await response.json();
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
    // Update user profile with payment information
    const { data, error } = await supabase
      .from('users')
      .update({
        payment_completed: true,
        payment_date: new Date().toISOString(),
        payment_id: sessionId,
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

export default {
  createCheckoutSession,
  handlePaymentSuccess
};
