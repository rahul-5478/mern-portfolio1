const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Gmail App Password, not your normal password
    }
  });
  return transporter;
}

/**
 * Sends Rahul an email whenever someone submits the contact form.
 * Fails silently (logs a warning) if EMAIL_USER/EMAIL_PASS aren't set,
 * so the contact form still works (and still saves to MongoDB) even
 * before email is configured.
 */
async function sendContactNotification({ name, email, message }) {
  const t = getTransporter();
  if (!t) {
    console.warn('⚠ EMAIL_USER/EMAIL_PASS not set — skipping email notification.');
    return { sent: false };
  }

  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;

  await t.sendMail({
    from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    text: `You got a new message from your portfolio site.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2 style="color:#1E3A8A;">New message from your portfolio</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap; background:#f4f7fc; padding:12px; border-radius:8px;">${escapeHtml(message)}</p>
      </div>
    `
  });

  return { sent: true };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = { sendContactNotification };