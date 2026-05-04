import { ImageResponse } from "@cloudflare/pages-plugin-og";

export const config = {
  runtime: "edge"
};

export async function onRequest(context) {
  try {
    const { slug } = context.params;

    // ======================
    // FETCH DATA
    // ======================
    let post = null;

    try {
      const res = await fetch("https://api.niadzgn.workers.dev/posts");
      const data = await res.json();
      post = data.find(p => p.slug === slug);
    } catch (e) {}

    // ======================
    // FALLBACK
    // ======================
    const title = post?.title || formatSlug(slug);
    const kategori = post?.kategori || "Blog";

    // ======================
    // IMAGE
    // ======================
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px",
            background: "linear-gradient(135deg,#4f46e5,#6366f1)",
            color: "white",
            fontSize: 48,
            fontWeight: 700
          }}
        >

          <div style={{ fontSize: 28, opacity: 0.8 }}>
            {kategori}
          </div>

          <div style={{ lineHeight: 1.2 }}>
            {title}
          </div>

          <div style={{ fontSize: 22, opacity: 0.8 }}>
            niadzgn.pages.dev
          </div>

        </div>
      ),
      {
        width: 1200,
        height: 630
      }
    );

  } catch (err) {
    return new Response("OG Error: " + err.message, { status: 500 });
  }
}

// ======================
function formatSlug(slug = "") {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
