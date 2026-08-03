const CACHE = "kai-ops-v2";
const SHELL = [
  "./index.html", "./schedule.html", "./roadmap.html", "./health.html", "./finance.html", "./offline.html",
  "./manifest.json", "./shared.css", "./app-shell.js", "./meals-data.js", "./firebase-init.js",
  "./assets/icon-192.png", "./assets/icon-512.png", "./assets/koi.jpg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("message", (e) => {
  if (e.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).catch(() => {
        if (e.request.mode === "navigate") return caches.match("./offline.html");
        return cached;
      });
    })
  );
});
