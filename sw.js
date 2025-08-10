self.addEventListener('install', event => {
  // 매 설치 시마다 캐시 비우기
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => caches.delete(cache))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // 항상 네트워크에서 먼저 가져오고, 실패 시 캐시 사용
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
