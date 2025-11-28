// Service Worker for Auto-Refresh on Slow Load
const CACHE_NAME = 'golden-crumb-v1';
const LOAD_TIMEOUT = 10000; // 10 seconds timeout
const MAX_RETRIES = 3; // Maximum number of auto-refresh attempts

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing...');
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim(); // Take control of all pages immediately
});

// Fetch event - intercept network requests and monitor performance
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  // Monitor fetch performance
  const fetchStartTime = Date.now();
  
  event.respondWith(
    Promise.race([
      // Try to fetch from network with timeout
      new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Request timeout'));
        }, LOAD_TIMEOUT);

        fetch(event.request)
          .then((response) => {
            clearTimeout(timeout);
            const fetchTime = Date.now() - fetchStartTime;
            
            // Log slow requests
            if (fetchTime > 5000) {
              console.warn(`[SW] Slow request detected: ${url.pathname} took ${fetchTime}ms`);
            }
            
            // Clone the response for caching
            const responseToCache = response.clone();
            
            // Cache successful responses
            if (response.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            
            resolve(response);
          })
          .catch((error) => {
            clearTimeout(timeout);
            reject(error);
          });
      }),
      // Fallback to cache if network fails or times out
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log(`[SW] Serving from cache: ${url.pathname}`);
          return cachedResponse;
        }
        throw new Error('No cache available');
      })
    ]).catch((error) => {
      console.error(`[SW] Fetch failed for ${url.pathname}:`, error);
      // Return a basic offline response if available
      return caches.match(event.request);
    })
  );
});

// Message handler - receive messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_LOAD_TIME') {
    // Send back current time for load monitoring
    event.ports[0].postMessage({ loadTime: Date.now() });
  }
  
  if (event.data && event.data.type === 'FORCE_REFRESH') {
    // Notify all clients to refresh
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'FORCE_REFRESH' });
      });
    });
  }
});

