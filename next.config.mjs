/**
 * Static export: `npm run build` emits plain HTML/CSS/JS into `out/`, which can be
 * served by any file host (GitHub Pages, Vercel, Netlify, S3) with no Node runtime.
 *
 * NEXT_PUBLIC_BASE_PATH exists for project-scoped hosts such as GitHub Pages, where
 * the site lives under /<repo> rather than at the domain root. Leaving it unset keeps
 * local development and root-domain hosting working unchanged.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
export default {
  output: 'export',
  basePath,
  trailingSlash: true,
  // Static export has no image optimisation server; community art is served straight
  // from the Discord CDN.
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
