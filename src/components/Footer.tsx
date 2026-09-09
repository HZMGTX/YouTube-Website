import Link from 'next/link';
import Mark from './Mark';
import { SITE } from '@/lib/site';

const COLUMNS = [
  {
    heading: 'Directory',
    links: [
      { href: '/', label: 'Home' },
      { href: '/browse', label: 'Browse all' },
      { href: '/search', label: 'Search' },
      { href: '/compare', label: 'Compare' },
      { href: '/stats', label: 'Statistics' },
    ],
  },
  {
    heading: 'Get listed',
    links: [
      { href: '/submit', label: 'Submit a community' },
      { href: '/guidelines', label: 'Listing guidelines' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
];

/** Carries no name and no name-bearing copyright line — see src/lib/site.ts. */
export default function Footer() {
  return (
    <footer className="no-print mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <span className="text-accent">
            <Mark className="size-7" />
          </span>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-2">
            A free, hand-checked directory of Discord communities. Listings are submitted by their
            own members and every server here is independently run.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3">{column.heading}</h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-2 transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-ink-3 sm:px-6">
          <p>Listings are independently operated. Inclusion is not an endorsement.</p>
          <a
            href={SITE.repo}
            className="transition-colors hover:text-ink-2"
            target="_blank"
            rel="noreferrer noopener"
          >
            Source and submissions on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
