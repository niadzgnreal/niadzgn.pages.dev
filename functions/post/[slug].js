import { layout } from "../../lib/render"; 
import {
  SITE,
  canonical,
  ogImage as buildOg,
  sanitizeSlug,
  stripHTML,
  readingTime,
  postImage,
  cardImage
} from "../../lib/config";
import { getPosts, getPost } from "../../lib/api";

export async function onRequest(context){ try{ let { slug } = context.params; slug = sanitizeSlug(slug);

const post = await getPost(slug);

if(!post){
  return new Response("404 Not Found",{ status:404 });
}

const posts = await getPosts();

const related = posts.filter(p =>
  sanitizeSlug(p.slug) !== slug &&
  (p.kategori || "").toLowerCase() === (post.kategori || "").toLowerCase()
).slice(0,6);

post.content = autoLink(post.content, related);

const read = readingTime(post.content);

const desc = stripHTML(post.content).slice(0,160);

const breadcrumb = `
<nav class="breadcrumb">
<a href="/">Home</a> ›
<a href="/kategori/${sanitizeSlug(post.kategori)}">${post.kategori}</a> ›
<span>${post.title}</span>
</nav>
`;

const og = buildOg(slug);

const schema = `
<script type="application/ld+json">
{
"@context":"https://schema.org",
"@type":"BlogPosting",
"headline":"${post.title}",
"description":"${desc}",
"image":"${og}",
"mainEntityOfPage":"${canonical("/post/" + slug)}",
"author":{"@type":"Organization","name":"${SITE.name}"},
"publisher":{"@type":"Organization","name":"${SITE.name}"}
}
</script>

<script type="application/ld+json">
{
"@context":"https://schema.org",
"@type":"BreadcrumbList",
"itemListElement":[
{"@type":"ListItem","position":1,"name":"Home","item":"${SITE.domain}/"},
{"@type":"ListItem","position":2,"name":"${post.kategori}","item":"${SITE.domain}/kategori/${sanitizeSlug(post.kategori)}"},
{"@type":"ListItem","position":3,"name":"${post.title}"}
]
}
</script>
`;

return layout({
  title: post.title,
  description: desc,
  canonical: canonical("/post/" + slug),
  image: og,
  schema,

  content: `
  ${breadcrumb}

  <article class="post">

    ${postImage(og, post.title)}

    <h1>${post.title}</h1>

    <p>⏱ ${read} min read</p>

    <div class="post-content">
      ${post.content}
    </div>

  </article>

  <h3>Artikel Terkait</h3>

  <div class="grid">

    ${related.map(p => `
      <div class="card">
        <a href="/post/${sanitizeSlug(p.slug)}">
            ${cardImage(`/og/${sanitizeSlug(p.slug)}`, p.title)}
          <h4>${p.title}</h4>
        </a>
      </div>
    `).join("")}

  </div>
  `
});

}catch(e){
  return new Response("Error: " + e.message,{ status:500 });
}}

function autoLink(content, related=[]){ if(!content) return "";

let used = new Set();
let count = 0;
const MAX_LINK = 5;

return content.replace(/(<a[^>]*>.*?<\/a>)|>([^<]+)</gi,(match,linkPart,textPart)=>{

  if(linkPart){
    return linkPart;
  }

  let text = textPart;

  related.forEach(p=>{

    if(count >= MAX_LINK){
      return;
    }

    const keyword = p.title.split(" ").slice(0,2).join(" ").toLowerCase();

    if(!keyword || used.has(keyword)){
      return;
    }

    const safeSlug = sanitizeSlug(p.slug);

    const regex = new RegExp(`\\b${keyword}\\b`,"i");

    if(regex.test(text)){

      text = text.replace(
        regex,
        `<a href="/post/${safeSlug}">${keyword}</a>`
      );

      used.add(keyword);

      count++;
    }

  });

  return ">" + text + "<";
});
}
