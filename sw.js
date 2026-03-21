const CACHE = 'marcus-v2';
const ASSETS = ['./index.html', './manifest.json', './icon-192.svg', './icon-512.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting(); // prend le contrôle immédiatement sans attendre la fermeture
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()) // prend le contrôle de tous les onglets ouverts
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API Grist → toujours réseau
  if (e.request.url.includes('getgrist.com') || e.request.url.includes('workers.dev')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  // index.html → network-first pour toujours avoir la dernière version
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Autres assets (manifest, icônes, sw.js) → cache-first
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
