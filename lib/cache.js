export async function withCache(context, ttl, handler) {
  const cache = caches.default;
  const key = new Request(context.request.url, {
    method: "GET"
  });

  // ======================
  // CHECK CACHE
  // ======================
  let res = await cache.match(key);
  if (res) {
    return res;
  }

  // ======================
  // EXECUTE HANDLER
  // ======================
  let response = await handler();

  // pastikan selalu Response object
  if (!(response instanceof Response)) {
    response = new Response(response);
  }

  // ======================
  // CLONE SAFE RESPONSE
  // ======================
  const resToCache = new Response(response.body, response);

  // ======================
  // SET CACHE HEADER
  // ======================
  resToCache.headers.set(
    "cache-control",
    `public, max-age=${ttl}, stale-while-revalidate=60`
  );

  // ======================
  // STORE CACHE (ASYNC)
  // ======================
  context.waitUntil(cache.put(key, resToCache.clone()));

  return resToCache;
}
