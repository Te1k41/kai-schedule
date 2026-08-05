const CACHE = "kai-ops-v36";
const SHELL = [
  "./index.html", "./schedule.html", "./roadmap.html", "./health.html", "./finance.html", "./offline.html",
  "./now.html", "./money.html", "./partner.html",
  "./manifest.json", "./shared.css", "./app-shell.js", "./theme-boot.js", "./meals-data.js", "./schedule-data.js", "./finance-core.js", "./firebase-init.js",
  "./assets/icon-192.png", "./assets/icon-512.png", "./assets/icon-mask.png", "./assets/koi.jpg"
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

// Stale-while-revalidate: serve the cached copy instantly (if any), but
// always fetch a fresh one in the background and update the cache for next
// time — so routine deploys show up on the next load without needing a
// manual CACHE version bump.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const networked = fetch(e.request).then((res) => {
    if (res && res.status === 200) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
    }
    return res;
  });
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) {
        e.waitUntil(networked.catch(() => {}));
        return cached;
      }
      return networked.catch(() => e.request.mode === "navigate" ? caches.match("./offline.html") : undefined);
    })
  );
});
