export async function onRequest(context) {
  try {
    const { slug } = context.params;

    // ======================
    // FETCH DATA (OPTIONAL)
    // ======================
    let post = null;
    try {
      const res = await fetch("https://api.niadzgn.workers.dev/posts");
      const data = await res.json();
      post = data.find(p => p.slug === slug);
    } catch {}

    const title = post?.title || formatSlug(slug);
    const kategori = post?.kategori || "Blog";

    // ======================
    // SVG PREMIUM (VALID)
    // ======================
    const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>

    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>

    <filter id="blur">
      <feGaussianBlur stdDeviation="40" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Glow Circle -->
  <circle cx="1000" cy="120" r="220" fill="url(#accent)" opacity="0.25" filter="url(#blur)"/>

  <!-- Wave -->
  <path d="M0,480 C300,380 900,680 1200,520 L1200,630 L0,630 Z"
        fill="url(#accent)" opacity="0.12"/>

  <!-- Category -->
  <rect x="60" y="60" rx="12" ry="12" width="220" height="42" fill="#4f46e5"/>
  <text x="80" y="88" fill="white" font-size="20" font-family="sans-serif">
    ${escapeXML(kategori)}
  </text>

  <!-- Title -->
  <text x="60" y="260" fill="white" font-size="54" font-weight="bold" font-family="sans-serif">
    ${wrapText(title, 28)}
  </text>

  <!-- Footer -->
  <text x="60" y="580" fill="#94a3b8" font-size="22" font-family="sans-serif">
    niadzgn.pages.dev
  </text>

</svg>
`;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400"
      }
    });

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

function escapeXML(str = "") {
  return str.replace(/[<>&'"]/g, c => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;"
  }[c]));
}

// wrap text jadi multiline SVG
function wrapText(text, maxLen) {
  const words = text.split(" ");
  let lines = [];
  let current = "";

  for (let w of words) {
    if ((current + w).length > maxLen) {
      lines.push(current.trim());
      current = w + " ";
    } else {
      current += w + " ";
    }
  }
  lines.push(current.trim());

  return lines.map((line, i) =>
    `<tspan x="60" dy="${i === 0 ? 0 : 60}">${escapeXML(line)}</tspan>`
  ).join("");
}
