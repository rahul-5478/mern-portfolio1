const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ContactMessage = require('../models/ContactMessage');
const { sendContactNotification } = require('../utils/mailer');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are all required.' });
    }

    // Save to MongoDB if connected (gracefully skip if not configured yet)
    if (mongoose.connection.readyState === 1) {
      await ContactMessage.create({ name, email, message });
    } else {
      console.log('New contact message (DB not connected, logging only):', { name, email, message });
    }

    // Email Rahul so he sees it immediately, even without checking the DB
    let emailResult = { sent: false };
    try {
      emailResult = await sendContactNotification({ name, email, message });
    } catch (mailErr) {
      console.error('Failed to send contact email:', mailErr.message);
    }

    res.status(201).json({
      ok: true,
      emailSent: emailResult.sent,
      warning: mongoose.connection.readyState !== 1
        ? 'Message received but not saved to the database — MONGODB_URI is not configured on the server.'
        : undefined
    });
  } catch (err) {
    console.error('Contact route error:', err);
    res.status(500).json({ error: 'Something went wrong saving your message.' });
  }
});

module.exports = router;