require('dotenv').config();

//console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY); // Debugging

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Stripe secret key is missing from environment variables');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;