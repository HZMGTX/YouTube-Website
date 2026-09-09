'use client';

import { useState } from 'react';
import { toast } from './Toast';

/**
 * A copyable iframe snippet so a listed community can show its own card on their site.
 * The URL is read at render time on the client, so it is correct on any deployment.
 */
export default function EmbedSnippet({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);

  const snippet = `<iframe src="${
    typeof window === 'undefined' ? '' : new URL(`/embed/${id}/`, window.location.origin).toString()
  }" title="${name}" width="380" height="150" style="border:0;border-radius:14px" loading="lazy"></iframe>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      toast('Embed code copied');
    } catch {
      window.prompt('Copy this embed code', snippet);
    }
  }

  return (
    <div className="panel p-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-ink">Embed this listing</span>
          <span className="mt-0.5 block text-xs text-ink-3">Show the card on your own site</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`size-4 shrink-0 text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          aria-hidden="true"
        >
          <path d="m6 9.5 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="mt-4">
          <pre className="overflow-x-auto rounded-lg border border-line bg-sunken p-3 text-[11px] leading-relaxed text-ink-2">
            <code>{snippet}</code>
          </pre>
          <button
            type="button"
            onClick={copy}
            className="mt-3 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            Copy embed code
          </button>
        </div>
      )}
    </div>
  );
}
