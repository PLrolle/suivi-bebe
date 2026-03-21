const CACHE = 'marcus-v1';
const ASSETS = ['./index.html', './manifest.json', './icon-192.svg', './icon-512.svg'];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
);
self.addEventListener('activate', e =>
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ))
);
self.addEventListener('fetch', e => {
  // Network-first for Grist API calls, cache-first for app assets
  if (e.request.url.includes('getgrist.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } })));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
