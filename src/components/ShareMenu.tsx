'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from './Toast';

/** Uses the native share sheet where available, and a small menu everywhere else. */
export default function ShareMenu({ name, path }: { name: string; path: string }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function url() {
    return typeof window === 'undefined' ? path : new URL(path, window.location.origin).toString();
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url: url() });
        return;
      } catch {
        /* Reader dismissed the sheet, or sharing is unavailable — fall through. */
      }
    }
    setOpen((value) => !value);
  }

  async function copyLink() {
    setOpen(false);
    try {
      await navigator.clipboard.writeText(url());
      toast('Link copied');
    } catch {
      window.prompt('Copy this link', url());
    }
  }

  return (
    <div ref={container} className="relative">
      <button
        type="button"
        onClick={share}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Share ${name}`}
        className="grid size-9 place-items-center rounded-lg border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
          <circle cx="18" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="18" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="m8.2 10.8 7.6-4m0 10.4-7.6-4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span className="sr-only">Share {name}</span>
      </button>

      {open && (
        <div role="menu" className="panel absolute right-0 top-11 z-30 w-44 overflow-hidden p-1 !shadow-e3">
          <button
            type="button"
            role="menuitem"
            onClick={copyLink}
            className="w-full rounded-md px-3 py-2 text-left text-sm text-ink-2 transition-colors hover:bg-raised hover:text-ink"
          >
            Copy link
          </button>
          <a
            role="menuitem"
            href={`https://x.com/intent/post?text=${encodeURIComponent(name)}&url=${encodeURIComponent(url())}`}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-ink-2 transition-colors hover:bg-raised hover:text-ink"
          >
            Share on X
          </a>
        </div>
      )}
    </div>
  );
}
