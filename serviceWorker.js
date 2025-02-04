const CUSTOM_CACHE = "custom-cache-v1";

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  "/",
  "/log/",
  "/js/dexie.js",
  "/js/dexie-cloud-addon.js",
  "/js/rxjs.umd.js",
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CUSTOM_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = [CUSTOM_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

//network first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    //network first fetch, on error check cache
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.open(CUSTOM_CACHE).then((cache) => {
          return cache.match(event.request).then((matching) => {
            return matching || Promise.reject("no-match");
          });
        });
      })
  );
});
