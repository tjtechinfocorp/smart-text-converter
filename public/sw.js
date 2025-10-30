// Service Worker for SmartTextConverter
// Version: 2.1.0 - Enhanced with compression support

const CACHE_VERSION = '2.0.1761780503396';
const CACHE_NAME = `smarttextconverter-v${CACHE_VERSION}`;
const STATIC_CACHE = `static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-v${CACHE_VERSION}`;
const IMAGE_CACHE = `images-v${CACHE_VERSION}`;

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/main-logo-80x80.png',
  '/favicon.ico',
  '/manifest.json',
  // Critical CSS and JS
  '/styles.css',
  '/main.js',
  '/polyfills.js',
];

// Cache strategies
const CACHE_STRATEGIES = {
  static: 'cache-first',
  images: 'cache-first',
  api: 'network-first',
  pages: 'stale-while-revalidate',
};

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Caching static assets...');
        // Cache assets individually to handle missing files gracefully
        return Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(error => {
              console.warn(`⚠️ Failed to cache ${url}:`, error.message);
              return null; // Continue with other assets
            })
          )
        );
      })
      .then(results => {
        const successful = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
        const failed = results.filter(r => r.status === 'rejected' || r.value === null).length;
        console.log(`📦 Cached ${successful} assets, ${failed} failed`);
        console.log('🚀 Service Worker activating...');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker installation failed:', error);
        // Still try to activate even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('✅ Service Worker activated');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🎯 Service Worker ready');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);
  const isImage = event.request.destination === 'image';
  const isStatic =
    event.request.url.includes('/assets/') ||
    event.request.url.includes('.js') ||
    event.request.url.includes('.css');

  event.respondWith(handleRequest(event.request, isImage, isStatic));
});

// Enhanced request handling with different strategies and compression
async function handleRequest(request, isImage, isStatic) {
  const cacheName = isImage ? IMAGE_CACHE : isStatic ? STATIC_CACHE : DYNAMIC_CACHE;

  // Add compression headers for text-based files
  const url = new URL(request.url);
  if (url.pathname.match(/\.(js|css|html|json)$/i)) {
    const headers = new Headers(request.headers);
    headers.set('Accept-Encoding', 'gzip, deflate, br');
    request = new Request(request.url, {
      method: request.method,
      headers: headers,
      body: request.body,
      mode: request.mode,
      credentials: request.credentials,
      cache: request.cache,
      redirect: request.redirect,
      referrer: request.referrer,
    });
  }

  try {
    // Try cache first for static assets and images
    if (isStatic || isImage) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Fetch from network
    const networkResponse = await fetch(request);

    // Don't cache if not a valid response
    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
      return networkResponse;
    }

    // Clone the response for caching
    const responseToCache = networkResponse.clone();

    // Cache the response
    const cache = await caches.open(cacheName);
    await cache.put(request, responseToCache);

    return networkResponse;
  } catch (error) {
    console.error('❌ Fetch failed:', error);

    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }

    throw error;
  }
}

// Message event - handle updates and notifications
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('🔄 Background sync triggered')
    );
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/main-logo-80x80.png',
      badge: '/main-logo-80x80.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(clients.openWindow('/'));
});
