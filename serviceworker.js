const CACHE_NAME = "neanchat-cache-v1";
const OFFLINE_URL = "/offline.html";

// Files to always pre-cache
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/offline.html"
];

// Install (cache essential app shell)
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS);
      self.skipWaiting(); // Activate immediately
    })()
  );
});

// Activate (remove old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // network first (loads newest version)
          return await fetch(request);
        } catch (error) {
          // if offline → return cached index.html
          const cache = await caches.open(CACHE_NAME);
          return await cache.match("/index.html");
        }
      })()
    );
    return;
  }


  if (
    request.url.includes("/static/") ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Return cached version (fast)
          // Update cache silently
          fetch(request).then((response) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          });
          return cached;
        }

        // Not cached → fetch and store
        return fetch(request)
          .then((response) => {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
            return response;
          })
          .catch(() => caches.match(OFFLINE_URL));
      })
    );
    return;
  }

  // 🧠 3. Default: Network fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request) || caches.match(OFFLINE_URL))
  );
});
