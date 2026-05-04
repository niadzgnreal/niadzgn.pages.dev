export function layout({ seo, content }) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">
${seo}

<style>
body{font-family:sans-serif;max-width:900px;margin:auto;padding:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.card{border:1px solid #ddd;padding:10px}
</style>

</head>
<body>

<header>
  <a href="/">Home</a>
</header>

<main>
${content}
</main>

</body>
</html>`;
}
