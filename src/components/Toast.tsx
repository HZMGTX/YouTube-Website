'use client';

import { useEffect, useState } from 'react';

type Item = { id: number; message: string };

/** Fire a transient confirmation from anywhere: toast('Invite copied'). */
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent('toast', { detail: message }));
}

export default function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let counter = 0;
    function onToast(event: Event) {
      const message = (event as CustomEvent<string>).detail;
      const id = ++counter;
      setItems((current) => [...current, { id, message }]);
      window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 2600);
    }
    window.addEventListener('toast', onToast);
    return () => window.removeEventListener('toast', onToast);
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="panel animate-fade-rise pointer-events-auto flex items-center gap-2 px-4 py-2.5 text-sm text-ink !shadow-e3"
        >
          <svg viewBox="0 0 24 24" className="size-4 text-positive" fill="none" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item.message}
        </div>
      ))}
    </div>
  );
}
