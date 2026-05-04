import { getPosts } from "../lib/api";
import { SITE, sanitizeSlug } from "../lib/config";

export async function onRequest() {
  const posts = await getPosts();

  const items = posts.slice(0, 20).map(p => `
<item>
<title>${escapeXML(p.title)}</title>
<link>${SITE.domain}/post/${sanitizeSlug(p.slug)}</link>
</item>`).join("");

  return new Response(`<?xml version="1.0"?>
<rss version="2.0">
<channel>
<title>${SITE.name}</title>
<link>${SITE.domain}</link>
${items}
</channel>
</rss>`, {
    headers: { "content-type": "application/xml" }
  });
}

// ======================
// ESCAPE XML (WAJIB BIAR VALID)
// ======================
function escapeXML(str = "") {
  return String(str).replace(/[<>&'"]/g, c => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;"
  }[c]));
}
