// Shared by every demo site: the Thai/English switch, small helpers, and the
// "send to LINE" preview.
//
// LANGUAGE. The pages are written in Thai. Each page hands its English wording
// to Demo.en({ "ข้อความไทย": "English text", ... }); in English mode every
// piece of text on the page (and every placeholder / aria-label / alt) that
// matches a key is swapped, including text the page's own script adds later.
// Sentences a script builds out of several parts use Demo.t("ไทย", "English")
// instead, and Demo.tr("ไทย") looks one phrase up in the dictionary. Switching
// language reloads the page, so nothing has to be translated back.
//
// MAP. Put <div class="dm-map" data-q="place to search for"></div> where the
// map should go (optional data-title-th / data-title-en for a heading above
// it). It becomes a live Google Map of that place plus an "open in Google
// Maps" button that starts directions on a phone. No API key is involved —
// it is Google's ordinary embed. The made-up shops are pinned on a real
// neighbourhood, and a line under the map says so.
//
// SEND TO LINE. A real site would open the shop's LINE chat with the message
// already typed in. These are demos with made-up shops, so the button shows
// the message it would send instead. The box takes each demo's colour from
// the CSS variable --demo-accent.
(function () {
  var KEY = "demo-lang";
  var lang = "th";
  try {
    if (localStorage.getItem(KEY) === "en") lang = "en";
  } catch (e) {}
  document.documentElement.lang = lang;

  var dict = {};
  var ATTRS = ["placeholder", "aria-label", "alt", "title"];

  function lookup(text) {
    var trimmed = text.trim();
    if (!trimmed || !Object.prototype.hasOwnProperty.call(dict, trimmed)) return null;
    // keep the spaces that were around the Thai text
    return text.replace(trimmed, dict[trimmed]);
  }
  function translateText(node) {
    var out = lookup(node.nodeValue);
    if (out !== null && out !== node.nodeValue) node.nodeValue = out;
  }
  function translateAttrs(el) {
    ATTRS.forEach(function (name) {
      var value = el.getAttribute && el.getAttribute(name);
      if (!value) return;
      var out = lookup(value);
      if (out !== null && out !== value) el.setAttribute(name, out);
    });
  }
  function translateTree(root) {
    if (root.nodeType === 3) return translateText(root);
    if (root.nodeType !== 1 || root.tagName === "SCRIPT" || root.tagName === "STYLE") return;
    translateAttrs(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 3) {
        if (node.parentNode.tagName !== "SCRIPT" && node.parentNode.tagName !== "STYLE") translateText(node);
      } else translateAttrs(node);
    }
  }

  // The strip across the top: what this page is, the way back, and the switch.
  function buildBar() {
    var bar = document.querySelector(".demo-bar");
    if (!bar) return;
    bar.textContent = "";
    bar.append(lang === "en" ? "Sample website made to show a design — not a real business · " : "เว็บตัวอย่างเพื่อแสดงงานออกแบบ ไม่ใช่ธุรกิจจริง · ");
    var back = document.createElement("a");
    back.href = "../../index.html#demos";
    back.textContent = lang === "en" ? "Back to portfolio" : "กลับไปหน้าผลงาน";
    bar.append(back, "  ");
    var box = document.createElement("span");
    box.className = "dm-lang";
    [["th", "ไทย"], ["en", "EN"]].forEach(function (pair) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = pair[1];
      b.setAttribute("aria-pressed", String(lang === pair[0]));
      b.onclick = function () {
        if (lang === pair[0]) return;
        try {
          localStorage.setItem(KEY, pair[0]);
        } catch (e) {}
        location.reload();
      };
      box.appendChild(b);
    });
    bar.appendChild(box);
  }

  var css =
    ".dm-lang{display:inline-flex;margin-left:10px;border:1px solid currentColor;border-radius:999px;overflow:hidden;vertical-align:middle}" +
    ".dm-lang button{font:600 12px/1 system-ui,sans-serif;padding:5px 10px;border:0;background:none;color:inherit;cursor:pointer;letter-spacing:0}" +
    ".dm-lang button[aria-pressed=true]{background:rgba(128,128,128,.5)}" +
    ".dm-map{display:grid;gap:12px;letter-spacing:0;text-transform:none}" +
    ".dm-map h3{margin:0;font-size:1.35em;line-height:1.3}" +
    ".dm-map iframe{display:block;width:100%;height:320px;border:0;border-radius:14px;background:#e9e9e4}" +
    ".dm-map-foot{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;font-size:14px}" +
    ".dm-map-foot span{flex:1;min-width:200px;opacity:.75}" +
    ".dm-map-foot a{display:inline-block;background:var(--demo-accent,#111);color:#fff;font:600 15px/1 system-ui,sans-serif;padding:12px 20px;border-radius:999px;text-decoration:none;white-space:nowrap}" +
    ".dm-mapwrap{max-width:1100px;margin:0 auto;padding:48px 20px}" +
    ".dm-overlay{position:fixed;inset:0;background:rgba(10,10,10,.55);display:grid;place-items:center;padding:18px;z-index:999;font-family:system-ui,sans-serif;letter-spacing:0}" +
    ".dm-box{background:#fff;color:#1b1b1b;border-radius:16px;max-width:440px;width:100%;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,.3)}" +
    ".dm-box h4{margin:0 0 4px;font:700 18px/1.3 inherit}" +
    ".dm-box p{margin:0 0 12px;font-size:13.5px;color:#666;line-height:1.5}" +
    ".dm-box pre{margin:0 0 14px;background:#f1f8f1;border-left:4px solid #06c755;border-radius:8px;padding:12px 14px;font:14px/1.6 inherit;white-space:pre-wrap;max-height:46vh;overflow:auto}" +
    ".dm-box button{border:0;background:var(--demo-accent,#111);color:#fff;font:600 15px inherit;padding:11px 22px;border-radius:999px;cursor:pointer}";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function close() {
    var el = document.querySelector(".dm-overlay");
    if (el) el.remove();
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  function t(th, en) {
    return lang === "en" ? en : th;
  }

  window.Demo = {
    lang: lang,
    t: t,
    // Registers a page's English wording (may be called more than once).
    en: function (words) {
      for (var k in words) dict[k] = words[k];
    },
    tr: function (th) {
      return lang === "en" && Object.prototype.hasOwnProperty.call(dict, th) ? dict[th] : th;
    },
    locale: function () {
      return lang === "en" ? "en-GB" : "th-TH";
    },
    baht: function (n) {
      return "฿" + Math.round(n).toLocaleString("en-US");
    },
    // yyyy-mm-dd for <input type="date">, `plus` days from today
    day: function (plus) {
      var d = new Date();
      d.setDate(d.getDate() + (plus || 0));
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    },
    // "พฤ. 15 ต.ค." / "Thu 15 Oct" — kept under its old name, pages call it everywhere
    thaiDate: function (iso) {
      return new Date(iso + "T00:00:00").toLocaleDateString(lang === "en" ? "en-GB" : "th-TH", { weekday: "short", day: "numeric", month: "short" });
    },
    validPhone: function (text) {
      var digits = String(text).replace(/[^0-9]/g, "");
      return digits.length === 9 || digits.length === 10;
    },
    // Marks a field wrong (or clears the mark) and returns whether it's ok.
    check: function (input, ok) {
      input.style.outline = ok ? "" : "2px solid #d93025";
      return ok;
    },
    send: function (lines) {
      close();
      var overlay = document.createElement("div");
      overlay.className = "dm-overlay";
      var box = document.createElement("div");
      box.className = "dm-box";
      box.setAttribute("role", "dialog");
      var h = document.createElement("h4");
      h.textContent = t("ข้อความที่จะส่งเข้า LINE ของร้าน", "The message that goes to the shop's LINE");
      var p = document.createElement("p");
      p.textContent = t(
        "นี่คือเว็บตัวอย่าง จึงยังไม่ส่งจริง ในเว็บจริง ปุ่มนี้จะเปิดแชท LINE ของร้านพร้อมข้อความด้านล่าง ลูกค้าแค่กดส่ง",
        "This is a sample site, so nothing is sent. On a real site this button opens the shop's LINE chat with the message below already typed in — the customer just taps Send."
      );
      var pre = document.createElement("pre");
      pre.textContent = lines.join("\n");
      var btn = document.createElement("button");
      btn.textContent = t("ปิด", "Close");
      btn.onclick = close;
      box.append(h, p, pre, btn);
      overlay.appendChild(box);
      overlay.addEventListener("mousedown", function (e) {
        if (e.target === overlay) close();
      });
      document.body.appendChild(overlay);
      btn.focus();
    },
  };

  function buildMaps() {
    document.querySelectorAll(".dm-map").forEach(function (box) {
      var place = box.getAttribute("data-q");
      if (!place) return;
      var q = encodeURIComponent(place);
      var title = box.getAttribute(lang === "en" ? "data-title-en" : "data-title-th");
      box.textContent = "";
      if (title) {
        var h = document.createElement("h3");
        h.textContent = title;
        box.appendChild(h);
      }
      var frame = document.createElement("iframe");
      frame.src = "https://www.google.com/maps?q=" + q + "&z=15&hl=" + lang + "&output=embed";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.title = t("แผนที่ Google Maps", "Google Map");
      var foot = document.createElement("div");
      foot.className = "dm-map-foot";
      var note = document.createElement("span");
      note.textContent = t("ตำแหน่งตัวอย่าง — เว็บจริงจะปักหมุดที่ร้านของคุณ", "Example location — a real site is pinned on your own shop");
      var link = document.createElement("a");
      link.href = "https://www.google.com/maps/search/?api=1&query=" + q;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = t("เปิดใน Google Maps", "Open in Google Maps");
      foot.append(note, link);
      box.append(frame, foot);
    });
  }

  buildBar();
  buildMaps();

  // Page scripts run before this fires, so by now they have registered their
  // dictionary and drawn their first screen.
  document.addEventListener("DOMContentLoaded", function () {
    if (lang !== "en") return;
    document.title = lookup(document.title) || document.title;
    translateTree(document.body);
    new MutationObserver(function (changes) {
      changes.forEach(function (change) {
        if (change.type === "characterData") translateText(change.target);
        else if (change.type === "attributes") translateAttrs(change.target);
        else change.addedNodes.forEach(translateTree);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  });
})();
