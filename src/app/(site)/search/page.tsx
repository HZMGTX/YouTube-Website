import type { Metadata } from 'next';
import ListingShell from '@/components/ListingShell';
import { allCategories, allTags, getUnpinned } from '@/lib/communities';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search every community in the directory by name, topic or tag.',
  robots: { index: false, follow: true },
};

/** No featured slot here: a search page should return results and nothing else. */
export default function SearchPage() {
  return (
    <ListingShell
      title="Search"
      description="Search by name, topic or tag. Every term has to match, so adding words narrows the results. Your query stays in the URL, so the view is shareable."
      communities={getUnpinned()}
      pinned={null}
      tags={allTags()}
      categories={allCategories()}
      heading="Results"
    />
  );
}
