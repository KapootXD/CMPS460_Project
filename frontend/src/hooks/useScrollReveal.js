import { useEffect, useEffectEvent, useRef } from 'react';

/**
 * Attaches IntersectionObserver to [data-reveal] descendants of rootRef.
 * `watchKey` should change when dynamic children (e.g. menu cards from API) are added
 * so new nodes are observed; otherwise they stay at opacity:0 from CSS.
 */
export function useScrollReveal(watchKey = 0) {
  const rootRef = useRef(null);

  const revealEntries = useEffectEvent((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  });

  useEffect(() => {
    const root = rootRef.current;

    if (!root || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const targets = [...root.querySelectorAll('[data-reveal]')];

    if (targets.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => revealEntries(entries, observer),
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    targets.forEach((target, index) => {
      const delay = target.getAttribute('data-reveal-delay') ?? `${Math.min(index * 70, 280)}`;
      target.style.setProperty('--reveal-delay', `${delay}ms`);
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [revealEntries, watchKey]);

  return rootRef;
}
