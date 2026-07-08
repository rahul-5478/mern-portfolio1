import React, { useEffect, useRef } from 'react';
import { useFadeIn } from '../hooks.js';

const ABOUT_TEXT = "I'm a full stack developer and data science student, working across the MERN stack to build complete, deployable products. I focus on real-time AI integrations, clean backend architecture, and shipping fast. Let's build something incredible together!";

export default function About() {
  const headingFade = useFadeIn(0);
  const btnFade = useFadeIn(0);
  const textRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      const el = textRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const end = vh * 0.2;
      const spans = el.querySelectorAll('span');
      const total = spans.length;
      spans.forEach((span, i) => {
        const charProgressPoint = rect.top + (rect.height * (i / total));
        let p = (start - charProgressPoint) / (start - end);
        p = Math.max(0, Math.min(1, p));
        span.style.opacity = 0.2 + p * 0.8;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="about-section" id="about">
      <h2 className={`about-heading hero-heading ${headingFade.className}`} ref={headingFade.ref} style={headingFade.style}>
        About me
      </h2>
      <p className="about-text" ref={textRef}>
        {ABOUT_TEXT.split('').map((ch, i) => (
          <span key={i}>{ch === ' ' ? ' ' : ch}</span>
        ))}
      </p>
      <button className={`contact-btn ${btnFade.className}`} ref={btnFade.ref} style={btnFade.style}>Contact Me</button>
    </section>
  );
}
