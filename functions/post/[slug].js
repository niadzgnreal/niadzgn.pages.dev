import { layout } from "../../lib/render";
import { SITE, canonical, ogImage as buildOg } from "../../lib/config";

const API = "https://api.niadzgn.workers.dev";

// ======================
// MAIN
// ======================
export async function onRequest(context) {
  try {
    let { slug } = context.params;

    // ======================
    // SANITIZE SLUG (ANTI HTML INJECTION)
    // ======================
    slug = sanitizeSlug(slug);

    const posts = await fetch(API + "/posts").then(r => r.json());

    const post = posts.find(p => sanitizeSlug(p.slug) === slug);

    if (!post) {
      return new Response("404 Not Found", { status: 404 });
    }

    // ======================
    // RELATED POSTS
    // ======================
    const related = posts
      .filter(p =>
        sanitizeSlug(p.slug) !== slug &&
        (p.kategori || "").toLowerCase() === (post.kategori || "").toLowerCase()
      )
      .slice(0, 6);

    // ======================
    // INTERNAL LINK (SAFE)
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
    // SCHEMA (PAKAI CONFIG DOMAIN)
    // ======================
    const schema = `
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 "headline": "${post.title}",
 "description": "${stripHTML(post.content).slice(0,150)}",
 "mainEntityOfPage": "${canonical("/post/" + slug)}"
}
</script>

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [
  {"@type":"ListItem","position":1,"name":"Home","item":"${SITE.domain}/"},
  {"@type":"ListItem","position":2,"name":"${post.kategori}","item":"${SITE.domain}/kategori/${post.kategori}"},
  {"@type":"ListItem","position":3,"name":"${post.title}"}
 ]
}
</script>
`;

    // ======================
    // RENDER
    // ======================
    const og = buildOg(slug);

    return layout({
      title: post.title,
      description: stripHTML(post.content).slice(0, 160),

      // ✅ pakai config
      canonical: canonical("/post/" + slug),
      image: og,

      schema: schema,

      content: `
      ${breadcrumb}

      <article class="post">
        <img loading="lazy" src="/og/${slug}" alt="${post.title}">
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
            <a href="/post/${sanitizeSlug(p.slug)}">
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
// AUTO INTERNAL LINK (SAFE VERSION)
// ======================
function autoLink(content, related = []) {
  if (!content) return "";

  let used = new Set();
  let count = 0;
  const MAX_LINK = 5;

  return content.replace(/(<a[^>]*>.*?<\/a>)|>([^<]+)</gi, (match, linkPart, textPart) => {

    if (linkPart) return linkPart;

    let text = textPart;

    related.forEach(p => {
      if (count >= MAX_LINK) return;

      const keyword = p.title.split(" ").slice(0, 2).join(" ").toLowerCase();
      if (!keyword || used.has(keyword)) return;

      const safeSlug = sanitizeSlug(p.slug);

      const regex = new RegExp(`\\b${keyword}\\b`, "i");

      if (regex.test(text)) {
        text = text.replace(
          regex,
          `<a href="/post/${safeSlug}">${keyword}</a>`
        );

        used.add(keyword);
        count++;
      }
    });

    return ">" + text + "<";
  });
}

// ======================
// SANITIZE SLUG
// ======================
function sanitizeSlug(slug) {
  return encodeURIComponent(
    (slug || "")
      .replace(/<[^>]*>?/gm, "")
      .replace(/"/g, "")
      .trim()
  );
}

// ======================
// UTIL
// ======================
function stripHTML(html) {
  return html.replace(/<[^>]*>?/gm, "");
}
