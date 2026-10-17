// Vite plugin: writes dist/sw.js, a small service worker that precaches every file of the build
// so the app works offline after the first visit. The file list and a build id are embedded, so
// each deploy installs a new worker and drops the old cache.
export default function serviceWorker() {
  return {
    name: 'lw-service-worker',
    apply: 'build',
    generateBundle(_, bundle) {
      const files = [...new Set(['./', './index.html', './favicon.svg', ...Object.keys(bundle).map((f) => `./${f}`)])];
      const id = `lw-${Date.now().toString(36)}`;
      const source = `// Generated at build time by tools/sw-plugin.js. Precaches the app for offline use.
const CACHE = ${JSON.stringify(id)};
const FILES = ${JSON.stringify(files)};
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('lw-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return; // the classroom API is never cached
  if (req.mode === 'navigate') { e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put('./index.html', c)); return r; }).catch(() => caches.match('./index.html'))); return; }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(req, c)); } return r; })));
});
`;
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}
