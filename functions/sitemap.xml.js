import { getPosts } from "../lib/api";import { SITE,sanitizeSlug } from "../lib/config";

export async function onRequest(){

try{

const posts = await getPosts()
.catch(()=>[]);

if(!Array.isArray(posts)){

return new Response(
"Invalid posts",
{ status:500 }
);

}

// ======================
// REMOVE DUPLICATE
// ======================
const used = new Set();

const urls = posts

.filter(p=>{

const slug = sanitizeSlug(
p?.slug || ""
);

const kategori = sanitizeSlug(
p?.kategori || "umum"
);

const key =
kategori + "/" + slug;

if(
!slug ||
used.has(key)
){
return false;
}

used.add(key);

return true;

})

.map(p=>{

const slug = sanitizeSlug(
p.slug
);

const kategori = sanitizeSlug(
p.kategori || "umum"
);

const lastmod =
p.updated ||
p.date ||
new Date().toISOString();

const postUrl =
`${SITE.domain}/${kategori}/${slug}`;

const imageUrl =
`${SITE.domain}/og/${slug}`;

return `
<url>

<loc>${postUrl}</loc>

<lastmod>${lastmod}</lastmod>

<changefreq>daily</changefreq>

<priority>0.8</priority>

<image:image
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>

<image:loc>
${imageUrl}
</image:loc>

</image:image>

</url>
`;

})

.join("");

// ======================
// XML
// ======================
const xml =
`<?xml version="1.0" encoding="UTF-8"?>

<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>

<url>

<loc>${SITE.domain}/</loc>

<changefreq>hourly</changefreq>

<priority>1.0</priority>

</url>

<url>

<loc>${SITE.domain}/kategori/seo</loc>

<changefreq>daily</changefreq>

<priority>0.9</priority>

</url>

<url>

<loc>${SITE.domain}/kategori/blog</loc>

<changefreq>daily</changefreq>

<priority>0.9</priority>

</url>

<url>

<loc>${SITE.domain}/kategori/teknologi</loc>

<changefreq>daily</changefreq>

<priority>0.9</priority>

</url>

${urls}

</urlset>`;

return new Response(
xml,
{
headers:{
"content-type":
"application/xml;charset=UTF-8",

"cache-control":
"public,max-age=3600"
}
}
);

}catch(e){

return new Response(
"Sitemap Error: " +
e.message,
{ status:500 }
);

}

}
