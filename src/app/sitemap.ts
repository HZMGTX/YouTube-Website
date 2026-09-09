import type { MetadataRoute } from 'next';
import { allCategories, allTags, getAllCommunities } from '@/lib/communities';
import { slugify } from '@/lib/format';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE.url}/browse`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.url}/stats`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE.url}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/guidelines`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.url}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // /search and /embed are deliberately absent: both are noindex.
  return [
    ...pages,
    ...getAllCommunities().map((community) => ({
      url: `${SITE.url}/c/${community.id}`,
      lastModified: new Date(`${community.addedAt}T00:00:00Z`),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...allCategories().map((category) => ({
      url: `${SITE.url}/category/${slugify(category)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...allTags().map((tag) => ({
      url: `${SITE.url}/tag/${slugify(tag)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];
}
