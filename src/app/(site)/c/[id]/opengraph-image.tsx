import { ImageResponse } from 'next/og';
import { getAllCommunities, getCommunity } from '@/lib/communities';
import { monogram } from '@/lib/format';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Community listing';

export function generateStaticParams() {
  return getAllCommunities().map((community) => ({ id: community.id }));
}

/**
 * Generated once at build time, one per listing. Carries the community's identity and
 * the site's geometric mark — never a site name, per the no-name rule.
 */
export default async function OpengraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const community = getCommunity(id);

  if (!community) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0b0b10',
            color: '#ededf2',
            fontSize: 48,
          }}
        >
          Community Directory
        </div>
      ),
      size,
    );
  }

  const format = (value: number) => value.toLocaleString('en-US');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0b10',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: 28,
              background: community.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 56,
              fontWeight: 700,
            }}
          >
            {monogram(community.name)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ color: '#a2a2ae', fontSize: 26 }}>{community.category}</div>
            <div style={{ color: '#ededf2', fontSize: 66, fontWeight: 700, lineHeight: 1.05 }}>
              {community.name}
            </div>
          </div>
        </div>

        <div style={{ color: '#a2a2ae', fontSize: 30, lineHeight: 1.45, maxWidth: 980 }}>
          {community.description.slice(0, 160)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 44 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#ededf2', fontSize: 38, fontWeight: 700 }}>
                {format(community.members)}
              </span>
              <span style={{ color: '#6f6f7d', fontSize: 22 }}>members</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#34d399', fontSize: 38, fontWeight: 700 }}>
                {format(community.online)}
              </span>
              <span style={{ color: '#6f6f7d', fontSize: 22 }}>online</span>
            </div>
          </div>

          {/* The geometric mark, drawn as boxes — the site has no wordmark to place here. */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: '#8b5cf6', opacity: 0.75 }} />
            <div style={{ width: 18, height: 18, borderRadius: 9, background: '#8b5cf6' }} />
            <div style={{ width: 18, height: 18, borderRadius: 9, background: '#8b5cf6', opacity: 0.55 }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
