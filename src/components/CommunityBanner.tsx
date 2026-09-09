'use client';

import { useState } from 'react';
import { stillImage } from '@/lib/format';

/**
 * Banner art with a graceful failure: Discord banner hashes change when a server
 * updates its art, and a stale URL would otherwise leave a broken image across the top
 * of the card. On error the accent colour takes over instead.
 *
 * The <source media> rule serves the still frame of an animated banner to readers who
 * ask for reduced motion, with no JavaScript involved.
 */
export default function CommunityBanner({
  src,
  accent,
  className,
}: {
  src: string;
  accent: string;
  className: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {failed ? (
        <div
          className="size-full"
          style={{ background: `linear-gradient(120deg, ${accent}, ${accent}22)` }}
          aria-hidden="true"
        />
      ) : (
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet={stillImage(src)} />
          <img
            src={src}
            alt=""
            fetchPriority="high"
            onError={() => setFailed(true)}
            className="size-full object-cover"
          />
        </picture>
      )}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, var(--surface) 4%, transparent 60%)' }}
        aria-hidden="true"
      />
    </div>
  );
}
