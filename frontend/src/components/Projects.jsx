import React, { useEffect, useRef, useState } from 'react';

const projects = [
  {
    num: "01", name: "SkillAnalyzer", cat: "AI Resume & Skill Analyzer", category: "personal",
    desc: "Parses resumes using Groq's Llama 3.3-70B to extract skills and surface gaps, returning results in ~2–3 seconds with an interactive skill heatmap.",
    tags: ["React", "Node.js", "MongoDB", "Groq Llama 3.3"],
    gradient: "linear-gradient(135deg,#0A1330,#22D3EE)",
    initial: "SA",
    link: "https://skill-analyzer-iota.vercel.app/", code: "https://github.com/rahul-5478/skillanalyzer"
  },
  {
    num: "02", name: "HireAI", cat: "Job Portal", category: "personal",
    desc: "A full job portal with candidate and recruiter roles, JWT auth, role-based dashboards, deployed on Vercel + Render with MongoDB Atlas.",
    tags: ["React", "Node.js", "MongoDB", "Express", "JWT"],
    gradient: "linear-gradient(135deg,#1E3A8A,#3B82F6)",
    initial: "HR",
    link: "https://job-portal-gules-six.vercel.app/", code: "https://github.com/rahul-5478/hireai"
  },
  {
    num: "03", name: "PDF Toolkit", cat: "Online PDF Editor", category: "personal",
    desc: "An iLovePDF-style toolkit supporting merge, split, compress, convert, rotate, and watermark — with server-side PDF processing and no third-party APIs.",
    tags: ["React", "Node.js", "pdf-lib", "Multer"],
    gradient: "linear-gradient(135deg,#060B18,#1E3A8A)",
    initial: "PDF",
    link: "https://pdftool-delta.vercel.app/", code: "#"
  },
  {
    num: "04", name: "GlowUp AI", cat: "Beauty & Skincare Advisor", category: "personal",
    desc: "Face analysis and skincare recommendations using the Claude Vision API, routed through a secure Express backend, packaged as an Android app via Capacitor.",
    tags: ["React", "Node.js", "Claude Vision AI", "MongoDB"],
    gradient: "linear-gradient(135deg,#2A1B5C,#8B7FF5)",
    initial: "GU",
    link: "https://glowup-ai-xi.vercel.app/", code: "https://github.com/rahul-5478/glowup-ai"
  },
  {
    num: "05", name: "Gym Website Capstone", cat: "Industrial Training Project", category: "client",
    desc: "Client capstone built during industrial training — service listings, membership plans, and contact forms, graded A+ for production-readiness of code and deployment.",
    tags: ["Node.js", "Express", "MongoDB", "REST API"],
    gradient: "linear-gradient(135deg,#1E3A8A,#22D3EE)",
    initial: "GYM",
    link: "#", code: "#"
  }
];

function ProjectCard({ p, index, total, cardRef }) {
  return (
    <div className="card-sticky-outer">
      <div className="project-card" ref={cardRef} data-index={index}>
        <div className="card-top">
          <div className="card-top-left">
            <div className="card-number">{p.num}</div>
            <div className="card-meta">
              <div className="card-category">{p.cat}</div>
              <div className="card-name">{p.name}</div>
            </div>
          </div>
          {p.link && p.link !== '#' ? (
            <a className="live-btn" href={p.link} target="_blank" rel="noopener noreferrer">Live Project</a>
          ) : (
            <span className="live-btn" style={{ opacity: .4, cursor: 'default' }}>Client Project</span>
          )}
        </div>
        <div className="card-grid">
          <div className="card-info">
            <div className="card-desc">{p.desc}</div>
            <div className="card-tags">
              {p.tags.map((t) => <span className="card-tag" key={t}>{t}</span>)}
            </div>
            <div className="card-links">
              {p.link && p.link !== '#' && <a className="live-btn small" href={p.link} target="_blank" rel="noopener noreferrer">Live Demo</a>}
              {p.code && p.code !== '#' && <a className="live-btn small" href={p.code} target="_blank" rel="noopener noreferrer">Source Code</a>}
            </div>
          </div>
          <div className="card-visual" style={{ background: p.gradient }}>
            <span>{p.initial}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const cardsWrapRef = useRef(null);
  const cardRefs = useRef([]);
  const stateRef = useRef([]);

  const list = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, list.length);
    stateRef.current = list.map(() => ({ scale: 1, rotX: 0, rotY: 0 }));
  }, [filter, list.length]);

  useEffect(() => {
    const total = list.length;

    function applyTransform(i) {
      const card = cardRefs.current[i];
      const s = stateRef.current[i];
      if (!card || !s) return;
      card.style.transform = `scale(${s.scale}) rotateX(${s.rotX}deg) rotateY(${s.rotY}deg)`;
    }

    function onScroll() {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const outer = card.parentElement;
        const rect = outer.getBoundingClientRect();
        let progress = 0;
        if (rect.top < 0) progress = Math.min(1, -rect.top / (rect.height * 0.6));
        const targetScale = 1 - (total - 1 - i) * 0.03;
        const finalScale = targetScale + (1 - targetScale) * (1 - progress);
        stateRef.current[i].scale = Math.min(1, finalScale);
        applyTransform(i);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const wrap = cardsWrapRef.current;
    const TILT_MAX = 6;
    function onMouseMove(e) {
      const card = e.target.closest('.project-card');
      if (!card) return;
      const i = cardRefs.current.indexOf(card);
      if (i === -1) return;
      const rect = card.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      stateRef.current[i].rotY = nx * TILT_MAX;
      stateRef.current[i].rotX = -ny * TILT_MAX;
      applyTransform(i);
    }
    function onMouseOut(e) {
      const card = e.target.closest('.project-card');
      if (!card) return;
      const i = cardRefs.current.indexOf(card);
      if (i === -1) return;
      stateRef.current[i].rotX = 0;
      stateRef.current[i].rotY = 0;
      applyTransform(i);
    }
    if (wrap) {
      wrap.addEventListener('mousemove', onMouseMove);
      wrap.addEventListener('mouseout', onMouseOut);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (wrap) {
        wrap.removeEventListener('mousemove', onMouseMove);
        wrap.removeEventListener('mouseout', onMouseOut);
      }
    };
  }, [list.length]);

  return (
    <section className="projects-section" id="projects">
      <h2 className="projects-heading hero-heading">Project</h2>
      <div className="filter-tabs">
        {['all', 'personal', 'client'].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="cards-wrap" ref={cardsWrapRef}>
        {list.map((p, i) => (
          <ProjectCard
            key={p.name}
            p={p}
            index={i}
            total={list.length}
            cardRef={(el) => { cardRefs.current[i] = el; }}
          />
        ))}
      </div>
    </section>
  );
}
