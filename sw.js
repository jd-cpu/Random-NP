// sw.js
const CACHE_NAME = 'quiz-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    fetch(evt.request).then(resp => {
      // 성공시 캐시 업데이트(선택적)
      if (evt.request.method === 'GET' && resp && resp.ok) {
        caches.open(CACHE_NAME).then(c => c.put(evt.request, resp.clone()));
      }
      return resp;
    }).catch(() => caches.match(evt.request).then(m => m || Promise.reject('no-match')))
  );
});
