import type { Metadata } from 'next';
import { Suspense } from 'react';
import CompareTable from '@/components/CompareTable';
import DirectorySkeleton from '@/components/DirectorySkeleton';
import { getAllCommunities, sortCommunities } from '@/lib/communities';

export const metadata: Metadata = {
  title: 'Compare communities',
  description: 'Put up to four communities side by side on size, activity, boosts and tags.',
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 pt-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Compare communities</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-2">
          Put up to four side by side on size, how much of the membership is online, boosts and
          tags. The selection lives in the URL, so a comparison can be shared as a link.
        </p>
      </header>

      <div className="mt-10">
        <Suspense fallback={<DirectorySkeleton count={3} />}>
          <CompareTable communities={sortCommunities(getAllCommunities(), 'members')} />
        </Suspense>
      </div>
    </div>
  );
}
