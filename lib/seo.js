import {
SITE,
canonical,
amphtml,
ogImage as buildOg,
sanitizeSlug,
postUrl
} from "./config";

export function seo({
title = SITE.name,
description = SITE.description,
post = null,
slug = "",
image = "",
type = "article",
robots = "index,follow"
}){

// ======================
// POST URL
// ======================
const path = post
? postUrl(post)
: (
slug
? "/" + sanitizeSlug(slug)
: "/"
);

const url =
canonical(path);

const amp =
amphtml(path);

const og =
image ||
buildOg(
post?.slug ||
slug
);

// ======================
// CATEGORY
// ======================
const kategori =
sanitizeSlug(
post?.kategori || ""
);

// ======================
// JSON LD
// ======================
const schema = {

"@context":
"https://schema.org",

"@type":
type === "website"
? "WebSite"
: "BlogPosting",

headline:
title,

description:
description,

url,

mainEntityOfPage:
url,

image:
og,

publisher:{
"@type":"Organization",
"name":SITE.name
}

};

// ======================
// BREADCRUMB
// ======================
const breadcrumb =
post
? `
<script type="application/ld+json">
{
"@context":"https://schema.org",
"@type":"BreadcrumbList",
"itemListElement":[
{
"@type":"ListItem",
"position":1,
"name":"Home",
"item":"${SITE.domain}/"
},
{
"@type":"ListItem",
"position":2,
"name":"${escapeJSON(post.kategori || "Kategori")}",
"item":"${SITE.domain}/${kategori}"
},
{
"@type":"ListItem",
"position":3,
"name":"${escapeJSON(title)}"
}
]
}
</script>
`
: "";

// ======================
// SEO OUTPUT
// ======================
return `

<title>
${escapeHTML(title)}
</title>

<meta
name="description"
content="${escapeHTML(description)}"
>

<meta
name="robots"
content="${robots}"
>

<link
rel="canonical"
href="${url}"
>

<link
rel="amphtml"
href="${amp}"
>

<meta
property="og:type"
content="${type}"
>

<meta
property="og:site_name"
content="${SITE.name}"
>

<meta
property="og:title"
content="${escapeHTML(title)}"
>

<meta
property="og:description"
content="${escapeHTML(description)}"
>

<meta
property="og:url"
content="${url}"
>

<meta
property="og:image"
content="${og}"
>

<meta
name="twitter:card"
content="summary_large_image"
>

<meta
name="twitter:title"
content="${escapeHTML(title)}"
>

<meta
name="twitter:description"
content="${escapeHTML(description)}"
>

<meta
name="twitter:image"
content="${og}"
>

<script type="application/ld+json">
${JSON.stringify(schema)}
</script>

${breadcrumb}

`;

}

// ======================
// ESCAPE HTML
// ======================
function escapeHTML(str=""){

return String(str)

.replace(/[&<>"]/g,c=>({

"&":"&amp;",

"<":"&lt;",

">":"&gt;",

'"':"&quot;"

}[c]));

}

// ======================
// ESCAPE JSON
// ======================
function escapeJSON(str=""){

return String(str)

.replace(/\\/g,"\\\\")

.replace(/"/g,'\\"')

.replace(/\n/g," ");

}
