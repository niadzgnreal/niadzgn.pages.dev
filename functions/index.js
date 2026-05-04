const API = "https://api.niadzgn.workers.dev";

// ======================
// MAIN ROUTER
// ======================
export async function onRequest(context) {
  return withCache(context, 3600, async () => {
    try {
      const posts = await getPosts();

      return html({
        title: "Auto Blog Modern",
        description: "Artikel otomatis + SEO + cepat",
        content: `
        
        <div class="hero">
          <h1>🚀 Auto Blog Modern</h1>
          <p>Artikel otomatis + SEO + cepat</p>
        </div>

        <input class="search" placeholder="Cari artikel...">
        <div id="results"></div>

        <h2>Artikel Terbaru</h2>

        <div class="grid">
          ${posts.slice(0,12).map(p => `
            <div class="card">
              <a href="/post/${p.slug}">
                <img loading="lazy" src="https://picsum.photos/seed/${p.slug}/400/300">
                <h3>${p.title}</h3>
              </a>
            </div>
          `).join("")}
        </div>

        ${searchScript()}
        
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
// HTML + SEO + UI GLOBAL
// ======================
function html({ title, description, content }) {
  return new Response(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">

<title>${title}</title>
<meta name="description" content="${description}">

<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">

<meta name="twitter:card" content="summary_large_image">

<style>
:root{--bg:#fff;--text:#111;--primary:#4f46e5}
html.dark{--bg:#0f172a;--text:#e5e7eb}

body{margin:0;font-family:system-ui;background:var(--bg);color:var(--text)}

.header{display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid #ddd}
.logo{font-weight:bold;color:var(--primary)}

.container{max-width:1100px;margin:auto;padding:20px}

/* HERO */
.hero{
  margin:20px 0;
  padding:40px;
  border-radius:12px;
  text-align:center;
  background:linear-gradient(135deg,#4f46e5,#6366f1);
  color:#fff
}

/* GRID */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:20px
}

/* CARD */
.card{
  border:1px solid #ddd;
  border-radius:12px;
  padding:10px;
  transition:.2s
}
.card:hover{transform:translateY(-5px)}
.card img{
  width:100%;
  border-radius:10px
}

/* SEARCH */
.search{
  width:100%;
  padding:12px;
  border-radius:10px;
  border:1px solid #ddd;
  margin:20px 0
}

.search-item{
  display:block;
  padding:10px;
  border:1px solid #ddd;
  border-radius:8px;
  margin-bottom:8px;
  text-decoration:none;
  color:var(--text)
}

/* POST */
.post img{width:100%;border-radius:12px}
.post h1{margin:15px 0}
.post-content{line-height:1.8;font-size:16px}

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
    <a class="search-item" href="/post/\${d.slug}">
      \${d.title}
    </a>
  \`).join("");
});
</script>
`;
}
