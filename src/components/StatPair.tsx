import { compactCount } from '@/lib/format';

/** Members / online / boosts readout shared by cards and the community page. */
export default function StatPair({
  members,
  online,
  boosts,
  className = '',
}: {
  members: number;
  online: number;
  boosts?: number;
  className?: string;
}) {
  return (
    <dl className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2 ${className}`}>
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-positive" aria-hidden="true" />
        <dt className="sr-only">Online now</dt>
        <dd>
          <span className="font-medium text-ink">{compactCount(online)}</span> online
        </dd>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-ink-3" aria-hidden="true" />
        <dt className="sr-only">Members</dt>
        <dd>
          <span className="font-medium text-ink">{compactCount(members)}</span> members
        </dd>
      </div>
      {typeof boosts === 'number' && boosts > 0 && (
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Server boosts</dt>
          <dd className="text-ink-3">{compactCount(boosts)} boosts</dd>
        </div>
      )}
    </dl>
  );
}
