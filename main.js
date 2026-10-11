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
  function sectionHead(number, title, extraClass) {
    var head = el("div", "section-head" + (extraClass ? " " + extraClass : ""));
    head.append(el("span", "num", number), el("h2", "", title));
    return head;
  }

  var site = data.site || {};
  var app = document.getElementById("app");
  var nav = document.getElementById("nav");
  var count = 0;
  function next() {
    count += 1;
    return (count < 10 ? "0" : "") + count;
  }

  // ---------- header
  document.querySelectorAll("[data-site-name]").forEach(function (node) {
    node.textContent = site.name || "";
  });
  document.title = (site.name ? site.name + " — " : "") + (en ? "Websites for shops and businesses" : "รับทำเว็บไซต์ร้านค้าและธุรกิจ");
  function navLink(id, section) {
    if (!section) return;
    var a = el("a", "", L(section.menu || section.title));
    a.href = "#" + id;
    nav.appendChild(a);
  }

  // ---------- hero
  var hero = data.hero || {};
  var heroBox = el("section", "hero");
  var heroWrap = el("div", "wrap");
  heroWrap.appendChild(el("p", "kicker", L(hero.kicker)));
  var h1 = el("h1");
  h1.append(L(hero.title1), el("br"), el("span", "", L(hero.title2)));
  heroWrap.append(h1, el("p", "lead", L(hero.lead)));
  var actions = el("div", "hero-actions");
  var b1 = el("a", "btn", L(hero.button1));
  b1.href = "#demos";
  var b2 = el("a", "btn btn-ghost", L(hero.button2));
  b2.href = "#pricing";
  actions.append(b1, b2);
  heroWrap.appendChild(actions);
  if (list(hero.proof).length) {
    var proof = el("ul", "proof");
    list(hero.proof).forEach(function (item) {
      var li = el("li");
      li.append(el("b", "", item.big), el("span", "", L(item.text)));
      proof.appendChild(li);
    });
    heroWrap.appendChild(proof);
  }
  heroBox.appendChild(heroWrap);
  app.appendChild(heroBox);

  // ---------- real work
  var work = data.work || {};
  if (list(work.items).length) {
    navLink("work", work);
    var workBox = el("section", "section wrap");
    workBox.id = "work";
    workBox.appendChild(sectionHead(next(), L(work.title)));
    list(work.items).forEach(function (item) {
      var article = el("article", "case");
      var shot = el("a", "case-shot");
      shot.href = item.url || "#";
      shot.target = "_blank";
      shot.rel = "noopener";
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
        var link = el("a", "text-link", L(item.linkText));
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noopener";
        body.appendChild(link);
      }
      article.append(shot, body);
      workBox.appendChild(article);
    });
    app.appendChild(workBox);
  }

  // ---------- design samples
  var demos = data.demos || {};
  if (list(demos.items).length) {
    navLink("demos", demos);
    var demoBox = el("section", "section section-tint");
    demoBox.id = "demos";
    var demoWrap = el("div", "wrap");
    demoWrap.append(sectionHead(next(), L(demos.title)), el("p", "section-note", L(demos.note)));
    var grid = el("div", "demo-grid");
    list(demos.items).forEach(function (item) {
      var card = el("a", "demo");
      card.href = item.link || "#";
      if (item.image) {
        var img = el("img");
        img.src = item.image;
        img.alt = L(item.title);
        img.loading = "lazy";
        card.appendChild(img);
      }
      var text = el("div");
      text.append(el("h3", "", L(item.title)), el("p", "", L(item.desc)));
      card.appendChild(text);
      grid.appendChild(card);
    });
    demoWrap.appendChild(grid);
    demoBox.appendChild(demoWrap);
    app.appendChild(demoBox);
  }

  // ---------- why us
  var why = data.why || {};
  if (list(why.items).length) {
    navLink("why", why);
    var whyBox = el("section", "section wrap");
    whyBox.id = "why";
    whyBox.append(sectionHead(next(), L(why.title)), el("p", "section-note", L(why.note)));
    var qa = el("div", "qa");
    list(why.items).forEach(function (item) {
      var row = el("div", "qa-row");
      row.append(el("h3", "", L(item.q)), el("p", "", L(item.a)));
      qa.appendChild(row);
    });
    whyBox.appendChild(qa);
    app.appendChild(whyBox);
  }

  // ---------- services and steps
  var services = data.services || {};
  if (list(services.items).length || list(services.steps).length) {
    var svcBox = el("section", "section section-tint");
    svcBox.id = "services";
    var svcWrap = el("div", "wrap");
    svcWrap.appendChild(sectionHead(next(), L(services.title)));
    var svcGrid = el("div", "svc-grid");
    list(services.items).forEach(function (item) {
      var card = el("div", "svc");
      card.append(el("h3", "", L(item.title)), el("p", "", L(item.desc)));
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

  // ---------- pricing
  var pricing = data.pricing || {};
  if (list(pricing.plans).length) {
    navLink("pricing", pricing);
    var priceBox = el("section", "section wrap");
    priceBox.id = "pricing";
    priceBox.append(sectionHead(next(), L(pricing.title)), el("p", "section-note", L(pricing.note)));
    var plans = el("div", "plans");
    list(pricing.plans).forEach(function (plan) {
      var card = el("article", "plan" + (plan.best ? " plan-best" : ""));
      if (plan.best) card.appendChild(el("span", "plan-tag", en ? "Most chosen" : "แนะนำ"));
      var price = el("p", "plan-price");
      price.append(el("small", "", plan.from ? (en ? "from " : "เริ่มต้น ") : ""), el("b", "", "฿" + (Number(plan.price) || 0).toLocaleString("en-US")));
      var ticks = el("ul", "ticks");
      list(plan.items).forEach(function (item) {
        ticks.appendChild(el("li", "", L(item)));
      });
      var cta = el("a", plan.best ? "btn" : "btn btn-ghost", L(pricing.button));
      cta.href = "#contact";
      card.append(el("h3", "", L(plan.name)), price, el("p", "plan-note", L(plan.note)), ticks, cta);
      plans.appendChild(card);
    });
    priceBox.appendChild(plans);
    app.appendChild(priceBox);
  }

  // ---------- contact
  var contact = data.contact || {};
  var contactBox = el("section", "section contact");
  contactBox.id = "contact";
  var contactWrap = el("div", "wrap");
  contactWrap.append(sectionHead(next(), L(contact.title)), el("p", "contact-lead", L(contact.lead)));
  var links = el("div", "contact-links");
  var channels = [];
  if (site.lineId) {
    // LINE takes an Official Account ID ("@name") or a personal ID ("~name") in this link.
    var id = site.lineId.trim();
    channels.push({ label: "LINE", value: id, href: "https://line.me/R/ti/p/" + encodeURIComponent(id.charAt(0) === "@" ? id : "~" + id) });
  }
  if (site.phone) channels.push({ label: en ? "Phone" : "โทร", value: site.phone, href: "tel:" + site.phone.replace(/[^0-9+]/g, "") });
  if (site.email) channels.push({ label: en ? "Email" : "อีเมล", value: site.email, href: "mailto:" + site.email });
  if (site.facebook) channels.push({ label: "Facebook", value: en ? "Open page" : "เปิดเพจ", href: site.facebook });
  if (channels.length === 0) {
    links.appendChild(el("p", "contact-empty", en ? "No contact details yet — add LINE, phone or email in the admin page." : "ยังไม่ได้ใส่ช่องทางติดต่อ — เปิดหน้าแอดมิน (admin.html) แล้วกรอก LINE เบอร์โทร หรืออีเมล"));
  }
  channels.forEach(function (item) {
    var a = el("a");
    a.href = item.href;
    if (item.href.indexOf("http") === 0) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    a.append(el("small", "", item.label), el("b", "", item.value));
    links.appendChild(a);
  });
  contactWrap.appendChild(links);
  contactBox.appendChild(contactWrap);
  app.appendChild(contactBox);

  // ---------- header: contact button and language switch (after the section links)
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
  var cta = el("a", "nav-cta", L(contact.title));
  cta.href = "#contact";
  nav.append(box, cta);

  // Thai pages show the Buddhist year.
  document.getElementById("year").textContent = new Date().getFullYear() + (en ? 0 : 543);

  if (isDraft) {
    var strip = el("div", "draft-strip");
    strip.append(en ? "Preview of unsaved edits from the admin page — visitors don't see this yet. " : "กำลังแสดงฉบับร่างจากหน้าแอดมิน ผู้เข้าชมยังไม่เห็น ");
    var back = el("a", "", en ? "Back to admin" : "กลับไปหน้าแอดมิน");
    back.href = "admin.html";
    strip.appendChild(back);
    document.body.prepend(strip);
  }
})();
