import { getPosts } from "../lib/api";
import { layout } from "../lib/render";
import { seo } from "../lib/seo";
import { withCache } from "../lib/cache";

export async function onRequest(context) {
  return withCache(context, 3600, async () => {
    const posts = await getPosts();

    const list = posts.slice(0, 12).map(p => `
      <div class="card">
        <a href="/post/${p.slug}">${p.title}</a>
      </div>
    `).join("");

    return new Response(layout({
      seo: seo({ title: "Home", description: "Blog terbaru" }),
      content: `
        <h1>Auto Blog</h1>
        ${list}
      `
    }), { headers: { "content-type": "text/html" }});
  });
}
