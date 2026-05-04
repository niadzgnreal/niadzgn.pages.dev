import { layout } from "../../lib/render";
import { canonical, sanitizeSlug } from "../../lib/config";
import { getByKategori } from "../../lib/api";

export async function onRequest(context) {
  const { slug } = context.params;

  const safeSlug = sanitizeSlug(slug);

  // ======================
  // DATA (PAKAI API LAYER)
  // ======================
  const filtered = await getByKategori(safeSlug);

  return layout({
    title: "Kategori " + safeSlug,
    description: "Kategori " + safeSlug,

    // ✅ SEO
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
