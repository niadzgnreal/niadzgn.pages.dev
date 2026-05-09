import { SITE, url as buildUrl, amphtml } from "./config";

export const layout = ({
title = SITE.name,
description = SITE.description,
canonical = "",
image = "",
schema = "",
robots = "",
content = ""
}) => {

const canonicalUrl = canonical || SITE.domain;
const ampUrl = amphtml(canonicalUrl.replace(SITE.domain, ""));
const ogImage = image || buildUrl("/og/default");

return new Response(`<!DOCTYPE html><html lang="id"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHTML(title)}</title>
<meta name="description" content="${escapeHTML(description)}">
<link rel="canonical" href="${canonicalUrl}">
<link rel="amphtml" href="${ampUrl}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#4f46e5">
<meta name="author" content="${SITE.name}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${escapeHTML(title)}">
<meta property="og:description" content="${escapeHTML(description)}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHTML(title)}">
<meta name="twitter:description" content="${escapeHTML(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="sitemap" type="application/xml" href="${SITE.domain}/sitemap.xml">
<link rel="alternate" type="application/rss+xml" title="${SITE.name}" href="${SITE.domain}/rss.xml">
${robots || ""}
${schema || ""}
<style>
:root{--bg:#fff;--card:#fff;--text:#0f172a;--muted:#64748b;--primary:#4f46e5;--border:#e2e8f0}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.7}
a{text-decoration:none;color:var(--primary)}
img{max-width:100%;height:auto;display:block}
.header{position:sticky;top:0;z-index:99;background:rgba(255,255,255,.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
.header-wrap{max-width:1100px;margin:auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.logo{font-size:22px;font-weight:800;color:var(--primary)}
.nav{display:flex;gap:16px;flex-wrap:wrap}
.nav a{font-size:14px;font-weight:600;color:var(--text)}
.container{max-width:1100px;margin:auto;padding:20px}
.hero{padding:70px 25px;border-radius:22px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;text-align:center;margin-bottom:35px}
.hero h1{margin:0 0 12px;font-size:42px;line-height:1.1}
.hero p{margin:0;font-size:17px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.card{background:var(--card);border:1px solid var(--border);border-radius:18px;overflow:hidden;transition:.2s}
.card:hover{transform:translateY(-4px);box-shadow:0 10px 30px rgba(0,0,0,.06)}
.card img{width:100%;aspect-ratio:400/210;object-fit:cover}
.card h3,.card h4{padding:16px;margin:0;font-size:18px;line-height:1.5;color:var(--text)}
.search{width:100%;padding:16px;border-radius:14px;border:1px solid var(--border);font-size:15px;margin:25px 0 15px;outline:none}
.search:focus{border-color:var(--primary)}
#results{display:grid;gap:10px;margin-bottom:25px}
.search-item{padding:14px;border:1px solid var(--border);border-radius:12px;background:#fff}
.search-item h4{margin:0;font-size:15px;color:var(--text)}
.post{max-width:860px;margin:auto}
.post img{border-radius:18px;aspect-ratio:1200/630;object-fit:cover;margin-bottom:20px}
.post h1{font-size:38px;line-height:1.3;margin:20px 0}
.post-content{font-size:18px;line-height:1.9;word-break:break-word}
.post-content h2,.post-content h3{margin-top:34px;line-height:1.4}
.post-content a{text-decoration:underline}
.post-content ul,.post-content ol{padding-left:22px}
.breadcrumb{font-size:14px;margin-bottom:20px;color:var(--muted)}
.pagination{display:flex;justify-content:center;gap:10px;margin:45px 0;flex-wrap:wrap}
.pagination a{padding:10px 16px;border-radius:12px;border:1px solid var(--border);color:var(--text);font-weight:600}
.pagination a.active{background:var(--primary);color:#fff;border-color:var(--primary)}
.footer{margin-top:60px;padding:40px 20px;border-top:1px solid var(--border);text-align:center;font-size:14px;color:var(--muted)}
@media(max-width:768px){
.container{padding:16px}
.hero{padding:50px 20px;border-radius:18px}
.hero h1{font-size:32px}
.post h1{font-size:28px}
.post-content{font-size:16px}
.nav{gap:12px}
}
</style></head><body>

<header class="header"><div class="header-wrap">
<a href="/" class="logo">⚡ ${SITE.name}</a>
<nav class="nav">
<a href="/">Home</a>
<a href="/kategori/seo">SEO</a>
<a href="/kategori/blog">Blog</a>
<a href="/kategori/teknologi">Teknologi</a>
</nav>
</div></header>

<main class="container">${content}</main>

<footer class="footer">
© ${new Date().getFullYear()} ${SITE.name} — Built for speed ⚡
</footer>

</body></html>`,{
headers:{
"content-type":"text/html;charset=UTF-8",
"cache-control":"public,max-age=300"
}
});

};

function escapeHTML(str=""){
return String(str).replace(/[&<>"]/g,c=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;"
}[c]));
}
