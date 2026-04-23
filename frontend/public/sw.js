// Force this SW to activate immediately, evicting any stale Workbox SW
// that was intercepting API fetch requests and causing ERR_FAILED.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Pass all fetch requests straight through — this SW only handles push.
self.addEventListener('fetch', () => {});

self.addEventListener('push', event => {
  const { title, message, icon, action_url } = event.data.json();
  event.waitUntil(
    self.registration.showNotification(title, {
      body: message,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      data: { url: action_url }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url;
  if (url) event.waitUntil(clients.openWindow(url));
});