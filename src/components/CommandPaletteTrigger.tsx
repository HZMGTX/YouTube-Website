'use client';

/** Opens the palette that CommandPalette listens for. Kept separate so the header
    stays a server component apart from this button. */
export default function CommandPaletteTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
      className="flex h-9 items-center gap-2 rounded-lg border border-line px-2.5 text-sm text-ink-3 transition-colors hover:border-line-strong hover:text-ink-2 sm:px-3"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden rounded border border-line bg-raised px-1.5 py-0.5 font-sans text-[11px] text-ink-3 sm:inline">
        ⌘K
      </kbd>
      <span className="sr-only">Open search. Keyboard shortcut: Command or Control K.</span>
    </button>
  );
}
