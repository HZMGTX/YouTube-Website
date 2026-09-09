import Sparkline from './Sparkline';
import { compactCount, formatCount, formatDate } from '@/lib/format';
import { growthRate, growthWindowDays } from '@/lib/communities';
import type { Community } from '@/lib/types';

/**
 * Growth over the recorded history. A listing that has only just been added has a
 * single sample, so this says so plainly rather than drawing a flat line that would
 * imply the server is not growing.
 */
export default function GrowthCard({ community }: { community: Community }) {
  const history = community.history ?? [];
  const rate = growthRate(community);
  const days = growthWindowDays(community);

  if (rate === null || history.length < 2) {
    return (
      <div className="panel p-5">
        <h2 className="text-sm font-semibold text-ink">Member growth</h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-3">
          Not enough history yet. Counts are sampled each time the directory refreshes, and a
          trend appears here once there are at least two samples
          {history.length === 1 ? ` — the first was taken on ${formatDate(history[0].date)}.` : '.'}
        </p>
      </div>
    );
  }

  const first = history[0];
  const last = history[history.length - 1];
  const change = last.members - first.members;
  const rising = change >= 0;

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Member growth</h2>
          <p className="mt-0.5 text-xs text-ink-3">
            {days ? `Last ${days} days` : 'Recorded history'}
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums ${
            rising ? 'border-line text-ink' : 'border-line text-ink-2'
          }`}
        >
          {rising ? '+' : ''}
          {rate.toFixed(1)}%
        </span>
      </div>

      <div className="mt-4">
        <Sparkline
          history={history}
          accent={community.accent}
          label={`${community.name} grew from ${formatCount(first.members)} to ${formatCount(
            last.members,
          )} members between ${formatDate(first.date)} and ${formatDate(last.date)}.`}
        />
      </div>

      <dl className="mt-3 flex items-center justify-between text-xs text-ink-3">
        <div>
          <dt className="sr-only">Members on {formatDate(first.date)}</dt>
          <dd className="tabular-nums">{compactCount(first.members)}</dd>
        </div>
        <div className="text-ink-2">
          <dt className="sr-only">Change</dt>
          <dd className="tabular-nums">
            {rising ? '+' : ''}
            {formatCount(change)} members
          </dd>
        </div>
        <div>
          <dt className="sr-only">Members on {formatDate(last.date)}</dt>
          <dd className="tabular-nums text-ink">{compactCount(last.members)}</dd>
        </div>
      </dl>
    </div>
  );
}
