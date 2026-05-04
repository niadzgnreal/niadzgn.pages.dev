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
    <!-- Background -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <!-- Accent -->
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>

    <!-- Glass -->
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>

    <!-- Blur -->
    <filter id="blur">
      <feGaussianBlur stdDeviation="80"/>
    </filter>
  </defs>

  <!-- BG -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Glow blob -->
  <circle cx="1000" cy="120" r="260" fill="url(#accent)" opacity="0.25" filter="url(#blur)"/>

  <!-- Secondary glow -->
  <circle cx="200" cy="550" r="200" fill="#4f46e5" opacity="0.15" filter="url(#blur)"/>

  <!-- Glass card -->
  <rect x="50" y="50" width="1100" height="530" rx="24"
        fill="url(#glass)" stroke="rgba(255,255,255,0.1)"/>

  <!-- Grid lines -->
  <g opacity="0.05">
    <line x1="0" y1="100" x2="1200" y2="100" stroke="#fff"/>
    <line x1="0" y1="300" x2="1200" y2="300" stroke="#fff"/>
    <line x1="0" y1="500" x2="1200" y2="500" stroke="#fff"/>
  </g>

  <!-- Category badge -->
  <rect x="100" y="100" rx="14" ry="14" width="260" height="48" fill="#4f46e5"/>
  <text x="130" y="132" fill="white" font-size="22" font-family="sans-serif">
    ${escapeXML(kategori)}
  </text>

  <!-- Title -->
  <text x="200" y="260" fill="white" font-size="60" font-weight="bold" font-family="sans-serif">
    ${wrapText(title, 26)}
  </text>

  <!-- Divider -->
  <rect x="100" y="420" width="300" height="4" fill="url(#accent)" opacity="0.8"/>

  <!-- Footer -->
  <text x="100" y="520" fill="#94a3b8" font-size="22" font-family="sans-serif">
    niadzgn.pages.dev
  </text>

  <!-- Mini badge -->
  <text x="980" y="560" fill="#94a3b8" font-size="18">
    ⚡ AutoBlog
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
