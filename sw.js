// sw.js — EmirLearn Service Worker
const CACHE_NAME = 'emirlearn-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './data/master-units-data.js',
  './data/unit-quizzes-data.js',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Video dosyaları (range request gerektiren büyük medyalar) service worker cache'ine alınmaz
  if (url.pathname.endsWith('.mp4') || event.request.headers.get('range')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
