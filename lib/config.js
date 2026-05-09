// ======================
// GLOBAL CONFIG
// ======================
export const SITE = {
name:"Auto Blog",
domain:"https://niadzgn.pages.dev",
ampDomain:"https://amp-niadzgn.pages.dev",
description:"Artikel otomatis + SEO + cepat",
defaultImage:"/og/default"
};

// ======================
// API CONFIG
// ======================
export const API_BASE =
"https://api.niadzgn.workers.dev";

// ======================
// URL HELPER
// ======================
export const url = (path="")=>{

if(!path.startsWith("/")){
path = "/" + path;
}

return SITE.domain + path;

};

// ======================
// AMP URL
// ======================
export const ampUrl = (path="")=>{

if(!path.startsWith("/")){
path = "/" + path;
}

return SITE.ampDomain + path;

};

// ======================
// CANONICAL
// ======================
export const canonical = (path="")=>
url(path);

// ======================
// AMPHTML
// ======================
export const amphtml = (path="")=>
ampUrl(path);

// ======================
// OG IMAGE
// ======================
export const ogImage = (slug="")=>{

if(!slug){
return url(SITE.defaultImage);
}

return url("/og/" + slug);

};

// ======================
// DEFAULT OG
// ======================
export const defaultOG = ()=>
url(SITE.defaultImage);

// ======================
// SANITIZE SLUG
// ======================
export function sanitizeSlug(slug=""){

return encodeURIComponent(

String(slug)

.replace(/<[^>]*>?/gm,"")

.replace(/"/g,"")

.trim()

);

}

// ======================
// POST URL
// ======================
export function postUrl(post={}){

const kategori = sanitizeSlug(
post.kategori || "umum"
);

const slug = sanitizeSlug(
post.slug || ""
);

return `/${kategori}/${slug}`;

}

// ======================
// CARD IMAGE
// ======================
export function cardImage(src,alt=""){

return `
<img
loading="lazy"
decoding="async"
src="${escapeHTML(src)}"
alt="${escapeHTML(alt)}"
width="400"
height="210"
/>
`;

}

// ======================
// POST IMAGE
// ======================
export function postImage(src,alt=""){

return `
<img
loading="eager"
fetchpriority="high"
decoding="async"
src="${escapeHTML(src)}"
alt="${escapeHTML(alt)}"
width="1200"
height="630"
/>
`;

}

// ======================
// STRIP HTML
// ======================
export function stripHTML(html=""){

return String(html)
.replace(/<[^>]*>?/gm,"");

}

// ======================
// READING TIME
// ======================
export function readingTime(text=""){

const words = stripHTML(text)
.split(/\s+/)
.length;

return Math.ceil(words / 200);

}

// ======================
// ESCAPE HTML
// ======================
export function escapeHTML(str=""){

return String(str)

.replace(/[&<>"]/g,c=>({

"&":"&amp;",

"<":"&lt;",

">":"&gt;",

'"':"&quot;"

}[c]));

}
