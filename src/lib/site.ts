/**
 * Site-wide strings.
 *
 * DELIBERATE CONSTRAINT: this site displays no name or brand of its own. `title` is a
 * plain descriptor of what the page is, not a product name, and there is no wordmark,
 * logotype or `openGraph.siteName` anywhere. Community names are of course shown — it
 * is the site itself that stays nameless. `npm run check:name` enforces this against
 * the built output on every CI run; if you introduce a brand here, that check fails.
 */
export const SITE = {
  title: 'Community Directory',
  tagline: 'Find a community worth joining',
  description:
    'Browse Discord communities by size, interest and activity. Every listing is hand-checked, links straight to an invite, and is free to submit.',
  /** Used for canonical URLs, sitemap and feed. Override per deployment. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hzmgtx.github.io/YouTube-Website',
  /** Backs the submit, report and claim flows, which open prefilled issues. */
  repo: 'https://github.com/HZMGTX/YouTube-Website',
  locale: 'en',
} as const;

export const ISSUE_URL = {
  submit: `${SITE.repo}/issues/new?template=community-submission.yml`,
  report: (name: string, id: string) =>
    `${SITE.repo}/issues/new?template=report-listing.yml&title=${encodeURIComponent(
      `Report: ${name}`,
    )}&listing=${encodeURIComponent(id)}`,
  claim: (name: string, id: string) =>
    `${SITE.repo}/issues/new?template=claim-listing.yml&title=${encodeURIComponent(
      `Claim: ${name}`,
    )}&listing=${encodeURIComponent(id)}`,
};
