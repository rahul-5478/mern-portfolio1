const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  sessionId: { type: String, default: 'default' },
  userMessage: { type: String, required: true },
  botReply: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
