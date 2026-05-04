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
// URL HELPER
// ======================
export const url = (path = "") => {
  return SITE.domain + path;
};

// ======================
// SEO HELPERS
// ======================

// canonical URL
export const canonical = (path = "") => {
  return url(path);
};

// OG image
export const ogImage = (path = "") => {
  return url("/og/" + path);
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
    slug
      .replace(/<[^>]*>?/gm, "") // hapus HTML
      .replace(/"/g, "")
      .trim()
  );
}

// ======================
// TEXT UTIL
// ======================
export function stripHTML(html = "") {
  return html.replace(/<[^>]*>?/gm, "");
}

// ======================
// READING TIME
// ======================
export function readingTime(text = "") {
  const words = stripHTML(text).split(/\s+/).length;
  return Math.ceil(words / 200);
}
