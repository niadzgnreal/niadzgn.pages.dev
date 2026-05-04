const API = "https://api.niadzgn.workers.dev";

// ======================
// MAIN
// ======================
export async function onRequest(context) {
  return withCache(context, 3600, async () => {
    try {
      const { slug } = context.params;

      const post = await getPost(slug);

      if (!post || post.error) {
        return new Response("404 Not Found", { status: 404 });
      }

      const relatedHTML = (post.related || []).map(p => `
        <div class="card">
          <a href="/post/${p.slug}">
            <h4>${p.title}</h4>
          </a>
        </div>
      `).join("");

      return html({
        title: post.title,
        description: stripHTML(post.content).slice(0, 160),
        slug,
        content: `
        <article class="post">
          <img loading="lazy" src="https://picsum.photos/seed/${slug}/800/400">
          <h1>${post.title}</h1>

          <div class="post-content">
            ${post.content}
          </div>
        </article>

        <h3>Artikel Terkait</h3>
        <div class="grid">
          ${relatedHTML}
        </div>
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
// HTML + SEO
// ======================
function html({ title, description, slug, content }) {
  const url = `https://niadzgn.pages.dev/post/${slug}`;

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
<meta property="og:image" content="https://niadzgn.pages.dev/og/${slug}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">

<meta name="twitter:card" content="summary_large_image">

<!-- JSON-LD -->
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 "headline": "${title}",
 "description": "${description}",
 "mainEntityOfPage": "${url}"
}
</script>

<style>
:root{--bg:#fff;--text:#111;--primary:#4f46e5}
html.dark{--bg:#0f172a;--text:#e5e7eb}

body{margin:0;font-family:system-ui;background:var(--bg);color:var(--text)}

.header{display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid #ddd}
.logo{font-weight:bold;color:var(--primary)}

.container{max-width:900px;margin:auto;padding:20px}

.post img{width:100%;border-radius:12px}
.post h1{margin:15px 0}
.post-content{line-height:1.8;font-size:16px}

.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}

.card{border:1px solid #ddd;padding:10px;border-radius:10px}

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
// UTIL
// ======================
function stripHTML(html) {
  return html.replace(/<[^>]*>?/gm, "");
}
