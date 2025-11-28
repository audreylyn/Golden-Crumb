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
    (async () => {
      // Try network first
      try {
        const networkResponse = await fetch(event.request);
        const fetchTime = Date.now() - fetchStartTime;
        
        // Log slow requests
        if (fetchTime > 5000) {
          console.warn(`[SW] Slow request detected: ${url.pathname} took ${fetchTime}ms`);
        }
        
        // Clone the response for caching
        const responseToCache = networkResponse.clone();
        
        // Cache successful responses (only cache 200 status)
        if (networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch((err) => {
              console.warn(`[SW] Failed to cache ${url.pathname}:`, err);
            });
          });
        }
        
        return networkResponse;
      } catch (networkError) {
        // Network failed, try cache
        console.log(`[SW] Network failed for ${url.pathname}, trying cache...`);
        const cachedResponse = await caches.match(event.request);
        
        // IMPORTANT: cachedResponse can be null, so we must check before returning
        if (cachedResponse) {
          console.log(`[SW] Serving from cache: ${url.pathname}`);
          return cachedResponse;
        }
        
        // No cache available - the original fetch failed
        // Return the network error as a Response to avoid undefined
        console.warn(`[SW] No cache available for ${url.pathname}`);
        // Re-throw to be caught by outer handler, which will return a proper error Response
        throw networkError;
      }
    })().catch((error) => {
      // Final fallback: if everything fails, we must return a valid Response
      // This prevents the "undefined" error that was occurring
      console.error(`[SW] All fetch strategies failed for ${url.pathname}:`, error);
      // Return a proper error response instead of undefined
      return new Response('', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'text/plain'
        }
      });
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

