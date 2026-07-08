import React, { useEffect, useRef } from 'react';

const row1Items = ["MongoDB","Express.js","React","Node.js","JWT Auth","TypeScript","Tailwind CSS","REST APIs","Groq AI","Vite"];
const row2Items = ["Razorpay","Stripe","Capacitor","Render","Vercel","Framer Motion","Socket.io","MERN Stack","LLM Integration"];

export default function TechMarquee() {
  const sectionRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current;
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      if (!section || !row1 || !row2) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      row1.style.transform = `translateX(${offset - 200}px)`;
      row2.style.transform = `translateX(${-(offset - 200)}px)`;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tripledRow1 = [...row1Items, ...row1Items, ...row1Items];
  const tripledRow2 = [...row2Items, ...row2Items, ...row2Items];

  return (
    <section className="marquee-section" ref={sectionRef}>
      <div className="marquee-row" ref={row1Ref}>
        {tripledRow1.map((t, i) => <div className="tech-pill" key={i}>{t}</div>)}
      </div>
      <div className="marquee-row" ref={row2Ref}>
        {tripledRow2.map((t, i) => <div className="tech-pill" key={i}>{t}</div>)}
      </div>
    </section>
  );
}
