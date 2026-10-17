// Writes everything search engines and AI tools read, from content.js:
//   • index.html, between the seo:head markers — title, description, link
//     preview tags and schema.org JSON-LD (the studio, its prices, the FAQ);
//   • index.html, between the seo:body markers — the page's content as plain
//     HTML. main.js draws the real page over it, but Google's first pass and
//     most AI crawlers (ChatGPT, Claude, Perplexity) don't run JavaScript, so
//     without this they would see an empty page;
//   • articles/<slug>.html — one real page per article in content.js;
//   • sitemap.xml, robots.txt and llms.txt (a plain summary for AI tools).
//
// GitHub Pages runs this on every push (.github/workflows/publish.yml), so an
// edit published from admin.html is rebuilt without anyone running it by hand.
//
// Run after every change to content.js:   node tools/build-seo.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "content.js"), "utf8"), sandbox);
const C = sandbox.window.CONTENT;

const th = (v) => (v == null ? "" : typeof v === "string" ? v : v.th || "");
const en = (v) => (v == null ? "" : typeof v === "string" ? v : v.en || v.th || "");
const list = (v) => (Array.isArray(v) ? v : []);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const baht = (n) => "฿" + Number(n || 0).toLocaleString("en-US");

const site = C.site || {};
const URL_ = (site.url || "").replace(/\/?$/, "/");
const abs = (p) => (/^https?:/.test(p) ? p : URL_ + p.replace(/^\//, ""));
const name = site.name || "CAN DESIGN WEB STUDIO";
const seo = C.seo || {};
const title = th(seo.title) || name;
const desc = th(seo.description);
const samples = list(C.demos && C.demos.items).filter((d) => !d.real);
const plans = list(C.pricing && C.pricing.plans);
const faq = list(C.why && C.why.items);
const sameAs = [site.facebook].filter(Boolean);
const contactPoints = [];
if (site.phone) contactPoints.push({ "@type": "ContactPoint", telephone: site.phone, name: th(site.phoneName) || undefined, contactType: "customer service", availableLanguage: ["th", "en"] });
if (site.email) contactPoints.push({ "@type": "ContactPoint", email: site.email, contactType: "customer service", availableLanguage: ["th", "en"] });

// ---------- JSON-LD
const graph = [
  {
    "@type": "ProfessionalService",
    "@id": URL_ + "#studio",
    name,
    alternateName: ["CAN design web studio", "CAN Design", "แคน ดีไซน์ เว็บ สตูดิโอ"],
    url: URL_,
    logo: abs("assets/logo-192.png"),
    image: abs("brand/facebook-cover.png"),
    description: desc,
    slogan: th(C.hero && C.hero.title1) + " " + th(C.hero && C.hero.title2),
    areaServed: { "@type": "Country", name: "Thailand" },
    knowsLanguage: ["th", "en"],
    priceRange: plans.length ? baht(Math.min(...plans.map((p) => p.price))) + "–" + baht(Math.max(...plans.map((p) => p.price))) + "+" : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    contactPoint: contactPoints.length ? contactPoints : undefined,
    knowsAbout: ["รับทำเว็บไซต์", "ออกแบบเว็บไซต์", "เว็บร้านค้าออนไลน์", "เว็บไซต์ธุรกิจ", "ระบบหลังบ้าน", "LINE Official Account", "Web design", "E-commerce website", "Bilingual Thai–English websites"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: th(C.pricing && C.pricing.title) || "ราคา",
      itemListElement: plans.map((p) => ({
        "@type": "Offer",
        name: th(p.name),
        description: [th(p.note)].concat(list(p.items).map(th)).join(" · "),
        price: p.price,
        priceCurrency: "THB",
        priceSpecification: p.from ? { "@type": "PriceSpecification", minPrice: p.price, priceCurrency: "THB" } : undefined,
        itemOffered: { "@type": "Service", name: "รับทำเว็บไซต์ — " + th(p.name) },
      })),
    },
  },
  { "@type": "WebSite", "@id": URL_ + "#website", url: URL_, name, inLanguage: ["th", "en"], publisher: { "@id": URL_ + "#studio" } },
];
if (faq.length) {
  graph.push({
    "@type": "FAQPage",
    "@id": URL_ + "#faq",
    inLanguage: "th",
    mainEntity: faq.map((q) => ({ "@type": "Question", name: th(q.q), acceptedAnswer: { "@type": "Answer", text: th(q.a) } })),
  });
}
const jsonld = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 1).replace(/</g, "\\u003c");

const head = `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${esc(URL_)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(URL_)}">
<meta property="og:image" content="${esc(abs("brand/facebook-cover.png"))}">
<meta property="og:image:width" content="1640">
<meta property="og:image:height" content="624">
<meta property="og:locale" content="th_TH">
<meta property="og:locale:alternate" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(abs("brand/facebook-cover.png"))}">
<meta name="theme-color" content="#221b33">
<script type="application/ld+json">
${jsonld}
</script>`;

// ---------- the plain-HTML copy of the page
const h = [];
const hero = C.hero || {};
h.push(`<div data-static>`);
h.push(`<section><p>${esc(name)} · ${esc(th(hero.kicker))}</p><h1>${esc(th(hero.title1))} ${esc(th(hero.title2))}</h1><p>${esc(th(hero.lead))}</p></section>`);
const pains = C.pains || {};
if (list(pains.items).length) {
  h.push(`<section><h2>${esc(th(pains.title))}</h2><p>${esc(th(pains.note))}</p><ul>${list(pains.items).map((i) => `<li><strong>${esc(th(i.problem))}</strong> — ${esc(th(i.answer))}</li>`).join("")}</ul></section>`);
}
const about = C.about || {};
if (th(about.text)) {
  h.push(`<section id="about-text"><h2>${esc(th(about.title))}</h2><p>${esc(th(about.text))}</p><ul>${list(about.facts).map((f) => `<li>${esc(th(f))}</li>`).join("")}</ul></section>`);
}
const work = C.work || {};
if (list(work.items).length) {
  h.push(`<section><h2>${esc(th(work.title))}</h2>${list(work.items).map((w) => `<article><h3>${esc(w.name)}</h3><p>${esc(th(w.type))}</p><p>${esc(th(w.desc))}</p><ul>${list(w.points).map((p) => `<li>${esc(th(p))}</li>`).join("")}</ul>${w.url ? `<a href="${esc(w.url)}">${esc(th(w.linkText) || w.url)}</a>` : ""}</article>`).join("")}</section>`);
}
if (samples.length) {
  h.push(`<section><h2>${esc(th(C.demos.title))}</h2><p>${esc(th(C.demos.note))}</p><ul>${samples.map((d) => `<li><a href="${esc(d.link)}">${esc(th(d.title))}</a> — ${esc(th(d.desc))}</li>`).join("")}</ul></section>`);
}
const svc = C.services || {};
if (list(svc.items).length) {
  h.push(`<section><h2>${esc(th(svc.title))}</h2><ul>${list(svc.items).map((s) => `<li><strong>${esc(th(s.title))}</strong> — ${esc(th(s.desc))}</li>`).join("")}</ul><h3>${esc(th(svc.stepsTitle))}</h3><ol>${list(svc.steps).map((s) => `<li><strong>${esc(th(s.title))}</strong> — ${esc(th(s.desc))}</li>`).join("")}</ol></section>`);
}
if (faq.length) {
  h.push(`<section><h2>${esc(th(C.why.title))}</h2>${faq.map((q) => `<h3>${esc(th(q.q))}</h3><p>${esc(th(q.a))}</p>`).join("")}</section>`);
}
if (plans.length) {
  h.push(`<section><h2>${esc(th(C.pricing.title))}</h2><p>${esc(th(C.pricing.note))}</p>${plans.map((p) => `<h3>${esc(th(p.name))} — ${p.from ? "เริ่มต้น " : ""}${baht(p.price)}</h3><p>${esc(th(p.note))}</p><ul>${list(p.items).map((i) => `<li>${esc(th(i))}</li>`).join("")}</ul>`).join("")}</section>`);
}
const arts = list(C.articles && C.articles.items).filter((a) => a.slug);
if (arts.length) {
  h.push(`<section><h2><a href="articles/">${esc(th(C.articles.title))}</a></h2><ul>${arts.map((a) => `<li><a href="articles/${esc(a.slug)}.html">${esc(th(a.title))}</a> — ${esc(th(a.summary))}</li>`).join("")}</ul></section>`);
}
const contact = C.contact || {};
const links = [];
if (site.facebook) links.push(`<li>Facebook: <a href="${esc(site.facebook)}">${esc(site.facebookName || name)}</a></li>`);
if (site.lineId) links.push(`<li>LINE: ${esc(site.lineId)}</li>`);
if (site.phone) links.push(`<li>โทร: ${esc(site.phone)}${th(site.phoneName) ? " (" + esc(th(site.phoneName)) + ")" : ""}</li>`);
if (site.email) links.push(`<li>อีเมล: ${esc(site.email)}</li>`);
h.push(`<section><h2>${esc(th(contact.title))}</h2><p>${esc(th(contact.lead))}</p><ul>${links.join("")}</ul></section>`);
// a short English version, for searches in English
h.push(`<section lang="en"><h2>${esc(en(about.title) || name)}</h2><p>${esc(en(about.text) || en(seo.description))}</p><p>${esc(en(seo.description))}</p></section>`);
h.push(`</div>`);
const body = h.join("\n");

// ---------- sitemap, robots, llms.txt
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${URL_}</loc><lastmod>${today}</lastmod></url>
${arts.length ? `  <url><loc>${URL_}articles/</loc><lastmod>${today}</lastmod></url>
` : ""}${arts.map((a) => `  <url><loc>${URL_}articles/${a.slug}.html</loc><lastmod>${a.date || today}</lastmod></url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `# Everyone, including AI search tools, may read this site.
User-agent: *
Allow: /

Sitemap: ${URL_}sitemap.xml
`);
const llms = [
  `# ${name}`,
  ``,
  `> ${en(seo.description)}`,
  ``,
  `${th(seo.description)}`,
  ``,
  `Full text of every article: ${URL_}llms-full.txt`,
  ``,
  `## About`,
  en(about.text),
  ``,
  th(about.text),
  ``,
  ...list(about.facts).map((f) => `- ${en(f)} / ${th(f)}`),
  ``,
  `## Real work`,
  ...list(work.items).map((w) => `- ${w.name} (${en(w.type)}): ${en(w.desc)}${w.url ? ` — ${abs(w.url)}` : ""}`),
  ``,
  `## Services`,
  ...list(svc.items).map((s) => `- ${en(s.title)}: ${en(s.desc)}`),
  ``,
  `## Pricing (Thai baht)`,
  ...plans.map((p) => `- ${en(p.name)}: ${p.from ? "from " : ""}${baht(p.price)} — ${en(p.note)}. ${list(p.items).map(en).join("; ")}`),
  ``,
  `## Sample sites to try (${samples.length})`,
  ...samples.map((d) => `- [${en(d.title)}](${abs(d.link)}): ${en(d.desc)}`),
  ``,
  ...(arts.length ? [`## Articles`, ...arts.map((a) => `- [${en(a.title)}](${URL_}articles/${a.slug}.html): ${en(a.summary)}`), ``] : []),
  `## Questions`,
  ...faq.flatMap((q) => [`### ${en(q.q)}`, en(q.a), ``]),
  `## Contact`,
  site.facebook ? `- Facebook (${site.facebookName || name}): ${site.facebook}` : null,
  site.lineId ? `- LINE: ${site.lineId}` : null,
  site.phone ? `- Phone: ${site.phone}${en(site.phoneName) ? ` (${en(site.phoneName)})` : ""}` : null,
  site.email ? `- Email: ${site.email}` : null,
  `- Website: ${URL_}`,
  ``,
].filter((l) => l !== null);
fs.writeFileSync(path.join(ROOT, "llms.txt"), llms.join("\n"));
const full = llms.concat([
  "",
  "## Articles in full",
  "",
  ...arts.flatMap((a) => [`### ${th(a.title)}`, `${URL_}articles/${a.slug}.html`, "", th(a.body), "", `#### ${en(a.title)}`, "", en(a.body), ""]),
]);
fs.writeFileSync(path.join(ROOT, "llms-full.txt"), full.join("\n"));
// ---------- the contact bar at the top of every generated page (main.js draws
// the same bar on the home page)
const ICON = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg>',
  line: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5C6.2 2.5 1.5 6.3 1.5 11c0 4.2 3.7 7.7 8.8 8.4.34.07.8.23.92.52.1.27.07.69.03.96l-.15.9c-.04.27-.21 1.05.92.57 1.13-.47 6.1-3.6 8.33-6.16C21.95 14.47 22.5 12.8 22.5 11c0-4.7-4.7-8.5-10.5-8.5z"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.4 7H19.6zM4 8.5V17h16V8.5l-7.4 5.1a1 1 0 0 1-1.2 0z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.13.38 2.34.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
};
function topbarHtml() {
  const items = [];
  if (site.facebook) items.push(["facebook", "Facebook", site.facebookName || name, site.facebook]);
  if (site.lineId) {
    const id = site.lineId.trim();
    items.push(["line", "LINE", id, "https://line.me/R/ti/p/" + encodeURIComponent(id.charAt(0) === "@" ? id : "~" + id)]);
  }
  if (site.phone) items.push(["phone", "โทร", site.phone, "tel:" + site.phone.replace(/[^0-9+]/g, "")]);
  if (site.email) items.push(["email", "อีเมล", site.email, "mailto:" + site.email]);
  if (!items.length) return "";
  const text = C.ui && C.ui.topBar;
  return `<div class="topbar"><div class="wrap topbar-in"><span class="topbar-text"><span data-lang="th">${esc(th(text) || "ปรึกษาฟรี ทักมาได้เลย")}</span><span data-lang="en">${esc(en(text) || "Free advice — message us")}</span></span><div class="topbar-links">${items
    .map(([k, label, value, href]) => `<a class="tb tb-${k}" href="${esc(href)}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}><span class="tb-icon">${ICON[k]}</span><span class="tb-label">${esc(label)}</span><b class="tb-value">${esc(value)}${k === "phone" && th(site.phoneName) ? `<span class="tb-extra"> · ${esc(th(site.phoneName))}</span>` : ""}</b></a>`)
    .join("")}</div></div></div>`;
}

// ---------- one page per article
// Body text: paragraphs separated by a blank line; a line starting "## " is a heading.
function prose(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => (block.startsWith("## ") ? `<h2>${esc(block.slice(3))}</h2>` : `<p>${esc(block).replace(/\n/g, "<br>")}</p>`))
    .join("\n");
}
const artDir = path.join(ROOT, "articles");
fs.mkdirSync(artDir, { recursive: true });
// an article deleted in admin loses its page too
for (const f of fs.readdirSync(artDir)) if (f.endsWith(".html") && f !== "index.html" && !arts.some((a) => a.slug + ".html" === f)) fs.unlinkSync(path.join(artDir, f));
const fmtDate = (d, locale) => (d ? new Date(d + "T00:00:00Z").toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "");
const quote = C.ui && C.ui.quoteButton;
for (const a of arts) {
  const url = `${URL_}articles/${a.slug}.html`;
  const img = a.image ? abs(a.image) : abs("brand/facebook-cover.png");
  const crumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name, item: URL_ },
      { "@type": "ListItem", position: 2, name: th(C.articles.title), item: `${URL_}articles/` },
      { "@type": "ListItem", position: 3, name: th(a.title), item: url },
    ],
  };
  const ld = JSON.stringify([crumbs, {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    dateModified: a.updated || a.date || undefined,
    headline: th(a.title),
    alternativeHeadline: en(a.title),
    description: th(a.summary),
    datePublished: a.date || undefined,
    inLanguage: "th",
    image: img,
    url,
    mainEntityOfPage: url,
    author: { "@type": "Organization", "@id": URL_ + "#studio", name, url: URL_ },
    publisher: { "@type": "Organization", name, logo: { "@type": "ImageObject", url: abs("assets/logo-192.png") } },
  }].map((x) => Object.assign({ "@context": "https://schema.org" }, x))).replace(/</g, "\\u003c");
  const version = (lang, get, date) => `<div class="article-lang" data-lang="${lang}"${lang === "en" ? ' lang="en"' : ""}>
    <p class="article-date">${esc(date)}</p>
    <h1>${esc(get(a.title))}</h1>
    <p class="article-lead">${esc(get(a.summary))}</p>
    ${a.image ? `<img class="article-hero" src="../${esc(a.image)}" alt="">` : ""}
    <div class="article-body">
${prose(get(a.body))}
    </div>
  </div>`;
  const page = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.className += " js"; try { if (localStorage.getItem("demo-lang") === "en") document.documentElement.className += " en"; } catch (e) {}</script>
<!-- Written by tools/build-seo.js from content.js — edit the article in admin.html, not here. -->
<title>${esc(th(a.title))} | ${esc(name)}</title>
<meta name="description" content="${esc(th(a.summary))}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc(name)}">
<meta property="og:title" content="${esc(th(a.title))}">
<meta property="og:description" content="${esc(th(a.summary))}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#221b33">
<link rel="icon" href="../assets/favicon-64.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Fahkwang:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fahkwang:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"></noscript>
<link rel="stylesheet" href="../styles.css">
<script type="application/ld+json">${ld}</script>
</head>
<body class="article-page">
<header class="site-header">
  ${topbarHtml()}
  <div class="wrap bar">
    <a class="brand" href="../index.html" aria-label="${esc(name)}"><img src="../assets/logo-96.webp" width="44" height="44" alt=""><span>${esc(name)}</span></a>
    <nav>
      <a class="nav-plain" href="index.html"><span data-lang="th">${esc(th(C.articles.menu || C.articles.title))}</span><span data-lang="en">${esc(en(C.articles.menu || C.articles.title))}</span></a>
      <span class="lang" id="lang"><button type="button" data-l="th">ไทย</button><button type="button" data-l="en">EN</button></span>
      <a class="nav-cta" href="../index.html#contact"><span data-lang="th">${esc(th(quote) || "ขอใบเสนอราคา")}</span><span data-lang="en">${esc(en(quote) || "Get a quote")}</span></a>
    </nav>
  </div>
</header>
<main class="wrap article-wrap">
  <a class="article-back" href="index.html"><span data-lang="th">← บทความทั้งหมด</span><span data-lang="en">← All articles</span></a>
  ${version("th", th, fmtDate(a.date, "th-TH"))}
  ${version("en", en, fmtDate(a.date, "en-GB"))}
  <div class="article-cta">
    <p data-lang="th">อยากได้เว็บไซต์ให้ร้านของคุณ? ลองใช้เว็บตัวอย่างก่อนจ้างได้ที่หน้าแรก</p>
    <p data-lang="en">Want a website for your shop? Try the sample sites on our home page before you hire.</p>
    <a class="btn" href="../index.html#demos"><span data-lang="th">ดูเว็บตัวอย่าง</span><span data-lang="en">See the samples</span></a>
    ${site.facebook ? `<a class="btn btn-ghost" href="${esc(site.facebook)}" target="_blank" rel="noopener">Facebook · ${esc(site.facebookName || name)}</a>` : ""}
  </div>
</main>
<footer class="site-footer"><div class="wrap"><div class="footer-bottom">© ${esc(name)}</div></div></footer>
<script>
var isEn = document.documentElement.classList.contains("en");
if (isEn) document.documentElement.lang = "en";
document.querySelectorAll("#lang button").forEach(function (b) {
  b.setAttribute("aria-pressed", String(isEn === (b.dataset.l === "en")));
  b.onclick = function () { try { localStorage.setItem("demo-lang", b.dataset.l); } catch (e) {} location.reload(); };
});
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(artDir, a.slug + ".html"), page);
}

// ---------- articles/index.html: every article, newest first
if (arts.length) {
  const sorted = arts.map((a, i) => ({ a, i })).sort((x, y) => String(y.a.date || "").localeCompare(String(x.a.date || "")) || y.i - x.i).map((x) => x.a);
  const card = (a, get, locale) => `<a class="article-card" href="${esc(a.slug)}.html">
      <div class="article-pic">${a.image ? `<img src="../${esc(a.image)}" alt="" loading="lazy">` : `<img src="../assets/logo-192.webp" width="72" height="72" alt="">`}</div>
      <div class="article-text"><time class="article-date" datetime="${esc(a.date || "")}">${esc(fmtDate(a.date, locale))}</time><h3>${esc(get(a.title))}</h3><p>${esc(get(a.summary))}</p><span class="demo-go">${esc(get(C.ui && C.ui.readMore) || "อ่านต่อ →")}</span></div>
    </a>`;
  const listUrl = `${URL_}articles/`;
  const ldList = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: th(C.articles.title) + " | " + name,
    url: listUrl,
    inLanguage: "th",
    mainEntity: { "@type": "ItemList", itemListElement: sorted.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: `${URL_}articles/${a.slug}.html`, name: th(a.title) })) },
  }).replace(/</g, "\\u003c");
  const indexPage = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.className += " js"; try { if (localStorage.getItem("demo-lang") === "en") document.documentElement.className += " en"; } catch (e) {}</script>
<!-- Written by tools/build-seo.js from content.js. -->
<title>${esc(th(C.articles.title))} | ${esc(name)}</title>
<meta name="description" content="${esc(th(C.articles.note))}">
<link rel="canonical" href="${esc(listUrl)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(name)}">
<meta property="og:title" content="${esc(th(C.articles.title))} | ${esc(name)}">
<meta property="og:description" content="${esc(th(C.articles.note))}">
<meta property="og:url" content="${esc(listUrl)}">
<meta property="og:image" content="${esc(abs("brand/facebook-cover.png"))}">
<meta name="theme-color" content="#221b33">
<link rel="icon" href="../assets/favicon-64.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Fahkwang:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fahkwang:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"></noscript>
<link rel="stylesheet" href="../styles.css">
<script type="application/ld+json">${ldList}</script>
</head>
<body class="article-page article-index">
<header class="site-header">
  ${topbarHtml()}
  <div class="wrap bar">
    <a class="brand" href="../index.html" aria-label="${esc(name)}"><img src="../assets/logo-96.webp" width="44" height="44" alt=""><span>${esc(name)}</span></a>
    <nav>
      <a class="nav-plain" href="index.html"><span data-lang="th">${esc(th(C.articles.menu || C.articles.title))}</span><span data-lang="en">${esc(en(C.articles.menu || C.articles.title))}</span></a>
      <span class="lang" id="lang"><button type="button" data-l="th">ไทย</button><button type="button" data-l="en">EN</button></span>
      <a class="nav-cta" href="../index.html#contact"><span data-lang="th">${esc(th(quote) || "ขอใบเสนอราคา")}</span><span data-lang="en">${esc(en(quote) || "Get a quote")}</span></a>
    </nav>
  </div>
</header>
<main class="wrap" style="padding-top:48px;padding-bottom:96px">
  <a class="article-back" href="../index.html"><span data-lang="th">← หน้าแรก</span><span data-lang="en">← Home</span></a>
  <div class="article-list-head" data-lang="th"><p class="eyebrow">${sorted.length}</p><h1>${esc(th(C.articles.title))}</h1><p>${esc(th(C.articles.note))}</p></div>
  <div class="article-list-head" data-lang="en" lang="en"><p class="eyebrow">${sorted.length}</p><h1>${esc(en(C.articles.title))}</h1><p>${esc(en(C.articles.note))}</p></div>
  <div class="article-grid" data-lang="th">
    ${sorted.map((a) => card(a, th, "th-TH")).join("\n    ")}
  </div>
  <div class="article-grid" data-lang="en" lang="en">
    ${sorted.map((a) => card(a, en, "en-GB")).join("\n    ")}
  </div>
</main>
<footer class="site-footer"><div class="wrap"><div class="footer-bottom">© ${esc(name)}</div></div></footer>
<script>
var isEn = document.documentElement.classList.contains("en");
if (isEn) document.documentElement.lang = "en";
document.querySelectorAll("#lang button").forEach(function (b) {
  b.setAttribute("aria-pressed", String(isEn === (b.dataset.l === "en")));
  b.onclick = function () { try { localStorage.setItem("demo-lang", b.dataset.l); } catch (e) {} location.reload(); };
});
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(artDir, "index.html"), indexPage);
}

// ---------- write index.html
const indexPath = path.join(ROOT, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
function between(src, tag, inner) {
  const re = new RegExp(`(<!-- ${tag}:start -->)[\\s\\S]*?(<!-- ${tag}:end -->)`);
  if (!re.test(src)) throw new Error(`index.html has no ${tag} markers`);
  return src.replace(re, `$1\n${inner}\n$2`);
}
html = between(html, "seo:head", head);
html = between(html, "seo:body", body);
html = between(html, "seo:topbar", topbarHtml());
fs.writeFileSync(indexPath, html);

console.log("index.html, sitemap.xml, robots.txt and llms.txt written for", URL_);
