import { API_BASE, sanitizeSlug } from "./config";

// ======================
// INTERNAL CACHE (in-memory edge)
// ======================
let _cache = null;
let _lastFetch = 0;
const TTL = 60 * 1000; // 60 detik

// ======================
// FETCH JSON (SAFE)
// ======================
async function fetchJSON(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "accept": "application/json"
      }
    });

    if (!res.ok) throw new Error("API Error " + res.status);

    return await res.json();

  } catch (err) {
    console.error("API FETCH ERROR:", err.message);

    // ✅ fallback ke cache kalau ada
    if (_cache) return _cache;

    return [];
  }
}

// ======================
// GET ALL POSTS
// ======================
export async function getPosts() {
  const now = Date.now();

  // pakai cache
  if (_cache && (now - _lastFetch < TTL)) {
    return _cache;
  }

  const data = await fetchJSON(API_BASE + "/posts");

  const normalized = (data || []).map(p => ({
    slug: sanitizeSlug(p.slug || ""),
    title: (p.title || "No Title").trim(),
    content: p.content || "",
    kategori: (p.kategori || "").toLowerCase().trim()
  }));

  // ✅ sort terbaru (kalau ada tanggal nanti tinggal upgrade)
  normalized.sort((a, b) => b.slug.localeCompare(a.slug));

  _cache = normalized;
  _lastFetch = now;

  return normalized;
}

// ======================
// GET SINGLE POST
// ======================
export async function getPost(slug) {
  if (!slug) return null;

  const safeSlug = sanitizeSlug(slug);
  const posts = await getPosts();

  return posts.find(p => p.slug === safeSlug) || null;
}

// ======================
// GET BY CATEGORY
// ======================
export async function getByKategori(kategori) {
  if (!kategori) return [];

  const posts = await getPosts();
  const safeKategori = kategori.toLowerCase().trim();

  return posts.filter(
    p => p.kategori === safeKategori
  );
}

// ======================
// SEARCH
// ======================
export async function searchPosts(query) {
  if (!query) return [];

  const posts = await getPosts();
  const q = sanitizeQuery(query);

  return posts.filter(p =>
    (p.title || "").toLowerCase().includes(q)
  ).slice(0, 20);
}

// ======================
// SANITIZE QUERY
// ======================
function sanitizeQuery(q = "") {
  return q
    .toLowerCase()
    .replace(/<[^>]*>?/gm, "")   // hapus HTML
    .replace(/[^\w\s-]/g, "")    // hapus simbol aneh
    .trim();
}
