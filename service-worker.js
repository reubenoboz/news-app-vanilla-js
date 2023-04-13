self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("newsApp-v1").then(function (cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/html/create-post.html",
        "/html/news-details.html",
        "/css/styles.css",
        "/css/create-news.css",
        "/css/news-details.css",
        "/js/index.js",
        "/js/create-post.js",
        "/js/news-details.js",
      ]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
