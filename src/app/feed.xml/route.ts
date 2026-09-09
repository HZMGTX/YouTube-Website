import { getAllCommunities, sortCommunities } from '@/lib/communities';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS of the most recently listed communities. */
export function GET() {
  const recent = sortCommunities(getAllCommunities(), 'newest').slice(0, 20);

  const items = recent
    .map((community) => {
      const url = `${SITE.url}/c/${community.id}`;
      return `    <item>
      <title>${escape(community.name)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${community.addedAt}T00:00:00Z`).toUTCString()}</pubDate>
      <category>${escape(community.category)}</category>
      <description>${escape(community.description)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(SITE.title)}</title>
    <link>${SITE.url}/</link>
    <description>${escape(SITE.description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
