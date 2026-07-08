import { useEffect, useRef, useState } from 'react';

/** Adds .in class once the element scrolls into view (mirrors old fade-in behavior) */
export function useFadeIn(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    className: `fade-in${visible ? ' in' : ''}`,
    style: { transitionDelay: `${delay}s` }
  };
}
