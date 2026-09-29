const CACHE = "scroller-v1"
const FILES = [ 
    "./",
    "index.html",
    "style.css",
    "app.js",
    "manifest.json",
    "icon-192.png",
    "icon-512.png",
    "favicon.png"
 ]

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(FILES))
    )
})

self.addEventListener("fetch", (event) => {
    event.respondWith(networkFirst(event.request))
})

async function networkFirst(request) {
    try {
        const response = await fetch(request)      // 1. try the internet
        const cache = await caches.open(CACHE)      // 2. open your storage box
        cache.put(request, response.clone())         // 3. save a copy
        return response                 // 4. give the fresh one to the app
    } catch {
        return caches.match(request)                     // 5. offline: give back the saved copy
    }
}