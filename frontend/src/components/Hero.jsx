import React, { useEffect, useRef, useState } from 'react';
import { useFadeIn } from '../hooks.js';

export default function Hero({ theme, onToggleTheme }) {
  const heroH1Ref = useRef(null);
  const magnetRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navbarFade = useFadeIn(0);
  const headingFade = useFadeIn(0.15);
  const taglineFade = useFadeIn(0.35);
  const btnFade = useFadeIn(0.5);
  const portraitFade = useFadeIn(0.6);

  // Auto-fit the huge heading so the full name always fits on one line
  useEffect(() => {
    const heroH1 = heroH1Ref.current;
    if (!heroH1) return;
    const container = heroH1.parentElement;

    function fitHeroHeading() {
      heroH1.style.transform = 'none';
      let lo = 10, hi = 400;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi + 1) / 2);
        heroH1.style.fontSize = mid + 'px';
        if (heroH1.scrollWidth <= container.clientWidth) lo = mid;
        else hi = mid - 1;
      }
      heroH1.style.fontSize = lo + 'px';
    }

    fitHeroHeading();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitHeroHeading);
    }

    const resizeObserver = new ResizeObserver(() => fitHeroHeading());
    resizeObserver.observe(container);

    window.addEventListener('resize', fitHeroHeading);
    window.addEventListener('orientationchange', fitHeroHeading);

    return () => {
      window.removeEventListener('resize', fitHeroHeading);
      window.removeEventListener('orientationchange', fitHeroHeading);
      resizeObserver.disconnect();
    };
  }, []);

  // Close mobile menu automatically if the viewport grows back to desktop size
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 640) setMenuOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Magnet hover + 3D tilt (image stays fixed in place, no dragging)
  useEffect(() => {
    const magnet = magnetRef.current;
    if (!magnet) return;

    const PADDING = 150, STRENGTH = 3, TILT_MAX = 12;
    function onMouseMove(e) {
      const rect = magnet.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist < Math.max(rect.width, rect.height) / 2 + PADDING) {
        const dx = (e.clientX - cx) / STRENGTH;
        const dy = (e.clientY - cy) / STRENGTH;
        const nx = (e.clientX - cx) / rect.width;
        const ny = (e.clientY - cy) / rect.height;
        const rotY = Math.max(-TILT_MAX, Math.min(TILT_MAX, nx * TILT_MAX));
        const rotX = Math.max(-TILT_MAX, Math.min(TILT_MAX, -ny * TILT_MAX));
        magnet.style.transition = 'transform .3s ease-out';
        magnet.style.transform = `translate3d(${dx}px,${dy}px,0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      } else {
        magnet.style.transition = 'transform .6s ease-in-out';
        magnet.style.transform = 'translate3d(0,0,0) rotateX(0) rotateY(0)';
      }
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <section className="hero">
      <div className="glow-blob b1"></div>
      <div className="glow-blob b2"></div>

      <nav className={`navbar ${navbarFade.className} ${menuOpen ? 'menu-open' : ''}`} ref={navbarFade.ref} style={navbarFade.style}>
        <div className="logo">
          <span className="logo-mark">RK</span>
          <span className="logo-text">Rahul<em>.dev</em></span>
        </div>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#about" data-nav="about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#services" data-nav="services" onClick={() => setMenuOpen(false)}>Price</a>
          <a href="#projects" data-nav="projects" onClick={() => setMenuOpen(false)}>Projects</a>
          <a href="#contact" data-nav="contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a className="resume-btn resume-btn-mobile" href="/Rahul_Kumar_Resume.pdf" download="Rahul_Kumar_Resume.pdf" onClick={() => setMenuOpen(false)}>Resume</a>
        </div>

        <div className="nav-actions">
          <a className="resume-btn" href="/Rahul_Kumar_Resume.pdf" download="Rahul_Kumar_Resume.pdf">Resume</a>
          <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            )}
          </button>
          <button
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      {menuOpen && <div className="nav-backdrop" onClick={() => setMenuOpen(false)}></div>}

      <div className="hero-content">
        <div className="hero-heading-wrap">
          <h1
            className={`hero-h1 hero-heading ${headingFade.className}`}
            ref={(el) => { heroH1Ref.current = el; headingFade.ref.current = el; }}
            style={headingFade.style}
          >
            Hi, i&apos;m rahul kumar
          </h1>
        </div>

        <div
          className={`portrait-wrap ${portraitFade.className}`}
          ref={portraitFade.ref}
          style={portraitFade.style}
        >
          <div id="magnet" ref={magnetRef}>
            <img src="/photo.jpg" alt="Rahul Kumar" draggable="false" />
          </div>
        </div>

        <div className="hero-bottom">
          <p className={`hero-tagline ${taglineFade.className}`} ref={taglineFade.ref} style={taglineFade.style}>
            a full stack developer building fast, ai-powered mern applications
          </p>
          <button className={`contact-btn ${btnFade.className}`} ref={btnFade.ref} style={btnFade.style}>Contact Me</button>
        </div>
      </div>
    </section>
  );
}