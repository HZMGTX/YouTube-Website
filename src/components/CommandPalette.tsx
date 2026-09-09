'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { compactCount } from '@/lib/format';

type Entry = { id: string; name: string; category: string; members: number };

const PAGES = [
  { href: '/', label: 'Home', hint: 'Featured and newest' },
  { href: '/browse', label: 'Browse all communities', hint: 'Every listing' },
  { href: '/stats', label: 'Statistics', hint: 'Size and category breakdown' },
  { href: '/submit', label: 'Submit a community', hint: 'Get listed' },
  { href: '/guidelines', label: 'Listing guidelines', hint: 'What gets accepted' },
  { href: '/faq', label: 'FAQ', hint: 'Common questions' },
];

/** ⌘K / Ctrl+K anywhere, or the header button, jumps to any community or page. */
export default function CommandPalette({ communities }: { communities: Entry[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pages = PAGES.filter((p) => !q || p.label.toLowerCase().includes(q)).map((p) => ({
      kind: 'page' as const,
      href: p.href,
      label: p.label,
      hint: p.hint,
    }));
    const servers = communities
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
      .sort((a, b) => b.members - a.members)
      .slice(0, 8)
      .map((c) => ({
        kind: 'community' as const,
        href: `/c/${c.id}`,
        label: c.name,
        hint: `${c.category} · ${compactCount(c.members)} members`,
      }));
    return [...servers, ...pages].slice(0, 12);
  }, [communities, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  function go(href: string) {
    close();
    router.push(href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      go(results[active].href);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-sunken/70 backdrop-blur-sm" onClick={close} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search communities and pages"
        onKeyDown={onKeyDown}
        className="panel relative w-full max-w-lg overflow-hidden !shadow-e3"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-ink-3" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search communities and pages…"
            aria-label="Search communities and pages"
            aria-activedescendant={results[active] ? `palette-${active}` : undefined}
            className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
          />
          <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 text-[11px] text-ink-3">esc</kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-3">No matches for “{query}”.</p>
        ) : (
          <ul ref={listRef} role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-2">
            {results.map((result, index) => (
              <li key={`${result.kind}-${result.href}`} id={`palette-${index}`} role="option" aria-selected={index === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(result.href)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    index === active ? 'bg-accent-soft text-ink' : 'text-ink-2 hover:bg-raised'
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-md text-[11px] font-semibold ${
                      result.kind === 'community' ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-3'
                    }`}
                    aria-hidden="true"
                  >
                    {result.kind === 'community' ? result.label.slice(0, 1).toUpperCase() : '→'}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{result.label}</span>
                    <span className="block truncate text-xs text-ink-3">{result.hint}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
