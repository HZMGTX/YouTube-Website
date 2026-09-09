import { Suspense } from 'react';
import Link from 'next/link';
import PinnedCard from '@/components/PinnedCard';
import Directory from '@/components/Directory';
import DirectorySkeleton from '@/components/DirectorySkeleton';
import StatsBar from '@/components/StatsBar';
import CategoryTiles from '@/components/CategoryTiles';
import SectionRail from '@/components/SectionRail';
import RecentlyViewed from '@/components/RecentlyViewed';
import {
  allCategories,
  allTags,
  categoryBreakdown,
  directoryStats,
  getPinned,
  getUnpinned,
  newestCommunities,
  trendingCommunities,
} from '@/lib/communities';
import { SITE } from '@/lib/site';

export default function HomePage() {
  const pinned = getPinned();
  const rest = getUnpinned();
  const stats = directoryStats();

  // ItemList rather than a named organisation: the site itself has no name to declare.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: SITE.title,
    numberOfItems: stats.communities,
    itemListElement: [pinned, ...rest].filter(Boolean).slice(0, 20).map((community, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: community!.name,
      url: `${SITE.url}/c/${community!.id}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          {stats.communities} communities listed
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {SITE.tagline}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-2">
          {SITE.description}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#directory"
            className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-ink transition-[filter] hover:brightness-110"
          >
            Browse communities
          </Link>
          <Link
            href="/submit"
            className="inline-flex h-11 items-center rounded-lg border border-line px-5 text-sm font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            Submit yours
          </Link>
        </div>
      </section>

      <div className="mt-12">
        <StatsBar
          stats={[
            { label: 'Communities', value: stats.communities },
            { label: 'Members', value: stats.members },
            { label: 'Online now', value: stats.online },
            { label: 'Categories', value: stats.categories },
          ]}
        />
      </div>

      {pinned && (
        <div className="mt-12">
          <PinnedCard community={pinned} />
        </div>
      )}

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <SectionRail
          title="Trending now"
          description="Highest share of members online"
          communities={trendingCommunities(4)}
          href="/browse?sort=online"
        />
        <SectionRail
          title="Recently added"
          description="Newest listings in the directory"
          communities={newestCommunities(4)}
          href="/browse?sort=newest"
        />
      </div>

      <div className="mt-12">
        <RecentlyViewed communities={[pinned, ...rest].filter((c) => c !== null)} />
      </div>

      <div className="mt-12">
        <CategoryTiles categories={categoryBreakdown().map(({ category, count }) => ({ category, count }))} />
      </div>

      <div className="mt-16">
        <Suspense fallback={<DirectorySkeleton />}>
          <Directory communities={rest} tags={allTags()} categories={allCategories()} />
        </Suspense>
      </div>
    </div>
  );
}
