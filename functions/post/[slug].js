import { layout } from "../../lib/render";

export async function onRequest(context) {
  const { slug } = context.params;

  const post = await fetch("https://api.niadzgn.workers.dev/post/"+slug)
    .then(r=>r.json());

  return layout({
    title: post.title,
    description: post.title,
    content: `
      <article class="post">
        <img src="https://picsum.photos/seed/${slug}/800/400">
        <h1>${post.title}</h1>
        <div class="post-content">${post.content}</div>
      </article>
    `
  });
}
