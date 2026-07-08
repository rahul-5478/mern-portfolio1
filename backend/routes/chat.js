const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { SYSTEM_PROMPT } = require('../data/knowledge');
const ChatLog = require('../models/ChatLog');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile'; // change here if you want a different Groq model

// Keep a short in-memory history per session id so the bot has some
// conversational context. This resets whenever the server restarts —
// swap in a real store (Redis, a DB) if you need it to persist.
const sessions = new Map();
const MAX_HISTORY_MESSAGES = 8;

router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: 'Server is missing GROQ_API_KEY. Add it to backend/.env (see .env.example).'
      });
    }

    const sid = sessionId || 'default';
    const history = sessions.get(sid) || [];

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message.trim() }
    ];

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 400
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq API error:', groqRes.status, errText);
      return res.status(502).json({ error: 'The AI backend had trouble responding. Please try again.' });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim()
      || "Sorry, I didn't catch that — could you rephrase?";

    // update short rolling history (in-memory, for conversational context)
    const updatedHistory = [...history, { role: 'user', content: message.trim() }, { role: 'assistant', content: reply }]
      .slice(-MAX_HISTORY_MESSAGES);
    sessions.set(sid, updatedHistory);

    // fire-and-forget log to MongoDB if it's connected — lets you review
    // real visitor questions later and improve data/knowledge.js accordingly
    if (mongoose.connection.readyState === 1) {
      ChatLog.create({ sessionId: sid, userMessage: message.trim(), botReply: reply }).catch((e) =>
        console.error('Failed to log chat message:', e.message)
      );
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chat route error:', err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

module.exports = router;
