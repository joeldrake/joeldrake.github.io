// Gör att Kläckt! fungerar offline. Spelets state ligger i localStorage och rörs inte här.
// Lägger du till en fil som ska fungera offline: skriv in den i FILES och höj versionen i CACHE.
const PREFIX = 'klackt-';
const CACHE = `${PREFIX}v1`;
const NETWORK_TIMEOUT = 3000;

const FILES = [
	'./',
	'manifest.json',
	'icon.svg',
	'icon-192.png',
	'icon-512.png',
	'apple-touch-icon.png',
	'font/fredoka.woff2'
];

const PAGE = new URL('./', self.location).href;
const CACHED_URLS = new Set(FILES.map((file) => new URL(file, self.location).href));

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll(FILES.map((file) => new Request(file, { cache: 'reload' }))))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			// Cachar delas av hela domänen, så städa bara våra egna
			.then((names) => names.filter((name) => name.startsWith(PREFIX) && name !== CACHE))
			.then((old) => Promise.all(old.map((name) => caches.delete(name))))
			.then(() => self.clients.claim())
	);
});

// Nätet först så att uppdateringar syns direkt, cachen om nätet saknas eller är segt
self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	let key = url.origin + url.pathname;
	if (key === `${PAGE}index.html`) key = PAGE;
	if (!CACHED_URLS.has(key)) return;

	const cached = caches.open(CACHE).then((cache) => cache.match(key));
	const network = fetch(key, { cache: 'no-cache' }).then(async (response) => {
		if (!response.ok) throw new Error(`${response.status} ${key}`);
		const copy = response.clone();
		try {
			const cache = await caches.open(CACHE);
			await cache.put(key, copy);
		} catch {
			// Fullt lagringsutrymme ska inte stoppa appen
		}
		return response;
	});
	const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT));

	event.waitUntil(network.catch(() => {}));
	event.respondWith(
		Promise.race([network, timeout])
			.catch(() => null)
			.then(async (response) => response || (await cached) || network)
	);
});
