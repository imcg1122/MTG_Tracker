const CACHE = 'mtg-playmat-v55';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon192.png',
  './icon512.png'
];

// Install: cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: stale-while-revalidate for index.html, network-first for everything else
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isIndexHtml = url.pathname === '/' || url.pathname === '/index.html';

  if (isIndexHtml) {
    // Stale-while-revalidate: serve cached, update in background
    e.respondWith(
      caches.match(e.request).then(cached => {
        // Start background revalidation immediately
        const fetchPromise = fetch(e.request).then(response => {
          // Cache the new version if response is valid
          if (response && response.status === 200 && response.type !== 'error') {
            caches.open(CACHE).then(cache => cache.put(e.request, response.clone()));
          }
          return response;
        }).catch(() => cached); // Fall back to cached if fetch fails

        // Return cached version immediately, or fetch if nothing cached
        return cached || fetchPromise;
      })
    );
  } else {
    // For everything else: serve from cache, fall back to network
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
