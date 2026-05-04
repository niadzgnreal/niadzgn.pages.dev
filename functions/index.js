const API = "https://api.niadzgn.workers.dev";

// ======================
// MAIN ROUTER
// ======================
export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const path = url.pathname;

    if (path === "/") return home(context);
    if (path.startsWith("/post/")) return postPage(context);
    if (path.startsWith("/kategori/")) return kategoriPage(context);
    if (path === "/api/search") return searchAPI(context);
    if (path === "/sitemap.xml") return sitemap(context);
    if (path === "/rss.xml") return rss(context);

    return new Response("Not found", { status: 404 });

  } catch (e) {
    return new Response("Error: " + e.message);
  }
}

// ======================
// API FETCH
// ======================
async function getPosts() {
  const res = await fetch(API + "/posts");
  return res.json();
}

async function getPost(slug) {
  const res = await fetch(API + "/post/" + slug);
  return res.json();
}

// ======================
// CACHE
// ======================
async function withCache(context, ttl, handler) {
  const cache = caches.default;
  const key = new Request(context.request.url);

  let res = await cache.match(key);
  if (res) return res;

  res = await handler();

  res = new Response(res.body, res);
  res.headers.set("cache-control", `public, max-age=${ttl}`);

  context.waitUntil(cache.put(key, res.clone()));

  return res;
}

// ======================
// HOME
// ======================
async function home(context) {
  return withCache(context, 3600, async () => {
    const posts = await getPosts();

    const list = posts.slice(0, 12).map(p => `
      <div class="card">
        <a href="/post/${p.slug}">
          <img loading="lazy" src="https://picsum.photos/seed/${p.slug}/400/300">
          <h3>${p.title}</h3>
        </a>
      </div>
    `).join("");

    return html({
      title: "Auto Blog Modern",
      content: `
      <div class="hero">
        <h1>🚀 Auto Blog Modern</h1>
        <p>Artikel otomatis + SEO + cepat</p>
      </div>

      <input class="search" placeholder="Cari artikel...">
      <div id="results"></div>

      <h2>Artikel Terbaru</h2>
      <div class="grid">${list}</div>

      ${searchScript()}
      `
    });
  });
}

// ======================
// POST
// ======================
async function postPage(context) {
  return withCache(context, 3600, async () => {
    const slug = context.request.url.split("/post/")[1];

    const post = await getPost(slug);
    if (!post || post.error) return new Response("404", { status: 404 });

    const related = (post.related || []).map(p => `
      <div class="card">
        <a href="/post/${p.slug}">
          <h4>${p.title}</h4>
        </a>
      </div>
    `).join("");

    return html({
      title: post.title,
      slug,
      content: `
      <article class="post">
        <img src="https://picsum.photos/seed/${slug}/800/400">
        <h1>${post.title}</h1>
        <div>${post.content}</div>
      </article>

      <h3>Artikel Terkait</h3>
      <div class="grid">${related}</div>
      `
    });
  });
}

// ======================
// KATEGORI
// ======================
async function kategoriPage(context) {
  return withCache(context, 3600, async () => {
    const slug = context.request.url.split("/kategori/")[1];

    const posts = await getPosts();
    const filtered = posts.filter(p => p.kategori === slug);

    return html({
      title: "Kategori " + slug,
      content: `
      <h1>Kategori: ${slug}</h1>

      <div class="grid">
        ${filtered.map(p => `
          <div class="card">
            <a href="/post/${p.slug}">${p.title}</a>
          </div>
        `).join("")}
      </div>
      `
    });
  });
}

// ======================
// SEARCH API
// ======================
async function searchAPI(context) {
  const url = new URL(context.request.url);
  const q = url.searchParams.get("q")?.toLowerCase() || "";

  const posts = await getPosts();

  const results = posts.filter(p =>
    p.title.toLowerCase().includes(q)
  ).slice(0, 20);

  return new Response(JSON.stringify(results), {
    headers: { "content-type": "application/json" }
  });
}

// ======================
// SITEMAP
// ======================
async function sitemap(context) {
  const posts = await getPosts();

  const urls = posts.map(p => `
    <url>
      <loc>https://niadzgn.pages.dev/post/${p.slug}</loc>
    </url>
  `).join("");

  return new Response(`<?xml version="1.0"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
  </urlset>`, {
    headers: { "content-type": "application/xml" }
  });
}

// ======================
// RSS
// ======================
async function rss(context) {
  const posts = await getPosts();

  const items = posts.slice(0, 20).map(p => `
    <item>
      <title>${p.title}</title>
      <link>https://niadzgn.pages.dev/post/${p.slug}</link>
    </item>
  `).join("");

  return new Response(`<?xml version="1.0"?>
  <rss version="2.0">
    <channel>
      <title>Auto Blog</title>
      <link>https://niadzgn.pages.dev</link>
      ${items}
    </channel>
  </rss>`, {
    headers: { "content-type": "application/xml" }
  });
}

// ======================
// HTML TEMPLATE + SEO
// ======================
function html({ title, slug, content }) {
  return new Response(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">

<title>${title}</title>
<meta name="description" content="${title}">

<link rel="canonical" href="https://niadzgn.pages.dev/post/${slug || ""}">

<meta property="og:title" content="${title}">
<meta property="og:image" content="https://niadzgn.pages.dev/og/${slug || ""}">
<meta property="og:type" content="article">

<style>
:root{--bg:#fff;--text:#111;--primary:#4f46e5}
html.dark{--bg:#0f172a;--text:#e5e7eb}

body{margin:0;font-family:system-ui;background:var(--bg);color:var(--text)}

.header{display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid #ddd}
.logo{font-weight:bold;color:var(--primary)}

.container{max-width:1100px;margin:auto;padding:20px}

.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}

.card{border:1px solid #ddd;border-radius:12px;padding:10px}
.card img{width:100%;border-radius:10px}

.hero{margin:20px;padding:40px;border-radius:12px;text-align:center;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff}

.search{width:100%;padding:12px;border-radius:10px;border:1px solid #ddd;margin:20px 0}

</style>
</head>
<body>

<header class="header">
  <div class="logo">⚡ AutoBlog</div>
  <button onclick="toggleTheme()">🌙</button>
</header>

<main class="container">
${content}
</main>

<script>
function toggleTheme(){
  document.documentElement.classList.toggle("dark");
}
</script>

</body>
</html>`, {
    headers: { "content-type": "text/html" }
  });
}

// ======================
// SEARCH SCRIPT
// ======================
function searchScript() {
  return `
<script>
const input = document.querySelector(".search");
const results = document.getElementById("results");

input?.addEventListener("input", async e=>{
  const q = e.target.value;

  if(q.length < 2){
    results.innerHTML = "";
    return;
  }

  const res = await fetch("/api/search?q="+q);
  const data = await res.json();

  results.innerHTML = data.map(d=>\`
    <a href="/post/\${d.slug}">\${d.title}</a>
  \`).join("");
});
</script>
`;
}
