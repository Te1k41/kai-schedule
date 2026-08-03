const CACHE = "kai-ops-v1";
const SHELL = ["./index.html", "./schedule.html", "./roadmap.html", "./health.html", "./finance.html", "./manifest.json", "./assets/icon-192.png", "./assets/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => cached)));
});
