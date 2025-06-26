const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')('*API KEY HERE*');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

app.post('/checkout', async (req, res, next) => {
  try {
    if (!req.body.items || !Array.isArray(req.body.items)) {
      return res.status(400).json({ error: 'Invalid items in request body.' });
    }

    const lineItems = req.body.items.map((item) => {
      if (!item.name || !item.price || typeof item.price !== 'number') {
        throw new Error('Invalid item format.');
      }

      console.log('Image url:', `http://localhost:3000${item.imageUrl}`);
      console.log('Url:', item.imageUrl);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:4200/checkout',
      cancel_url: 'http://localhost:4200/cancel',
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error in /checkout:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(4242, () => console.log('Server running on port 4242'));
