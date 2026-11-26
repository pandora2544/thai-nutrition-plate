/* Network first (revalidated, so updates show at once); cached copy when offline or slow. */
const CACHE = 'tnp-v9';
const FILES = ['./', 'index.html', 'style.css', 'icons.js', 'calc.js', 'plate.js', 'app.js', 'data/foods.json', 'data/groups.json', 'data/images.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => fetch(f, { cache: 'reload' }).then(r => r.ok && c.put(f, r))))));
  self.skipWaiting();
});
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const net = fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; });
    const timeout = new Promise(res => setTimeout(res, 4000));
    try {
      const r = await Promise.race([net, timeout]);
      if (r) return r;
    } catch (err) { /* offline */ }
    return (await c.match(e.request)) || net;
  }));
});
