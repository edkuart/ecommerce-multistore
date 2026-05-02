const CACHE_NAME = "ecommerce-pwa-v2";
const APP_SHELL = [
  "/",
  "/offline.html",
  "/placeholder-product.svg",
  "/pwa-icon.svg",
  "/pwa-icon-192.svg",
  "/pwa-icon-512.svg",
  "/manifest.webmanifest"
];

function isDashboardPath(pathname) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard");
}

function isApiPath(pathname) {
  return pathname.startsWith("/api/");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (isApiPath(url.pathname)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    if (isDashboardPath(url.pathname)) {
      event.respondWith(
        fetch(request).catch(() => caches.match("/offline.html"))
      );
      return;
    }

    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
