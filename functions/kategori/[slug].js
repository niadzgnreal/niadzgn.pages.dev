import { layout } from "../../lib/render";import { canonical, sanitizeSlug, cardImage } from "../../lib/config";import { getByKategori } from "../../lib/api";

export async function onRequest(context){

const { slug } = context.params;

const safeSlug = sanitizeSlug(slug);

const reqUrl = new URL(context.request.url);

const page = parseInt(reqUrl.searchParams.get("page")) || 1;

// ======================
// DATA
// ======================
const filtered = await getByKategori(safeSlug);

// ======================
// PAGINATION
// ======================
const perPage = 12;

const totalPage = Math.ceil(filtered.length / perPage);

const start = (page - 1) * perPage;

const currentPosts = filtered.slice(start,start + perPage);

// ======================
// GRID
// ======================
const grid = currentPosts.map(p => `
<div class="card">
<a href="/${sanitizeSlug(p.kategori)}/${sanitizeSlug(p.slug)}">
${cardImage(`/og/${sanitizeSlug(p.slug)}`,p.title)}
<h3>${p.title}</h3>
</a>
</div>
`).join("");

// ======================
// RENDER
// ======================
return layout({
title:"Kategori " + safeSlug,
description:"Kategori " + safeSlug,

canonical: canonical(
page > 1
? "/kategori/" + safeSlug + "?page=" + page
: "/kategori/" + safeSlug
),

content:`
<h1>Kategori: ${safeSlug}</h1>

<div class="grid">
${grid}
</div>

${pagination(page,totalPage,safeSlug)}
`
});

}

// ======================
// PAGINATION
// ======================
function pagination(current,total,slug){

if(total <= 1) return "";

let html = `<div class="pagination">`;

const group = Math.floor((current - 1) / 5);

const start = group * 5 + 1;

const end = Math.min(start + 4,total);

if(start > 1){
html += `<a href="/kategori/${slug}?page=${start - 1}">«</a>`;
}

for(let i = start; i <= end; i++){

html += `
<a
href="/kategori/${slug}?page=${i}"
class="${i === current ? "active" : ""}"
>
${i}
</a>
`;
}

if(end < total){
html += `<a href="/kategori/${slug}?page=${end + 1}">»</a>`;
}

html += `</div>`;

return html;

}
