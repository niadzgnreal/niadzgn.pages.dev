import { layout } from "../lib/render";
import { getPosts } from "../lib/api";
import { SITE, canonical, sanitizeSlug } from "../lib/config";

// ======================
// MAIN
// ======================
export async function onRequest(context) {
  try {
    const reqUrl = new URL(context.request.url);
    const page = parseInt(reqUrl.searchParams.get("page")) || 1;

    const robotsMeta = page > 1
      ? '<meta name="robots" content="noindex,follow">'
      : '';

    const posts = await getPosts();

    // ======================
    // PAGINATION
    // ======================
    const perPage = 12;
    const totalPage = Math.ceil(posts.length / perPage);

    const start = (page - 1) * perPage;
    const currentPosts = posts.slice(start, start + perPage);

    // ======================
    // GRID
    // ======================
    const grid = currentPosts.map(p => `
      <div class="card">
        <a href="/post/${sanitizeSlug(p.slug)}">
          <img loading="lazy" src="https://picsum.photos/seed/${sanitizeSlug(p.slug)}/400/300">
          <h3>${p.title}</h3>
        </a>
      </div>
    `).join("");

    // ======================
    // RENDER
    // ======================
    return layout({
      title: "Auto Blog Modern",
      description: "Artikel otomatis + SEO + cepat",

      // ✅ pakai config (anti hardcode)
      canonical: canonical(page > 1 ? "/?page=" + page : "/"),

      // ⚠️ robots tetap di schema (tidak ubah struktur kamu)
      schema: `
      ${robotsMeta}
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "WebSite",
 "name": "${SITE.name}",
 "url": "${SITE.domain}",
 "potentialAction": {
   "@type": "SearchAction",
   "target": "${SITE.domain}/?q={search_term_string}",
   "query-input": "required name=search_term_string"
 }
}
</script>
`,

      content: `

<div class="hero">
  <h1>🚀 ${SITE.name}</h1>
  <p>Artikel SEO, tutorial, dan teknologi terbaru</p>
</div>

<!-- SEO CONTENT -->
<section class="seo-content">
  <h2>Blog SEO & Teknologi Terlengkap</h2>
  <p>
    Website ini menyediakan berbagai artikel seputar SEO, digital marketing, 
    dan teknologi terbaru yang dirancang untuk membantu meningkatkan traffic 
    dan performa website Anda.
  </p>
</section>

<!-- KATEGORI -->
<section>
  <h2>Kategori Populer</h2>
  <div class="grid">
    <a class="card" href="/kategori/seo"><h3>SEO</h3></a>
    <a class="card" href="/kategori/blog"><h3>Blog</h3></a>
    <a class="card" href="/kategori/teknologi"><h3>Teknologi</h3></a>
  </div>
</section>

<!-- SEARCH -->
<input class="search" placeholder="Cari artikel...">
<div id="results"></div>

<!-- POSTS -->
<h2>Artikel Terbaru</h2>

<div class="grid">
  ${grid}
</div>

${pagination(page, totalPage)}

${searchScript()}
`
    });

  } catch (e) {
    return new Response("Error: " + e.message, { status: 500 });
  }
}

// ======================
// PAGINATION
// ======================
function pagination(current, total) {
  if (total <= 1) return "";

  let html = `<div class="pagination">`;

  const group = Math.floor((current - 1) / 5);
  const start = group * 5 + 1;
  const end = Math.min(start + 4, total);

  if (start > 1) {
    html += `<a href="/?page=${start - 1}">«</a>`;
  }

  for (let i = start; i <= end; i++) {
    html += `<a href="/?page=${i}" class="${i === current ? "active" : ""}">${i}</a>`;
  }

  if (end < total) {
    html += `<a href="/?page=${end + 1}">»</a>`;
  }

  html += `</div>`;
  return html;
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
      <h4>\${d.title}</h4>
    </a>
  \`).join("");
});
</script>
`;
}
