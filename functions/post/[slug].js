import { layout } from "../../lib/render";

import {
  SITE,
  canonical,
  ogImage as buildOg,
  sanitizeSlug,
  stripHTML,
  readingTime,
  metaDescription
} from "../../lib/config";

import {
  getPosts,
  getPost
} from "../../lib/api";

// ======================
// MAIN
// ======================
export async function onRequest(context) {

  try {

    let { slug } = context.params;

    // ======================
    // SANITIZE SLUG
    // ======================
    slug = sanitizeSlug(slug);

    // ======================
    // GET POST
    // ======================
    const post = await getPost(slug);

    if (!post) {
      return new Response(
        "404 Not Found",
        { status: 404 }
      );
    }

    // ======================
    // GET ALL POSTS
    // ======================
    const posts = await getPosts();

    // ======================
    // RELATED POSTS
    // ======================
    const related = posts
      .filter(p =>

        sanitizeSlug(p.slug) !== slug &&

        (p.kategori || "").toLowerCase() ===
        (post.kategori || "").toLowerCase()

      )
      .slice(0, 6);

    // ======================
    // AUTO INTERNAL LINK
    // ======================
    post.content = autoLink(
      post.content,
      related
    );

    // ======================
    // READING TIME
    // ======================
    const read = readingTime(
      post.content
    );

    // ======================
    // DESCRIPTION
    // ======================
    const desc = metaDescription(
      post.content,
      160
    );

    // ======================
    // BREADCRUMB
    // ======================
    const breadcrumb = `
<nav class="breadcrumb">
  <a href="/">Home</a> ›

  <a href="/kategori/${sanitizeSlug(post.kategori)}">
    ${post.kategori}
  </a> ›

  <span>${post.title}</span>
</nav>
`;

    // ======================
    // OG IMAGE
    // ======================
    const og = buildOg(slug);

    // ======================
    // SCHEMA
    // ======================
    const schema = `
<script type="application/ld+json">
{
 "@context":"https://schema.org",
 "@type":"BlogPosting",

 "headline":"${post.title}",

 "description":"${desc}",

 "image":"${og}",

 "mainEntityOfPage":"${canonical("/post/" + slug)}",

 "author":{
   "@type":"Organization",
   "name":"${SITE.name}"
 },

 "publisher":{
   "@type":"Organization",
   "name":"${SITE.name}"
 }
}
</script>

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
   "name":"${post.kategori}",
   "item":"${SITE.domain}/kategori/${sanitizeSlug(post.kategori)}"
  },

  {
   "@type":"ListItem",
   "position":3,
   "name":"${post.title}"
  }

 ]
}
</script>
`;

    // ======================
    // RENDER
    // ======================
    return layout({

      title: post.title,

      description: desc,

      canonical: canonical(
        "/post/" + slug
      ),

      image: og,

      schema,

      content: `
${breadcrumb}

<article class="post">

  <img
    loading="eager"
    fetchpriority="high"
    decoding="async"
    src="${og}"
    alt="${post.title}"
    width="1200"
    height="630"
  >

  <h1>${post.title}</h1>

  <p>
    ⏱ ${read} min read
  </p>

  <div class="post-content">
    ${post.content}
  </div>

</article>

<h3>Artikel Terkait</h3>

<div class="grid">

  ${related.map(p => `

    <div class="card">

      <a href="/post/${sanitizeSlug(p.slug)}">

        <img
          loading="lazy"
          decoding="async"
          src="/og/${sanitizeSlug(p.slug)}"
          alt="${p.title}"
          width="1200"
          height="630"
        >

        <h4>${p.title}</h4>

      </a>

    </div>

  `).join("")}

</div>
`
    });

  } catch (e) {

    return new Response(
      "Error: " + e.message,
      { status: 500 }
    );

  }
}

// ======================
// AUTO INTERNAL LINK
// ======================
function autoLink(
  content,
  related = []
) {

  if (!content) return "";

  let used = new Set();

  let count = 0;

  const MAX_LINK = 5;

  return content.replace(
    /(<a[^>]*>.*?<\/a>)|>([^<]+)</gi,

    (
      match,
      linkPart,
      textPart
    ) => {

      if (linkPart) {
        return linkPart;
      }

      let text = textPart;

      related.forEach(p => {

        if (count >= MAX_LINK) {
          return;
        }

        const keyword = p.title
          .split(" ")
          .slice(0, 2)
          .join(" ")
          .toLowerCase();

        if (
          !keyword ||
          used.has(keyword)
        ) {
          return;
        }

        const safeSlug = sanitizeSlug(
          p.slug
        );

        const regex = new RegExp(
          `\\b${keyword}\\b`,
          "i"
        );

        if (regex.test(text)) {

          text = text.replace(
            regex,

            `<a href="/post/${safeSlug}">
              ${keyword}
            </a>`
          );

          used.add(keyword);

          count++;
        }

      });

      return ">" + text + "<";
    }
  );
}
