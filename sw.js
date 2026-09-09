const CACHE_NAME = 'ashour-quiz-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './app-icon.png'
];

// التثبيت وحفظ الملفات
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// استقبال أمر التحديث المباشر من زرار التحديث في الموقع
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// تفعيل الملف الجديد وحذف الـ Cache القديم مباشرة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// جلب البيانات من الكاش أو الشبكة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
