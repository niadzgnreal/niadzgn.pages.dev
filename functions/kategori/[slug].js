import { layout } from "../../lib/render";

export async function onRequest(context) {
  const { slug } = context.params;

  const posts = await fetch("https://api.niadzgn.workers.dev/posts")
    .then(r=>r.json());

  const filtered = posts.filter(p =>
    (p.kategori || "").toLowerCase() === slug.toLowerCase()
  );

  return layout({
    title: "Kategori " + slug,
    description: "Kategori " + slug,
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
}
