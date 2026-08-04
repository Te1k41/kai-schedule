const CACHE = "kai-ops-v19";
const SHELL = [
  "./index.html", "./schedule.html", "./roadmap.html", "./health.html", "./finance.html", "./offline.html",
  "./now.html", "./money.html", "./partner.html",
  "./manifest.json", "./shared.css", "./app-shell.js", "./meals-data.js", "./schedule-data.js", "./finance-core.js", "./firebase-init.js",
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
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => {
        if (e.request.mode === "navigate") return caches.match("./offline.html");
        return cached;
      });
    })
  );
});
