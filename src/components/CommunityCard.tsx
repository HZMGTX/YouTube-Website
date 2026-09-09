import Link from 'next/link';
import CommunityIcon from './CommunityIcon';
import SaveButton from './SaveButton';
import StatPair from './StatPair';
import TagPill from './TagPill';
import VerifiedBadge from './VerifiedBadge';
import ExampleChip from './ExampleChip';
import JoinButton from './JoinButton';
import type { Community } from '@/lib/types';

/**
 * The title link is stretched across the card (`after:absolute after:inset-0`) so the
 * whole card is one click target without nesting the save and join controls inside an
 * anchor, which would be invalid and unreachable by keyboard.
 */
export default function CommunityCard({ community }: { community: Community }) {
  return (
    <article className="panel panel-interactive relative flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <CommunityIcon name={community.name} src={community.icon} accent={community.accent} />

        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-base font-semibold leading-tight text-ink">
            <Link href={`/c/${community.id}`} className="truncate after:absolute after:inset-0">
              {community.name}
            </Link>
            {community.verified && <VerifiedBadge />}
          </h3>
          <p className="mt-1 text-xs text-ink-3">{community.category}</p>
        </div>

        <SaveButton id={community.id} name={community.name} className="relative z-10" />
      </div>

      <p className="line-clamp-2 text-sm leading-relaxed text-ink-2">{community.description}</p>

      <div className="relative z-10 flex flex-wrap gap-1.5">
        {community.tags.slice(0, 3).map((tag) => (
          <TagPill key={tag} tag={tag} />
        ))}
        {community.example && <ExampleChip />}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
        <StatPair members={community.members} online={community.online} />
        <JoinButton community={community} size="sm" />
      </div>
    </article>
  );
}
