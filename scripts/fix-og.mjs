#!/usr/bin/env node
/**
 * Give the generated Open Graph images a real .png extension.
 *
 * Next emits them as extensionless, hash-suffixed files (opengraph-image-1d655g) and
 * relies on a server to set the content type. A static host has no such server and
 * serves them as application/octet-stream, which social scrapers reject. This renames
 * each file to opengraph-image.png and rewrites every reference to match.
 *
 * Runs automatically as part of `npm run build`.
 */
import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { style } from './discord.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const IMAGE_PATTERN = /^(opengraph-image|twitter-image)-[a-z0-9]+$/i;
const REWRITABLE = new Set(['.html', '.txt', '.json', '.xml', '.js']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function main() {
  if (!existsSync(OUT)) {
    console.error(style.fail('No out/ directory — run the build first.'));
    process.exit(1);
  }

  const files = await walk(OUT);
  const renames = new Map();

  for (const file of files) {
    const base = path.basename(file);
    const match = base.match(IMAGE_PATTERN);
    if (!match) continue;
    const target = path.join(path.dirname(file), `${match[1]}.png`);
    await rename(file, target);
    renames.set(base, `${match[1]}.png`);
  }

  if (renames.size === 0) {
    console.log(style.dim('No generated Open Graph images to fix.'));
    return;
  }

  let touched = 0;
  for (const file of files) {
    if (!REWRITABLE.has(path.extname(file))) continue;
    if (!existsSync(file)) continue;

    const original = await readFile(file, 'utf8');
    let updated = original;

    for (const [from, to] of renames) {
      // Drop the cache-busting query too: the filename is already content-addressed
      // by the build, and a query string on a static host buys nothing.
      updated = updated.replaceAll(new RegExp(`${from}(\\?[A-Za-z0-9]+)?`, 'g'), to);
    }

    if (updated !== original) {
      await writeFile(file, updated, 'utf8');
      touched += 1;
    }
  }

  console.log(
    style.ok(`Renamed ${renames.size} Open Graph ${renames.size === 1 ? 'image' : 'images'} to .png`) +
      style.dim(` (updated ${touched} files)`),
  );
}

main().catch((cause) => {
  console.error(style.fail(cause.message));
  process.exit(1);
});
