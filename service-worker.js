self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pwa-card-cache').then((cache) => {
      return cache.addAll([
        '/static/img/cards/', // ここにカードのイメージのパスを追加
        // 他の静的リソースもここに追加できます
      ]);
    }),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
