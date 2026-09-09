'use client';

import { useEffect, useState } from 'react';

/** Appears once the reader is well past the fold on these long listing pages. */
export default function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!shown) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="no-print panel animate-fade-rise fixed bottom-6 right-6 z-30 grid size-11 place-items-center !shadow-e2 transition-colors hover:border-line-strong"
    >
      <svg viewBox="0 0 24 24" className="size-4 text-ink-2" fill="none" aria-hidden="true">
        <path d="M12 19V6m0 0-6 6m6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">Back to top</span>
    </button>
  );
}
