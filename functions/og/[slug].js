export async function onRequest(context) {
  const { slug } = context.params;

  return new Response(
`<svg width="1200" height="630">
<rect width="100%" height="100%" fill="#4f46e5"/>
<text x="50%" y="50%" fill="white" font-size="40" text-anchor="middle">
${slug}
</text>
</svg>`,
  { headers: { "content-type": "image/svg+xml" } }
  );
}
