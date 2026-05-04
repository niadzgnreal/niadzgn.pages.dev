content: `

<div class="hero">
  <h1>🚀 Auto Blog Modern</h1>
  <p>Artikel SEO, tutorial, dan teknologi terbaru</p>
</div>

<!-- ======================
SEO CONTENT (WAJIB)
====================== -->
<section class="seo-content">
  <h2>Blog SEO & Teknologi Terlengkap</h2>
  <p>
    Website ini menyediakan berbagai artikel seputar SEO, digital marketing, 
    dan teknologi terbaru yang dirancang untuk membantu meningkatkan traffic 
    dan performa website Anda. Semua konten dibuat dengan struktur SEO modern 
    dan mudah dipahami.
  </p>
</section>

<!-- ======================
KATEGORI (INTERNAL LINK)
====================== -->
<section>
  <h2>Kategori Populer</h2>
  <div class="grid">
    <a class="card" href="/kategori/seo"><h3>SEO</h3></a>
    <a class="card" href="/kategori/blog"><h3>Blog</h3></a>
    <a class="card" href="/kategori/teknologi"><h3>Teknologi</h3></a>
  </div>
</section>

<!-- ======================
SEARCH
====================== -->
<input class="search" placeholder="Cari artikel...">
<div id="results"></div>

<!-- ======================
LATEST POSTS
====================== -->
<h2>Artikel Terbaru</h2>

<div class="grid">
  ${grid}
</div>

${pagination(page, totalPage)}

${searchScript()}
`
