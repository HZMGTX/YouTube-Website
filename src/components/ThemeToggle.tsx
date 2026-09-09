'use client';

import { useEffect, useState } from 'react';

type Choice = 'system' | 'light' | 'dark';

const NEXT: Record<Choice, Choice> = { system: 'light', light: 'dark', dark: 'system' };
const LABEL: Record<Choice, string> = { system: 'System theme', light: 'Light theme', dark: 'Dark theme' };

function apply(choice: Choice) {
  const dark = choice === 'dark' || (choice === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

export default function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Choice | null) ?? 'system';
    setChoice(stored);
    setReady(true);

    // Follow the OS while the reader has not made an explicit choice.
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if ((localStorage.getItem('theme') as Choice | null) === 'system') apply('system');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  function cycle() {
    const next = NEXT[choice];
    setChoice(next);
    localStorage.setItem('theme', next);
    apply(next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      title={ready ? LABEL[choice] : 'Theme'}
      aria-label={ready ? `${LABEL[choice]}. Activate to change.` : 'Change theme'}
      className="grid size-9 place-items-center rounded-lg border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
    >
      {choice === 'dark' ? (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      ) : choice === 'light' ? (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 21h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
