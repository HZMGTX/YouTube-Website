import { getAllCommunities } from '@/lib/communities';
import { SITE } from '@/lib/site';
import directory from '../../../data/communities.json';

export const dynamic = 'force-static';

/**
 * Machine-readable copy of the directory, so the listings can be consumed by a bot,
 * a dashboard or anyone else without scraping the HTML.
 */
export function GET() {
  const body = {
    generatedAt: new Date().toISOString(),
    pinnedId: (directory as { pinnedId: string | null }).pinnedId,
    count: getAllCommunities().length,
    communities: getAllCommunities().map((community) => ({
      ...community,
      url: `${SITE.url}/c/${community.id}`,
    })),
  };

  return Response.json(body);
}
