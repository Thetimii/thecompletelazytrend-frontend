import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async (req, res) => {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    
    let event;
    
    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;
        
        if (userId) {
          try {
            // Update user profile to mark payment as completed and onboarding as completed
            const { error } = await supabase
              .from('users')
              .update({
                payment_completed: true,
                payment_date: new Date().toISOString(),
                payment_id: paymentIntent.id,
                onboarding_completed: true
              })
              .eq('auth_id', userId);
            
            if (error) {
              console.error('Error updating user profile:', error);
            } else {
              console.log(`User ${userId} payment completed and onboarding marked as complete`);
            }
          } catch (dbError) {
            console.error('Database error:', dbError);
          }
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        console.log(`Payment failed for user ${failedPaymentIntent.metadata.userId}`);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
