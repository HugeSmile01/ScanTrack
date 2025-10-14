const CACHE_NAME = 'scantrack-cache-v4';
const urlsToCache = [
  '/',
  '404.html',
  '/index.html',
  '/dashboard.html',
  '/docs.html',
  '/login.html',
  '/scanner.html',
  '/manifest.json',
  '/qrCreate.html',
  '/search.html',
  '/ai.html',
  '/service-worker.js',
  '/support.html',
  '/about.html',
  '/chatbot.html',
  '/legal.html',
  '/res/material.cyan-light_blue.min.css',
  '/Css/chatbot.css',
  '/Css/qrCreate.css',
  '/Css/scanner.css',
  '/Css/search.css',
  '/Css/style.css',
  '/Script/auth.js',
  '/Script/dashboard.js',
  '/Script/login.js',
  '/Script/menu.js',
  '/Script/qrCreate.js',
  '/Script/scanner.js',
  '/Script/search.js',
  '/Script/signin.js',
  '/Script/chatbot.js',
  '/Script/config.js',
  '/images/Tideglider.png',
  '/images/ScanTrack.png',
  '/images/android-desktop.png',
  '/images/favicon.png',
  '/images/ios-desktop.png',
  '/images/logo.svg',
  '/images/prof.png',
  '/images/user.png',
  '/images/icon-512.svg',
  '/images/icon-192.svg',
  '/images/developer.svg'
];


// Install event: cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// Fetch event: serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
