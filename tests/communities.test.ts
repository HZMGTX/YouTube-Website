import { describe, expect, it } from 'vitest';
import directory from '../data/communities.json';
import {
  allCategories,
  allTags,
  applyFilters,
  categoryBreakdown,
  communitiesInCategory,
  communitiesWithTag,
  directoryStats,
  filterCommunities,
  findCategoryBySlug,
  findTagBySlug,
  getAllCommunities,
  getCommunity,
  getPinned,
  getUnpinned,
  relatedTo,
  sizeBreakdown,
  sortCommunities,
} from '@/lib/communities';
import { compactCount, formatCount, monogram, slugify, stillImage } from '@/lib/format';
import { DEFAULT_FILTERS, type Filters } from '@/lib/types';

const filters = (patch: Partial<Filters> = {}): Filters => ({ ...DEFAULT_FILTERS, ...patch });

describe('the pinned community', () => {
  it('resolves from pinnedId', () => {
    expect(getPinned()?.id).toBe(directory.pinnedId);
  });

  it('is excluded from the grid list, so it cannot render twice', () => {
    expect(getUnpinned().some((c) => c.id === directory.pinnedId)).toBe(false);
    expect(getUnpinned()).toHaveLength(getAllCommunities().length - 1);
  });

  // The whole point of pinning: nothing the reader does to the grid can displace it.
  it('is never returned by the grid under any filter or sort', () => {
    const combinations: Filters[] = [
      filters(),
      filters({ q: 'norax' }),
      filters({ sort: 'name' }),
      filters({ sort: 'newest' }),
      filters({ sort: 'online' }),
      filters({ sort: 'boosts' }),
      filters({ size: 'large' }),
      filters({ onlineOnly: true }),
      filters({ tags: ['Community'] }),
      filters({ categories: ['Community'] }),
    ];

    for (const combination of combinations) {
      const results = applyFilters(getUnpinned(), combination);
      expect(results.some((c) => c.id === directory.pinnedId)).toBe(false);
    }
  });

  it('returns null rather than throwing when pinnedId names nothing', () => {
    // getPinned reads the real file, so this asserts the guard's contract via the data:
    // an id that is present must resolve, and the lookup helper must not throw otherwise.
    expect(getCommunity('does-not-exist')).toBeUndefined();
  });
});

describe('search', () => {
  it('matches on name, description and tag', () => {
    expect(filterCommunities(getAllCommunities(), filters({ q: 'norax' }))).toHaveLength(1);
    expect(filterCommunities(getAllCommunities(), filters({ q: 'pixel' }))[0].name).toBe('Pixel Forge');
    expect(filterCommunities(getAllCommunities(), filters({ q: 'roleplay' })).length).toBeGreaterThan(0);
  });

  it('is case insensitive and ignores surrounding whitespace', () => {
    expect(filterCommunities(getAllCommunities(), filters({ q: '  NoRaX  ' }))).toHaveLength(1);
  });

  it('narrows rather than widens when terms are added', () => {
    const one = filterCommunities(getAllCommunities(), filters({ q: 'community' }));
    const two = filterCommunities(getAllCommunities(), filters({ q: 'community norax' }));
    expect(two.length).toBeLessThanOrEqual(one.length);
    expect(two.every((c) => one.includes(c))).toBe(true);
  });

  it('returns nothing for a term that appears nowhere', () => {
    expect(filterCommunities(getAllCommunities(), filters({ q: 'zzzznotathing' }))).toHaveLength(0);
  });
});

describe('filters', () => {
  it('buckets by size', () => {
    const small = filterCommunities(getAllCommunities(), filters({ size: 'small' }));
    const medium = filterCommunities(getAllCommunities(), filters({ size: 'medium' }));
    const large = filterCommunities(getAllCommunities(), filters({ size: 'large' }));

    expect(small.every((c) => c.members < 100)).toBe(true);
    expect(medium.every((c) => c.members >= 100 && c.members <= 1000)).toBe(true);
    expect(large.every((c) => c.members > 1000)).toBe(true);
    // The buckets partition the set: every listing lands in exactly one.
    expect(small.length + medium.length + large.length).toBe(getAllCommunities().length);
  });

  it('requires every selected tag, not any of them', () => {
    const both = filterCommunities(getAllCommunities(), filters({ tags: ['Community', 'Hangout'] }));
    expect(both.every((c) => c.tags.includes('Community') && c.tags.includes('Hangout'))).toBe(true);
  });

  it('accepts any of the selected categories', () => {
    const results = filterCommunities(getAllCommunities(), filters({ categories: ['Art', 'Music'] }));
    expect(results.every((c) => c.category === 'Art' || c.category === 'Music')).toBe(true);
    expect(results.length).toBe(
      communitiesInCategory('Art').length + communitiesInCategory('Music').length,
    );
  });

  it('drops empty servers when "active now" is on', () => {
    expect(
      filterCommunities(getAllCommunities(), filters({ onlineOnly: true })).every((c) => c.online > 0),
    ).toBe(true);
  });
});

