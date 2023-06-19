const PRE_CACHE = [
  '/styles/styles.css',
  '/scripts/utils.js',
  '/scripts/scripts.js',
  'https://main--milo--adobecom.hlx.page/libs/utils/utils.js',
  'https://main--milo--adobecom.hlx.page/libs/styles/styles.css',
  '/gnav.plain.html',
  '/footer.plain.html',
  '/placeholders.json',
  '/legal-privacy-notice.plain.html',
  '/query-index.json',
  'https://main--milo--adobecom.hlx.page/libs/blocks/gnav/gnav.css',
  'https://main--milo--adobecom.hlx.page/libs/blocks/gnav/gnav.js',
  'https://main--milo--adobecom.hlx.page/libs/blocks/fragment/fragment.css',
  'https://main--milo--adobecom.hlx.page/libs/blocks/fragment/fragment.js',
  'https://main--milo--adobecom.hlx.page/libs/styles/typography.css',
  'https://main--milo--adobecom.hlx.page/libs/styles/variables.css',
  'https://main--milo--adobecom.hlx.page/libs/blocks/section-metadata/section-metadata.css',
  'https://main--milo--adobecom.hlx.page/libs/blocks/section-metadata/section-metadata.js',
  'https://main--milo--adobecom.hlx.page/libs/blocks/footer/footer.js',
  'https://main--milo--adobecom.hlx.page/libs/blocks/footer/footer.css',
];

const CACHE_NAME = 'v1';

/* eslint-disable no-restricted-globals */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE)));
  console.info('service worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  event.waitUntil((async () => {
    if (self.registration.navigationPreload) {
      // await self.registration.navigationPreload.enable();
    }
  })());
  console.info('service worker activated');
});

self.addEventListener('fetch', (event) => {
//   const l = event.request.url.split('.');
  event.respondWith((async () => {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;
    // const response = await event.preloadResponse;
    // if (response) return response;

    return fetch(event.request.clone())
      .then((resp) => {
        if (resp.clone().status < 400) {
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, resp.clone()));
        }
        return resp;
      })
      .catch((err) => {
        console.error('uh oh', err, event.request);
      });
  })());
});
