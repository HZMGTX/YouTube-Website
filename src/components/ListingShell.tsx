import { Suspense } from 'react';
import Directory from './Directory';
import DirectorySkeleton from './DirectorySkeleton';
import PinnedCard from './PinnedCard';
import EmptyState from './EmptyState';
import Link from 'next/link';
import type { Community } from '@/lib/types';

/**
 * Shared layout for every listing page. `pinned` is rendered in its own slot above the
 * grid and must already be excluded from `communities`, so the featured community keeps
 * the top position on browse, tag and category pages exactly as it does on the home page.
 */
export default function ListingShell({
  title,
  description,
  communities,
  pinned,
  tags,
  categories,
  heading,
  empty,
}: {
  title: string;
  description: string;
  communities: Community[];
  pinned: Community | null;
  tags: string[];
  categories: string[];
  heading?: string;
  empty?: { title: string; body: string };
}) {
  const nothingAtAll = communities.length === 0 && !pinned;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-2">{description}</p>
      </header>

      {pinned && (
        <div className="mt-10">
          <PinnedCard community={pinned} />
        </div>
      )}

      <div className="mt-12">
        {nothingAtAll ? (
          <EmptyState
            title={empty?.title ?? 'Nothing here yet'}
            body={empty?.body ?? 'No communities have been listed under this heading so far.'}
            action={
              <Link
                href="/submit"
                className="mt-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-[filter] hover:brightness-110"
              >
                Submit a community
              </Link>
            }
          />
        ) : (
          <Suspense fallback={<DirectorySkeleton />}>
            <Directory
              communities={communities}
              tags={tags}
              categories={categories}
              heading={heading ?? 'Communities'}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
