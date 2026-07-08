import React, { useEffect, useRef, useState } from 'react';

export function Preloader() {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    function onLoad() {
      setTimeout(() => setHide(true), 600);
    }
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  return (
    <div className={`preloader ${hide ? 'hide' : ''}`}>
      <div className="preloader-mark">RK</div>
      <div className="preloader-bar"><div className="preloader-fill"></div></div>
    </div>
  );
}

export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, raf;
    function onMouseMove(e) {
      mouseX = e.clientX; mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = mouseX + 'px';
        dotRef.current.style.top = mouseY + 'px';
      }
    }
    function animate() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.left = ringX + 'px';
        ringRef.current.style.top = ringY + 'px';
      }
      raf = requestAnimationFrame(animate);
    }
    window.addEventListener('mousemove', onMouseMove);
    animate();

    function addHover() { ringRef.current && ringRef.current.classList.add('hovering'); }
    function removeHover() { ringRef.current && ringRef.current.classList.remove('hovering'); }
    const targets = document.querySelectorAll('a, button, .project-card, .service-item, .filter-tab');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
    </>
  );
}

export function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (barRef.current) barRef.current.style.width = pct + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-progress" ref={barRef}></div>;
}

export function GrainOverlay() {
  return <div className="grain-overlay"></div>;
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 600); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
}
