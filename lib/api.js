const API = "https://api.niadzgn.workers.dev";

export async function getPosts() {
  const res = await fetch(API + "/posts");
  return res.json();
}

export async function getPost(slug) {
  const res = await fetch(API + "/post/" + slug);
  return res.json();
}
