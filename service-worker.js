const CACHE_NAME = 'quiz-cache-v1'; // 버전 올릴 때마다 v1 -> v2로 변경
const ASSETS_TO_CACHE = [
    '/', // 루트
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// 설치 시 리소스 캐싱
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE.map(url => `${url}?v=${Date.now()}`)); // 항상 최신 파일
        })
    );
    self.skipWaiting(); // 새 서비스 워커 즉시 활성화
});

// 활성화 시 이전 캐시 삭제
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// 요청 가로채기
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});