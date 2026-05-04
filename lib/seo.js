export function seo({ title, description, slug }) {
  return `
<title>${title}</title>
<meta name="description" content="${description || title}">
<link rel="canonical" href="https://niadzgn.pages.dev/post/${slug || ""}">

<meta property="og:title" content="${title}">
<meta property="og:description" content="${description || title}">
<meta property="og:image" content="https://niadzgn.pages.dev/og/${slug || ""}">
<meta property="og:type" content="article">

<meta name="twitter:card" content="summary_large_image">

<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 "headline": "${title}"
}
</script>
`;
}