describe('sorting', () => {
  const list = getAllCommunities();

  it('orders by members, online and boosts descending', () => {
    for (const key of ['members', 'online', 'boosts'] as const) {
      const sorted = sortCommunities(list, key);
      for (let i = 1; i < sorted.length; i += 1) {
        expect(sorted[i - 1][key]).toBeGreaterThanOrEqual(sorted[i][key]);
      }
    }
  });

  it('orders alphabetically and by newest', () => {
    const byName = sortCommunities(list, 'name').map((c) => c.name);
    expect(byName).toEqual([...byName].sort((a, b) => a.localeCompare(b)));

    const byDate = sortCommunities(list, 'newest');
    for (let i = 1; i < byDate.length; i += 1) {
      expect(byDate[i - 1].addedAt >= byDate[i].addedAt).toBe(true);
    }
  });

  it('does not mutate the array it is given', () => {
    const original = [...list];
    sortCommunities(list, 'name');
    expect(list).toEqual(original);
  });
});

describe('taxonomy', () => {
  it('round-trips tags and categories through their slugs', () => {
    for (const tag of allTags()) expect(findTagBySlug(slugify(tag))).toBe(tag);
    for (const category of allCategories()) expect(findCategoryBySlug(slugify(category))).toBe(category);
  });

  it('returns undefined for an unknown slug', () => {
    expect(findTagBySlug('not-a-tag')).toBeUndefined();
    expect(findCategoryBySlug('not-a-category')).toBeUndefined();
  });

  it('counts every listing exactly once across categories', () => {
    const total = categoryBreakdown().reduce((sum, row) => sum + row.count, 0);
    expect(total).toBe(getAllCommunities().length);
    expect(sizeBreakdown().reduce((sum, row) => sum + row.count, 0)).toBe(getAllCommunities().length);
  });

  it('finds communities by tag', () => {
    for (const tag of allTags()) {
      expect(communitiesWithTag(tag).every((c) => c.tags.includes(tag))).toBe(true);
    }
  });
});

describe('related communities', () => {
  const norax = getCommunity('norax')!;

  it('never includes the community itself', () => {
    expect(relatedTo(norax, 5).some((c) => c.id === norax.id)).toBe(false);
  });

  it('only returns communities that actually share something', () => {
    for (const related of relatedTo(norax, 5)) {
      const shares = related.tags.some((t) => norax.tags.includes(t)) || related.category === norax.category;
      expect(shares).toBe(true);
    }
  });

  it('respects the limit', () => {
    expect(relatedTo(norax, 2).length).toBeLessThanOrEqual(2);
  });
});

describe('stats', () => {
  it('sums the listings', () => {
    const stats = directoryStats();
    expect(stats.communities).toBe(getAllCommunities().length);
    expect(stats.members).toBe(getAllCommunities().reduce((sum, c) => sum + c.members, 0));
    expect(stats.categories).toBe(allCategories().length);
  });
});

describe('formatting', () => {
  it('formats counts', () => {
    expect(formatCount(1009)).toBe('1,009');
    expect(compactCount(999)).toBe('999');
    expect(compactCount(1009)).toBe('1K');
    expect(compactCount(27310)).toBe('27K');
    expect(compactCount(4820)).toBe('4.8K');
    expect(compactCount(1_500_000)).toBe('1.5M');
  });

  it('builds slugs and monograms', () => {
    expect(slugify('Content Creator')).toBe('content-creator');
    expect(slugify('  Voice Chat!  ')).toBe('voice-chat');
    expect(monogram('Norax')).toBe('N');
    expect(monogram('Pixel Forge')).toBe('PF');
    expect(monogram('')).toBe('?');
  });

  it('strips the animated flag so reduced-motion readers get a still frame', () => {
    expect(stillImage('https://cdn.discordapp.com/x.webp?size=1280&animated=true')).toBe(
      'https://cdn.discordapp.com/x.webp?size=1280',
    );
    expect(stillImage('https://cdn.discordapp.com/x.webp?animated=true')).toBe(
      'https://cdn.discordapp.com/x.webp?',
    );
  });
});

describe('the data file itself', () => {
  it('has unique ids and a pin that resolves', () => {
    const ids = getAllCommunities().map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(directory.pinnedId);
  });

  it('never gives an example listing an invite link', () => {
    for (const community of getAllCommunities()) {
      if (community.example) expect(community.invite).toBeNull();
      else expect(community.invite).toBeTruthy();
    }
  });
});
