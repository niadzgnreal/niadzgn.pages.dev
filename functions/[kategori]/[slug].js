import { layout } from "../../lib/render";import { SITE,canonical,ogImage as buildOg,sanitizeSlug,stripHTML,readingTime,postImage,cardImage } from "../../lib/config";import { getPosts,getPost } from "../../lib/api";

export async function onRequest(context){

try{

let { kategori,slug } = context.params;

kategori = sanitizeSlug(kategori);
slug = sanitizeSlug(slug);

const post = await getPost(slug);

if(!post || sanitizeSlug(post.kategori) !== kategori){
return new Response("404 Not Found",{ status:404 });
}

const posts = await getPosts();

const related = posts.filter(p=>
sanitizeSlug(p.slug)!==slug &&
sanitizeSlug(p.kategori)===kategori
).sort(()=>0.5-Math.random()).slice(0,6);

post.content = autoLink(post.content,related);

const read = readingTime(post.content);

const desc = stripHTML(post.content).slice(0,160);

const postUrl = "/" + kategori + "/" + slug;

const breadcrumb = `
<nav class="breadcrumb">
<a href="/">Home</a> ›
<a href="/kategori/${kategori}">${post.kategori}</a> ›
<span>${post.title}</span>
</nav>
`;

const og = buildOg(slug);

const schema = `
<script type="application/ld+json">
{
"@context":"https://schema.org",
"@type":"BlogPosting",
"headline":"${post.title}",
"description":"${desc}",
"image":"${og}",
"mainEntityOfPage":"${canonical(postUrl)}",
"author":{"@type":"Organization","name":"${SITE.name}"},
"publisher":{"@type":"Organization","name":"${SITE.name}"}
}
</script>

<script type="application/ld+json">
{
"@context":"https://schema.org",
"@type":"BreadcrumbList",
"itemListElement":[
{"@type":"ListItem","position":1,"name":"Home","item":"${SITE.domain}/"},
{"@type":"ListItem","position":2,"name":"${post.kategori}","item":"${SITE.domain}/kategori/${kategori}"},
{"@type":"ListItem","position":3,"name":"${post.title}","item":"${SITE.domain}${postUrl}"}
]
}
</script>
`;

return layout({
title:post.title,
description:desc,
canonical:canonical(postUrl),
image:og,
schema,

content:`
${breadcrumb}

<article class="post">

${postImage(og,post.title)}

<h1>${post.title}</h1>

<p>⏱ ${read} min read</p>

<div class="post-content">
${post.content}
</div>

</article>

<h3>Artikel Terkait</h3>

<div class="grid">

${related.map(p=>`
<div class="card">
<a href="/${sanitizeSlug(p.kategori)}/${sanitizeSlug(p.slug)}">
${cardImage(`/og/${sanitizeSlug(p.slug)}`,p.title)}
<h4>${p.title}</h4>
</a>
</div>
`).join("")}

</div>
`
});

}catch(e){

return new Response(
"Error: " + e.message,
{ status:500 }
);

}

}

function autoLink(content="",related=[]){

if(!content || !related.length){
return content;
}

const MAX_LINK = 8;

let total = 0;

const parts = content.split(/(<[^>]+>)/g);

return parts.map(part=>{

if(part.startsWith("<")){
return part;
}

let text = part;

for(const p of related){

if(total >= MAX_LINK){
break;
}

const title = String(p.title || "").trim();

const slug = sanitizeSlug(p.slug || "");

const kategori = sanitizeSlug(p.kategori || "");

if(!title || !slug){
continue;
}

const keyword = title
.split(" ")
.slice(0,2)
.join(" ")
.toLowerCase();

if(!keyword || keyword.length < 4){
continue;
}

const escaped = keyword.replace(
/[.*+?^${}()|[\]\\]/g,
"\\$&"
);

const regex = new RegExp(
`\\b(${escaped})\\b`,
"i"
);

if(regex.test(text)){

text = text.replace(
regex,
`<a href="/${kategori}/${slug}">$1</a>`
);

total++;

}

}

return text;

}).join("");

}
