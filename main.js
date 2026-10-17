// Draws the whole page from content.js — every heading, card and price on the
// site is data the owner edits in admin.html, in Thai and English.
//
// Two things decide what is shown:
//   • language — "th" or "en", remembered under the same key the demo sites
//     use, so a visitor who picks English stays in English inside a demo;
//   • a draft — admin.html keeps unsaved edits in this browser only. Its
//     "ดูตัวอย่าง" button opens index.html?draft, and only then does the page
//     show the draft, with a strip saying so. Opened normally, the page always
//     shows the published content — an old draft left in the browser must not
//     hide what is live.
(function () {
  var LANG_KEY = "demo-lang";
  var DRAFT_KEY = "cherrybyte-draft";
  var LOGO = "assets/logo-192.webp";
  var lang = "th";
  var data = window.CONTENT || {};
  var isDraft = false;
  try {
    if (localStorage.getItem(LANG_KEY) === "en") lang = "en";
    var draft = /[?&]draft(=|&|$)/.test(location.search) && localStorage.getItem(DRAFT_KEY);
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

  // Brand icons for the contact bar (Facebook and LINE in their own colours, so
  // they are recognised at a glance).
  var ICON = {
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg>',
    line: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5C6.2 2.5 1.5 6.3 1.5 11c0 4.2 3.7 7.7 8.8 8.4.34.07.8.23.92.52.1.27.07.69.03.96l-.15.9c-.04.27-.21 1.05.92.57 1.13-.47 6.1-3.6 8.33-6.16C21.95 14.47 22.5 12.8 22.5 11c0-4.7-4.7-8.5-10.5-8.5z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.4 7H19.6zM4 8.5V17h16V8.5l-7.4 5.1a1 1 0 0 1-1.2 0z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.13.38 2.34.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
  };
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
  // href: where the menu item goes — this page's section unless given
  function addMenu(id, section, href) {
    if (section) menu.push({ id: id, text: L(section.menu || section.title), href: href || "#" + id });
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
  if (L(hero.note)) heroText.appendChild(el("p", "hero-note", L(hero.note)));
  if (list(hero.assurances).length) {
    var assure = el("ul", "assure");
    list(hero.assurances).forEach(function (a) {
      assure.appendChild(el("li", "", L(a)));
    });
    heroText.appendChild(assure);
  }
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
  var firstWork = list(work.items)[0];
  var frame = el("div", "browser");
  var bar = el("div", "browser-bar");
  bar.append(el("i"), el("i"), el("i"), el("span", "", firstWork && firstWork.url ? firstWork.url.replace(/^https?:\/\//, "") : ""));
  frame.appendChild(bar);
  if (firstWork && firstWork.image) {
    var shotImg = el("img");
    shotImg.src = firstWork.image;
    shotImg.width = 700;
    shotImg.height = 2290;
    shotImg.setAttribute("fetchpriority", "high");
    shotImg.alt = firstWork.name || "";
    var screen = el("div", "browser-screen");
    screen.appendChild(shotImg);
    frame.appendChild(screen);
    var heroWhole = el("button", "demo-full hero-full", U("fullPage", "ดูทั้งหน้า", "Whole page"));
    heroWhole.type = "button";
    heroWhole.onclick = function () {
      openWholePage({ title: firstWork.name, image: firstWork.image, link: firstWork.url, linkText: L(firstWork.linkText), external: /^https?:/.test(firstWork.url || "") });
    };
    frame.appendChild(heroWhole);
  }
  var seal = el("img", "seal");
  seal.setAttribute("aria-hidden", "true");
  seal.src = "assets/logo-420.webp";
  seal.width = 210;
  seal.height = 210;
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

  // ---------- "does your shop run into this?" — each problem with how the site helps
  var pains = data.pains || {};
  if (list(pains.items).length) {
    var painBox = el("section", "section section-soft");
    painBox.id = "problems";
    var painWrap = el("div", "wrap");
    painWrap.appendChild(sectionHead(L(pains.title), L(pains.note)));
    var painGrid = el("div", "pain-grid");
    list(pains.items).forEach(function (item) {
      var card = el("div", "pain");
      var top = el("div", "pain-problem");
      top.append(el("small", "", L(pains.problemLabel) || (en ? "The problem" : "ปัญหา")), el("p", "", L(item.problem)));
      var bottom = el("div", "pain-answer");
      bottom.append(el("small", "", L(pains.answerLabel) || (en ? "How the site helps" : "เว็บของเราช่วยได้")), el("p", "", L(item.answer)));
      card.append(top, bottom);
      painGrid.appendChild(card);
    });
    painWrap.appendChild(painGrid);
    var painCta = el("a", "btn", L(hero.button1));
    painCta.href = "#demos";
    painWrap.appendChild(painCta);
    painBox.appendChild(painWrap);
    app.appendChild(painBox);
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
        img.width = 700;
        img.height = 2290;
        img.onload = function () {
          shot.style.setProperty("--scroll-time", Math.max(3, (img.naturalHeight / img.naturalWidth) * 2.2).toFixed(1) + "s");
        };
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
      var shotBox = el("div", "case-shot-box");
      shotBox.appendChild(shot);
      if (item.image) {
        var caseWhole = el("button", "demo-full", U("fullPage", "ดูทั้งหน้า", "Whole page"));
        caseWhole.type = "button";
        caseWhole.onclick = function () {
          openWholePage({ title: item.name, image: item.image, link: item.url, linkText: L(item.linkText), external: /^https?:/.test(item.url || "") });
        };
        shotBox.appendChild(caseWhole);
      }
      article.append(shotBox, body);
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
      // The picture is a screenshot of the whole sample page: the card shows
      // its top, hovering scrolls it to the bottom, and "ดูทั้งหน้า" opens it
      // at full size. The button sits beside the link, not inside it.
      var holder = el("div", "demo-item");
      var card = el("a", "demo");
      card.href = item.link || "#";
      var pic = el("div", "demo-pic");
      if (item.image) {
        var img = el("img");
        img.src = item.image;
        img.alt = L(item.title);
        img.loading = "lazy";
        img.width = 700;
        img.height = 1600;
        img.onload = function () {
          // longer pages scroll for longer, at an even pace
          pic.style.setProperty("--scroll-time", Math.max(3, (img.naturalHeight / img.naturalWidth) * 2.2).toFixed(1) + "s");
        };
        pic.appendChild(img);
      }
      if (item.real) {
        card.className += " demo-real";
        pic.appendChild(el("span", "demo-badge", U("realBadge", "ผลงานจริง", "Real work")));
      }
      var text = el("div", "demo-text");
      text.append(el("h3", "", L(item.title)), el("p", "", L(item.desc)), el("span", "demo-go", item.real ? U("realLink", "ดูภาพ →", "See the screens →") : U("tryLink", "ลองใช้ →", "Try it →")));
      card.append(pic, text);
      holder.appendChild(card);
      if (item.image) {
        var whole = el("button", "demo-full", U("fullPage", "ดูทั้งหน้า", "Whole page"));
        whole.type = "button";
        whole.onclick = function () { openWholePage({ title: L(item.title), image: item.image, link: item.link }); };
        holder.appendChild(whole);
      }
      grid.appendChild(holder);
    });
    demoWrap.appendChild(grid);
    if (L(demos.cta)) {
      var demoCta = el("div", "inline-cta");
      var go = el("a", "btn", L(demos.ctaButton) || (en ? "Talk to us" : "ทักมาคุยเลย"));
      go.href = "#contact";
      demoCta.append(el("p", "", L(demos.cta)), go);
      demoWrap.appendChild(demoCta);
    }
    demoBox.appendChild(demoWrap);
    app.appendChild(demoBox);
  }

  // ---------- the whole-page viewer for sample screenshots
  // view: { title, image, link, linkText, external }
  function openWholePage(view) {
    var item = { title: view.title, image: view.image, link: view.link };
    var overlay = el("div", "page-viewer");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", item.title);
    var panel = el("div", "page-viewer-panel");
    var head = el("div", "page-viewer-head");
    var open = el("a", "btn", view.linkText || U("openSample", "เปิดลองใช้ →", "Open and try it →"));
    open.href = item.link;
    if (view.external) external(open);
    var close = el("button", "page-viewer-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", en ? "Close" : "ปิด");
    head.append(el("b", "", item.title), open, close);
    var scroller = el("div", "page-viewer-body");
    var img = el("img");
    // a sharper "-large" copy when there is one (assets/full/*-large.webp)
    var large = /\.webp$/.test(item.image) ? item.image.replace(/\.webp$/, "-large.webp") : item.image;
    img.onerror = function () {
      if (img.src.indexOf(item.image) < 0) img.src = item.image;
    };
    img.src = large;
    img.alt = item.title;
    scroller.appendChild(img);
    panel.append(head, scroller);
    overlay.appendChild(panel);
    function shut() {
      overlay.remove();
      document.body.classList.remove("viewer-open");
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) {
      if (e.key === "Escape") shut();
    }
    close.onclick = shut;
    overlay.addEventListener("mousedown", function (e) {
      if (e.target === overlay) shut();
    });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(overlay);
    document.body.classList.add("viewer-open");
    close.focus();
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

  // The package chooser: three questions, one answer each. Plans are matched
  // by position in content.js — 0 one-page, 1 custom, 2 multi-page with admin,
  // 3 full online shop.
  function buildChooser(chooser) {
    var box = el("div", "chooser");
    box.appendChild(el("h3", "", L(chooser.title)));
    var answers = {};
    var qs = el("div", "chooser-qs");
    var result = el("div", "chooser-result");
    result.hidden = true;
    list(chooser.questions).forEach(function (q, qi) {
      var group = el("div", "chooser-q");
      group.appendChild(el("p", "", (qi + 1) + ". " + L(q.q)));
      var opts = el("div", "chooser-opts");
      list(q.options).forEach(function (o) {
        var b = el("button", "", L(o.label));
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.onclick = function () {
          answers[qi] = o.tag;
          [].forEach.call(opts.children, function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          pick();
        };
        opts.appendChild(b);
      });
      group.appendChild(opts);
      qs.appendChild(group);
    });
    function pick() {
      if (Object.keys(answers).length < list(chooser.questions).length) return;
      var tags = Object.keys(answers).map(function (k) { return answers[k]; });
      var has = function (t) { return tags.indexOf(t) >= 0; };
      var i = has("shop") ? 3 : has("often") ? 2 : has("action") || has("brand") ? 1 : 0;
      var plan = list(pricing.plans)[i];
      document.querySelectorAll(".plan").forEach(function (c) { c.classList.toggle("plan-match", c.id === "plan-" + i); });
      result.textContent = "";
      var price = (plan.from ? (en ? "from " : "เริ่มต้น ") : "") + "฿" + (Number(plan.price) || 0).toLocaleString("en-US");
      var text = el("div");
      text.append(el("small", "", L(chooser.result)), el("b", "", L(plan.name) + " · " + price), el("span", "", L(plan.note)));
      var see = el("a", "btn btn-light", en ? "See this package" : "ดูแพ็กเกจนี้");
      see.href = "#plan-" + i;
      result.append(text, see);
      result.hidden = false;
    }
    box.append(qs, result);
    return box;
  }

  // ---------- pricing
  var pricing = data.pricing || {};
  if (list(pricing.plans).length) {
    addMenu("pricing", pricing);
    var priceBox = el("section", "section section-soft");
    priceBox.id = "pricing";
    var priceWrap = el("div", "wrap");
    priceWrap.appendChild(sectionHead(L(pricing.title), L(pricing.note)));
    var chooser = pricing.chooser || {};
    if (list(chooser.questions).length && list(pricing.plans).length >= 4) {
      priceWrap.appendChild(buildChooser(chooser));
    }
    var plans = el("div", "plans");
    list(pricing.plans).forEach(function (plan) {
      var card = el("article", "plan" + (plan.best ? " plan-best" : ""));
      card.id = "plan-" + plans.children.length;
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
  // the name of whoever answers goes after the number: "081-6511161 · เชอร์รี่"
  var phoneName = L(site.phoneName);
  if (site.phone) channels.push({ label: en ? "Phone" : "โทร", value: site.phone + (phoneName ? " · " + phoneName : ""), number: site.phone, extra: phoneName, href: "tel:" + site.phone.replace(/[^0-9+]/g, "") });
  if (site.email) channels.push({ label: en ? "Email" : "อีเมล", value: site.email, href: "mailto:" + site.email });
  if (site.facebook) channels.push({ label: "Facebook", value: site.facebookName || (en ? "Open page" : "เปิดเพจ"), href: site.facebook });
  channels.forEach(function (c) {
    c.icon = c.label === "LINE" ? "line" : c.label === "Facebook" ? "facebook" : c.href.indexOf("tel:") === 0 ? "phone" : c.href.indexOf("mailto:") === 0 ? "email" : "";
  });

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
  if (list(contact.steps).length) {
    var cSteps = el("ol", "contact-steps");
    list(contact.steps).forEach(function (st) {
      cSteps.appendChild(el("li", "", L(st)));
    });
    cardText.appendChild(cSteps);
  }
  card.append(cardText, logo(240, "contact-logo"));
  contactWrap.appendChild(card);
  contactBox.appendChild(contactWrap);
  app.appendChild(contactBox);

  // ---------- articles: each one has its own page, written by tools/build-seo.js
  var articles = data.articles || {};
  if (list(articles.items).length) {
    addMenu("articles", articles, "articles/index.html");
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

  // ---------- header: section links, language switch, quote button
  var links2 = el("span", "nav-links");
  menu.forEach(function (item) {
    var a = el("a", "", item.text);
    a.href = item.href;
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

  // ---------- the contact bar across the top of the header: Facebook, LINE,
  // phone — always in view, since the header stays at the top while scrolling.
  var quick = channels.filter(function (c) { return c.icon; });
  quick.sort(function (a, b) { return ["facebook", "line", "phone", "email"].indexOf(a.icon) - ["facebook", "line", "phone", "email"].indexOf(b.icon); });
  if (quick.length) {
    var topbar = el("div", "topbar");
    var topWrap = el("div", "wrap topbar-in");
    topWrap.appendChild(el("span", "topbar-text", U("topBar", "ปรึกษาฟรี ทักมาได้เลย", "Free advice — message us")));
    var topLinks = el("div", "topbar-links");
    quick.forEach(function (c) {
      var a = el("a", "tb tb-" + c.icon);
      a.href = c.href;
      if (c.href.indexOf("http") === 0) external(a);
      var ic = el("span", "tb-icon");
      ic.innerHTML = ICON[c.icon];
      var value = el("b", "tb-value", c.number || c.value);
      if (c.extra) value.appendChild(el("span", "tb-extra", " · " + c.extra));
      a.append(ic, el("span", "tb-label", c.label), value);
      topLinks.appendChild(a);
    });
    topWrap.appendChild(topLinks);
    topbar.appendChild(topWrap);
    // index.html already carries this bar (tools/build-seo.js), so the page
    // doesn't jump when it appears; swap in the one drawn from the current data.
    var old = document.querySelector(".site-header .topbar");
    if (old) old.replaceWith(topbar);
    else document.querySelector(".site-header").prepend(topbar);
  } else {
    var stale = document.querySelector(".site-header .topbar");
    if (stale) stale.remove();
  }

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
    a.href = item.href;
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

  app.classList.add("ready");

  if (isDraft) {
    var draftStrip = el("div", "draft-strip");
    draftStrip.append(en ? "Preview of unsaved edits from the admin page — visitors don't see this yet. " : "กำลังแสดงฉบับร่างจากหน้าแอดมิน ผู้เข้าชมยังไม่เห็น ");
    var back = el("a", "", en ? "Back to admin" : "กลับไปหน้าแอดมิน");
    back.href = "admin.html";
    var live = el("a", "", en ? "See the published site" : "ดูเว็บที่เผยแพร่จริง");
    live.href = "index.html";
    draftStrip.append(" · ");
    draftStrip.appendChild(live);
    draftStrip.appendChild(back);
    document.body.prepend(draftStrip);
  }
})();
