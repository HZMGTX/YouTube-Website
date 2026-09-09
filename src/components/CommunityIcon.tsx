'use client';

import { useState } from 'react';
import { monogram } from '@/lib/format';

/**
 * Community avatar with a generated monogram fallback, used both when a listing has no
 * icon and when the Discord CDN link has gone dead (servers change their icon hash).
 */
export default function CommunityIcon({
  name,
  src,
  accent,
  className = 'size-12',
  rounded = 'rounded-xl',
}: {
  name: string;
  src: string | null;
  accent: string;
  className?: string;
  rounded?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className={`${className} ${rounded} grid shrink-0 place-items-center border border-line font-semibold text-white`}
        // container-type lets the lettering scale with the tile, so one component serves
        // both a 32px rail avatar and a 96px hero without a size prop.
        style={{ background: `linear-gradient(140deg, ${accent}, ${accent}99)`, containerType: 'size' }}
      >
        <span className="tracking-tight drop-shadow-sm" style={{ fontSize: '44cqh', lineHeight: 1 }}>
          {monogram(name)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`${className} ${rounded} shrink-0 border border-line object-cover`}
    />
  );
}
