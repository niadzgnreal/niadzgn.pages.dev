import { getPosts } from "../lib/api";import { SITE,sanitizeSlug,stripHTML } from "../lib/config";

export async function onRequest(){

try{

const posts = await getPosts();

const items = posts

.slice(0,20)

.map(p=>{

const kategori = sanitizeSlug(
p.kategori || "umum"
);

const slug = sanitizeSlug(
p.slug
);

const url =
`${SITE.domain}/${kategori}/${slug}`;

const desc = escapeXML(
stripHTML(p.content || "")
.slice(0,160)
);

const title = escapeXML(
p.title || "Untitled"
);

const image =
`${SITE.domain}/og/${slug}`;

const pubDate = new Date(
p.date || Date.now()
).toUTCString();

return `
<item>

<title>${title}</title>

<link>${url}</link>

<guid>${url}</guid>

<pubDate>${pubDate}</pubDate>

<description>
<![CDATA[
<img src="${image}" />
<p>${desc}</p>
]]>
</description>

</item>
`;

})

.join("");

return new Response(

`<?xml version="1.0" encoding="UTF-8"?>

<rss
version="2.0"
xmlns:atom="http://www.w3.org/2005/Atom"
>

<channel>

<title>${escapeXML(SITE.name)}</title>

<link>${SITE.domain}</link>

<description>
${escapeXML(SITE.description)}
</description>

<language>id</language>

<atom:link
href="${SITE.domain}/rss.xml"
rel="self"
type="application/rss+xml"
/>

${items}

</channel>

</rss>`,

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
"RSS Error: " + e.message,
{ status:500 }
);

}

}

// ======================
// ESCAPE XML
// ======================
function escapeXML(str=""){

return String(str)

.replace(/[<>&'"]/g,c=>({

"<":"&lt;",

">":"&gt;",

"&":"&amp;",

"'":"&apos;",

'"':"&quot;"

}[c]));

}
