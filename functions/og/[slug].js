export async function onRequest(context) {
  const { slug } = context.params;

  // Ambil title dari slug (simple fallback)
  const title = decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

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
          fontWeight: 700,
        }}
      >
        {/* Title */}
        <div style={{ lineHeight: 1.2 }}>
          {title}
        </div>

        {/* Footer */}
        <div style={{ fontSize: 24, opacity: 0.8 }}>
          niadzgn.pages.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
