import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Listing guidelines',
  description: 'What gets listed in the directory, and what does not.',
};

const ACCEPTED = [
  'A permanent invite link that does not expire.',
  'A description a stranger can read and understand in one pass.',
  'An active server — members who actually post, not just a member count.',
  'Rules of its own, and moderation that enforces them.',
];

const REJECTED = [
  'Servers that are 18+, NSFW, or gated behind age verification.',
  'Invite-farming, nuke, raid, selfbot or account-selling servers.',
  'Anything selling access to pirated media, cheats or stolen accounts.',
  'Servers whose main activity is harassing a person or another community.',
  'Empty shells created purely to advertise something else.',
];

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Listing guidelines</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-2">
        Every listing is checked by hand before it goes live. These are the rules that decide it.
      </p>

      <section className="panel mt-10 p-6">
        <h2 className="text-lg font-semibold text-ink">What gets listed</h2>
        <ul className="mt-4 space-y-3">
          {ACCEPTED.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-2">
              <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-positive" fill="none" aria-hidden="true">
                <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel mt-4 p-6">
        <h2 className="text-lg font-semibold text-ink">What does not</h2>
        <ul className="mt-4 space-y-3">
          {REJECTED.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-2">
              <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-ink-3" fill="none" aria-hidden="true">
                <path d="M6.5 6.5l11 11m0-11-11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel mt-4 p-6">
        <h2 className="text-lg font-semibold text-ink">Ordering and the featured slot</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          The grid is ordered by whatever you sort it by — nobody can pay to move up it. One
          community holds the featured slot above the grid; it is labelled as featured wherever it
          appears, and it is set by the people who run this directory rather than sold.
        </p>
      </section>

      <p className="mt-8 text-sm text-ink-2">
        Ready?{' '}
        <Link href="/submit" className="text-accent underline underline-offset-2 decoration-accent/40 transition-colors hover:decoration-accent">
          Submit a community
        </Link>
        .
      </p>
    </div>
  );
}
