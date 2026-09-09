# Community directory

A static directory for promoting Discord communities. One community holds a featured
slot at the top of every listing; everything else is searchable, filterable and sortable.

Built with Next.js, React and Tailwind, and **exported to plain static HTML, CSS and
JavaScript** — the built site in `out/` needs no server and can be dropped on GitHub
Pages, Vercel, Netlify or any file host.

## The site displays no name of its own

This is a deliberate constraint, not an oversight. There is no wordmark, no logotype, no
brand in the header, footer, page titles or `og:site_name`. The header carries a
geometric mark only, and page titles are a plain descriptor (`Community Directory`).
Community names — including the featured one — are shown normally; it is the site itself
that stays nameless.

`npm run check:name` enforces this against the built output and runs in CI. It fails if
any page declares `og:site_name`, if a `<title>` stops matching the descriptor, if the
header's home link gains text, or if the web manifest is renamed. The single place to
change wording is `src/lib/site.ts`.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export into out/
npm start            # serve out/ on http://localhost:4173
```

## Adding a community

You never write a listing by hand. Paste an invite and the script pulls the name,
description, icon, banner, member and boost counts straight from Discord:

```bash
npm run add -- https://discord.gg/example
npm run add -- https://discord.gg/example --category Gaming --tags "Gaming,Events"
npm run add -- https://discord.gg/example --pin      # also give it the featured slot
npm run check                                        # validate before committing
```

## Pinning

`data/communities.json` opens with a single field:

```json
{ "pinnedId": "norax", "communities": [ … ] }
```

Whichever listing that id names renders in the featured slot above the grid and is
excluded from the grid itself, so it stays first no matter how the grid is searched,
filtered or sorted — a pinned post, not a search result. On tag and category pages it
appears only when it actually belongs to that tag or category. Change the string to
re-pin; set it to `null` for no featured community.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Static export into `out/`, then fixes the Open Graph image extensions |
| `npm start` | Serve `out/` locally with realistic content types |
| `npm run add -- <invite>` | Add a listing from a Discord invite |
| `npm run refresh` | Re-fetch member, online and boost counts for every listing |
| `npm run check` | Validate `data/communities.json` (`--offline`, `--strict`) |
| `npm run check:name` | Assert the built site displays no name of its own |
| `npm test` | Unit tests for the pin, filter and sort logic |
| `npm run e2e` | Playwright browser tests, including an axe accessibility scan |
| `npm run verify` | check → build → check:name → test |

## Data model

Everything lives in `data/communities.json`.

| Field | Notes |
| --- | --- |
| `id` | Lowercase slug; forms the `/c/<id>` URL |
| `name`, `description`, `category`, `tags` | Editorial fields — `npm run refresh` never overwrites these |
| `invite` | Permanent Discord invite. `null` only for example listings |
| `inviteExpiresAt` | Set automatically; a listing with one fails `check` as it nears expiry |
| `icon`, `banner` | Discord CDN URLs; a missing icon falls back to a generated monogram |
| `members`, `online`, `boosts` | Maintained by `npm run refresh` |
| `verified` | Shows a badge; set from Discord's VERIFIED/PARTNERED features |
| `example` | Demo data. Renders an "Example" chip and carries no invite |
| `accent` | Hex colour used to tint the listing's card and page |

### Example listings

The directory ships with several listings marked `"example": true` so search, filters,
sorting and the statistics page are visible with real-looking data. They render with a
visible "Example" chip and have no invite link, so nothing can be mistaken for a real
server. Delete them from `data/communities.json` as real listings replace them —
`npm run check` reminds you how many are left.

## Known limitations

- **Member counts are not live.** The site is static, and the featured server's Discord
  widget is disabled, so a browser cannot read counts directly. `npm run refresh` (run
  weekly by `.github/workflows/refresh.yml`) keeps them current instead, so a figure can
  be a few days old.
- **Temporary invites break listings.** Discord invites can carry an expiry. `npm run
  check` warns as soon as one is present and fails within seven days of expiry, and the
  weekly workflow opens an issue. Always list a permanent invite or a vanity URL.

## Deploying

The build is a folder of static files, so any host works.

- **GitHub Pages** — enable Settings → Pages → Source: GitHub Actions.
  `.github/workflows/deploy.yml` then builds and publishes on every push to `main`, and
  sets `NEXT_PUBLIC_BASE_PATH` for you so a project site served from `/<repo>` works.
- **Anywhere else** — `npm run build` and upload `out/`. Set `NEXT_PUBLIC_SITE_URL` to
  the public origin so canonical URLs, the sitemap and the feed are correct.

## What is generated

`sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `feed.xml` (recently added
communities), `communities.json` (the whole directory, machine-readable), a per-listing
Open Graph image, and `sw.js` for offline support.

## Accessibility

Every page is keyboard operable with a visible focus ring and a skip link, filter results
announce themselves, the animated banner is replaced by a still frame under
`prefers-reduced-motion`, and both themes meet WCAG AA contrast. `npm run e2e` runs an
axe-core scan over six pages in both themes and fails on any violation.
