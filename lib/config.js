// ======================
// GLOBAL CONFIG
// ======================
export const SITE = {
  name: "Auto Blog",
  domain: "https://niadzgn.pages.dev",
  description: "Artikel otomatis + SEO + cepat",
  defaultImage: "/og/default",
};

// ======================
// API CONFIG (WAJIB)
// ======================
export const API_BASE = "https://api.niadzgn.workers.dev";

// ======================
// URL HELPER
// ======================
export const url = (path = "") => {
  if (!path.startsWith("/")) path = "/" + path;
  return SITE.domain + path;
};

// ======================
// SEO HELPERS
// ======================

// canonical URL
export const canonical = (path = "") => {
  return url(path);
};

// OG image (FIX biar aman)
export const ogImage = (slug = "") => {
  if (!slug) return url(SITE.defaultImage);
  return url("/og/" + slug);
};

// default OG
export const defaultOG = () => {
  return url(SITE.defaultImage);
};

// ======================
// SLUG SANITIZER (WAJIB)
// ======================
export function sanitizeSlug(slug = "") {
  return encodeURIComponent(
    String(slug)
      .replace(/<[^>]*>?/gm, "") // hapus HTML
      .replace(/"/g, "")
      .trim()
  );
}

// ======================
// TEXT UTIL
// ======================
export function stripHTML(html = "") {
  return String(html).replace(/<[^>]*>?/gm, "");
}

// ======================
// READING TIME
// ======================
export function readingTime(text = "") {
  const words = stripHTML(text).split(/\s+/).length;
  return Math.ceil(words / 200);
}
