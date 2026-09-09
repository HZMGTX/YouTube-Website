#!/usr/bin/env node
/**
 * Enforce the no-name rule against the built site.
 *
 *   npm run build && npm run check:name
 *
 * This site deliberately displays no name or brand of its own (see src/lib/site.ts).
 * That is easy to undo by accident, so it is checked rather than trusted. Fails when:
 *
 *   1. any page declares og:site_name;
 *   2. any <title> is not the plain descriptor, or "<page> — <descriptor>";
 *   3. the header's home link contains a text wordmark rather than the mark alone;
 *   4. the web manifest names anything other than the descriptor;
 *   5. a term from FORBIDDEN appears anywhere in the output.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { style } from './discord.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');

/**
 * Brand terms that must never appear in the output. Add to this list if a name ever
 * gets proposed for the site, so the check catches it coming back.
 */
const FORBIDDEN = [];

const errors = [];

async function descriptor() {
  const source = await readFile(path.join(ROOT, 'src', 'lib', 'site.ts'), 'utf8');
  const match = source.match(/title:\s*'([^']+)'/);
  if (!match) throw new Error('Could not read SITE.title from src/lib/site.ts');
  return match[1];
}

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

function decode(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x2F;/g, '/');
}

async function main() {
  if (!existsSync(OUT)) {
    console.error(style.fail('No out/ directory. Run `npm run build` first.'));
    process.exit(1);
  }

  const name = await descriptor();
  const files = await htmlFiles(OUT);

  for (const file of files) {
    const relative = path.relative(OUT, file);
    const html = await readFile(file, 'utf8');

    // 1. og:site_name would name the site to every scraper and social preview.
    if (/property=["']og:site_name["']/i.test(html)) {
      errors.push(`${relative}: declares og:site_name.`);
    }

    // 2. Titles must be the descriptor, or "<something> — <descriptor>".
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (title) {
      const text = decode(title[1]).trim();
      if (text !== name && !text.endsWith(`— ${name}`)) {
        errors.push(`${relative}: title "${text}" is not "${name}" or "… — ${name}".`);
      }
    }

    // 3. The home link in the header must carry the mark only — no lettering.
    const header = html.match(/<header[\s\S]*?<\/header>/i);
    if (header) {
      for (const anchor of header[0].matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
        const href = anchor[1].replace(/\/$/, '');
        const isHome = href === '' || href === process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '');
        if (!isHome) continue;
        const text = decode(anchor[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
        if (text) errors.push(`${relative}: header home link contains the wordmark "${text}".`);
      }
    }

    // 5. Anything explicitly banned.
    for (const term of FORBIDDEN) {
      if (new RegExp(term, 'i').test(html)) errors.push(`${relative}: contains forbidden term "${term}".`);
    }
  }

  // 4. The installed app must not be named either.
  const manifestPath = path.join(OUT, 'manifest.webmanifest');
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    for (const key of ['name', 'short_name']) {
      if (manifest[key] && manifest[key] !== name) {
        errors.push(`manifest.webmanifest: ${key} is "${manifest[key]}", expected "${name}".`);
      }
    }
  }

  console.log(style.bold(`\nChecked ${files.length} pages for site branding\n`));

  if (errors.length) {
    for (const message of errors) console.log(style.fail(`  fail  ${message}`));
    console.log(style.fail(`\nThe site must display no name of its own. ${errors.length} problems.\n`));
    process.exit(1);
  }

  console.log(style.ok(`No site name, wordmark or og:site_name found. Descriptor in use: "${name}".\n`));
}

main().catch((cause) => {
  console.error(style.fail(`\n${cause.message}`));
  process.exit(1);
});
