'use client';

import { useEffect } from 'react';
import { withBasePath } from '@/lib/format';

/** Registers the offline cache. Failure is non-fatal — the site works without it. */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register(withBasePath('/sw.js')).catch(() => {
      /* Offline support is an enhancement; ignore registration failures. */
    });
  }, []);

  return null;
}
