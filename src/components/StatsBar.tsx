'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCount } from '@/lib/format';

type Stat = { label: string; value: number };

/** Counts up once when scrolled into view; static for reduced-motion readers. */
function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic, so the number decelerates into its final value
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    setValue(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function StatValue({ value, active }: { value: number; active: boolean }) {
  return <>{formatCount(useCountUp(value, active))}</>;
}

export default function StatsBar({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <dl ref={ref} className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-surface px-4 py-5 text-center sm:px-6">
          <dd className="text-2xl font-semibold tabular-nums tracking-tight text-ink">
            <StatValue value={stat.value} active={active} />
          </dd>
          <dt className="mt-1 text-xs uppercase tracking-wider text-ink-3">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}
