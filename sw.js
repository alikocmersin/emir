// sw.js — EmirLearn Service Worker (v2.1 Network-First)
const CACHE_NAME = 'emirlearn-v2.1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css?v=2.1',
  './app.js?v=2.1',
  './data/master-units-data.js?v=2.1',
  './data/unit-quizzes-data.js?v=2.1',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Video dosyaları (range request gerektiren büyük medyalar) SW tarafından işlenmez
  if (url.pathname.endsWith('.mp4') || event.request.headers.get('range')) {
    return;
  }

  // Network-First stratejisi: Önce güncel dosyayı sunucudan al, yoksa önbelleğe bak
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          }).catch(() => {});
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
