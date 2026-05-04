export function layout({
  title = "Auto Blog",
  description = "Artikel terbaru",
  canonical = "",
  image = "",
  type = "website",
  schema = "",
  content = ""
}) {

  const url = canonical || "https://niadzgn.pages.dev";
  const ogImage = image || "https://niadzgn.pages.dev/og/default";

  return new Response(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${escapeHTML(title)}</title>
<meta name="description" content="${escapeHTML(description)}">

<link rel="canonical" href="${url}">

<!-- Open Graph -->
<meta property="og:title" content="${escapeHTML(title)}">
<meta property="og:description" content="${escapeHTML(description)}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHTML(title)}">
<meta name="twitter:description" content="${escapeHTML(description)}">
<meta name="twitter:image" content="${ogImage}">

${schema || ""}

<style>
:root{
  --bg:#ffffff;
  --text:#111;
  --primary:#4f46e5;
  --border:#e5e7eb;
}

html.dark{
  --bg:#0f172a;
  --text:#e5e7eb;
  --border:#1f2937;
}

*{box-sizing:border-box}

body{
  margin:0;
  font-family:system-ui,-apple-system,sans-serif;
  background:var(--bg);
  color:var(--text);
}

/* HEADER */
.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:12px 16px;
  border-bottom:1px solid var(--border);
}
.logo{
  font-weight:bold;
  color:var(--primary);
}

/* CONTAINER */
.container{
  max-width:1100px;
  margin:auto;
  padding:20px;
}

/* HERO */
.hero{
  margin:20px 0;
  padding:40px;
  border-radius:12px;
  text-align:center;
  background:linear-gradient(135deg,#4f46e5,#6366f1);
  color:#fff;
}

/* GRID */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:20px;
}

/* CARD */
.card{
  border:1px solid var(--border);
  border-radius:12px;
  padding:10px;
  transition:.2s;
  background:var(--bg);
}
.card:hover{
  transform:translateY(-5px);
}
.card img{
  width:100%;
  border-radius:10px;
}

/* SEARCH */
.search{
  width:100%;
  padding:12px;
  border-radius:10px;
  border:1px solid var(--border);
  margin:20px 0;
}

/* SEARCH RESULT */
.search-item{
  display:block;
  padding:10px;
  border:1px solid var(--border);
  border-radius:8px;
  margin-bottom:8px;
  text-decoration:none;
  color:var(--text);
}

/* POST */
.post img{
  width:100%;
  border-radius:12px;
}
.post h1{
  margin:15px 0;
}
.post-content{
  line-height:1.8;
  font-size:16px;
}

/* BREADCRUMB */
.breadcrumb{
  font-size:14px;
  margin-bottom:15px;
}
.breadcrumb a{
  text-decoration:none;
  color:var(--primary);
}

/* PAGINATION */
.pagination{
  display:flex;
  gap:8px;
  justify-content:center;
  margin:30px 0;
  flex-wrap:wrap;
}
.pagination a{
  padding:8px 12px;
  border:1px solid var(--border);
  border-radius:8px;
  text-decoration:none;
  color:var(--text);
}
.pagination a.active{
  background:var(--primary);
  color:#fff;
}

/* FOOTER */
.footer{
  text-align:center;
  padding:30px;
  border-top:1px solid var(--border);
  margin-top:40px;
  font-size:14px;
}
.seo-content{
  margin:30px 0;
  line-height:1.8;
}
</style>
</head>

<body>

<header class="header">
  <div class="logo">⚡ AutoBlog</div>
  <button onclick="toggleTheme()" id="themeBtn">🌙</button>
</header>

<main class="container">
${content}
</main>

<footer class="footer">
  © ${new Date().getFullYear()} AutoBlog
</footer>

<script>
// ======================
// THEME TOGGLE + SAVE
// ======================
function toggleTheme(){
  const html = document.documentElement;
  const btn = document.getElementById("themeBtn");

  html.classList.toggle("dark");

  if(html.classList.contains("dark")){
    localStorage.setItem("theme","dark");
    btn.textContent = "☀️";
  } else {
    localStorage.setItem("theme","light");
    btn.textContent = "🌙";
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  const saved = localStorage.getItem("theme");
  const btn = document.getElementById("themeBtn");

  if(saved === "dark"){
    document.documentElement.classList.add("dark");
    if(btn) btn.textContent = "☀️";
  }
});
</script>

</body>
</html>`, {
    headers: { "content-type": "text/html; charset=UTF-8" }
  });
}


// ======================
// SAFE HTML ESCAPE
// ======================
function escapeHTML(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
