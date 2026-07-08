import React, { useEffect, useState } from 'react';
import Hero from './components/Hero.jsx';
import TechMarquee from './components/TechMarquee.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Timeline from './components/Timeline.jsx';
import Services from './components/Services.jsx';
import Projects from './components/Projects.jsx';
import Footer from './components/Footer.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import { Preloader, CustomCursor, ScrollProgress, GrainOverlay, BackToTop } from './components/Extras.jsx';

export default function App() {
  const [theme, setTheme] = useState('dark');

  // Load saved theme preference on mount
  useEffect(() => {
    let saved = 'dark';
    try { saved = localStorage.getItem('rk-theme') || 'dark'; } catch (e) {}
    setTheme(saved);
  }, []);

  // Apply theme class to <html> and persist
  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    try { localStorage.setItem('rk-theme', theme); } catch (e) {}
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  // Smooth scroll + active nav highlight
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const navAnchors = document.querySelectorAll('.nav-links a[data-nav]');
    const navSections = Array.from(navAnchors)
      .map((a) => document.getElementById(a.dataset.nav))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach((a) => a.classList.toggle('active', a.dataset.nav === id));
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    navSections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Preloader />
      <CustomCursor />
      <ScrollProgress />
      <GrainOverlay />
      <div id="root">
        <Hero theme={theme} onToggleTheme={toggleTheme} />
        <TechMarquee />
        <About />
        <Skills />
        <Timeline />
        <Services />
        <Projects />
        <Footer />
      </div>
      <BackToTop />
      <ChatWidget />
    </>
  );
}
