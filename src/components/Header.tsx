import Link from 'next/link';
import Mark from './Mark';
import ThemeToggle from './ThemeToggle';
import CommandPaletteTrigger from './CommandPaletteTrigger';

const NAV = [
  { href: '/browse', label: 'Browse' },
  { href: '/stats', label: 'Stats' },
  { href: '/guidelines', label: 'Guidelines' },
  { href: '/submit', label: 'Submit' },
];

/**
 * No wordmark by design — the mark links home and carries an accessible name, but the
 * site renders no name of its own. See src/lib/site.ts.
 */
export default function Header() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Home"
          className="grid size-9 shrink-0 place-items-center rounded-lg text-accent transition-colors hover:bg-accent-soft"
        >
          <Mark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-raised hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <CommandPaletteTrigger />
          <ThemeToggle />
        </div>
      </div>

      {/* Nav collapses to a scrollable row rather than a hamburger: four links fit, and
          a menu behind a tap is worse than the links themselves. */}
      <nav
        aria-label="Primary, compact"
        className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 sm:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-ink-2 transition-colors hover:bg-raised hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
