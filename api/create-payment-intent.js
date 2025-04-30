import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  stripeAccount: process.env.STRIPE_CONNECT_ACCOUNT_ID
});

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { priceId, userId, email } = req.body;
      
      if (!priceId) {
        return res.status(400).json({ message: 'Price ID is required' });
      }
      
      // Get the price from Stripe
      const price = await stripe.prices.retrieve(priceId);
      
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }
      
      // Create a customer if one doesn't exist
      let customerId;
      
      if (email) {
        // Check if customer already exists
        const customers = await stripe.customers.list({
          email,
          limit: 1
        });
        
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          // Create a new customer
          const customer = await stripe.customers.create({
            email,
            metadata: {
              userId
            }
          });
          customerId = customer.id;
        }
      }
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price.unit_amount,
        currency: price.currency,
        customer: customerId,
        metadata: {
          userId,
          priceId,
          productId: price.product
        },
        receipt_email: email,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        amount: price.unit_amount,
        currency: price.currency
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({
        message: error.message || 'Failed to create payment intent'
      });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
