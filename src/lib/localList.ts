'use client';

import { useSyncExternalStore } from 'react';

/**
 * A tiny localStorage-backed list of community ids, shared across components via
 * useSyncExternalStore so a save on one card updates the count in the filter bar.
 * Returns a stable empty array during SSR/first paint, which keeps hydration quiet.
 */
const EMPTY: string[] = [];

function createStore(key: string, limit?: number) {
  let cache: string[] | null = null;
  const listeners = new Set<() => void>();

  function read(): string[] {
    if (cache) return cache;
    try {
      const parsed = JSON.parse(localStorage.getItem(key) ?? '[]');
      cache = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
    } catch {
      cache = [];
    }
    return cache;
  }

  function write(next: string[]) {
    cache = limit ? next.slice(0, limit) : next;
    try {
      localStorage.setItem(key, JSON.stringify(cache));
    } catch {
      /* Private mode or a full quota: keep the in-memory list working regardless. */
    }
    listeners.forEach((listener) => listener());
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    get: read,
    toggle(id: string) {
      const current = read();
      write(current.includes(id) ? current.filter((value) => value !== id) : [id, ...current]);
    },
    push(id: string) {
      const current = read();
      if (current[0] === id) return;
      write([id, ...current.filter((value) => value !== id)]);
    },
    clear() {
      write([]);
    },
  };
}

const savedStore = createStore('saved-communities');
const recentStore = createStore('recent-communities', 6);

export function useSavedIds(): string[] {
  return useSyncExternalStore(savedStore.subscribe, savedStore.get, () => EMPTY);
}

export function toggleSaved(id: string) {
  savedStore.toggle(id);
}

export function useRecentIds(): string[] {
  return useSyncExternalStore(recentStore.subscribe, recentStore.get, () => EMPTY);
}

export function recordVisit(id: string) {
  recentStore.push(id);
}
