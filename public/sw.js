/**
 * Offline cache for the directory.
 *
 * Stale-while-revalidate for pages and assets: a repeat visitor gets an instant paint
 * from cache while a fresh copy downloads in the background, and a reader with no
 * connection still gets the last version they saw. Discord CDN images are deliberately
 * not cached — they are large, animated, and change independently of a deploy.
 */
const CACHE = 'directory-v1';
const PRECACHE = ['/', '/browse/', '/submit/', '/guidelines/', '/faq/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);

      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);

      // Serve the cached copy immediately when there is one; refresh it behind the scenes.
      return cached || network;
    }),
  );
});
