'use client';

import { useEffect } from 'react';
import { recordVisit } from '@/lib/localList';

/** Logs a community page view into the local "recently viewed" list. */
export default function RecordVisit({ id }: { id: string }) {
  useEffect(() => {
    recordVisit(id);
  }, [id]);

  return null;
}
