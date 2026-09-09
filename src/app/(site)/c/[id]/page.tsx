import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommunityIcon from '@/components/CommunityIcon';
import CommunityBanner from '@/components/CommunityBanner';
import CommunityCard from '@/components/CommunityCard';
import TagPill from '@/components/TagPill';
import VerifiedBadge from '@/components/VerifiedBadge';
import ExampleChip from '@/components/ExampleChip';
import JoinButton from '@/components/JoinButton';
import CopyInvite from '@/components/CopyInvite';
import ShareMenu from '@/components/ShareMenu';
import SaveButton from '@/components/SaveButton';
import EmbedSnippet from '@/components/EmbedSnippet';
import RecordVisit from '@/components/RecordVisit';
import { getAllCommunities, getCommunity, relatedTo } from '@/lib/communities';
import { formatCount, formatDate, slugify } from '@/lib/format';
import { ISSUE_URL, SITE } from '@/lib/site';

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getAllCommunities().map((community) => ({ id: community.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const community = getCommunity(id);
  if (!community) return {};

  return {
    title: community.name,
    description: community.description,
    alternates: { canonical: `${SITE.url}/c/${community.id}` },
    // og:image comes from opengraph-image.tsx in this folder, which renders a card
    // built for social previews rather than reusing the server's raw banner art.
    openGraph: {
      type: 'website',
      title: community.name,
      description: community.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: community.name,
      description: community.description,
    },
  };
}

export default async function CommunityPage({ params }: Params) {
  const { id } = await params;
  const community = getCommunity(id);
  if (!community) notFound();

  const related = relatedTo(community, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: community.name,
    description: community.description,
    url: `${SITE.url}/c/${community.id}`,
    ...(community.icon ? { logo: community.icon } : {}),
    ...(community.invite ? { sameAs: [community.invite] } : {}),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RecordVisit id={community.id} />

      <nav aria-label="Breadcrumb" className="no-print mb-6 flex items-center gap-2 text-sm text-ink-3">
        <Link href="/" className="transition-colors hover:text-ink-2">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/category/${slugify(community.category)}`} className="transition-colors hover:text-ink-2">
          {community.category}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-ink-2">{community.name}</span>
      </nav>

      <article className="panel overflow-hidden !shadow-e2">
        {community.banner && (
          <CommunityBanner src={community.banner} accent={community.accent} className="h-40 sm:h-56" />
        )}

        <div className={`relative p-5 sm:p-8 ${community.banner ? '-mt-14 sm:-mt-16' : ''}`}>
          <CommunityIcon
            name={community.name}
            src={community.icon}
            accent={community.accent}
            className="size-24 sm:size-28"
            rounded="rounded-2xl"
          />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{community.name}</h1>
            {community.verified && <VerifiedBadge className="size-6" />}
            {community.example && <ExampleChip />}
          </div>

          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-2">{community.description}</p>

          <dl className="mt-6 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
            {[
              { label: 'Members', value: formatCount(community.members), numeric: true },
              { label: 'Online', value: formatCount(community.online), numeric: true },
              { label: 'Boosts', value: formatCount(community.boosts), numeric: true },
              // The category is a word, not a figure, so it takes body sizing and wraps
              // rather than being truncated to fit a numeric tile.
              { label: 'Category', value: community.category, numeric: false },
            ].map((item) => (
              <div key={item.label} className="flex flex-col justify-between bg-surface px-4 py-3">
                <dd
                  className={
                    item.numeric
                      ? 'text-lg font-semibold tabular-nums text-ink'
                      : 'text-sm font-medium leading-tight text-ink'
                  }
                >
                  {item.value}
                </dd>
                <dt className="mt-0.5 text-[11px] uppercase tracking-wider text-ink-3">{item.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {community.tags.map((tag) => (
              <TagPill key={tag} tag={tag} size="md" />
            ))}
          </div>

          <div className="no-print mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-6">
            <JoinButton community={community} size="lg" />
            {community.invite && <CopyInvite invite={community.invite} className="size-11" />}
            <ShareMenu name={community.name} path={`/c/${community.id}`} />
            <SaveButton id={community.id} name={community.name} className="size-9" />
            <p className="ml-auto text-xs text-ink-3">Listed {formatDate(community.addedAt)}</p>
          </div>
        </div>
      </article>

      <div className="no-print mt-6 grid items-start gap-4 sm:grid-cols-2">
        <EmbedSnippet id={community.id} name={community.name} />

        <div className="panel p-5">
          <h2 className="text-sm font-semibold text-ink">Something wrong with this listing?</h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-3">
            Listings are maintained in the open. Report a dead invite or a rule breach, or claim the
            listing if you run the server.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={ISSUE_URL.report(community.name, community.id)}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              Report listing
            </a>
            <a
              href={ISSUE_URL.claim(community.name, community.id)}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              Claim listing
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="no-print mt-12">
          <h2 id="related-heading" className="mb-4 text-xl font-semibold tracking-tight text-ink">
            Similar communities
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <CommunityCard key={item.id} community={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
