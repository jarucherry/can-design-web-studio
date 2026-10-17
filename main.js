// Draws the whole page from content.js — every heading, card and price on the
// site is data the owner edits in admin.html, in Thai and English.
//
// Two things decide what is shown:
//   • language — "th" or "en", remembered under the same key the demo sites
//     use, so a visitor who picks English stays in English inside a demo;
//   • a draft — admin.html keeps unsaved edits in this browser only. When one
//     exists the page shows it, with a strip saying so, so the owner can
//     preview before saving content.js. Visitors never see a draft.
(function () {
  var LANG_KEY = "demo-lang";
  var DRAFT_KEY = "cherrybyte-draft";
  var LOGO = "assets/logo-192.webp";
  var lang = "th";
  var data = window.CONTENT || {};
  var isDraft = false;
  try {
    if (localStorage.getItem(LANG_KEY) === "en") lang = "en";
    var draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      data = JSON.parse(draft);
      isDraft = true;
    }
  } catch (e) {}
  var en = lang === "en";
  document.documentElement.lang = lang;

  // A bilingual field is { th, en }; plain strings are the same in both.
  // Blank English falls back to the Thai text.
  function L(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return (en && value.en) || value.th || "";
  }
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function list(items) {
    return Array.isArray(items) ? items : [];
  }
  function logo(size, className) {
    var img = el("img", className);
    img.src = LOGO;
    img.width = size;
    img.height = size;
    img.alt = "";
    return img;
  }
  function external(a) {
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  }

  var site = data.site || {};
  // Short labels (buttons, badges) — editable in admin.html's "ข้อความอื่น ๆ" tab.
  var ui = data.ui || {};
  function U(key, th, enText) {
    return L(ui[key]) || (en ? enText : th);
  }
  var app = document.getElementById("app");
  // index.html carries a plain-HTML copy of this content for search engines
  // and AI tools that don't run JavaScript (written by tools/build-seo.js).
  // The page drawn here replaces it.
  document.querySelectorAll("[data-static]").forEach(function (node) {
    node.remove();
  });
  var nav = document.getElementById("nav");
  var menu = [];
  var count = 0;
  // "01 — Real work" above each section title, and the title itself; the
  // section's note sits beside it on wide screens.
  function sectionHead(title, note) {
    count += 1;
    var head = el("div", "section-head");
    var left = el("div");
    left.append(el("p", "eyebrow", (count < 10 ? "0" : "") + count), el("h2", "", title));
    head.appendChild(left);
    if (note) head.appendChild(el("p", "section-note", note));
    return head;
  }
  function addMenu(id, section) {
    if (section) menu.push({ id: id, text: L(section.menu || section.title) });
  }

  // ---------- header
  document.querySelectorAll("[data-site-name]").forEach(function (node) {
    node.textContent = site.name || "";
  });
  var seo = data.seo || {};
  document.title = L(seo.title) || (site.name ? site.name + " — " : "") + (en ? "Websites for shops and businesses" : "รับทำเว็บไซต์ร้านค้าและธุรกิจ");
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && L(seo.description)) metaDesc.content = L(seo.description);

  // ---------- hero
  var hero = data.hero || {};
  var work = data.work || {};
  var demos = data.demos || {};
  var heroBox = el("section", "hero");
  var heroWrap = el("div", "wrap hero-grid");
  var heroText = el("div", "hero-text");
  var kicker = el("p", "kicker");
  kicker.append(el("i"), L(hero.kicker));
  var h1 = el("h1");
  h1.append(el("span", "line plain", L(hero.title1)), el("br"), el("span", "line", L(hero.title2)));
  heroText.append(kicker, h1, el("p", "lead", L(hero.lead)));
  var actions = el("div", "hero-actions");
  var b1 = el("a", "btn", L(hero.button1));
  b1.href = "#demos";
  var b2 = el("a", "btn btn-ghost", L(hero.button2));
  b2.href = "#pricing";
  actions.append(b1, b2);
  heroText.appendChild(actions);
  if (list(hero.proof).length) {
    var proof = el("ul", "proof");
    list(hero.proof).forEach(function (item) {
      var li = el("li");
      li.append(el("b", "", item.big), el("span", "", L(item.text)));
      proof.appendChild(li);
    });
    heroText.appendChild(proof);
  }
  // The picture: the real client site in a browser frame, the logo as a seal.
  var art = el("div", "hero-art");
  art.setAttribute("aria-hidden", "true");
  var firstWork = list(work.items)[0];
  var frame = el("div", "browser");
  var bar = el("div", "browser-bar");
  bar.append(el("i"), el("i"), el("i"), el("span", "", firstWork && firstWork.url ? firstWork.url.replace(/^https?:\/\//, "") : ""));
  frame.appendChild(bar);
  if (firstWork && firstWork.image) {
    var shotImg = el("img");
    shotImg.src = firstWork.image;
    shotImg.alt = "";
    frame.appendChild(shotImg);
  }
  var seal = el("img", "seal");
  seal.src = "assets/logo-640.webp";
  seal.alt = "";
  art.append(frame, seal);
  var samples = list(demos.items).filter(function (item) { return !item.real; });
  if (samples.length) {
    var chip = el("div", "chip");
    chip.append(el("b", "", String(samples.length)), el("span", "", U("sampleChip", "เว็บตัวอย่างให้ลองใช้", "sample sites to try")));
    art.appendChild(chip);
  }
  heroWrap.append(heroText, art);
  heroBox.appendChild(heroWrap);
  app.appendChild(heroBox);

  // ---------- the kinds of business there are samples for, running across the page
  if (samples.length) {
    var strip = el("div", "industries");
    var track = el("div", "industries-track");
    for (var pass = 0; pass < 2; pass++) {
      samples.forEach(function (item) {
        var tag = el("span", "", L(item.title));
        // the second copy only makes the loop seamless
        if (pass) tag.setAttribute("aria-hidden", "true");
        track.appendChild(tag);
      });
    }
    strip.appendChild(track);
    app.appendChild(strip);
  }

  // ---------- about: who the studio is, in plain words
  var about = data.about || {};
  if (L(about.text)) {
    addMenu("about", about);
    var aboutBox = el("section", "section");
    aboutBox.id = "about";
    var aboutWrap = el("div", "wrap about-grid");
    aboutWrap.appendChild(sectionHead(L(about.title)));
    var aboutBody = el("div", "about-body");
    aboutBody.appendChild(el("p", "about-text", L(about.text)));
    if (list(about.facts).length) {
      var facts = el("ul", "ticks");
      list(about.facts).forEach(function (fact) {
        facts.appendChild(el("li", "", L(fact)));
      });
      aboutBody.appendChild(facts);
    }
    aboutWrap.appendChild(aboutBody);
    aboutBox.appendChild(aboutWrap);
    app.appendChild(aboutBox);
  }

  // ---------- real work
  if (list(work.items).length) {
    addMenu("work", work);
    var workBox = el("section", "section");
    workBox.id = "work";
    var workWrap = el("div", "wrap");
    workWrap.appendChild(sectionHead(L(work.title)));
    list(work.items).forEach(function (item) {
      var article = el("article", "case");
      var shot = el("a", "case-shot");
      shot.href = item.url || "#";
      if (/^https?:/.test(item.url || "")) external(shot);
      if (item.image) {
        var img = el("img");
        img.src = item.image;
        img.alt = item.name || "";
        img.loading = "lazy";
        shot.appendChild(img);
      }
      var body = el("div", "case-body");
      body.append(el("p", "case-type", L(item.type)), el("h3", "", item.name), el("p", "", L(item.desc)));
      var ticks = el("ul", "ticks");
      list(item.points).forEach(function (point) {
        ticks.appendChild(el("li", "", L(point)));
      });
      body.appendChild(ticks);
      if (item.url) {
        var link = el("a", "btn btn-ghost", L(item.linkText));
        link.href = item.url;
        if (/^https?:/.test(item.url)) external(link);
        body.appendChild(link);
      }
      article.append(shot, body);
      workWrap.appendChild(article);
    });
    workBox.appendChild(workWrap);
    app.appendChild(workBox);
  }

  // ---------- design samples
  if (list(demos.items).length) {
    addMenu("demos", demos);
    var demoBox = el("section", "section");
    demoBox.id = "demos";
    var demoWrap = el("div", "wrap");
    demoWrap.appendChild(sectionHead(L(demos.title), L(demos.note)));
    var grid = el("div", "demo-grid");
    list(demos.items).forEach(function (item) {
      var card = el("a", "demo");
      card.href = item.link || "#";
      var pic = el("div", "demo-pic");
      if (item.image) {
        var img = el("img");
        img.src = item.image;
        img.alt = L(item.title);
        img.loading = "lazy";
        pic.appendChild(img);
      }
      if (item.real) {
        card.className += " demo-real";
        pic.appendChild(el("span", "demo-badge", U("realBadge", "ผลงานจริง", "Real work")));
      }
      var text = el("div", "demo-text");
      text.append(el("h3", "", L(item.title)), el("p", "", L(item.desc)), el("span", "demo-go", item.real ? U("realLink", "ดูภาพ →", "See the screens →") : U("tryLink", "ลองใช้ →", "Try it →")));
      card.append(pic, text);
      grid.appendChild(card);
    });
    demoWrap.appendChild(grid);
    demoBox.appendChild(demoWrap);
    app.appendChild(demoBox);
  }

  // ---------- articles: each one has its own page, written by tools/build-seo.js
  var articles = data.articles || {};
  if (list(articles.items).length) {
    addMenu("articles", articles);
    var artBox = el("section", "section section-soft");
    artBox.id = "articles";
    var artWrap = el("div", "wrap");
    artWrap.appendChild(sectionHead(L(articles.title), L(articles.note)));
    var artGrid = el("div", "article-grid");
    // newest first; the home page shows three, articles/index.html lists all
    var newest = list(articles.items)
      .map(function (item, i) { return { item: item, i: i }; })
      .filter(function (x) { return x.item.slug; })
      .sort(function (a, b) { return String(b.item.date || "").localeCompare(String(a.item.date || "")) || b.i - a.i; })
      .map(function (x) { return x.item; });
    newest.slice(0, 3).forEach(function (item) {
      var card = el("a", "article-card");
      card.href = "articles/" + item.slug + ".html";
      var pic = el("div", "article-pic");
      if (item.image) {
        var img = el("img");
        img.src = item.image;
        img.alt = "";
        img.loading = "lazy";
        pic.appendChild(img);
      } else {
        pic.appendChild(logo(72));
      }
      var text = el("div", "article-text");
      if (item.date) {
        var when = el("time", "article-date", new Date(item.date + "T00:00:00").toLocaleDateString(en ? "en-GB" : "th-TH", { day: "numeric", month: "long", year: "numeric" }));
        when.dateTime = item.date;
        text.appendChild(when);
      }
      text.append(el("h3", "", L(item.title)), el("p", "", L(item.summary)), el("span", "demo-go", U("readMore", "อ่านต่อ →", "Read more →")));
      card.append(pic, text);
      artGrid.appendChild(card);
    });
    artWrap.appendChild(artGrid);
    var all = el("a", "btn btn-ghost article-all", U("allArticles", "ดูบทความทั้งหมด", "See all articles") + " (" + newest.length + ") →");
    all.href = "articles/index.html";
    artWrap.appendChild(all);
    artBox.appendChild(artWrap);
    app.appendChild(artBox);
  }

  // ---------- services and steps (the dark band)
  var services = data.services || {};
  if (list(services.items).length || list(services.steps).length) {
    addMenu("services", services);
    var svcBox = el("section", "section section-dark");
    svcBox.id = "services";
    var svcWrap = el("div", "wrap");
    svcWrap.appendChild(sectionHead(L(services.title)));
    var svcGrid = el("div", "svc-grid");
    list(services.items).forEach(function (item, i) {
      var card = el("div", "svc");
      card.append(el("span", "svc-num", (i < 9 ? "0" : "") + (i + 1)), el("h3", "", L(item.title)), el("p", "", L(item.desc)));
      svcGrid.appendChild(card);
    });
    svcWrap.appendChild(svcGrid);
    if (list(services.steps).length) {
      svcWrap.appendChild(el("h3", "sub", L(services.stepsTitle)));
      var steps = el("ol", "steps");
      list(services.steps).forEach(function (item) {
        var li = el("li");
        li.append(el("b", "", L(item.title)), el("span", "", L(item.desc)));
        steps.appendChild(li);
      });
      svcWrap.appendChild(steps);
    }
    svcBox.appendChild(svcWrap);
    app.appendChild(svcBox);
  }

  // ---------- why us: questions worth asking, as an FAQ that opens and closes
  var why = data.why || {};
  if (list(why.items).length) {
    addMenu("why", why);
    var whyBox = el("section", "section");
    whyBox.id = "why";
    var whyWrap = el("div", "wrap faq-grid");
    whyWrap.appendChild(sectionHead(L(why.title), L(why.note)));
    var qa = el("div", "faq");
    list(why.items).forEach(function (item, i) {
      var row = el("details");
      if (i === 0) row.open = true;
      row.append(el("summary", "", L(item.q)), el("p", "", L(item.a)));
      qa.appendChild(row);
    });
    whyWrap.appendChild(qa);
    whyBox.appendChild(whyWrap);
    app.appendChild(whyBox);
  }

  // ---------- pricing
  var pricing = data.pricing || {};
  if (list(pricing.plans).length) {
    addMenu("pricing", pricing);
    var priceBox = el("section", "section section-soft");
    priceBox.id = "pricing";
    var priceWrap = el("div", "wrap");
    priceWrap.appendChild(sectionHead(L(pricing.title), L(pricing.note)));
    var plans = el("div", "plans");
    list(pricing.plans).forEach(function (plan) {
      var card = el("article", "plan" + (plan.best ? " plan-best" : ""));
      if (plan.best) card.appendChild(el("span", "plan-tag", U("bestTag", "แนะนำ", "Most chosen")));
      var price = el("p", "plan-price");
      if (plan.from) price.appendChild(el("small", "", en ? "from" : "เริ่มต้น"));
      price.appendChild(el("b", "", "฿" + (Number(plan.price) || 0).toLocaleString("en-US")));
      var ticks = el("ul", "ticks");
      list(plan.items).forEach(function (item) {
        ticks.appendChild(el("li", "", L(item)));
      });
      var cta = el("a", plan.best ? "btn btn-light" : "btn btn-ghost", L(pricing.button));
      cta.href = "#contact";
      card.append(el("h3", "", L(plan.name)), price, el("p", "plan-note", L(plan.note)), ticks, cta);
      plans.appendChild(card);
    });
    priceWrap.appendChild(plans);
    priceBox.appendChild(priceWrap);
    app.appendChild(priceBox);
  }

  // ---------- contact
  var contact = data.contact || {};
  var channels = [];
  if (site.lineId) {
    // LINE takes an Official Account ID ("@name") or a personal ID ("~name") in this link.
    var id = site.lineId.trim();
    channels.push({ label: "LINE", value: id, href: "https://line.me/R/ti/p/" + encodeURIComponent(id.charAt(0) === "@" ? id : "~" + id) });
  }
  if (site.phone) channels.push({ label: en ? "Phone" : "โทร", value: site.phone, href: "tel:" + site.phone.replace(/[^0-9+]/g, "") });
  if (site.email) channels.push({ label: en ? "Email" : "อีเมล", value: site.email, href: "mailto:" + site.email });
  if (site.facebook) channels.push({ label: "Facebook", value: site.facebookName || (en ? "Open page" : "เปิดเพจ"), href: site.facebook });

  var contactBox = el("section", "section");
  contactBox.id = "contact";
  var contactWrap = el("div", "wrap");
  var card = el("div", "contact-card");
  var cardText = el("div");
  count += 1;
  cardText.append(el("p", "eyebrow", (count < 10 ? "0" : "") + count), el("h2", "", L(contact.title)), el("p", "contact-lead", L(contact.lead)));
  var links = el("div", "contact-links");
  if (channels.length === 0) {
    links.appendChild(el("p", "contact-empty", en ? "No contact details yet — add LINE, phone or email in the admin page." : "ยังไม่ได้ใส่ช่องทางติดต่อ — เปิดหน้าแอดมิน (admin.html) แล้วกรอก LINE เบอร์โทร หรืออีเมล"));
  }
  channels.forEach(function (item) {
    var a = el("a");
    a.href = item.href;
    if (item.href.indexOf("http") === 0) external(a);
    a.append(el("small", "", item.label), el("b", "", item.value));
    links.appendChild(a);
  });
  cardText.appendChild(links);
  card.append(cardText, logo(240, "contact-logo"));
  contactWrap.appendChild(card);
  contactBox.appendChild(contactWrap);
  app.appendChild(contactBox);

  // ---------- header: section links, language switch, quote button
  var links2 = el("span", "nav-links");
  menu.forEach(function (item) {
    var a = el("a", "", item.text);
    a.href = "#" + item.id;
    links2.appendChild(a);
  });
  var box = el("span", "lang");
  [["th", "ไทย"], ["en", "EN"]].forEach(function (pair) {
    var b = el("button", "", pair[1]);
    b.type = "button";
    b.setAttribute("aria-pressed", String(lang === pair[0]));
    b.onclick = function () {
      if (lang === pair[0]) return;
      try {
        localStorage.setItem(LANG_KEY, pair[0]);
      } catch (e) {}
      location.reload();
    };
    box.appendChild(b);
  });
  var cta = el("a", "nav-cta", U("quoteButton", "ขอใบเสนอราคา", "Get a quote"));
  cta.href = "#contact";
  // On narrower screens the section links fold into a menu button.
  var menuBtn = el("button", "menu-btn");
  menuBtn.type = "button";
  menuBtn.setAttribute("aria-label", en ? "Menu" : "เมนู");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.append(el("i"), el("i"), el("i"));
  menuBtn.onclick = function () {
    var open = document.body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  };
  links2.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      document.body.classList.remove("menu-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
  nav.append(links2, box, cta, menuBtn);

  // ---------- footer
  var footer = document.getElementById("footer");
  var fWrap = el("div", "wrap footer-grid");
  var fBrand = el("div", "footer-brand");
  var fName = el("p", "footer-name");
  fName.append(logo(52), el("span", "", site.name || ""));
  fBrand.append(fName, el("p", "", L(hero.kicker)));
  var fMenu = el("div", "footer-col");
  fMenu.appendChild(el("h4", "", U("footerMenu", "เมนู", "Explore")));
  menu.forEach(function (item) {
    var a = el("a", "", item.text);
    a.href = "#" + item.id;
    fMenu.appendChild(a);
  });
  var fContact = el("div", "footer-col");
  fContact.appendChild(el("h4", "", U("footerContact", "ติดต่อ", "Contact")));
  channels.forEach(function (item) {
    var a = el("a", "", item.label + " · " + item.value);
    a.href = item.href;
    if (item.href.indexOf("http") === 0) external(a);
    fContact.appendChild(a);
  });
  if (!channels.length) fContact.appendChild(el("span", "", en ? "Coming soon" : "เร็ว ๆ นี้"));
  // Thai pages show the Buddhist year.
  var fBottom = el("div", "footer-bottom", "© " + (new Date().getFullYear() + (en ? 0 : 543)) + " " + (site.name || ""));
  fWrap.append(fBrand, fMenu, fContact, fBottom);
  footer.appendChild(fWrap);

  if (isDraft) {
    var draftStrip = el("div", "draft-strip");
    draftStrip.append(en ? "Preview of unsaved edits from the admin page — visitors don't see this yet. " : "กำลังแสดงฉบับร่างจากหน้าแอดมิน ผู้เข้าชมยังไม่เห็น ");
    var back = el("a", "", en ? "Back to admin" : "กลับไปหน้าแอดมิน");
    back.href = "admin.html";
    draftStrip.appendChild(back);
    document.body.prepend(draftStrip);
  }
})();
