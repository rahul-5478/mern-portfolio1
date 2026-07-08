import React from 'react';
import { useFadeIn } from '../hooks.js';

const timelineData = [
  { title: "MERN Stack Developer — Industrial Training", meta: "Sensation Software Solutions Pvt. Ltd. · Jul–Aug 2025 · Grade A+", desc: "Built a gym website capstone with service listings and membership plans; developed RESTful APIs with Node.js and Express connected to MongoDB." },
  { title: "BCA — Full Stack Development", meta: "GNA University, Phagwara, Punjab · 2023–2026", desc: "Bachelor of Computer Applications, specializing in full stack web development." },
  { title: "Class XII — Science", meta: "JJ Senior Secondary School · 2022–2023 · 73%", desc: "" },
  { title: "Class X", meta: "Shri Mahavir Jain Model School · 2020–2021 · 78%", desc: "" }
];

function TimelineItem({ title, meta, desc }) {
  const fade = useFadeIn(0);
  return (
    <div className={`timeline-item ${fade.className}`} ref={fade.ref} style={fade.style}>
      <div className="timeline-dot"></div>
      <div className="timeline-title">{title}</div>
      <div className="timeline-meta">{meta}</div>
      {desc && <div className="timeline-desc">{desc}</div>}
    </div>
  );
}

export default function Timeline() {
  const headingFade = useFadeIn(0);
  return (
    <section className="timeline-section" id="timeline">
      <h2 className={`timeline-heading hero-heading ${headingFade.className}`} ref={headingFade.ref} style={headingFade.style}>
        Journey
      </h2>
      <div className="timeline-track">
        {timelineData.map((t, i) => <TimelineItem key={i} {...t} />)}
      </div>
    </section>
  );
}
