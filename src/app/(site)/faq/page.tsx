import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Common questions about how the directory works.',
};

const QUESTIONS = [
  {
    q: 'Does listing cost anything?',
    a: 'No. There is no paid placement, no promoted tier and no way to buy a higher position in the grid.',
  },
  {
    q: 'How is the order decided?',
    a: 'By whichever sort you pick — most members by default. The featured community above the grid is the one exception, and it is labelled as featured wherever it appears.',
  },
  {
    q: 'Are the member counts live?',
    a: 'They are refreshed periodically from Discord rather than on every page load, because the site is a set of static files with no server behind it. A count can be a few days out of date.',
  },
  {
    q: 'Do you track me?',
    a: 'No analytics, no third-party scripts, no cookies. Saved communities and your theme choice are kept in your own browser and never leave it.',
  },
  {
    q: 'What are the entries marked "Example"?',
    a: 'Demo data used to show the search, filter and sort features. They carry no invite link and are removed as real listings replace them.',
  },
  {
    q: 'How do I get a listing changed or removed?',
    a: 'Every community page has Report and Claim buttons that open an issue. Anyone who runs a listed server can ask for changes or removal.',
  },
];

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: QUESTIONS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Questions</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-2">
        How the directory works, in short. Anything missing can be asked{' '}
        <a href={`${SITE.repo}/issues`} target="_blank" rel="noreferrer noopener" className="text-accent underline underline-offset-2 decoration-accent/40 transition-colors hover:decoration-accent">
          on GitHub
        </a>
        .
      </p>

      <dl className="mt-10 flex flex-col gap-3">
        {QUESTIONS.map((item) => (
          <div key={item.q} className="panel p-6">
            <dt className="text-base font-semibold text-ink">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink-2">{item.a}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-sm text-ink-2">
        See also the{' '}
        <Link href="/guidelines" className="text-accent underline underline-offset-2 decoration-accent/40 transition-colors hover:decoration-accent">
          listing guidelines
        </Link>
        .
      </p>
    </div>
  );
}
