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
    } catch (e) {
      // fallback kalau API gagal
      post = null;
    }

    // ======================
    // FALLBACK
    // ======================
    const title = post?.title || formatSlug(slug);
    const kategori = post?.kategori || "Blog";

    // ======================
    // IMAGE RENDER
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
            fontFamily: "sans-serif",
          }}
        >

          {/* TOP BAR */}
          <div style={{ fontSize: 24, opacity: 0.85 }}>
            {kategori}
          </div>

          {/* TITLE */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.2,
              margin: "20px 0",
            }}
          >
            {title}
          </div>

          {/* FOOTER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 22,
              opacity: 0.85,
            }}
          >
            <div>niadzgn.pages.dev</div>
            <div>⚡ AutoBlog</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );

  } catch (err) {
    return new Response("OG Error: " + err.message, { status: 500 });
  }
}

// ======================
// UTIL
// ======================
function formatSlug(slug = "") {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
