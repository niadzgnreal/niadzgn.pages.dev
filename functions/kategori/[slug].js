const API = "https://api.niadzgn.workers.dev";

// ======================
// MAIN
// ======================
export async function onRequest(context) {
  return withCache(context, 3600, async () => {
    try {
      const url = new URL(context.request.url);
      const slug = (context.params.slug || "").toLowerCase();
      const page = parseInt(url.searchParams.get("page")) || 1;

      const posts = await getPosts();

      // ✅ FIX: case insensitive + null safe
      const filtered = posts.filter(
        p => (p.kategori || "").toLowerCase() === slug
      );

      if (!filtered.length) {
        return html({
          title: "Kategori tidak ditemukan",
          description: "Tidak ada artikel di kategori ini",
          slug,
          content: `<h1>Kategori "${slug}" tidak ditemukan</h1>`
        });
      }

      // ======================
      // PAGINATION
      // ======================
      const perPage = 12;
      const totalPage = Math.ceil(filtered.length / perPage);

      const start = (page - 1) * perPage;
      const currentPosts = filtered.slice(start, start + perPage);

      const grid = currentPosts.map(p => `
        <div class="card">
          <a href="/post/${p.slug}">
            <img loading="lazy" src="https://picsum.photos/seed/${p.slug}/400/300">
            <h3>${p.title}</h3>
          </a>
        </div>
      `).join("");

      return html({
        title: `Kategori: ${slug}`,
        description: `Artikel dalam kategori ${slug}`,
        slug,
        content: `
          <h1>Kategori: ${slug}</h1>

          <div class="grid">
            ${grid}
          </div>

          ${pagination(slug, page, totalPage)}
        `
      });

    } catch (e) {
      return new Response("Error: " + e.message, { status: 500 });
    }
  });
}

// ======================
// API
// ======================
async function getPosts() {
  const res = await fetch(API + "/posts");
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
// PAGINATION
// ======================
function pagination(slug, current, total) {
  if (total <= 1) return "";

  let html = `<div class="pagination">`;

  const group = Math.floor((current - 1) / 5);
  const start = group * 5 + 1;
  const end = Math.min(start + 4, total);

  if (start > 1) {
    html += `<a href="/kategori/${slug}?page=${start - 1}">«</a>`;
  }

  for (let i = start; i <= end; i++) {
    html += `<a href="/kategori/${slug}?page=${i}" class="${i === current ? "active" : ""}">${i}</a>`;
  }

  if (end < total) {
    html += `<a href="/kategori/${slug}?page=${end + 1}">»</a>`;
  }

  html += `</div>`;
  return html;
}

// ======================
// HTML + SEO
// ======================
function html({ title, description, slug, content }) {
  const url = `https://niadzgn.pages.dev/kategori/${slug}`;

  return new Response(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">

<title>${title}</title>
<meta name="description" content="${description}">

<link rel="canonical" href="${url}">

<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">

<meta name="twitter:card" content="summary">

<!-- JSON-LD -->
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "CollectionPage",
 "name": "${title}",
 "url": "${url}"
}
</script>

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

.pagination{display:flex;gap:8px;justify-content:center;margin:30px 0;flex-wrap:wrap}
.pagination a{padding:8px 12px;border:1px solid #ddd;border-radius:8px;text-decoration:none;color:var(--text)}
.pagination a.active{background:var(--primary);color:#fff}

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
