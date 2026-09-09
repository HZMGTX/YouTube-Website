/** 1009 -> "1,009" */
export function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}

/** 27310 -> "27.3K". Used where space is tight, such as compact cards. */
export function compactCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    return `${k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k)}K`;
  }
  const m = n / 1_000_000;
  return `${m < 10 ? m.toFixed(1).replace(/\.0$/, '') : Math.round(m)}M`;
}

/** "2026-09-09" -> "9 September 2026" */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** "Voice Chat" -> "voice-chat", so tags and categories can be URL segments. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Icon fallback lettering: initials for a multi-word name, a single letter for a
 * one-word one — two letters of a single word tends to spell something ("NO" for Norax).
 */
export function monogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Prefix a root-relative path with the deploy base path, so links keep working when
 * the site is served from a subdirectory (GitHub Pages project sites).
 */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (!base) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Discord serves a still frame for an animated asset when `animated=true` is absent.
 * Used to honour prefers-reduced-motion without JavaScript, via <source media=...>.
 */
export function stillImage(url: string): string {
  return url.replace(/[?&]animated=true/, (match) => (match.startsWith('?') ? '?' : ''));
}
