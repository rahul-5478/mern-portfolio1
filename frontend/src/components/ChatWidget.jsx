import React, { useEffect, useRef, useState } from 'react';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : ''; // set your deployed backend URL here for production

async function getBotReply(message) {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Bad response');
    const data = await res.json();
    return data.reply;
  } catch (err) {
    return "I couldn't reach my backend just now. Make sure the server in /backend is running (npm start) and try again.";
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, typing]);

  function toggleChat() {
    const next = !open;
    setOpen(next);
    if (next && messages.length === 0) {
      setMessages([{ sender: 'bot', text: "Hi! I'm Rahul's AI assistant — ask me about his projects, skills, or experience." }]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setTyping(true);
    const reply = await getBotReply(text);
    setTyping(false);
    setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
  }

  return (
    <div className="chat-widget">
      <div className={`chat-panel ${open ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">RK</div>
            <div>
              <div className="chat-title">Rahul's AI Assistant</div>
              <div className="chat-status"><span className="status-dot"></span>Online</div>
            </div>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)}>&times;</button>
        </div>
        <div className="chat-messages" ref={messagesRef}>
          {messages.map((m, i) => (
            <div className={`chat-msg ${m.sender}`} key={i}>{m.text}</div>
          ))}
        </div>
        {typing && (
          <div className="chat-typing" style={{ display: 'flex' }}>
            <span></span><span></span><span></span>
          </div>
        )}
        <form className="chat-input-row" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask about my projects, skills..."
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="chat-send" aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 11L21 3L14 21L11 13L3 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
          </button>
        </form>
      </div>
      <button className={`chat-bubble ${open ? 'open' : ''}`} onClick={toggleChat} aria-label="Open chat">
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="white" strokeWidth="2.4" strokeLinecap="round"/></svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 11.5C21 16.75 16.75 21 11.5 21C10.05 21 8.68 20.68 7.46 20.1L3 21L4.4 17.09C3.52 15.77 3 14.19 3 12.5C3 7.25 7.25 3 12.5 3C17.53 3 21.65 6.9 21.98 11.86" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>
    </div>
  );
}
