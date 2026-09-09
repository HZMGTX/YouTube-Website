import type { Metadata } from 'next';
import ListingShell from '@/components/ListingShell';
import { allCategories, allTags, getPinned, getUnpinned } from '@/lib/communities';

export const metadata: Metadata = {
  title: 'Browse all communities',
  description: 'Every community in the directory, filterable by category, tag, size and activity.',
};

export default function BrowsePage() {
  return (
    <ListingShell
      title="Browse all communities"
      description="Every listing in the directory. Filter by category, tag or size, sort by whatever matters to you, and share the resulting view — the filters live in the URL."
      communities={getUnpinned()}
      pinned={getPinned()}
      tags={allTags()}
      categories={allCategories()}
      heading="All communities"
    />
  );
}
