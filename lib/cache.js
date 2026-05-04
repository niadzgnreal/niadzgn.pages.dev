export async function withCache(context, ttl, handler) {
  const cache = caches.default;
  const key = new Request(context.request.url);

  let res = await cache.match(key);
  if (res) return res;

  res = await handler();

  res = new Response(res.body, res);
  res.headers.set("cache-control", `public, max-age=${ttl}`);

  context.waitUntil(cache.put(key, res.clone()));

  return res;
}
