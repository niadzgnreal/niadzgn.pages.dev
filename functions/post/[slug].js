import { layout } from "../../lib/render";

export async function onRequest(context) {
  const { slug } = context.params;

  // ambil semua post
  const posts = await fetch("https://api.niadzgn.workers.dev/posts")
    .then(r=>r.json());

  // ambil post utama
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return new Response("404", { status: 404 });
  }

  // 🔥 GENERATE RELATED
  const related = posts
    .filter(p =>
      p.slug !== slug &&
      p.kategori === post.kategori
    )
    .slice(0, 6);

  return layout({
    title: post.title,
    description: post.title,
    content: `
      <article class="post">
        <img src="https://picsum.photos/seed/${slug}/800/400">
        <h1>${post.title}</h1>
        <div class="post-content">${post.content}</div>
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
}
