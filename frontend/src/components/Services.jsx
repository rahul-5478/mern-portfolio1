import React from 'react';
import { useFadeIn } from '../hooks.js';

const services = [
  ["01", "Full Stack Development", "End-to-end MERN applications — from database schema to polished, responsive React frontends."],
  ["02", "AI Integration", "Adding LLM-powered features using Groq, OpenAI-compatible SDKs, and custom prompt pipelines."],
  ["03", "Payments & Auth", "Secure JWT authentication, Razorpay and Stripe integrations, subscription and referral systems."],
  ["04", "Mobile Apps", "Wrapping web apps into installable Android/iOS apps using Capacitor."],
  ["05", "Deployment & DevOps", "Shipping production apps with Render, Vercel, and monorepo-friendly build pipelines."]
];

function ServiceItem({ num, name, desc, delay }) {
  const fade = useFadeIn(delay);
  return (
    <div className={`service-item ${fade.className}`} ref={fade.ref} style={fade.style}>
      <div className="service-number">{num}</div>
      <div className="service-body">
        <div className="service-name">{name}</div>
        <div className="service-desc">{desc}</div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section className="services-section" id="services">
      <h2 className="services-heading">Services</h2>
      <div className="services-list">
        {services.map(([num, name, desc], i) => (
          <ServiceItem key={num} num={num} name={name} desc={desc} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
