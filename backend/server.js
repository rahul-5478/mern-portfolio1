require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const chatRoute = require('./routes/chat');
const contactRoute = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman) and any listed origin
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  }
}));

app.use(express.json());

// health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Rahul Kumar portfolio backend is running.' });
});

app.use('/api/chat', chatRoute);
app.use('/api/contact', contactRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✔ Backend running at http://localhost:${PORT}`);
    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠ GROQ_API_KEY is not set. Copy .env.example to .env and add your key.');
    }
  });
});
