import { getPosts } from "../lib/api";
import { SITE, sanitizeSlug } from "../lib/config";

export async function onRequest() {
  const posts = await getPosts();

  const urls = posts.map(p => `
<url>
  <loc>${SITE.domain}/post/${sanitizeSlug(p.slug)}</loc>
</url>`).join("");

  return new Response(`<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`, {
    headers: { "content-type": "application/xml" }
  });
}
