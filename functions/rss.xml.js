import { getPosts } from "../lib/api";

export async function onRequest() {
  const posts = await getPosts();

  const items = posts.slice(0, 20).map(p => `
<item>
<title>${p.title}</title>
<link>https://niadzgn.pages.dev/post/${p.slug}</link>
</item>`).join("");

  return new Response(`<?xml version="1.0"?>
<rss version="2.0">
<channel>
<title>Auto Blog</title>
<link>https://niadzgn.pages.dev</link>
${items}
</channel>
</rss>`, {
    headers: { "content-type": "application/xml" }
  });
}
