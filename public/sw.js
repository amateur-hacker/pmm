// public/sw.js

const CACHE_NAME = "pmm-cache-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/about",
        "/members",
        "/blogs",
        "/contact",
        "/register-member",
        "/manifest.json",
        "/favicon.ico",
      ]);
    }),
  );
});

// Offline-first fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((res) => {
          // Cache new resources dynamically
          const cloned = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
          return res;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            // fallback offline page
            return caches.match("/");
          }
        });
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
});

