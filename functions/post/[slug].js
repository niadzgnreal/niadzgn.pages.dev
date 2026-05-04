import { getPost } from "../../lib/api";
import { layout } from "../../lib/render";
import { seo } from "../../lib/seo";
import { withCache } from "../../lib/cache";

export async function onRequest(context) {
  return withCache(context, 3600, async () => {
    const { slug } = context.params;

    const post = await getPost(slug);
    if (!post || post.error) {
      return new Response("404", { status: 404 });
    }

    const related = (post.related || []).map(p => `
      <a href="/post/${p.slug}">${p.title}</a>
    `).join("");

    return new Response(layout({
      seo: seo({
        title: post.title,
        description: post.title,
        slug
      }),
      content: `
        <h1>${post.title}</h1>
        ${post.content}

        <h3>Artikel Terkait</h3>
        ${related}
      `
    }), { headers: { "content-type": "text/html" }});
  });
}
