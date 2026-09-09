import Link from 'next/link';
import CommunityIcon from './CommunityIcon';
import SaveButton from './SaveButton';
import StatPair from './StatPair';
import VerifiedBadge from './VerifiedBadge';
import ExampleChip from './ExampleChip';
import JoinButton from './JoinButton';
import type { Community } from '@/lib/types';

/** Compact list variant of CommunityCard, for the grid/list view toggle. */
export default function CommunityRow({ community }: { community: Community }) {
  return (
    <article className="panel panel-interactive relative flex items-center gap-4 p-4">
      <CommunityIcon name={community.name} src={community.icon} accent={community.accent} className="size-11" />

      <div className="min-w-0 flex-1">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold leading-tight text-ink">
          <Link href={`/c/${community.id}`} className="truncate after:absolute after:inset-0">
            {community.name}
          </Link>
          {community.verified && <VerifiedBadge className="size-3.5" />}
          {community.example && <ExampleChip />}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-ink-2">{community.description}</p>
        <StatPair members={community.members} online={community.online} className="mt-1.5" />
      </div>

      <div className="relative z-10 flex shrink-0 items-center gap-2">
        <SaveButton id={community.id} name={community.name} />
        <JoinButton community={community} size="sm" className="hidden sm:inline-flex" />
      </div>
    </article>
  );
}
