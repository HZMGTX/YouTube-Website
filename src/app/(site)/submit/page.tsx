import type { Metadata } from 'next';
import Link from 'next/link';
import SubmitForm from '@/components/SubmitForm';

export const metadata: Metadata = {
  title: 'Submit a community',
  description: 'Add your Discord server to the directory. Free, and no account needed here.',
};

const STEPS = [
  { title: 'Fill in the form', body: 'It composes a GitHub issue for you — nothing is submitted from this page.' },
  { title: 'Post the issue', body: 'You review the prefilled text and post it under your own GitHub account.' },
  { title: 'A maintainer checks it', body: 'The invite is verified, the details are pulled from Discord, and the listing goes live.' },
];

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-8 pt-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Submit a community</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-2">
          Listing is free and there is no account to create here. Read the{' '}
          <Link href="/guidelines" className="text-accent underline underline-offset-2 decoration-accent/40 transition-colors hover:decoration-accent">
            guidelines
          </Link>{' '}
          first — servers that break them are not listed.
        </p>
      </header>

      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="panel p-5">
            <span className="grid size-7 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
              {index + 1}
            </span>
            <h2 className="mt-3 text-sm font-semibold text-ink">{step.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-3">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <SubmitForm />
      </div>
    </div>
  );
}
