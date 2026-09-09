import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CommunityIcon from '@/components/CommunityIcon';
import { compactCount } from '@/lib/format';
import { getAllCommunities, getCommunity } from '@/lib/communities';

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getAllCommunities().map((community) => ({ id: community.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const community = getCommunity(id);
  return {
    title: community ? `${community.name} — embed` : 'Embed',
    // An embed is a fragment of another page; it should never rank on its own.
    robots: { index: false, follow: false },
  };
}

/**
 * A bare card meant to be iframed on a listed community's own site. Outside the (site)
 * route group, so it renders with no header, footer or command palette.
 */
export default async function EmbedPage({ params }: Params) {
  const { id } = await params;
  const community = getCommunity(id);
  if (!community) notFound();

  return (
    <div className="p-2">
      <article
        className="panel flex items-center gap-4 p-4"
        style={{ borderColor: `${community.accent}55` }}
      >
        <CommunityIcon
          name={community.name}
          src={community.icon}
          accent={community.accent}
          className="size-14"
        />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-ink">{community.name}</h1>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-2">{community.description}</p>
          <p className="mt-1.5 flex items-center gap-3 text-[11px] text-ink-3">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-positive" aria-hidden="true" />
              {compactCount(community.online)} online
            </span>
            <span>{compactCount(community.members)} members</span>
          </p>
        </div>

        {community.invite && (
          <a
            href={community.invite}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-9 shrink-0 items-center rounded-lg px-4 text-sm font-medium text-white transition-[filter] hover:brightness-110"
            style={{ background: community.accent }}
          >
            Join
          </a>
        )}
      </article>
    </div>
  );
}
