// キャッシュ名
const CACHE_NAME = 'exponential-dist-v2';
// キャッシュするリソースのリスト

const urlsToCache = [
  './',
  './manifest.json',
  './icon.svg',
  './icon192.png',  // 追加
  './icon512.png'   // 追加
];

// インストールイベント
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチイベント（キャッシュ優先戦略）
self.addEventListener('fetch', event => {
  // CDNリソース（MathJax）はネットワークを優先
  if (event.request.url.indexOf('cdn.jsdelivr.net') !== -1) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあれば返す
        if (response) {
          return response;
        }
        // なければネットワークから取得
        return fetch(event.request);
      }
    )
  );
});

// アクティベートイベント（古いキャッシュの削除）
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});