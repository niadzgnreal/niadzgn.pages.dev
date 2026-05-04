import { SITE, url as buildUrl } from "./config";

export const layout = ({
  title = "Auto Blog",
  description = "Artikel terbaru",
  canonical = "",
  image = "",
  schema = "",
  robots = "",
  content = ""
}) => {

  const canonicalUrl = canonical || SITE.domain;
  const ogImage = image || buildUrl("/og/default");

  return new Response(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${escapeHTML(title)}</title>
<meta name="description" content="${escapeHTML(description)}">
<link rel="canonical" href="${canonicalUrl}">

${robots || ""}

<!-- OG -->
<meta property="og:title" content="${escapeHTML(title)}">
<meta property="og:description" content="${escapeHTML(description)}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:image" content="${ogImage}">
<meta property="og:type" content="article">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${ogImage}">

${schema || ""}

<style>
:root{
  --bg:#ffffff;
  --card:#ffffff;
  --text:#0f172a;
  --muted:#64748b;
  --primary:#4f46e5;
  --border:#e2e8f0;
}

html.dark{
  --bg:#0f172a;
  --card:#1e293b;
  --text:#e2e8f0;
  --muted:#94a3b8;
  --border:#334155;
}

*{box-sizing:border-box}

body{
  margin:0;
  font-family:system-ui,-apple-system,sans-serif;
  background:var(--bg);
  color:var(--text);
}

/* HEADER PREMIUM */
.header{
  position:sticky;
  top:0;
  backdrop-filter:blur(10px);
  background:rgba(255,255,255,0.8);
  border-bottom:1px solid var(--border);
  display:flex;
  justify-content:space-between;
  padding:12px 20px;
  z-index:10;
}
html.dark .header{
  background:rgba(15,23,42,0.7);
}

.logo{
  font-weight:700;
  color:var(--primary);
}

/* CONTAINER */
.container{
  max-width:1100px;
  margin:auto;
  padding:20px;
}

/* HERO PREMIUM */
.hero{
  padding:60px 20px;
  border-radius:16px;
  background:linear-gradient(135deg,#4f46e5,#6366f1);
  color:#fff;
  text-align:center;
  margin-bottom:30px;
}
.hero h1{
  font-size:32px;
  margin-bottom:10px;
}

/* GRID */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:20px;
}

/* CARD PREMIUM */
.card{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:14px;
  padding:14px;
  transition:.25s;
}
.card:hover{
  transform:translateY(-6px);
  box-shadow:0 10px 25px rgba(0,0,0,0.08);
}
.card img{
  width:100%;
  border-radius:10px;
}
.card h3{
  margin:10px 0;
  font-size:18px;
}

/* SEARCH */
.search{
  width:100%;
  padding:14px;
  border-radius:12px;
  border:1px solid var(--border);
  margin:20px 0;
}

/* POST */
.post{
  max-width:800px;
  margin:auto;
}
.post img{
  border-radius:14px;
  width:100%;
}
.post h1{
  font-size:30px;
  margin:15px 0;
}
.post-content{
  line-height:1.9;
  font-size:17px;
}

/* BREADCRUMB */
.breadcrumb{
  font-size:14px;
  margin-bottom:10px;
  color:var(--muted);
}
.breadcrumb a{
  color:var(--primary);
  text-decoration:none;
}

/* PAGINATION */
.pagination{
  display:flex;
  justify-content:center;
  gap:8px;
  margin:40px 0;
}
.pagination a{
  padding:8px 12px;
  border-radius:8px;
  border:1px solid var(--border);
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
  padding:40px;
  border-top:1px solid var(--border);
  margin-top:50px;
  color:var(--muted);
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
  © ${new Date().getFullYear()} ${SITE.name} — Built for speed ⚡
</footer>

<script>
function toggleTheme(){
  const html = document.documentElement;
  const btn = document.getElementById("themeBtn");
  html.classList.toggle("dark");

  if(html.classList.contains("dark")){
    localStorage.setItem("theme","dark");
    btn.textContent="☀️";
  } else {
    localStorage.setItem("theme","light");
    btn.textContent="🌙";
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  const saved = localStorage.getItem("theme");
  if(saved==="dark"){
    document.documentElement.classList.add("dark");
    document.getElementById("themeBtn").textContent="☀️";
  }
});
</script>

</body>
</html>`, {
    headers: { "content-type": "text/html;charset=UTF-8" }
  });
}

function escapeHTML(str=""){
  return String(str).replace(/[&<>"]/g, c =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c])
  );
}
