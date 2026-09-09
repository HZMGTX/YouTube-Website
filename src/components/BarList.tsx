import Link from 'next/link';
import { formatCount } from '@/lib/format';

export type BarRow = { label: string; value: number; href?: string; note?: string };

/**
 * Horizontal magnitude bars.
 *
 * All bars encode the same measure, so they share one hue — colouring each row
 * differently would imply an identity encoding that is not there. The value is always
 * rendered as text beside its bar, so the chart reads correctly without colour and
 * doubles as its own data table.
 */
export default function BarList({
  rows,
  unit = 'communities',
}: {
  rows: BarRow[];
  unit?: string;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <ul className="flex flex-col gap-2.5">
      {rows.map((row) => {
        const percent = Math.max((row.value / max) * 100, row.value > 0 ? 1.5 : 0);
        const label = (
          <span className="truncate text-sm text-ink-2 group-hover:text-ink">{row.label}</span>
        );

        return (
          <li key={row.label} className="group grid grid-cols-[minmax(5.5rem,9rem)_1fr_auto] items-center gap-3">
            {row.href ? (
              <Link href={row.href} className="truncate transition-colors">
                {label}
              </Link>
            ) : (
              label
            )}

            <span
              className="relative h-2.5 overflow-hidden rounded-sm bg-raised"
              title={`${row.label}: ${formatCount(row.value)} ${unit}`}
            >
              <span
                className="absolute inset-y-0 left-0 rounded-r bg-accent transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </span>

            <span className="min-w-10 text-right text-sm font-medium tabular-nums text-ink">
              {formatCount(row.value)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
