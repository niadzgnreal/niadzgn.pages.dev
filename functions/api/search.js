import { getPosts } from "../../lib/api";
import { sanitizeSlug } from "../../lib/config";

export async function onRequest(context){

try{

const url = new URL(context.request.url);

// ======================
// QUERY
// ======================
const q = sanitizeQuery(
url.searchParams.get("q")
);

// ======================
// EMPTY QUERY
// ======================
if(!q || q.length < 2){

return json([]);

}

// ======================
// POSTS
// ======================
const posts = await getPosts();

// ======================
// FILTER
// ======================
const results = posts

.filter(p=>{

const title = String(
p.title || ""
).toLowerCase();

return title.includes(q);

})

// ======================
// SORT RELEVANCE
// ======================
.sort((a,b)=>{

const aTitle = String(a.title || "").toLowerCase();

const bTitle = String(b.title || "").toLowerCase();

const aExact = aTitle.startsWith(q) ? 1 : 0;

const bExact = bTitle.startsWith(q) ? 1 : 0;

return bExact - aExact;

})

// ======================
// LIMIT
// ======================
.slice(0,20)

// ======================
// JSON
// ======================
.map(p=>({

title: escapeJSON(p.title),

slug: sanitizeSlug(p.slug),

kategori: sanitizeSlug(
p.kategori || "umum"
)

}));

return json(results);

}catch(e){

return new Response(
JSON.stringify({
error:e.message
}),
{
status:500,
headers:{
"content-type":"application/json"
}
}
);

}

}

// ======================
// JSON RESPONSE
// ======================
function json(data){

return new Response(
JSON.stringify(data),
{
headers:{
"content-type":"application/json;charset=UTF-8",

// ======================
// CACHE
// ======================
"cache-control":
"public,max-age=300"
}
}
);

}

// ======================
// SANITIZE QUERY
// ======================
function sanitizeQuery(q=""){

return String(q)

.toLowerCase()

.replace(/<[^>]*>?/gm,"")

.replace(/[^\w\s-]/g,"")

.trim();

}

// ======================
// ESCAPE JSON
// ======================
function escapeJSON(str=""){

return String(str)
.replace(/</g,"\\u003c");

}
