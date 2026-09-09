import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ListingShell from '@/components/ListingShell';
import {
  allCategories,
  allTags,
  communitiesInCategory,
  findCategoryBySlug,
  getPinned,
} from '@/lib/communities';
import { slugify } from '@/lib/format';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allCategories().map((category) => ({ slug: slugify(category) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category} communities`,
    description: `Every community in the ${category} category.`,
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);
  if (!category) notFound();

  const matches = communitiesInCategory(category);
  const pinned = getPinned();
  const featured = pinned && matches.some((c) => c.id === pinned.id) ? pinned : null;

  return (
    <ListingShell
      title={`${category} communities`}
      description={`${matches.length} ${matches.length === 1 ? 'community' : 'communities'} in ${category}.`}
      communities={matches.filter((c) => c.id !== featured?.id)}
      pinned={featured}
      tags={allTags(matches)}
      categories={allCategories(matches)}
      heading={category}
      empty={{ title: `No ${category} communities yet`, body: 'Nothing is listed in this category at the moment.' }}
    />
  );
}
