// This is a placeholder service worker that will be replaced by the Workbox service worker
// during the build process. This file ensures that the service worker is properly registered
// and can be updated when needed.

// Force clients to update when a new service worker is activated
self.addEventListener('activate', event => {
  event.waitUntil(
    clients.claim()
      .then(() => {
        // Send a message to all clients to refresh
        return self.clients.matchAll().then(clients => {
          return Promise.all(
            clients.map(client => client.postMessage({ type: 'REFRESH' }))
          );
        });
      })
  );
});

// Skip waiting when a new service worker is installed
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Handle fetch events with a network-first strategy
self.addEventListener('fetch', event => {
  // For navigation requests, always go to network first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // For other requests, try cache first but update cache in background
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Update the cache with the new response
        if (networkResponse && networkResponse.status === 200) {
          const clonedResponse = networkResponse.clone();
          caches.open('runtime-cache').then(cache => {
            cache.put(event.request, clonedResponse);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If both cache and network fail, return a simple offline page
        return new Response('You are offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      });
      
      // Return the cached response if we have one, otherwise wait for the network response
      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});