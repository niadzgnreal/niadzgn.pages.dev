import { SITE, canonical, ogImage as buildOg, sanitizeSlug } from "./config";

export function seo({ title, description, slug }) {

  const safeSlug = sanitizeSlug(slug || "");

  const url = canonical(safeSlug ? "/post/" + safeSlug : "/");
  const og = buildOg(safeSlug);

  return `
<title>${escapeHTML(title)}</title>
<meta name="description" content="${escapeHTML(description || title)}">
<link rel="canonical" href="${url}">

<meta property="og:title" content="${escapeHTML(title)}">
<meta property="og:description" content="${escapeHTML(description || title)}">
<meta property="og:image" content="${og}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${og}">

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 "headline": "${escapeJSON(title)}",
 "description": "${escapeJSON(description || title)}",
 "mainEntityOfPage": "${url}"
}
</script>
`;
}

// ======================
// ESCAPE HTML
// ======================
function escapeHTML(str = "") {
  return String(str).replace(/[&<>"]/g, c =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c])
  );
}

// ======================
// ESCAPE JSON (SCHEMA)
// ======================
function escapeJSON(str = "") {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, " ");
}
