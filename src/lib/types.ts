/** A single listing in the directory. Shape mirrors data/communities.json. */
export type Community = {
  id: string;
  name: string;
  /** Discord snowflake, recorded so the refresh script can rebuild CDN asset URLs. */
  guildId?: string;
  description: string;
  /** Null for example listings, which deliberately carry no invite. */
  invite: string | null;
  /** Set when the invite is temporary; `npm run check` fails on these. */
  inviteExpiresAt?: string | null;
  icon: string | null;
  banner: string | null;
  members: number;
  online: number;
  boosts: number;
  verified: boolean;
  /** Demo data. Rendered with a visible "Example" chip so nothing reads as a real server. */
  example?: boolean;
  category: string;
  tags: string[];
  /** ISO date (YYYY-MM-DD). */
  addedAt: string;
  /** Hex colour used to tint the community's card and page. */
  accent: string;
};

export type Directory = {
  /** The community holding the featured slot. Change this string to re-pin. */
  pinnedId: string | null;
  communities: Community[];
};

export type SortKey = 'members' | 'online' | 'boosts' | 'newest' | 'name';

export type SizeBucket = 'all' | 'small' | 'medium' | 'large';

export type Filters = {
  q: string;
  tags: string[];
  categories: string[];
  sort: SortKey;
  size: SizeBucket;
  onlineOnly: boolean;
};

export const SORT_LABELS: Record<SortKey, string> = {
  members: 'Most members',
  online: 'Most online',
  boosts: 'Most boosted',
  newest: 'Recently added',
  name: 'A–Z',
};

export const SIZE_LABELS: Record<SizeBucket, string> = {
  all: 'Any size',
  small: 'Under 100',
  medium: '100 – 1,000',
  large: 'Over 1,000',
};

export const DEFAULT_FILTERS: Filters = {
  q: '',
  tags: [],
  categories: [],
  sort: 'members',
  size: 'all',
  onlineOnly: false,
};
