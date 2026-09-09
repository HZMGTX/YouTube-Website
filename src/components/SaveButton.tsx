'use client';

import { useSavedIds, toggleSaved } from '@/lib/localList';

/** Favourites live in localStorage only — there is no account and no server. */
export default function SaveButton({ id, name, className = '' }: { id: string; name: string; className?: string }) {
  const saved = useSavedIds().includes(id);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleSaved(id);
      }}
      aria-pressed={saved}
      title={saved ? `Remove ${name} from saved` : `Save ${name}`}
      className={`grid size-8 place-items-center rounded-lg border transition-colors ${
        saved
          ? 'border-accent bg-accent-soft text-accent'
          : 'border-line text-ink-3 hover:border-line-strong hover:text-ink-2'
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill={saved ? 'currentColor' : 'none'} aria-hidden="true">
        <path
          d="M7 4h10a1 1 0 0 1 1 1v14.2a.8.8 0 0 1-1.24.67L12 16.8l-4.76 3.07A.8.8 0 0 1 6 19.2V5a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">{saved ? `Remove ${name} from saved` : `Save ${name}`}</span>
    </button>
  );
}
