const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <!-- Background gradient -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>

    <!-- Accent gradient -->
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>

    <!-- Glow -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="20" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative circle -->
  <circle cx="1000" cy="100" r="200" fill="url(#accent)" opacity="0.2" filter="url(#glow)"/>

  <!-- Wave -->
  <path d="M0,500 C300,400 900,700 1200,550 L1200,630 L0,630 Z"
        fill="url(#accent)" opacity="0.15"/>

  <!-- Category badge -->
  <rect x="60" y="60" rx="12" ry="12" width="200" height="40" fill="#4f46e5"/>
  <text x="80" y="88" fill="white" font-size="20">
    ${escapeXML(kategori)}
  </text>

  <!-- Title -->
  <text x="60" y="250" fill="white" font-size="56" font-weight="bold">
    ${wrapText(title, 28)}
  </text>

  <!-- Footer -->
  <text x="60" y="580" fill="#94a3b8" font-size="22">
    niadzgn.pages.dev
  </text>

</svg>
`;
