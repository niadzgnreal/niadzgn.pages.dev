import { getPosts } from "../../lib/api";
import { sanitizeSlug } from "../../lib/config";

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // ======================
  // SANITIZE QUERY
  // ======================
  const q = sanitizeQuery(url.searchParams.get("q"));

  const posts = await getPosts();

  const results = posts
    .filter(p =>
      (p.title || "").toLowerCase().includes(q)
    )
    .slice(0, 20)
    .map(p => ({
      title: escapeJSON(p.title),
      slug: sanitizeSlug(p.slug)
    }));

  return new Response(JSON.stringify(results), {
    headers: { "content-type": "application/json" }
  });
}

// ======================
// SANITIZE QUERY
// ======================
function sanitizeQuery(q = "") {
  return q
    .toLowerCase()
    .replace(/<[^>]*>?/gm, "") // hapus HTML
    .replace(/[^\w\s-]/g, "")  // hanya huruf, angka, dash
    .trim();
}

// ======================
// ESCAPE JSON (AMAN)
// ======================
function escapeJSON(str = "") {
  return String(str).replace(/</g, "\\u003c");
}
