// اسم الكاش
const CACHE_NAME = 'daniel-ai-v1.0';
// الملفات المطلوبة للتخزين
const urlsToCache = [
  './',
  './index.html',
  './faq.html',
  './style.css',
  './script.js',
  './default-avatar.png',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// التعامل مع الطلبات
self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetching:', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد الملف في الكاش
        if (response) {
          return response;
        }
        
        // إذا لم يوجد، جلب من الإنترنت
        return fetch(event.request)
          .then(response => {
            // التحقق من أن الاستجابة صالحة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // نسخ الاستجابة للتخزين
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // في حالة عدم وجود اتصال بالإنترنت
            // يمكن إرجاع صفحة بديلة هنا
            console.log('[Service Worker] Offline mode');
          });
      })
  );
});