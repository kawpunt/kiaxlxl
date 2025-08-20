const express = require('express');
const router = express.Router();

// Guard if no Stripe key
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[Checkout] STRIPE_SECRET_KEY missing. Checkout API will return 501.');
}

let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.warn('[Checkout] Stripe SDK not available.');
}

// Map simple product IDs to price data
const PRODUCTS = {
  'meta-ads': { name: 'Meta Ads Setup', amount: 150000, currency: 'usd' }, // $1,500
  'seo': { name: 'SEO Monthly Plan', amount: 120000, currency: 'usd' },    // $1,200
  'funnels': { name: 'Sales Funnel Build', amount: 500000, currency: 'usd' }, // $5,000
  'consulting': { name: 'Sales Consulting (Starter)', amount: 15000, currency: 'usd' } // $150
};

router.post('/create-session', async (req, res) => {
  try {
    const { productId } = req.body || {};
    if (!PRODUCTS[productId]) {
      return res.status(400).json({ success: false, error: 'Invalid product' });
    }
    if (!stripe) {
      return res.status(501).json({ success: false, error: 'Checkout disabled' });
    }

    const origin = `${req.protocol}://${req.get('host')}`;
    const p = PRODUCTS[productId];
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: p.currency,
            product_data: { name: p.name },
            unit_amount: p.amount
          },
          quantity: 1
        }
      ],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    console.error('[Checkout] error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;

