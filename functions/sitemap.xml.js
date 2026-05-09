import { getPosts } from "../lib/api";
import { SITE, sanitizeSlug } from "../lib/config";

export async function onRequest() {

  try {

    // ======================
    // FETCH POSTS SAFE
    // ======================
    const posts = await getPosts().catch(() => []);

    if (!Array.isArray(posts)) {
      return new Response("Invalid posts", {
        status: 500
      });
    }

    // ======================
    // REMOVE DUPLICATE SLUG
    // ======================
    const used = new Set();

    const urls = posts
      .filter(p => {

        const slug = sanitizeSlug(p?.slug || "");

        if (!slug || used.has(slug)) {
          return false;
        }

        used.add(slug);

        return true;

      })
      .map(p => {

        const slug = sanitizeSlug(p.slug);

        const lastmod =
          p.updated ||
          p.date ||
          new Date().toISOString();

        return `
<url>
  <loc>${SITE.domain}/post/${slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>`;

      })
      .join("");

    // ======================
    // XML
    // ======================
    const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
  <loc>${SITE.domain}/</loc>
  <changefreq>hourly</changefreq>
  <priority>1.0</priority>
</url>

${urls}

</urlset>`;

    return new Response(xml, {
      headers: {
        "content-type": "application/xml;charset=UTF-8",

        // ======================
        // CACHE
        // ======================
        "cache-control":
          "public, max-age=3600"
      }
    });

  } catch (e) {

    return new Response(
      "Sitemap Error: " + e.message,
      { status: 500 }
    );

  }
}
