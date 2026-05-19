self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

self.addEventListener('fetch', (event) => {
  // A dummy fetch event handler is needed to satisfy PWA install requirements
  // We can just let the browser handle the fetch naturally.
});
