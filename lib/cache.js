export async function withCache(context,ttl,handler){

const cache = caches.default;

const key = new Request(
context.request.url,
{
method:"GET"
}
);

try{

// ======================
// CHECK CACHE
// ======================
const cached =
await cache.match(key);

if(cached){

return new Response(
cached.body,
cached
);

}

// ======================
// EXECUTE HANDLER
// ======================
let response =
await handler();

// ======================
// ENSURE RESPONSE
// ======================
if(
!(response instanceof Response)
){

response = new Response(
response
);

}

// ======================
// ERROR RESPONSE
// ======================
if(response.status >= 500){

return response;

}

// ======================
// CLONE SAFE RESPONSE
// ======================
const resToCache =
new Response(
response.body,
response
);

// ======================
// CACHE HEADER
// ======================
resToCache.headers.set(
"cache-control",
`public,max-age=${ttl},stale-while-revalidate=60`
);

// ======================
// SECURITY
// ======================
resToCache.headers.set(
"x-cache",
"MISS"
);

// ======================
// STORE CACHE
// ======================
context.waitUntil(
cache.put(
key,
resToCache.clone()
)
);

return resToCache;

}catch(e){

return new Response(
"Cache Error: " + e.message,
{ status:500 }
);

}

}
