import { layout } from "../../lib/render";
import { canonical, sanitizeSlug } from "../../lib/config";

export async function onRequest(context) {
  const { slug } = context.params;

  const safeSlug = sanitizeSlug(slug);

  const posts = await fetch("https://api.niadzgn.workers.dev/posts")
    .then(r => r.json());

  const filtered = posts.filter(p =>
    (p.kategori || "").toLowerCase() === safeSlug.toLowerCase()
  );

  return layout({
    title: "Kategori " + safeSlug,
    description: "Kategori " + safeSlug,

    // ✅ tambah SEO (tidak ubah flow)
    canonical: canonical("/kategori/" + safeSlug),

    content: `
      <h1>Kategori: ${safeSlug}</h1>
      <div class="grid">
        ${filtered.map(p => `
          <div class="card">
            <a href="/post/${sanitizeSlug(p.slug)}">${p.title}</a>
          </div>
        `).join("")}
      </div>
    `
  });
}
