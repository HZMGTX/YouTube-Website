'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CommunityIcon from './CommunityIcon';
import Sparkline from './Sparkline';
import EmptyState from './EmptyState';
import { compactCount, formatCount, formatDate } from '@/lib/format';
import type { Community } from '@/lib/types';

const MAX = 4;

type Row = {
  label: string;
  render: (community: Community) => React.ReactNode;
  /** Highest value wins for these, so the leader can be marked. */
  best?: (community: Community) => number | null;
};

const ROWS: Row[] = [
  { label: 'Members', render: (c) => formatCount(c.members), best: (c) => c.members },
  { label: 'Online now', render: (c) => formatCount(c.online), best: (c) => c.online },
  {
    label: 'Share online',
    render: (c) => `${((c.online / Math.max(c.members, 1)) * 100).toFixed(1)}%`,
    best: (c) => c.online / Math.max(c.members, 1),
  },
  { label: 'Boosts', render: (c) => formatCount(c.boosts), best: (c) => c.boosts },
  { label: 'Category', render: (c) => c.category },
  {
    label: 'Tags',
    render: (c) => (
      <span className="flex flex-wrap gap-1">
        {c.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-2">
            {tag}
          </span>
        ))}
      </span>
    ),
  },
  { label: 'Verified', render: (c) => (c.verified ? 'Yes' : 'No') },
  { label: 'Listed', render: (c) => formatDate(c.addedAt) },
];

export default function CompareTable({ communities }: { communities: Community[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const selectedIds = useMemo(() => {
    const raw = params.get('ids');
    return raw ? raw.split(',').filter((id) => communities.some((c) => c.id === id)).slice(0, MAX) : [];
  }, [communities, params]);

  const selected = selectedIds
    .map((id) => communities.find((c) => c.id === id))
    .filter((c): c is Community => Boolean(c));

  function toggle(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((value) => value !== id)
      : [...selectedIds, id].slice(0, MAX);
    const query = next.length ? `?ids=${next.join(',')}` : '';
    router.replace(`${pathname}${query}`, { scroll: false });
  }

  const full = selectedIds.length >= MAX;

  return (
    <div>
      <fieldset className="panel p-5">
        <legend className="px-1 text-sm font-semibold text-ink">
          Pick up to {MAX} communities
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {communities.map((community) => {
            const on = selectedIds.includes(community.id);
            return (
              <button
                key={community.id}
                type="button"
                onClick={() => toggle(community.id)}
                aria-pressed={on}
                disabled={!on && full}
                className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition-colors ${
                  on
                    ? 'border-accent bg-accent-soft text-ink'
                    : 'border-line text-ink-2 hover:border-line-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line'
                }`}
              >
                <CommunityIcon
                  name={community.name}
                  src={community.icon}
                  accent={community.accent}
                  className="size-6"
                  rounded="rounded-full"
                />
                {community.name}
              </button>
            );
          })}
        </div>
        {full && (
          <p className="mt-3 text-xs text-ink-3">
            That is {MAX}. Deselect one to swap it for another.
          </p>
        )}
      </fieldset>

      <div className="mt-6">
        {selected.length < 2 ? (
          <EmptyState
            title="Choose at least two"
            body="Pick two or more communities above and they will be compared side by side. The selection lives in the URL, so the comparison can be shared."
          />
        ) : (
          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <caption className="sr-only">
                {selected.map((c) => c.name).join(', ')} compared across members, activity, boosts and tags.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-36 p-4 text-left text-xs uppercase tracking-wider text-ink-3">
                    Metric
                  </th>
                  {selected.map((community) => (
                    <th key={community.id} scope="col" className="border-l border-line p-4 text-left align-top">
                      <Link href={`/c/${community.id}`} className="flex items-center gap-2 hover:text-accent">
                        <CommunityIcon
                          name={community.name}
                          src={community.icon}
                          accent={community.accent}
                          className="size-8"
                          rounded="rounded-lg"
                        />
                        <span className="font-semibold text-ink">{community.name}</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const values = row.best ? selected.map((c) => row.best!(c) ?? -Infinity) : [];
                  const leader = values.length ? Math.max(...values) : null;
                  const unique = values.filter((value) => value === leader).length === 1;

                  return (
                    <tr key={row.label} className="border-t border-line">
                      <th scope="row" className="p-4 text-left align-top text-xs uppercase tracking-wider text-ink-3">
                        {row.label}
                      </th>
                      {selected.map((community, index) => {
                        const isLeader = unique && leader !== null && values[index] === leader;
                        return (
                          <td key={community.id} className="border-l border-line p-4 align-top">
                            <span className={isLeader ? 'font-semibold text-ink' : 'text-ink-2'}>
                              {row.render(community)}
                            </span>
                            {/* Marked in text, not colour alone. */}
                            {isLeader && <span className="ml-2 text-[11px] text-ink-3">highest</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr className="border-t border-line">
                  <th scope="row" className="p-4 text-left align-top text-xs uppercase tracking-wider text-ink-3">
                    Trend
                  </th>
                  {selected.map((community) => (
                    <td key={community.id} className="border-l border-line p-4 align-top">
                      {(community.history?.length ?? 0) >= 2 ? (
                        <Sparkline
                          history={community.history ?? []}
                          accent={community.accent}
                          label={`${community.name} member trend`}
                        />
                      ) : (
                        <span className="text-xs text-ink-3">Not enough history</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-line">
                  <th scope="row" className="p-4 text-left align-top text-xs uppercase tracking-wider text-ink-3">
                    Join
                  </th>
                  {selected.map((community) => (
                    <td key={community.id} className="border-l border-line p-4 align-top">
                      {community.invite ? (
                        <a
                          href={community.invite}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex h-8 items-center rounded-lg bg-accent px-3 text-xs font-medium text-accent-ink transition-[filter] hover:brightness-110"
                        >
                          Join {community.name}
                        </a>
                      ) : (
                        <span className="text-xs text-ink-3">Example listing</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-ink-3">
        Member and online counts are refreshed periodically from Discord, so treat “share online”
        as a rough measure of activity rather than a live reading. {compactCount(communities.length)}{' '}
        communities are available to compare.
      </p>
    </div>
  );
}
