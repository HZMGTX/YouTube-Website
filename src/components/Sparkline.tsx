import type { HistoryPoint } from '@/lib/types';

/**
 * Member count over time.
 *
 * One series, so there is no legend — the heading names it — and one hue. The figures
 * are rendered as text beside the chart by the caller, so nothing here is carried by
 * colour or shape alone. `vector-effect` keeps the stroke 2px however the SVG is scaled.
 */
export default function Sparkline({
  history,
  accent,
  height = 56,
  label,
}: {
  history: HistoryPoint[];
  accent: string;
  height?: number;
  label: string;
}) {
  if (history.length < 2) return null;

  const width = 240;
  const values = history.map((point) => point.members);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 4;

  const x = (index: number) => (index / (history.length - 1)) * width;
  const y = (value: number) => pad + (1 - (value - min) / span) * (height - pad * 2);

  const line = values.map((value, index) => `${index === 0 ? 'M' : 'L'}${x(index)},${y(value)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  const lastX = x(values.length - 1);
  const lastY = y(values[values.length - 1]);
  const gradientId = `spark-${label.replace(/\W+/g, '')}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-14 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r="3" fill={accent} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
