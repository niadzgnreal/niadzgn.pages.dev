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
    } catch {}

    const title = post?.title || formatSlug(slug);
    const kategori = post?.kategori || "Blog";

    // ======================
    // SVG TEMPLATE
    // ======================
    const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4f46e5"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </linearGradient>
      </defs>

      <rect width="1200" height="630" fill="url(#bg)"/>

      <text x="60" y="100" fill="white" font-size="28" opacity="0.8">
        ${escapeXML(kategori)}
      </text>

      <text x="60" y="300" fill="white" font-size="56" font-weight="bold">
        ${wrapText(title, 30)}
      </text>

      <text x="60" y="580" fill="white" font-size="24" opacity="0.8">
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

function wrapText(text, maxLen) {
  const words = text.split(" ");
  let lines = [];
  let current = "";

  for (let w of words) {
    if ((current + w).length > maxLen) {
      lines.push(current);
      current = w + " ";
    } else {
      current += w + " ";
    }
  }
  lines.push(current);

  return lines.map((line, i) =>
    `<tspan x="60" dy="${i === 0 ? 0 : 60}">${escapeXML(line)}</tspan>`
  ).join("");
}
