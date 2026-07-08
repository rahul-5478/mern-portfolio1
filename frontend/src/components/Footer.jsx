import React, { useState } from 'react';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : ''; // set your deployed backend URL here for production

export default function Footer() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-top">
        <div className="footer-name hero-heading">Rahul Kumar</div>
        <div className="footer-links">
          <a href="https://github.com/rahul-5478" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/rahul-kumar-a51935296" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:kumartiwari0005@gmail.com">Email</a>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-row">
          <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your email" value={form.email} onChange={handleChange} required />
        </div>
        <textarea name="message" placeholder="Your message" rows="3" value={form.message} onChange={handleChange} required></textarea>
        <button type="submit" className="contact-btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'sent' && <p className="form-status success">Thanks — I'll get back to you soon!</p>}
        {status === 'error' && <p className="form-status error">Couldn't send right now — make sure the backend is running, or email me directly.</p>}
      </form>

      <div className="footer-bottom">
        <span>© 2026 Rahul Kumar. All rights reserved.</span>
        <span>Built with MERN + AI</span>
      </div>
    </footer>
  );
}
