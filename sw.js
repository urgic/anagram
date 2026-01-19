const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js'
];

const CACHE_NAME = 'anagram-helper-cache';

// Install: cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: remove old caches (if any)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Fetch: respond with cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(resp => {
        const fetchPromise = fetch(event.request).then(networkResp => {
          // If fetch successful, update cache
          if (networkResp.ok) cache.put(event.request, networkResp.clone());
          return networkResp;
        }).catch(() => resp); // fallback to cache if offline
        return resp || fetchPromise;
      });
    })
  );
});
