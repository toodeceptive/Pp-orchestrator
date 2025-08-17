self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {}
  const options = { body: data.body || '', data: { url: data.url || '/' }, actions: [{action:'open', title:'Open'}] }
  event.waitUntil(self.registration.showNotification(data.title || 'PP', options))
})
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(clients.openWindow(url))
})
