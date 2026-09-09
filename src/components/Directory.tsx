'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FilterBar from './FilterBar';
import CommunityCard from './CommunityCard';
import CommunityRow from './CommunityRow';
import EmptyState from './EmptyState';
import { applyFilters } from '@/lib/communities';
import { useSavedIds } from '@/lib/localList';
import { useDirectoryFilters } from '@/lib/useDirectoryFilters';
import type { Community } from '@/lib/types';

const PAGE_SIZE = 12;

/**
 * The searchable grid. It never contains the pinned community — that lives in its own
 * slot above, so no filter or sort here can displace it.
 */
export default function Directory({
  communities,
  tags,
  categories,
  heading = 'All communities',
}: {
  communities: Community[];
  tags: string[];
  categories: string[];
  heading?: string;
}) {
  const router = useRouter();
  const { state, update, toggleInList, reset, activeCount } = useDirectoryFilters();
  const savedIds = useSavedIds();
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const base = state.savedOnly ? communities.filter((c) => savedIds.includes(c.id)) : communities;
    return applyFilters(base, state);
  }, [communities, savedIds, state]);

  const shown = results.slice(0, visible);

  function surpriseMe() {
    const pool = results.length > 0 ? results : communities;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) router.push(`/c/${pick.id}`);
  }

  return (
    <section aria-labelledby="directory-heading" className="scroll-mt-24" id="directory">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 id="directory-heading" className="text-xl font-semibold tracking-tight text-ink">
          {heading}
        </h2>
        <button
          type="button"
          onClick={surpriseMe}
          className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="9" cy="9" r="1.2" fill="currentColor" />
            <circle cx="15" cy="15" r="1.2" fill="currentColor" />
            <circle cx="15" cy="9" r="1.2" fill="currentColor" />
            <circle cx="9" cy="15" r="1.2" fill="currentColor" />
          </svg>
          Surprise me
        </button>
      </div>

      <FilterBar
        state={state}
        update={(patch) => {
          setVisible(PAGE_SIZE);
          update(patch);
        }}
        toggleInList={(key, value) => {
          setVisible(PAGE_SIZE);
          toggleInList(key, value);
        }}
        reset={() => {
          setVisible(PAGE_SIZE);
          reset();
        }}
        activeCount={activeCount}
        tags={tags}
        categories={categories}
        resultCount={results.length}
        savedCount={savedIds.length}
      />

      <div className="mt-6">
        {shown.length === 0 ? (
          <EmptyState
            title={state.savedOnly && savedIds.length === 0 ? 'Nothing saved yet' : 'No communities match'}
            body={
              state.savedOnly && savedIds.length === 0
                ? 'Save a community with the bookmark button on any card and it will show up here. Saved listings stay in this browser only.'
                : 'Try removing a filter or searching for a broader term.'
            }
            action={
              activeCount > 0 ? (
                <button
                  type="button"
                  onClick={reset}
                  className="mt-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-[filter] hover:brightness-110"
                >
                  Clear filters
                </button>
              ) : (
                <Link
                  href="/submit"
                  className="mt-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-[filter] hover:brightness-110"
                >
                  Submit a community
                </Link>
              )
            }
          />
        ) : state.view === 'list' ? (
          <div className="flex flex-col gap-3">
            {shown.map((community) => (
              <CommunityRow key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}

        {results.length > visible && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((value) => value + PAGE_SIZE)}
              className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              Show more ({results.length - visible} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
