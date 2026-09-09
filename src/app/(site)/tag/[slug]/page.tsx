import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ListingShell from '@/components/ListingShell';
import {
  allCategories,
  allTags,
  communitiesWithTag,
  findTagBySlug,
  getPinned,
} from '@/lib/communities';
import { slugify } from '@/lib/format';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allTags().map((tag) => ({ slug: slugify(tag) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const tag = findTagBySlug(slug);
  if (!tag) return {};
  return {
    title: `${tag} communities`,
    description: `Every community in the directory tagged ${tag}.`,
  };
}

export default async function TagPage({ params }: Params) {
  const { slug } = await params;
  const tag = findTagBySlug(slug);
  if (!tag) notFound();

  const matches = communitiesWithTag(tag);
  const pinned = getPinned();
  // The featured community keeps the top slot here only when it actually carries the tag.
  const featured = pinned && matches.some((c) => c.id === pinned.id) ? pinned : null;

  return (
    <ListingShell
      title={`${tag} communities`}
      description={`${matches.length} ${matches.length === 1 ? 'community' : 'communities'} tagged ${tag}.`}
      communities={matches.filter((c) => c.id !== featured?.id)}
      pinned={featured}
      tags={allTags(matches)}
      categories={allCategories(matches)}
      heading={`Tagged ${tag}`}
      empty={{ title: `No ${tag} communities yet`, body: 'Nothing carries this tag at the moment.' }}
    />
  );
}
