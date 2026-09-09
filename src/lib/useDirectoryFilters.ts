'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_FILTERS, type Filters, type SizeBucket, type SortKey } from './types';

const SORTS: SortKey[] = ['members', 'online', 'boosts', 'newest', 'growth', 'name'];
const SIZES: SizeBucket[] = ['all', 'small', 'medium', 'large'];

export type View = 'grid' | 'list';

export type DirectoryState = Filters & { view: View; savedOnly: boolean };

function list(value: string | null): string[] {
  return value ? value.split(',').map((v) => v.trim()).filter(Boolean) : [];
}

/**
 * Filter state lives in the URL rather than component state, so a filtered view can be
 * shared, bookmarked and reached with the back button. Writes use `replace` with
 * scroll:false so typing in the search box does not stack history entries or jump.
 */
export function useDirectoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const state = useMemo<DirectoryState>(() => {
    const sort = params.get('sort') as SortKey | null;
    const size = params.get('size') as SizeBucket | null;
    const view = params.get('view');
    return {
      q: params.get('q') ?? DEFAULT_FILTERS.q,
      tags: list(params.get('tags')),
      categories: list(params.get('cat')),
      sort: sort && SORTS.includes(sort) ? sort : DEFAULT_FILTERS.sort,
      size: size && SIZES.includes(size) ? size : DEFAULT_FILTERS.size,
      onlineOnly: params.get('online') === '1',
      verifiedOnly: params.get('verified') === '1',
      savedOnly: params.get('saved') === '1',
      view: view === 'list' ? 'list' : 'grid',
    };
  }, [params]);

  const update = useCallback(
    (patch: Partial<DirectoryState>) => {
      const next = new URLSearchParams(params.toString());
      const merged = { ...state, ...patch };

      const set = (key: string, value: string, fallback: string) => {
        if (value && value !== fallback) next.set(key, value);
        else next.delete(key);
      };

      set('q', merged.q, '');
      set('tags', merged.tags.join(','), '');
      set('cat', merged.categories.join(','), '');
      set('sort', merged.sort, DEFAULT_FILTERS.sort);
      set('size', merged.size, DEFAULT_FILTERS.size);
      set('online', merged.onlineOnly ? '1' : '', '');
      set('verified', merged.verifiedOnly ? '1' : '', '');
      set('saved', merged.savedOnly ? '1' : '', '');
      set('view', merged.view, 'grid');

      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [params, pathname, router, state],
  );

  const toggleInList = useCallback(
    (key: 'tags' | 'categories', value: string) => {
      const current = state[key];
      update({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });
    },
    [state, update],
  );

  const reset = useCallback(() => router.replace(pathname, { scroll: false }), [pathname, router]);

  const activeCount =
    (state.q ? 1 : 0) +
    state.tags.length +
    state.categories.length +
    (state.size !== 'all' ? 1 : 0) +
    (state.onlineOnly ? 1 : 0) +
    (state.verifiedOnly ? 1 : 0) +
    (state.savedOnly ? 1 : 0);

  return { state, update, toggleInList, reset, activeCount };
}
