import {
SITE,
url as buildUrl,
amphtml
} from "./config";

export const layout = ({
title = "Auto Blog",
description = "Artikel terbaru",
canonical = "",
image = "",
schema = "",
robots = "",
content = ""
})=>{

const canonicalUrl =
canonical || SITE.domain;

const ampUrl =
amphtml(
canonicalUrl.replace(
SITE.domain,
""
)
);

const ogImage =
image || buildUrl("/og/default");

return new Response(`<!DOCTYPE html>
<html lang="id">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1"
>

<title>${escapeHTML(title)}</title>

<meta
name="description"
content="${escapeHTML(description)}"
>

<link
rel="canonical"
href="${canonicalUrl}"
>

<link
rel="amphtml"
href="${ampUrl}"
>

<meta
name="robots"
content="index,follow,max-image-preview:large"
>

<meta
name="theme-color"
content="#4f46e5"
>

<meta
name="author"
content="${SITE.name}"
>

<meta
name="generator"
content="Cloudflare Pages"
>

<meta
property="og:type"
content="article"
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
content="${canonicalUrl}"
>

<meta
property="og:image"
content="${ogImage}"
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
content="${ogImage}"
>

<link
rel="preconnect"
href="https://fonts.googleapis.com"
>

<link
rel="dns-prefetch"
href="//fonts.googleapis.com"
>

<link
rel="sitemap"
type="application/xml"
href="${SITE.domain}/sitemap.xml"
>

<link
rel="alternate"
type="application/rss+xml"
title="${SITE.name}"
href="${SITE.domain}/rss.xml"
>

${robots || ""}

${schema || ""}

<style>

:root{
--bg:#ffffff;
--card:#ffffff;
--text:#0f172a;
--muted:#64748b;
--primary:#4f46e5;
--border:#e2e8f0;
}

*{
box-sizing:border-box;
}

body{
margin:0;
font-family:system-ui,-apple-system,sans-serif;
background:var(--bg);
color:var(--text);
line-height:1.7;
}

a{
color:var(--primary);
text-decoration:none;
}

img{
max-width:100%;
height:auto;
display:block;
}

.header{
position:sticky;
top:0;
z-index:99;
padding:14px 20px;
background:#fff;
border-bottom:1px solid var(--border);
}

.logo{
font-weight:700;
font-size:20px;
color:var(--primary);
}

.container{
max-width:860px;
margin:auto;
padding:20px;
}

.hero{
padding:60px 20px;
border-radius:18px;
background:linear-gradient(135deg,#4f46e5,#6366f1);
color:#fff;
margin-bottom:30px;
text-align:center;
}

.hero h1{
margin:0 0 10px;
font-size:34px;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:20px;
}

.card{
background:#fff;
border:1px solid var(--border);
border-radius:14px;
overflow:hidden;
transition:.2s;
}

.card:hover{
transform:translateY(-4px);
}

.card img{
width:100%;
aspect-ratio:400/210;
object-fit:cover;
}

.card h3,
.card h4{
padding:14px;
margin:0;
font-size:18px;
color:var(--text);
}

.post img{
border-radius:14px;
aspect-ratio:1200/630;
object-fit:cover;
margin-bottom:18px;
}

.post h1{
font-size:32px;
line-height:1.3;
margin:18px 0;
}

.post-content{
font-size:17px;
line-height:1.9;
word-break:break-word;
}

.post-content h2,
.post-content h3{
margin-top:32px;
}

.post-content a{
text-decoration:underline;
}

.breadcrumb{
font-size:14px;
margin-bottom:20px;
color:var(--muted);
}

.breadcrumb a{
color:var(--primary);
}

.pagination{
display:flex;
justify-content:center;
gap:8px;
margin:40px 0;
flex-wrap:wrap;
}

.pagination a{
padding:8px 14px;
border:1px solid var(--border);
border-radius:10px;
}

.pagination a.active{
background:var(--primary);
color:#fff;
}

.footer{
margin-top:50px;
padding:40px 20px;
border-top:1px solid var(--border);
text-align:center;
color:var(--muted);
font-size:14px;
}

@media(max-width:768px){

.hero{
padding:40px 20px;
}

.hero h1{
font-size:28px;
}

.post h1{
font-size:26px;
}

.container{
padding:16px;
}

}

</style>

</head>

<body>

<header class="header">
<div class="logo">
⚡ ${SITE.name}
</div>
</header>

<main class="container">
${content}
</main>

<footer class="footer">
© ${new Date().getFullYear()}
${SITE.name}
— Built for speed ⚡
</footer>

</body>

</html>`,{
headers:{
"content-type":"text/html;charset=UTF-8",
"cache-control":"public,max-age=300"
}
});

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
