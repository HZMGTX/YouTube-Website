import type { Metadata } from 'next';
import BarList from '@/components/BarList';
import { compactCount, formatCount, slugify } from '@/lib/format';
import {
  allTags,
  categoryBreakdown,
  communitiesWithTag,
  directoryStats,
  getAllCommunities,
  sizeBreakdown,
  sortCommunities,
} from '@/lib/communities';

export const metadata: Metadata = {
  title: 'Statistics',
  description: 'How the directory breaks down by category, size and activity.',
};

export default function StatsPage() {
  const communities = getAllCommunities();
  const stats = directoryStats();
  const largest = sortCommunities(communities, 'members').slice(0, 8);
  const boosted = sortCommunities(communities, 'boosts').slice(0, 5);
  const tags = allTags().slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 pt-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Statistics</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-2">
          What the directory currently holds. Member counts come from Discord and are refreshed
          periodically rather than live, so treat them as recent rather than exact.
        </p>
      </header>

      {/* Headline figures: single numbers, so they are stat tiles rather than a chart. */}
      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        {[
          { label: 'Communities', value: formatCount(stats.communities) },
          { label: 'Members combined', value: compactCount(stats.members) },
          { label: 'Online right now', value: compactCount(stats.online) },
          { label: 'Boosts combined', value: formatCount(stats.boosts) },
        ].map((item) => (
          <div key={item.label} className="bg-surface px-4 py-5">
            <dd className="text-2xl font-semibold tabular-nums tracking-tight text-ink">{item.value}</dd>
            <dt className="mt-1 text-xs uppercase tracking-wider text-ink-3">{item.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid items-start gap-4 md:grid-cols-2">
        <section className="panel p-6">
          <h2 className="text-base font-semibold text-ink">Communities per category</h2>
          <p className="mt-1 text-xs text-ink-3">Every listing has exactly one category.</p>
          <div className="mt-5">
            <BarList
              rows={categoryBreakdown().map((row) => ({
                label: row.category,
                value: row.count,
                href: `/category/${slugify(row.category)}`,
              }))}
            />
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-base font-semibold text-ink">Size distribution</h2>
          <p className="mt-1 text-xs text-ink-3">Listings grouped by member count.</p>
          <div className="mt-5">
            <BarList rows={sizeBreakdown().map((row) => ({ label: row.label, value: row.count }))} />
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-base font-semibold text-ink">Largest communities</h2>
          <p className="mt-1 text-xs text-ink-3">By member count.</p>
          <div className="mt-5">
            <BarList
              unit="members"
              rows={largest.map((community) => ({
                label: community.name,
                value: community.members,
                href: `/c/${community.id}`,
              }))}
            />
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-base font-semibold text-ink">Most used tags</h2>
          <p className="mt-1 text-xs text-ink-3">Listings can carry several tags.</p>
          <div className="mt-5">
            <BarList
              rows={tags.map((tag) => ({
                label: tag,
                value: communitiesWithTag(tag).length,
                href: `/tag/${slugify(tag)}`,
              }))}
            />
          </div>
        </section>
      </div>

      <section className="panel mt-4 p-6">
        <h2 className="text-base font-semibold text-ink">Most boosted</h2>
        <p className="mt-1 text-xs text-ink-3">Server boosts contributed by members.</p>
        <div className="mt-5">
          <BarList
            unit="boosts"
            rows={boosted.map((community) => ({
              label: community.name,
              value: community.boosts,
              href: `/c/${community.id}`,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
