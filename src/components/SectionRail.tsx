import Link from 'next/link';
import CommunityIcon from './CommunityIcon';
import { compactCount } from '@/lib/format';
import type { Community } from '@/lib/types';

/** A short, scannable list used for the "Trending" and "Recently added" bands. */
export default function SectionRail({
  title,
  description,
  communities,
  href,
}: {
  title: string;
  description: string;
  communities: Community[];
  href: string;
}) {
  return (
    <section className="panel flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-0.5 text-xs text-ink-3">{description}</p>
        </div>
        <Link href={href} className="shrink-0 text-xs font-medium text-accent hover:underline">
          See all
        </Link>
      </div>

      <ol className="mt-4 flex flex-col divide-y divide-[var(--line)]">
        {communities.map((community, index) => (
          <li key={community.id}>
            <Link
              href={`/c/${community.id}`}
              className="group flex items-center gap-3 py-2.5 transition-colors first:pt-0"
            >
              <span className="w-4 shrink-0 text-xs tabular-nums text-ink-3">{index + 1}</span>
              <CommunityIcon
                name={community.name}
                src={community.icon}
                accent={community.accent}
                className="size-8"
                rounded="rounded-lg"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink group-hover:text-accent">
                  {community.name}
                </span>
                <span className="block truncate text-xs text-ink-3">{community.category}</span>
              </span>
              <span className="shrink-0 text-xs tabular-nums text-ink-2">
                {compactCount(community.online)} online
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
