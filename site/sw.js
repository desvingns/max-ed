// Offline service worker: on install, precache every built file listed in precache.json
// (written by the build), then serve cache-first. The whole game works without internet.
const VERSION = 'v1790676796806'
const CACHE = 'maxed-' + VERSION

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    try {
      const list = await (await fetch('precache.json', { cache: 'no-store' })).json()
      // add in small batches so a slow tablet doesn't choke
      for (let i = 0; i < list.length; i += 20) {
        await Promise.all(list.slice(i, i + 20).map(async url => {
          // 'reload' skips the browser's HTTP cache, so files that changed under the same name are really refetched
          const res = await fetch(new Request(url, { cache: 'reload' }))
          if (!res.ok) throw new Error(url + ' ' + res.status)
          await cache.put(url, res)
        }))
      }
    } catch (e) {
      await cache.addAll(['./', 'index.html'])
    }
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k)
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', event => {
  const req = event.request
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return
  event.respondWith((async () => {
    const cache = await caches.open(CACHE)
    const hit = await cache.match(req, { ignoreSearch: true })
    if (hit) return hit
    try {
      const res = await fetch(req)
      if (res.ok) cache.put(req, res.clone())
      return res
    } catch (e) {
      return (await cache.match('index.html')) || Response.error()
    }
  })())
})
