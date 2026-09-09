#!/usr/bin/env node
/**
 * Minimal static server for the exported site:
 *
 *   npm start            # serves out/ on http://localhost:4173
 *   PORT=8080 npm start
 *
 * Exists so previewing and the end-to-end tests need no extra dependency, and so the
 * content types match what a real static host sends (which is what makes the .png
 * rename in fix-og.mjs worth doing).
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname.split('?')[0]);
  // Refuse anything that climbs out of out/.
  const target = path.normalize(path.join(OUT, decoded));
  if (!target.startsWith(OUT)) return null;

  const candidates = [target, `${target}.html`, path.join(target, 'index.html')];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

createServer((request, response) => {
  const file = resolveFile(request.url ?? '/');

  if (!file) {
    const notFound = path.join(OUT, '404.html');
    response.writeHead(404, { 'content-type': TYPES['.html'] });
    if (existsSync(notFound)) return createReadStream(notFound).pipe(response);
    return response.end('Not found');
  }

  response.writeHead(200, {
    'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
    'cache-control': 'no-cache',
  });
  createReadStream(file).pipe(response);
}).listen(PORT, () => {
  console.log(`Serving out/ on http://localhost:${PORT}`);
});
