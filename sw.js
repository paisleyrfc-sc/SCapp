// Opens fast even on a poor signal. The page comes from the network if it answers within 2.5 s, otherwise from the
// last saved copy (and the saved copy is updated in the background). Icons, fonts and the chart library are fixed for
// each version, so they come straight from the saved copy.
const CACHE = 'prfc-v18';
const SHELL = ['./', './coach/', './icons/crest.png', './icons/icon-192.png', './icons/coach-192.png', './manifest.webmanifest', './coach/manifest.webmanifest'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const mine = u.origin === location.origin, cdn = /(^|\.)cdnjs\.cloudflare\.com$|^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!mine && !cdn) return;
  const save = res => { if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); } return res; };
  const cached = () => caches.match(r, {ignoreSearch: r.mode === 'navigate'});
  if (r.mode === 'navigate' || /\.webmanifest$/.test(u.pathname)) {
    const net = fetch(r).then(save);
    e.waitUntil(net.catch(() => {}));
    e.respondWith(new Promise(resolve => {
      let done = false;
      const finish = res => { if (!done && res) { done = true; resolve(res); } };
      const t = setTimeout(() => cached().then(finish), 2500);
      net.then(res => { clearTimeout(t); finish(res); }, () => cached().then(c => finish(c || Response.error())));
    }));
    return;
  }
  e.respondWith(cached().then(c => c || fetch(r).then(save)));
});
