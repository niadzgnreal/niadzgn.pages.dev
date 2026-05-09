import { layout } from "../../lib/render";
import { canonical, sanitizeSlug, cardImage } from "../../lib/config";
import { getByKategori } from "../../lib/api";

export async function onRequest(context) {

  const { slug } = context.params;

  const safeSlug = sanitizeSlug(slug);

  // ======================
  // PAGINATION
  // ======================
  const url = new URL(context.request.url);

  const page = Number(url.searchParams.get("page") || 1);

  const PER_PAGE = 12;

  // ======================
  // DATA
  // ======================
  const filtered = await getByKategori(safeSlug);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const start = (page - 1) * PER_PAGE;

  const currentPosts = filtered.slice(
    start,
    start + PER_PAGE
  );

  // ======================
  // PAGINATION HTML
  // ======================
  let pagination = `<div class="pagination">`;

  for(let i = 1; i <= totalPages; i++){

    pagination += `
      <a
        href="/kategori/${safeSlug}?page=${i}"
        class="${i === page ? "active" : ""}"
      >
        ${i}
      </a>
    `;
  }

  pagination += `</div>`;

  return layout({
    title: "Kategori " + safeSlug,
    description: "Kategori " + safeSlug,

    // ✅ SEO
    canonical: canonical(
      "/kategori/" + safeSlug + "?page=" + page
    ),

    content: `
      <h1>Kategori: ${safeSlug}</h1>

      <div class="grid">

        ${currentPosts.map(p => `
          <div class="card">
            <a href="/post/${sanitizeSlug(p.slug)}">

              ${cardImage(
                `/og/${sanitizeSlug(p.slug)}`,
                p.title
              )}

              <h3>${p.title}</h3>

            </a>
          </div>
        `).join("")}

      </div>

      ${pagination}
    `
  });
}
