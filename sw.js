/* Service worker minimal : met les deux apps en cache pour qu'elles marchent
 * HORS CONNEXION (critère accessibilité : connexion faible). */
const CACHE = 'mimi-v3';
const FILES = ['./', 'index.html', 'carnet.html', 'shared.js', 'bot.js',
  'manifest.json', 'carnet.webmanifest', 'icon.svg', 'carnet-icon.svg',
  'icon-192.png', 'icon-512.png', 'carnet-icon-192.png', 'carnet-icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
});
// Réseau d'abord (pour voir vos modifications pendant le hackathon), cache en secours.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); return res; })
      .catch(() => caches.match(e.request))
  );
});
