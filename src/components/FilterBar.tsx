'use client';

import { useEffect, useRef } from 'react';
import { SIZE_LABELS, SORT_LABELS, type SizeBucket, type SortKey } from '@/lib/types';
import type { DirectoryState, View } from '@/lib/useDirectoryFilters';

type Props = {
  state: DirectoryState;
  update: (patch: Partial<DirectoryState>) => void;
  toggleInList: (key: 'tags' | 'categories', value: string) => void;
  reset: () => void;
  activeCount: number;
  tags: string[];
  categories: string[];
  resultCount: number;
  savedCount: number;
};

export default function FilterBar({
  state,
  update,
  toggleInList,
  reset,
  activeCount,
  tags,
  categories,
  resultCount,
  savedCount,
}: Props) {
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses search, Escape clears it — but never while the reader is typing
  // somewhere else, or the shortcut would eat the keystroke.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      } else if (event.key === 'Escape' && target === searchRef.current) {
        update({ q: '' });
        searchRef.current?.blur();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [update]);

  return (
    <div className="flex flex-col gap-4">
      {/* Sticky so search and sort stay reachable down a long grid. The offset clears
          the header, which is taller on mobile because the nav wraps to a second row. */}
      <div className="sticky top-[6.5rem] z-20 -mx-2 flex flex-wrap items-center gap-2 rounded-xl bg-canvas/90 px-2 py-2 backdrop-blur sm:top-[4.25rem]">
        <div className="relative min-w-56 flex-1">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            value={state.q}
            onChange={(event) => update({ q: event.target.value })}
            placeholder="Search, or try tag:art members:&gt;1000"
            aria-label="Search communities"
            className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-16 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-line-strong"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-raised px-1.5 py-0.5 text-[11px] text-ink-3 sm:block">
            /
          </kbd>
        </div>

        <label className="sr-only" htmlFor="sort">
          Sort communities
        </label>
        <select
          id="sort"
          value={state.sort}
          onChange={(event) => update({ sort: event.target.value as SortKey })}
          className="h-10 rounded-lg border border-line bg-surface px-3 text-sm text-ink-2 outline-none transition-colors hover:text-ink focus:border-line-strong"
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="size">
          Filter by size
        </label>
        <select
          id="size"
          value={state.size}
          onChange={(event) => update({ size: event.target.value as SizeBucket })}
          className="h-10 rounded-lg border border-line bg-surface px-3 text-sm text-ink-2 outline-none transition-colors hover:text-ink focus:border-line-strong"
        >
          {(Object.keys(SIZE_LABELS) as SizeBucket[]).map((key) => (
            <option key={key} value={key}>
              {SIZE_LABELS[key]}
            </option>
          ))}
        </select>

        <div className="flex h-10 items-center rounded-lg border border-line p-1" role="group" aria-label="Layout">
          {(['grid', 'list'] as View[]).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => update({ view })}
              aria-pressed={state.view === view}
              title={view === 'grid' ? 'Grid view' : 'List view'}
              className={`grid size-8 place-items-center rounded transition-colors ${
                state.view === view ? 'bg-raised text-ink' : 'text-ink-3 hover:text-ink-2'
              }`}
            >
              {view === 'grid' ? (
                <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                  <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                  <path d="M4 6.5h16M4 12h16M4 17.5h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              )}
              <span className="sr-only">{view === 'grid' ? 'Grid view' : 'List view'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium uppercase tracking-wider text-ink-3">Categories</span>
        {categories.map((category) => {
          const on = state.categories.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => toggleInList('categories', category)}
              aria-pressed={on}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                on
                  ? 'border-accent bg-accent-soft text-ink'
                  : 'border-line text-ink-2 hover:border-line-strong hover:text-ink'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium uppercase tracking-wider text-ink-3">Tags</span>
        {tags.map((tag) => {
          const on = state.tags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleInList('tags', tag)}
              aria-pressed={on}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                on
                  ? 'border-accent bg-accent-soft text-ink'
                  : 'border-line text-ink-2 hover:border-line-strong hover:text-ink'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <p aria-live="polite" className="text-sm text-ink-2">
          <span className="font-semibold text-ink">{resultCount}</span>{' '}
          {resultCount === 1 ? 'community' : 'communities'}
        </p>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-2">
          <input
            type="checkbox"
            checked={state.onlineOnly}
            onChange={(event) => update({ onlineOnly: event.target.checked })}
            className="size-4 rounded border-line accent-[var(--accent)]"
          />
          Active now
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-2">
          <input
            type="checkbox"
            checked={state.verifiedOnly}
            onChange={(event) => update({ verifiedOnly: event.target.checked })}
            className="size-4 rounded border-line accent-[var(--accent)]"
          />
          Verified
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-2">
          <input
            type="checkbox"
            checked={state.savedOnly}
            onChange={(event) => update({ savedOnly: event.target.checked })}
            className="size-4 rounded border-line accent-[var(--accent)]"
          />
          Saved{savedCount > 0 ? ` (${savedCount})` : ''}
        </label>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="ml-auto rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            Clear {activeCount} {activeCount === 1 ? 'filter' : 'filters'}
          </button>
        )}
      </div>
    </div>
  );
}
