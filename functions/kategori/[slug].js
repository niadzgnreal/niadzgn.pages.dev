import { getPosts } from "../../lib/api";
import { layout } from "../../lib/render";
import { seo } from "../../lib/seo";
import { withCache } from "../../lib/cache";

export async function onRequest(context) {
  return withCache(context, 3600, async () => {
    const { slug } = context.params;

    const posts = await getPosts();
    const filtered = posts.filter(p => p.kategori === slug);

    return new Response(layout({
      seo: seo({
        title: "Kategori " + slug,
        description: "Kategori " + slug,
        slug
      }),
      content: filtered.map(p => `
        <a href="/post/${p.slug}">${p.title}</a>
      `).join("")
    }), { headers: { "content-type": "text/html" }});
  });
}
