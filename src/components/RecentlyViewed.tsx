'use client';

import Link from 'next/link';
import CommunityIcon from './CommunityIcon';
import { useRecentIds } from '@/lib/localList';
import { compactCount } from '@/lib/format';
import type { Community } from '@/lib/types';

/**
 * Reads from localStorage, so it renders nothing on a first visit and nothing during
 * server rendering — which is why it never reserves space it might not use.
 */
export default function RecentlyViewed({ communities }: { communities: Community[] }) {
  const recent = useRecentIds()
    .map((id) => communities.find((community) => community.id === id))
    .filter((community): community is Community => Boolean(community));

  if (recent.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading" className="no-print">
      <h2 id="recent-heading" className="mb-4 text-xl font-semibold tracking-tight text-ink">
        Recently viewed
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {recent.map((community) => (
          <Link
            key={community.id}
            href={`/c/${community.id}`}
            className="panel panel-interactive flex w-52 shrink-0 items-center gap-3 p-3"
          >
            <CommunityIcon
              name={community.name}
              src={community.icon}
              accent={community.accent}
              className="size-9"
              rounded="rounded-lg"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">{community.name}</span>
              <span className="block text-xs text-ink-3">{compactCount(community.members)} members</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
