import { API_BASE,sanitizeSlug } from "./config";

// ======================
// INTERNAL CACHE
// ======================
let _cache = null;

let _lastFetch = 0;

const TTL = 60 * 1000;

// ======================
// FETCH JSON
// ======================
async function fetchJSON(url){

try{

const res = await fetch(url,{

headers:{
"accept":"application/json"
},

cf:{
cacheTtl:3600,
cacheEverything:true
}

});

if(!res.ok){

throw new Error(
"API Error " + res.status
);

}

return await res.json();

}catch(err){

console.error(
"API FETCH ERROR:",
err.message
);

// ======================
// FALLBACK CACHE
// ======================
if(_cache){
return _cache;
}

return [];

}

}

// ======================
// GET POSTS
// ======================
export async function getPosts(){

const now = Date.now();

// ======================
// CACHE MEMORY
// ======================
if(
_cache &&
(now - _lastFetch < TTL)
){
return _cache;
}

const data = await fetchJSON(
API_BASE + "/posts"
);

// ======================
// NORMALIZE
// ======================
const normalized = (data || [])

.filter(Boolean)

.map(p=>({

slug:sanitizeSlug(
p.slug || ""
),

title:String(
p.title || "No Title"
).trim(),

content:String(
p.content || ""
),

kategori:sanitizeSlug(
p.kategori || "umum"
),

date:
p.date ||
p.updated ||
new Date().toISOString()

}))

.filter(p=>p.slug);

// ======================
// SORT TERBARU
// ======================
normalized.sort((a,b)=>
new Date(b.date) -
new Date(a.date)
);

_cache = normalized;

_lastFetch = now;

return normalized;

}

// ======================
// GET SINGLE POST
// ======================
export async function getPost(slug){

if(!slug){
return null;
}

const safeSlug =
sanitizeSlug(slug);

const posts = await getPosts();

return posts.find(
p=>p.slug === safeSlug
) || null;

}

// ======================
// GET BY KATEGORI
// ======================
export async function getByKategori(kategori){

if(!kategori){
return [];
}

const safeKategori =
sanitizeSlug(kategori);

const posts = await getPosts();

return posts.filter(
p=>p.kategori === safeKategori
);

}

// ======================
// SEARCH POSTS
// ======================
export async function searchPosts(query){

if(!query){
return [];
}

const posts = await getPosts();

const q = sanitizeQuery(query);

return posts

.filter(p=>
String(p.title || "")
.toLowerCase()
.includes(q)
)

.sort((a,b)=>{

const aTitle =
String(a.title || "")
.toLowerCase();

const bTitle =
String(b.title || "")
.toLowerCase();

const aExact =
aTitle.startsWith(q)
? 1 : 0;

const bExact =
bTitle.startsWith(q)
? 1 : 0;

return bExact - aExact;

})

.slice(0,20);

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
