var cacheName = 'locals-pwa';
var filesToCache = [
  // '/',
  // '/index.html',
  // 'styles/App.css',
];



/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});




self.addEventListener('push', function(event) {

const title = `Locals App`;
const tag = new Date().getUTCMilliseconds();

const options = {
  body: `${event.data.text()} sent you a new direct message.`,
  icon: "https://locals-app-314118.wn.r.appspot.com/favicon.ico",
  renotify: true,
  tag: tag
}
   
    const promiseChain = self.registration.showNotification(title, options);
   
    event.waitUntil(promiseChain);

    
});




