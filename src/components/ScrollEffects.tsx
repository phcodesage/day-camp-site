'use client';

import { useEffect } from 'react';

export default function ScrollEffects() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cleanupFns: Array<() => void> = [];

    // 1. Scroll Progress Bar JS Fallback (if CSS scroll() is not supported)
    const supportsCSSScroll =
      window.CSS &&
      window.CSS.supports &&
      (window.CSS.supports('animation-timeline', 'scroll()') ||
        window.CSS.supports('(animation-timeline: scroll())'));

    if (!supportsCSSScroll) {
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
        const handleScroll = () => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight <= 0) return;
          const scrolled = window.scrollY;
          const progress = scrolled / docHeight;
          progressBar.style.transform = `scaleX(${progress})`;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // initial call
        cleanupFns.push(() => window.removeEventListener('scroll', handleScroll));
      }
    }

    // 2. Scroll Reveal IntersectionObserver (used for all browsers to ensure smooth, non-stuck animations)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.05,
      }
    );

    const targets = document.querySelectorAll('.scroll-reveal');
    targets.forEach((el) => observer.observe(el));

    cleanupFns.push(() => {
      targets.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return null;
}
