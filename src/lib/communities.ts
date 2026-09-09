import directoryData from '../../data/communities.json';
import { slugify } from './format';
import type { Community, Directory, Filters, SizeBucket, SortKey } from './types';

const directory = directoryData as unknown as Directory;

/** Every listing, pinned one included. */
export function getAllCommunities(): Community[] {
  return directory.communities;
}

/**
 * The community holding the featured slot, or null when `pinnedId` is unset or points
 * at an id that no longer exists (deleting a listing must not break the page).
 */
export function getPinned(): Community | null {
  if (!directory.pinnedId) return null;
  return directory.communities.find((c) => c.id === directory.pinnedId) ?? null;
}

/**
 * Everything except the pinned community. The pinned entry lives in its own slot above
 * the grid, so including it here would render it twice.
 */
export function getUnpinned(): Community[] {
  return directory.communities.filter((c) => c.id !== directory.pinnedId);
}

export function getCommunity(id: string): Community | undefined {
  return directory.communities.find((c) => c.id === id);
}

export function allTags(list: Community[] = getAllCommunities()): string[] {
  const seen = new Map<string, number>();
  for (const community of list) {
    for (const tag of community.tags) seen.set(tag, (seen.get(tag) ?? 0) + 1);
  }
  return [...seen.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
}

export function allCategories(list: Community[] = getAllCommunities()): string[] {
  return [...new Set(list.map((c) => c.category))].sort((a, b) => a.localeCompare(b));
}

export function findTagBySlug(slug: string): string | undefined {
  return allTags().find((tag) => slugify(tag) === slug);
}

export function findCategoryBySlug(slug: string): string | undefined {
  return allCategories().find((category) => slugify(category) === slug);
}

export function communitiesWithTag(tag: string, list: Community[] = getAllCommunities()): Community[] {
  return list.filter((c) => c.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
}

export function communitiesInCategory(category: string, list: Community[] = getAllCommunities()): Community[] {
  return list.filter((c) => c.category.toLowerCase() === category.toLowerCase());
}

function inSizeBucket(community: Community, bucket: SizeBucket): boolean {
  switch (bucket) {
    case 'small':
      return community.members < 100;
    case 'medium':
      return community.members >= 100 && community.members <= 1000;
    case 'large':
      return community.members > 1000;
    default:
      return true;
  }
}

function matchesQuery(community: Community, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [community.name, community.description, community.category, ...community.tags]
    .join(' ')
    .toLowerCase();
  // Every whitespace-separated term must appear, so "art feedback" narrows rather than widens.
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

export function filterCommunities(list: Community[], filters: Filters): Community[] {
  return list.filter((community) => {
    if (!matchesQuery(community, filters.q)) return false;
    if (!inSizeBucket(community, filters.size)) return false;
    if (filters.onlineOnly && community.online <= 0) return false;
    if (filters.tags.length && !filters.tags.every((tag) => community.tags.includes(tag))) return false;
    if (filters.categories.length && !filters.categories.includes(community.category)) return false;
    return true;
  });
}

export function sortCommunities(list: Community[], sort: SortKey): Community[] {
  const sorted = [...list];
  sorted.sort((a, b) => {
    switch (sort) {
      case 'online':
        return b.online - a.online || a.name.localeCompare(b.name);
      case 'boosts':
        return b.boosts - a.boosts || a.name.localeCompare(b.name);
      case 'newest':
        return b.addedAt.localeCompare(a.addedAt) || a.name.localeCompare(b.name);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return b.members - a.members || a.name.localeCompare(b.name);
    }
  });
  return sorted;
}

/** Filter then sort. The pinned community is never part of `list`. */
export function applyFilters(list: Community[], filters: Filters): Community[] {
  return sortCommunities(filterCommunities(list, filters), filters.sort);
}

/** Other communities sharing the most tags, for the "related" rail on a community page. */
export function relatedTo(community: Community, limit = 3, list: Community[] = getAllCommunities()): Community[] {
  return list
    .filter((c) => c.id !== community.id)
    .map((c) => ({
      community: c,
      shared: c.tags.filter((t) => community.tags.includes(t)).length + (c.category === community.category ? 1 : 0),
    }))
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => b.shared - a.shared || b.community.members - a.community.members)
    .slice(0, limit)
    .map((entry) => entry.community);
}

export function newestCommunities(limit = 4, list: Community[] = getUnpinned()): Community[] {
  return sortCommunities(list, 'newest').slice(0, limit);
}

export function trendingCommunities(limit = 4, list: Community[] = getUnpinned()): Community[] {
  // "Trending" = the highest share of members currently online, which favours active
  // servers over merely large ones. Needs a floor so a 3-member server cannot top it.
  return [...list]
    .filter((c) => c.members >= 50)
    .sort((a, b) => b.online / b.members - a.online / a.members)
    .slice(0, limit);
}

export type DirectoryStats = {
  communities: number;
  members: number;
  online: number;
  boosts: number;
  categories: number;
  tags: number;
};

export function directoryStats(list: Community[] = getAllCommunities()): DirectoryStats {
  return {
    communities: list.length,
    members: list.reduce((sum, c) => sum + c.members, 0),
    online: list.reduce((sum, c) => sum + c.online, 0),
    boosts: list.reduce((sum, c) => sum + c.boosts, 0),
    categories: allCategories(list).length,
    tags: allTags(list).length,
  };
}

/** Counts per category, largest first — powers the /stats breakdown. */
export function categoryBreakdown(list: Community[] = getAllCommunities()) {
  return allCategories(list)
    .map((category) => {
      const members = communitiesInCategory(category, list);
      return {
        category,
        count: members.length,
        members: members.reduce((sum, c) => sum + c.members, 0),
      };
    })
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

export function sizeBreakdown(list: Community[] = getAllCommunities()) {
  const buckets: { bucket: SizeBucket; label: string; count: number }[] = [
    { bucket: 'small', label: 'Under 100', count: 0 },
    { bucket: 'medium', label: '100 – 1,000', count: 0 },
    { bucket: 'large', label: 'Over 1,000', count: 0 },
  ];
  for (const community of list) {
    const match = buckets.find((b) => inSizeBucket(community, b.bucket));
    if (match) match.count += 1;
  }
  return buckets;
}
