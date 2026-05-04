import { layout } from "../../lib/render";

const API = "https://api.niadzgn.workers.dev";

// ======================
// MAIN
// ======================
export async function onRequest(context) {
  try {
    const { slug } = context.params;

    const posts = await fetch(API + "/posts").then(r => r.json());

    const post = posts.find(p => p.slug === slug);

    if (!post) {
      return new Response("404 Not Found", { status: 404 });
    }

    // ======================
    // RELATED POSTS
    // ======================
    const related = posts
      .filter(p =>
        p.slug !== slug &&
        (p.kategori || "").toLowerCase() === (post.kategori || "").toLowerCase()
      )
      .slice(0, 6);

    // ======================
    // INTERNAL LINK
    // ======================
    post.content = autoLink(post.content, related);

    // ======================
    // READING TIME
    // ======================
    const readingTime = Math.ceil(stripHTML(post.content).split(" ").length / 200);

    // ======================
    // BREADCRUMB
    // ======================
    const breadcrumb = `
    <nav class="breadcrumb">
      <a href="/">Home</a> › 
      <a href="/kategori/${post.kategori}">${post.kategori}</a> › 
      <span>${post.title}</span>
    </nav>
    `;

    // ======================
    // SCHEMA
    // ======================
    const schema = `
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 "headline": "${post.title}",
 "description": "${stripHTML(post.content).slice(0,150)}",
 "mainEntityOfPage": "https://niadzgn.pages.dev/post/${slug}"
}
</script>

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [
  {"@type":"ListItem","position":1,"name":"Home","item":"https://niadzgn.pages.dev/"},
  {"@type":"ListItem","position":2,"name":"${post.kategori}","item":"https://niadzgn.pages.dev/kategori/${post.kategori}"},
  {"@type":"ListItem","position":3,"name":"${post.title}"}
 ]
}
</script>
`;

    // ======================
    // RENDER
    // ======================
const ogImage = "https://niadzgn.pages.dev/og/" + slug;

return layout({
  title: post.title,
  description: stripHTML(post.content).slice(0, 160),

  // ✅ WAJIB
  canonical: "https://niadzgn.pages.dev/post/" + slug,

  // ✅ WAJIB (biar share bagus)
  image: ogImage,

  // ✅ schema tetap di head
  schema: schema,

  content: `
  
  ${breadcrumb}

  <article class="post">
    <img loading="lazy" src="https://picsum.photos/seed/${slug}/800/400">
    <h1>${post.title}</h1>

    <p>⏱ ${readingTime} min read</p>

    <div class="post-content">
      ${post.content}
    </div>
  </article>

  <h3>Artikel Terkait</h3>
  <div class="grid">
    ${related.map(p => `
      <div class="card">
        <a href="/post/${p.slug}">
          <h4>${p.title}</h4>
        </a>
      </div>
    `).join("")}
  </div>

  `
});

  } catch (e) {
    return new Response("Error: " + e.message, { status: 500 });
  }
}

// ======================
// INTERNAL LINK (ANTI SPAM)
// ======================
function autoLink(content, related = []) {
  if (!content) return "";

  let used = new Set();
  let count = 0;
  const MAX_LINK = 5;

  return content.replace(/>([^<]+)</g, (match, text) => {
    related.forEach(p => {
      if (count >= MAX_LINK) return;

      const keyword = p.title.split(" ")[0]?.toLowerCase();
      if (!keyword || used.has(keyword)) return;

      const regex = new RegExp(`\\b${keyword}\\b`, "i");

      if (regex.test(text)) {
        text = text.replace(
          regex,
          `<a href="/post/${p.slug}">${keyword}</a>`
        );
        used.add(keyword);
        count++;
      }
    });

    return ">" + text + "<";
  });
}

// ======================
// UTIL
// ======================
function stripHTML(html) {
  return html.replace(/<[^>]*>?/gm, "");
}
