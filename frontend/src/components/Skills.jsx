import React, { useEffect, useRef } from 'react';
import { useFadeIn } from '../hooks.js';

const skillsData = [
  { name: "Frontend", tools: "React, Next.js, Tailwind, JS (ES6+)", level: 88 },
  { name: "Backend", tools: "Node.js, Express, REST APIs, JWT", level: 85 },
  { name: "Database", tools: "MongoDB, Mongoose, MySQL, Firebase", level: 80 },
  { name: "AI Integration", tools: "Groq API, Claude Vision, Prompt Engineering", level: 82 },
  { name: "Payments & Media", tools: "Razorpay, Cloudinary", level: 75 },
  { name: "DevOps", tools: "Git, Vercel, Render, MongoDB Atlas", level: 78 }
];

function SkillBar({ name, tools, level }) {
  const fillRef = useRef(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.width = level + '%';
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [level]);

  return (
    <div className="skill-row">
      <div className="skill-row-top">
        <span className="skill-name">{name}</span>
        <span className="skill-tools">{tools}</span>
      </div>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" ref={fillRef}></div>
      </div>
    </div>
  );
}

export default function Skills() {
  const headingFade = useFadeIn(0);
  return (
    <section className="skills-section" id="skills">
      <h2 className={`skills-heading hero-heading ${headingFade.className}`} ref={headingFade.ref} style={headingFade.style}>
        Skills
      </h2>
      <div className="skills-grid">
        {skillsData.map((s) => <SkillBar key={s.name} {...s} />)}
      </div>
    </section>
  );
}
