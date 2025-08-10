// sw.js
const CACHE_NAME = 'quiz-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// 설치: 필요한 파일을 캐시
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => {
      // 이전 캐시는 삭제 (강제 갱신 목적)
      return Promise.all(keys.map(k => caches.delete(k)));
    }).then(() => caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)))
  );
  self.skipWaiting();
});

// 활성화: 이전 클라이언트 제어
self.addEventListener('activate', (evt) => {
  evt.waitUntil(self.clients.claim());
});

// fetch: 네트워크 우선 (최신 파일을 시도), 실패하면 캐시로 폴백
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    fetch(evt.request).then((resp) => {
      // 네트워크 응답을 캐시에 업데이트(선택사항)
      if (evt.request.method === 'GET') {
        caches.open(CACHE_NAME).then(cache => {
          try { cache.put(evt.request, resp.clone()); } catch (e) { /* 일부 요청에 실패할 수 있음 */ }
        });
      }
      return resp;
    }).catch(() => {
      return caches.match(evt.request).then(match => match || Promise.reject('no-match'));
    })
  );
});