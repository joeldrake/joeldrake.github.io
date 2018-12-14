const CUSTOM_CACHE = 'custom-cache-v1';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = ['./'];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CUSTOM_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting()),
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [CUSTOM_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(
          cacheName => !currentCaches.includes(cacheName),
        );
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

/*
//cache first
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(CUSTOM_CACHE).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the custom cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      }),
    );
  }
});
*/

//network first
self.addEventListener('fetch', event => {
  event.respondWith(
    //network first fetch, on error check cache
    fetch(event.request)
      .then(response => {
        /*
        // Put a copy of the response in the cache if respons.status is 200
        if (response.status === 200) {
          return caches.open(CUSTOM_CACHE).then(cache => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        } else {
          return response;
        }
        */
        return response;
      })
      .catch(error => {
        return caches.open(CUSTOM_CACHE).then(cache => {
          return cache.match(event.request).then(matching => {
            return matching || Promise.reject('no-match');
          });
        });
      }),
  );
});
