import Link from 'next/link';
import CommunityIcon from './CommunityIcon';
import CommunityBanner from './CommunityBanner';
import SaveButton from './SaveButton';
import TagPill from './TagPill';
import VerifiedBadge from './VerifiedBadge';
import JoinButton from './JoinButton';
import CopyInvite from './CopyInvite';
import ShareMenu from './ShareMenu';
import { compactCount, formatCount } from '@/lib/format';
import type { Community } from '@/lib/types';

/**
 * The featured slot. Whichever community `pinnedId` names in data/communities.json
 * renders here, above the grid and outside it, so it stays first no matter how the
 * grid below is searched, filtered or sorted.
 */
function FeaturedChip({ accent }: { accent: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-3 py-1 text-xs font-medium text-ink-2 shadow-e1 backdrop-blur">
      <span className="size-1.5 rounded-full" style={{ background: accent }} aria-hidden="true" />
      Featured community
    </span>
  );
}

export default function PinnedCard({ community }: { community: Community }) {
  return (
    <article className="panel relative overflow-hidden !shadow-e2">
      {community.banner && (
        <>
          <CommunityBanner src={community.banner} accent={community.accent} className="h-36 sm:h-48" />
          <div className="absolute right-4 top-4 z-10">
            <FeaturedChip accent={community.accent} />
          </div>
        </>
      )}

      <div className={`relative flex flex-col gap-5 p-5 sm:p-6 ${community.banner ? '-mt-12 sm:-mt-14' : ''}`}>
        <div className="flex items-end justify-between gap-4">
          <CommunityIcon
            name={community.name}
            src={community.icon}
            accent={community.accent}
            className="size-20 sm:size-24"
            rounded="rounded-2xl"
          />
          {!community.banner && <FeaturedChip accent={community.accent} />}
        </div>

        <div>
          <h2 className="flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            <Link href={`/c/${community.id}`} className="hover:text-accent">
              {community.name}
            </Link>
            {community.verified && <VerifiedBadge className="size-5" />}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2 sm:text-base">{community.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-positive" aria-hidden="true" />
            <span className="font-semibold text-ink">{formatCount(community.online)}</span>
            <span className="text-ink-2">online</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-ink-3" aria-hidden="true" />
            <span className="font-semibold text-ink">{formatCount(community.members)}</span>
            <span className="text-ink-2">members</span>
          </span>
          {community.boosts > 0 && (
            <span className="text-ink-3">{compactCount(community.boosts)} boosts</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {community.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-5">
          <JoinButton community={community} size="lg" />
          <Link
            href={`/c/${community.id}`}
            className="inline-flex h-11 items-center rounded-lg border border-line px-4 text-sm font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            About this server
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {community.invite && <CopyInvite invite={community.invite} />}
            <ShareMenu name={community.name} path={`/c/${community.id}`} />
            <SaveButton id={community.id} name={community.name} className="size-9" />
          </div>
        </div>
      </div>
    </article>
  );
}
