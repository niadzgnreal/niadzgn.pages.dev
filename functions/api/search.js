import { getPosts } from "../../lib/api";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const q = url.searchParams.get("q")?.toLowerCase() || "";

  const posts = await getPosts();

  const results = posts.filter(p =>
    p.title.toLowerCase().includes(q)
  ).slice(0, 20);

  return new Response(JSON.stringify(results), {
    headers: { "content-type": "application/json" }
  });
}
