import { layout } from "../lib/render";

export async function onRequest(context) {
  const posts = await fetch("https://api.niadzgn.workers.dev/posts").then(r=>r.json());

  const list = posts.slice(0,12).map(p => `
    <div class="card">
      <a href="/post/${p.slug}">
        <img src="https://picsum.photos/seed/${p.slug}/400/300">
        <h3>${p.title}</h3>
      </a>
    </div>
  `).join("");

  return layout({
    title: "Home",
    description: "Artikel terbaru",
    content: `
      <div class="hero">
        <h1>🚀 Auto Blog</h1>
      </div>

      <div class="grid">${list}</div>
    `
  });
}
