export function layout({ title, description, content }) {
  return new Response(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">

<title>${title}</title>
<meta name="description" content="${description}">

<style>
:root{--bg:#fff;--text:#111;--primary:#4f46e5}
html.dark{--bg:#0f172a;--text:#e5e7eb}

body{margin:0;font-family:system-ui;background:var(--bg);color:var(--text)}

.header{display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid #ddd}
.logo{font-weight:bold;color:var(--primary)}

.container{max-width:1100px;margin:auto;padding:20px}

.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}

.card{border:1px solid #ddd;border-radius:12px;padding:10px}
.card img{width:100%;border-radius:10px}

.hero{margin:20px 0;padding:40px;border-radius:12px;text-align:center;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff}

.search{width:100%;padding:12px;border-radius:10px;border:1px solid #ddd;margin:20px 0}

.post img{width:100%;border-radius:12px}
.post-content{line-height:1.8}

</style>
</head>
<body>

<header class="header">
  <div class="logo">⚡ AutoBlog</div>
  <button onclick="toggleTheme()">🌙</button>
</header>

<main class="container">
${content}
</main>

<script>
function toggleTheme(){
  document.documentElement.classList.toggle("dark");
}
</script>

</body>
</html>`, {
    headers: { "content-type": "text/html" }
  });
}
