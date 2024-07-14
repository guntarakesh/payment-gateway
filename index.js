require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/dbConfig');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = 3000;
const cors = require('cors')

app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'views')));
app.use(cors())

connectDB(); 

app.use('/api/auth', authRoutes);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.use(authMiddleware);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});



// app.post('/process-payment', async (req, res) => {
//   const { amount, currency, token } = req.body;
//   try {
//     // Create a payment intent using the Stripe API
//     const paymentIntent = await stripe.charges.create({
//       amount,
//       currency,
//       payment_method_data: {
//         type: 'card',
//         card: {
//           token: token
//         },
//       },
//       confirm: true,
//       return_url: 'http://localhost:3000/'
//     });
//     // console.log(paymentIntent)

//     // Return the payment intent status to the client
//     res.json({ status: paymentIntent.status });

//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while processing the payment.' });
//   }
// });

app.post('/process-payment', async (req, res) => {
  const { amount } = req.body;
  try {
    // Create a payment intent using the Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    // console.log(paymentIntent)

    // Return the payment intent status to the client
    res.json({ status: paymentIntent.status });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the payment.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
