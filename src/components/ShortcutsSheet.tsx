'use client';

import { useEffect, useState } from 'react';

const SHORTCUTS = [
  { keys: ['⌘', 'K'], description: 'Open the command palette', alt: 'Ctrl K' },
  { keys: ['/'], description: 'Jump to the search box' },
  { keys: ['Esc'], description: 'Clear the search, or close this' },
  { keys: ['?'], description: 'Show this list' },
  { keys: ['↑', '↓'], description: 'Move through palette results' },
  { keys: ['↵'], description: 'Open the highlighted result' },
];

/** Press ? anywhere outside a text field. */
export default function ShortcutsSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if (event.key === '?' && !typing) {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-sunken/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-heading"
        className="panel relative w-full max-w-sm p-6 !shadow-e3"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="shortcuts-heading" className="text-base font-semibold text-ink">
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-7 place-items-center rounded-lg border border-line text-ink-3 transition-colors hover:border-line-strong hover:text-ink"
          >
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close</span>
          </button>
        </div>

        <dl className="mt-5 flex flex-col gap-3">
          {SHORTCUTS.map((shortcut) => (
            <div key={shortcut.description} className="flex items-center justify-between gap-4">
              <dd className="text-sm text-ink-2">{shortcut.description}</dd>
              <dt className="flex shrink-0 items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="min-w-6 rounded border border-line bg-raised px-1.5 py-0.5 text-center font-sans text-[11px] text-ink-2"
                  >
                    {key}
                  </kbd>
                ))}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
