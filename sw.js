const CACHE_NAME = 'estate-invest-v4';
const CACHE_FILES = [
  './', './index.html', './manifest.json',
  './icon-192.png', './icon-512.png', './icon-180.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(CACHE_FILES).catch(err => console.warn('Cache partial fail:', err))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (event.request.url.includes('index.html') || event.request.url.endsWith('/')) {
        return fetch(event.request)
          .then(res => {
            caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
            return res;
          }).catch(() => cached);
      }
      return cached || fetch(event.request);
    })
  );
});
