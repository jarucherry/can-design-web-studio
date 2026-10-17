// The admin page: one tab per section of the site, built from TABS below.
//
// There is no server behind this site — it is plain files — so "saving" means
// writing a new content.js:
//   • every edit is kept at once as a DRAFT in this browser (localStorage), and
//     "ดูตัวอย่าง" opens the site showing that draft;
//   • "บันทึกไฟล์ content.js" writes the file. In Chrome/Edge it asks where to
//     save — choose the site's own content.js and it is replaced in place;
//     other browsers download the file to put there by hand.
// The published site changes when the saved content.js is uploaded with it.
//
// PUBLISHING. With a GitHub access token saved on the "เผยแพร่" tab, the
// "เผยแพร่ขึ้นเว็บ" button commits content.js straight to the site's GitHub
// repository, and GitHub Pages rebuilds the site (.github/workflows/publish.yml
// also writes the SEO copy and the article pages). Photos are uploaded the same
// way into assets/uploads/. The token stays in this browser only. With a token,
// the page also loads content.js from GitHub on opening, so it always starts
// from what is really published.
//
// To add something editable: put it in content.js, add a field to TABS, and
// make main.js draw it.
(function () {
  var DRAFT_KEY = "cherrybyte-draft";
  var saved = JSON.stringify(window.CONTENT || {});
  var data = JSON.parse(saved);
  try {
    var draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      data = JSON.parse(draft);
    }
  } catch (e) {}

  // ---- field kinds --------------------------------------------------------
  // text  : one line, Thai + English          long : several lines, Thai + English
  // plain : one line, same in both languages  number / check
  // list  : repeatable group of fields        lines: repeatable Thai + English line
  var T = function (key, label, hint) { return { kind: "text", key: key, label: label, hint: hint }; };
  var LONG = function (key, label, hint) { return { kind: "long", key: key, label: label, hint: hint }; };
  var P = function (key, label, hint) { return { kind: "plain", key: key, label: label, hint: hint }; };

  var TABS = [
    {
      title: "ข้อมูลและติดต่อ", path: "site",
      help: "ชื่อที่ใช้รับงานและช่องทางติดต่อ ช่องที่เว้นว่างจะไม่แสดงปุ่มบนหน้าเว็บ",
      fields: [
        P("name", "ชื่อที่ใช้รับงาน", "แสดงที่หัวเว็บ ท้ายเว็บ และชื่อแท็บ"),
        P("lineId", "LINE ID", "เช่น @candesign หรือ can123"),
        P("phone", "เบอร์โทร", "เช่น 081-234-5678"),
        P("email", "อีเมล"),
        P("facebook", "ลิงก์เพจ Facebook", "เช่น https://www.facebook.com/yourpage"),
        P("facebookName", "ชื่อเพจ Facebook", "แสดงบนปุ่มติดต่อและท้ายเว็บ เช่น CAN design web studio"),
        P("url", "ที่อยู่เว็บ", "ที่อยู่เต็มของหน้าเว็บนี้ ใช้บอก Google ว่าเว็บอยู่ที่ไหน เช่น https://candesign.co.th/"),
      ],
    },
    {
      title: "SEO", path: "seo",
      help: "ข้อความที่ Google และ AI ใช้แสดงผลการค้นหา หลังบันทึก content.js ให้รัน node tools/build-seo.js ด้วย เพื่อให้หน้าเว็บเวอร์ชันสำหรับ Google อัปเดตตาม",
      fields: [
        T("title", "ชื่อหน้าเว็บในผลการค้นหา", "ไม่เกินประมาณ 60 ตัวอักษร ใส่ชื่อสตูดิโอและสิ่งที่ทำ"),
        LONG("description", "คำอธิบายในผลการค้นหา", "ประมาณ 1–2 ประโยค บอกว่าทำอะไร ให้ใคร ราคาเริ่มต้น"),
      ],
    },
    {
      title: "เกี่ยวกับเรา", path: "about",
      help: "บอกว่า CAN DESIGN WEB STUDIO คือใครและทำอะไร เขียนเป็นภาษาธรรมดา ส่วนนี้ช่วยให้ Google และ AI เข้าใจเว็บ",
      fields: [
        T("title", "หัวข้อของส่วนนี้"),
        T("menu", "ชื่อในเมนูด้านบน"),
        LONG("text", "ข้อความแนะนำ"),
        { kind: "lines", key: "facts", label: "ข้อมูลสั้น ๆ (ทีละบรรทัด)" },
      ],
    },
    {
      title: "ส่วนหัว", path: "hero",
      help: "ส่วนแรกที่ผู้เข้าชมเห็นเมื่อเปิดเว็บ",
      fields: [
        T("kicker", "บรรทัดเล็กด้านบน"),
        T("title1", "หัวข้อใหญ่ บรรทัดที่ 1"),
        T("title2", "หัวข้อใหญ่ บรรทัดที่ 2", "แสดงเป็นสีเน้น"),
        LONG("lead", "ข้อความแนะนำ"),
        T("button1", "ปุ่มหลัก", "พาไปส่วนตัวอย่างดีไซน์"),
        T("button2", "ปุ่มรอง", "พาไปส่วนราคา"),
        { kind: "list", key: "proof", label: "ตัวเลขเด่น", item: "ตัวเลข", fields: [P("big", "ตัวเลขหรือคำสั้น ๆ", "เช่น 8 หรือ LINE"), T("text", "คำอธิบาย")] },
      ],
    },
    {
      title: "ผลงาน", path: "work",
      help: "ผลงานจริงที่ทำให้ลูกค้า เพิ่มได้หลายชิ้น ถ้าไม่มีผลงานเลย ส่วนนี้จะไม่แสดง",
      fields: [
        T("title", "หัวข้อของส่วนนี้"),
        T("menu", "ชื่อในเมนูด้านบน"),
        {
          kind: "list", key: "items", label: "รายการผลงาน", item: "ผลงาน", nameKey: "name",
          fields: [
            P("name", "ชื่อผลงาน"),
            T("type", "ประเภทงาน", "เช่น ร้านค้าออนไลน์ · แฟชั่น"),
            LONG("desc", "คำอธิบาย"),
            { kind: "lines", key: "points", label: "จุดเด่น (ทีละบรรทัด)" },
            P("url", "ลิงก์เว็บจริง", "เช่น https://example.com"),
            T("linkText", "ข้อความของลิงก์"),
            P("image", "ไฟล์รูป", "วางรูปไว้ในโฟลเดอร์ assets แล้วพิมพ์ เช่น assets/work-shop.jpg (กว้างราว 1200 พิกเซล)"),
          ],
        },
      ],
    },
    {
      title: "ตัวอย่างดีไซน์", path: "demos",
      help: "การ์ดของเว็บตัวอย่างแต่ละแบบ แก้ชื่อและคำอธิบายได้ ตัวเว็บตัวอย่างเองอยู่ในโฟลเดอร์ demos",
      fields: [
        T("title", "หัวข้อของส่วนนี้"),
        T("menu", "ชื่อในเมนูด้านบน"),
        LONG("note", "ข้อความใต้หัวข้อ"),
        {
          kind: "list", key: "items", label: "รายการตัวอย่าง", item: "ตัวอย่าง", nameKey: "title",
          fields: [T("title", "ชื่อ"), T("desc", "คำอธิบาย"), P("link", "ลิงก์", "เช่น demos/cafe/index.html"), P("image", "ไฟล์รูป", "เช่น assets/demo-cafe.jpg"), { kind: "check", key: "real", label: "เป็นผลงานจริง ไม่ใช่เว็บตัวอย่าง (มีป้าย “ผลงานจริง” และไม่นับรวมในจำนวนเว็บตัวอย่าง)" }],
        },
      ],
    },
    {
      title: "ทำไมต้องเรา", path: "why",
      help: "คำถามที่ลูกค้าควรถามก่อนจ้าง และคำตอบของคุณ ตรวจให้แน่ใจว่าทำได้จริงทุกข้อ",
      fields: [
        T("title", "หัวข้อของส่วนนี้"),
        T("menu", "ชื่อในเมนูด้านบน"),
        LONG("note", "ข้อความใต้หัวข้อ"),
        { kind: "list", key: "items", label: "คำถามและคำตอบ", item: "ข้อ", nameKey: "q", fields: [T("q", "คำถาม"), LONG("a", "คำตอบ")] },
      ],
    },
    {
      title: "บริการ", path: "services",
      help: "สิ่งที่คุณรับทำ และขั้นตอนการทำงาน",
      fields: [
        T("title", "หัวข้อของส่วนนี้"),
        { kind: "list", key: "items", label: "รายการบริการ", item: "บริการ", nameKey: "title", fields: [T("title", "ชื่อบริการ"), LONG("desc", "คำอธิบาย")] },
        T("stepsTitle", "หัวข้อของขั้นตอนการทำงาน"),
        { kind: "list", key: "steps", label: "ขั้นตอน", item: "ขั้นตอน", nameKey: "title", fields: [T("title", "ชื่อขั้นตอน"), T("desc", "คำอธิบาย")] },
      ],
    },
    {
      title: "ราคา", path: "pricing",
      help: "แพ็กเกจและราคา สิ่งที่เขียนในนี้คือคำสัญญากับลูกค้า ตรวจตัวเลขและเงื่อนไขก่อนบันทึก",
      fields: [
        T("title", "หัวข้อของส่วนนี้"),
        T("menu", "ชื่อในเมนูด้านบน"),
        LONG("note", "ข้อความใต้หัวข้อ"),
        T("button", "ข้อความบนปุ่มของทุกแพ็กเกจ"),
        {
          kind: "list", key: "plans", label: "แพ็กเกจ", item: "แพ็กเกจ", nameKey: "name",
          fields: [
            T("name", "ชื่อแพ็กเกจ"),
            { kind: "number", key: "price", label: "ราคา (บาท)" },
            { kind: "check", key: "from", label: "แสดงคำว่า “เริ่มต้น” หน้าราคา" },
            { kind: "check", key: "best", label: "เป็นแพ็กเกจแนะนำ (มีกรอบสีและป้าย)" },
            T("note", "คำอธิบายสั้น ๆ"),
            { kind: "lines", key: "items", label: "สิ่งที่ได้ (ทีละบรรทัด)" },
          ],
        },
      ],
    },
    {
      title: "บทความ", path: "articles",
      help: "บทความแต่ละเรื่องจะมีหน้าของตัวเอง ช่วยให้ Google และ AI ค้นเจอเว็บ หน้าบทความใหม่จะขึ้นหลังกด “เผยแพร่ขึ้นเว็บ” ประมาณ 1–2 นาที",
      fields: [
        T("title", "หัวข้อของส่วนนี้"),
        T("menu", "ชื่อในเมนูด้านบน"),
        LONG("note", "ข้อความใต้หัวข้อ"),
        {
          kind: "list", key: "items", label: "บทความ", item: "บทความ", nameKey: "title",
          // a new article gets a web address and today's date straight away
          make: function () {
            var d = new Date();
            return { slug: "article-" + d.getTime().toString(36), date: d.toISOString().slice(0, 10) };
          },
          fields: [
            T("title", "ชื่อบทความ"),
            LONG("summary", "สรุปสั้น ๆ", "แสดงบนการ์ดบทความและในผลการค้นหา 1–2 ประโยค"),
            { kind: "long", key: "body", label: "เนื้อหา", hint: "เว้นบรรทัดว่างระหว่างย่อหน้า ขึ้นบรรทัดด้วย ## ตามด้วยข้อความ เพื่อทำหัวข้อย่อย", tall: true },
            { kind: "image", key: "image", label: "รูปหน้าปก (ไม่บังคับ)", hint: "ถ้าไม่ใส่ จะใช้พื้นสีพาสเทลกับโลโก้" },
            P("date", "วันที่", "รูปแบบ ปี-เดือน-วัน ค.ศ. เช่น 2026-10-16"),
            P("slug", "ที่อยู่หน้าเว็บ", "ภาษาอังกฤษตัวเล็ก ตัวเลข และขีด เช่น website-cost — ตั้งแล้วไม่ควรเปลี่ยน ลิงก์เดิมจะเสีย"),
          ],
        },
      ],
    },
    {
      title: "ข้อความอื่น ๆ", path: "ui",
      help: "ข้อความสั้น ๆ บนปุ่มและป้ายต่าง ๆ ของหน้าเว็บ",
      fields: [
        T("quoteButton", "ปุ่มมุมขวาบน"),
        T("sampleChip", "ป้ายจำนวนเว็บตัวอย่างในส่วนหัว"),
        T("tryLink", "ลิงก์บนการ์ดเว็บตัวอย่าง"),
        T("realBadge", "ป้ายบนการ์ดผลงานจริง"),
        T("realLink", "ลิงก์บนการ์ดผลงานจริง"),
        T("bestTag", "ป้ายแพ็กเกจแนะนำ"),
        T("readMore", "ลิงก์บนการ์ดบทความ"),
        T("allArticles", "ปุ่มดูบทความทั้งหมด"),
        T("footerMenu", "หัวข้อเมนูท้ายเว็บ"),
        T("footerContact", "หัวข้อติดต่อท้ายเว็บ"),
      ],
    },
    {
      title: "เผยแพร่", custom: "publish",
      help: "ตั้งค่าครั้งเดียว แล้วปุ่ม “เผยแพร่ขึ้นเว็บ” จะอัปเดตเว็บจริงให้ทันที ไม่ต้องอัปโหลดไฟล์เอง",
    },
    {
      title: "ส่วนติดต่อ", path: "contact",
      help: "ข้อความในส่วนท้ายของหน้า ส่วนปุ่ม LINE เบอร์โทร และอีเมล แก้ที่แถบ “ข้อมูลและติดต่อ”",
      fields: [T("title", "หัวข้อของส่วนนี้", "ใช้เป็นข้อความบนปุ่มในเมนูด้านบนด้วย"), LONG("lead", "ข้อความเชิญชวน")],
    },
  ];

  // ---- helpers ------------------------------------------------------------
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function blankFor(fields) {
    var out = {};
    fields.forEach(function (f) {
      if (f.kind === "text" || f.kind === "long") out[f.key] = { th: "", en: "" };
      else if (f.kind === "plain" || f.kind === "image") out[f.key] = "";
      else if (f.kind === "number") out[f.key] = 0;
      else if (f.kind === "check") out[f.key] = false;
      else out[f.key] = [];
    });
    return out;
  }
  var status = document.getElementById("status");
  function changed() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (e) {}
    showStatus();
  }
  function showStatus(message) {
    var dirty = JSON.stringify(data) !== saved;
    status.className = "status" + (dirty ? " changed" : "");
    status.textContent = message || (dirty
      ? "มีการแก้ไขที่ยังไม่ได้เผยแพร่ — เก็บเป็นฉบับร่างในเบราว์เซอร์นี้แล้ว กด “ดูตัวอย่าง” เพื่อดู หรือ “เผยแพร่ขึ้นเว็บ” เพื่อใช้งานจริง"
      : "ตรงกับเว็บที่เผยแพร่อยู่");
    document.getElementById("site-name").textContent = (data.site && data.site.name) || "";
  }

  // ---- form builder -------------------------------------------------------
  function bilingual(obj, key, multiline) {
    if (!obj[key] || typeof obj[key] !== "object") obj[key] = { th: String(obj[key] || ""), en: "" };
    var pair = el("div", "pair");
    [["th", "ไทย"], ["en", "ENGLISH"]].forEach(function (lang) {
      var box = el("div");
      var input = el(multiline ? "textarea" : "input");
      if (!multiline) input.type = "text";
      input.value = obj[key][lang[0]] || "";
      input.setAttribute("aria-label", lang[1]);
      input.oninput = function () { obj[key][lang[0]] = input.value; changed(); };
      box.append(el("span", "tag", lang[1]), input);
      pair.appendChild(box);
    });
    return pair;
  }
  function labelFor(field) {
    var label = el("div", "label", field.label);
    if (field.hint) label.appendChild(el("span", "hint", field.hint));
    return label;
  }
  function moveButtons(arr, i, redraw) {
    var frag = document.createDocumentFragment();
    [["↑", -1, "เลื่อนขึ้น"], ["↓", 1, "เลื่อนลง"]].forEach(function (m) {
      var b = el("button", "icon", m[0]);
      b.type = "button";
      b.title = m[2];
      b.disabled = i + m[1] < 0 || i + m[1] >= arr.length;
      b.onclick = function () {
        var other = arr[i + m[1]];
        arr[i + m[1]] = arr[i];
        arr[i] = other;
        changed();
        redraw();
      };
      frag.appendChild(b);
    });
    var del = el("button", "icon", "×");
    del.type = "button";
    del.title = "ลบ";
    del.onclick = function () {
      if (!window.confirm("ลบรายการนี้ใช่ไหม?")) return;
      arr.splice(i, 1);
      changed();
      redraw();
    };
    frag.appendChild(del);
    return frag;
  }

  function buildField(obj, field) {
    var wrap = el("div", "field");
    if (field.kind === "text" || field.kind === "long") {
      var pairBox = bilingual(obj, field.key, field.kind === "long");
      if (field.tall) pairBox.querySelectorAll("textarea").forEach(function (t) { t.rows = 14; });
      wrap.append(labelFor(field), pairBox);
    } else if (field.kind === "image") {
      var row = el("div", "image-row");
      var thumb = el("img", "thumb");
      var pathInput = el("input");
      pathInput.type = "text";
      pathInput.placeholder = "เช่น assets/uploads/photo.jpg";
      pathInput.value = obj[field.key] || "";
      var showThumb = function (src) { thumb.src = src || ""; thumb.hidden = !src; };
      showThumb(obj[field.key] || "");
      pathInput.oninput = function () { obj[field.key] = pathInput.value.trim(); showThumb(obj[field.key]); changed(); };
      var pick = el("input");
      pick.type = "file";
      pick.accept = "image/*";
      pick.hidden = true;
      var up = el("button", "btn ghost small", "อัปโหลดรูป");
      up.type = "button";
      up.onclick = function () {
        if (!token()) { showStatus("ต้องตั้งค่าในแถบ “เผยแพร่” ก่อนจึงจะอัปโหลดรูปได้ หรือวางรูปในโฟลเดอร์ assets แล้วพิมพ์ชื่อไฟล์เอง"); return; }
        pick.click();
      };
      pick.onchange = async function () {
        var file = pick.files[0];
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) { showStatus("รูปใหญ่เกิน 4 MB ลองย่อรูปก่อน"); return; }
        up.disabled = true;
        showStatus("กำลังอัปโหลดรูป…");
        try {
          var dataUrl = await readAsDataURL(file);
          var safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+/, "") || "photo.jpg";
          var path = "assets/uploads/" + Date.now().toString(36) + "-" + safe;
          await putFile(path, dataUrl.split(",")[1], "Upload " + safe + " from admin");
          obj[field.key] = path;
          pathInput.value = path;
          showThumb(dataUrl);
          changed();
          showStatus("อัปโหลดรูปแล้ว — กด “เผยแพร่ขึ้นเว็บ” เพื่อใช้รูปนี้บนเว็บจริง");
        } catch (err) {
          showStatus("อัปโหลดไม่สำเร็จ: " + err.message);
        }
        up.disabled = false;
        pick.value = "";
      };
      row.append(thumb, pathInput, up, pick);
      wrap.append(labelFor(field), row);
    } else if (field.kind === "plain" || field.kind === "number") {
      var input = el("input");
      input.type = field.kind === "number" ? "number" : "text";
      if (field.kind === "number") input.min = "0";
      input.value = obj[field.key] == null ? "" : obj[field.key];
      input.setAttribute("aria-label", field.label);
      input.oninput = function () {
        obj[field.key] = field.kind === "number" ? Number(input.value) || 0 : input.value;
        changed();
      };
      wrap.append(labelFor(field), input);
    } else if (field.kind === "check") {
      var label = el("label", "check");
      var box = el("input");
      box.type = "checkbox";
      box.checked = Boolean(obj[field.key]);
      box.onchange = function () { obj[field.key] = box.checked; changed(); };
      label.append(box, field.label);
      wrap.appendChild(label);
    } else if (field.kind === "lines") {
      if (!Array.isArray(obj[field.key])) obj[field.key] = [];
      var arr = obj[field.key];
      var holder = el("div");
      var drawLines = function () {
        holder.textContent = "";
        arr.forEach(function (line, i) {
          var row = el("div", "simple-row");
          var tmp = { v: line };
          var pair = bilingual(tmp, "v", false);
          arr[i] = tmp.v;
          row.append(pair, moveButtons(arr, i, drawLines));
          holder.appendChild(row);
        });
        var add = el("button", "btn ghost small add", "+ เพิ่มบรรทัด");
        add.type = "button";
        add.onclick = function () { arr.push({ th: "", en: "" }); changed(); drawLines(); };
        holder.appendChild(add);
      };
      drawLines();
      wrap.append(labelFor(field), holder);
    } else if (field.kind === "list") {
      if (!Array.isArray(obj[field.key])) obj[field.key] = [];
      var items = obj[field.key];
      var listBox = el("div");
      var drawList = function () {
        listBox.textContent = "";
        items.forEach(function (item, i) {
          var group = el("div", "group");
          var head = el("div", "group-head");
          var name = field.nameKey ? item[field.nameKey] : "";
          if (name && typeof name === "object") name = name.th;
          head.append(el("b", "", field.item + " " + (i + 1) + (name ? " — " + name : "")), moveButtons(items, i, drawList));
          group.appendChild(head);
          field.fields.forEach(function (f) { group.appendChild(buildField(item, f)); });
          listBox.appendChild(group);
        });
        var add = el("button", "btn ghost small add", "+ เพิ่ม" + field.item);
        add.type = "button";
        add.onclick = function () {
          var fresh = blankFor(field.fields);
          if (field.make) Object.assign(fresh, field.make());
          items.push(fresh);
          changed();
          drawList();
        };
        listBox.appendChild(add);
      };
      drawList();
      wrap.className = "";
      wrap.append(el("div", "list-title", field.label), listBox);
    }
    return wrap;
  }

  // ---- tabs ---------------------------------------------------------------
  var tabsBox = document.getElementById("tabs");
  var panel = document.getElementById("panel");
  var current = 0;
  function drawTabs() {
    tabsBox.textContent = "";
    TABS.forEach(function (tab, i) {
      var b = el("button", "", tab.title);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(i === current));
      b.onclick = function () { current = i; drawTabs(); };
      tabsBox.appendChild(b);
    });
    var tab = TABS[current];
    panel.textContent = "";
    panel.appendChild(el("p", "help", tab.help));
    if (tab.custom === "publish") return drawPublishTab();
    if (!data[tab.path] || typeof data[tab.path] !== "object") data[tab.path] = {};
    tab.fields.forEach(function (f) { panel.appendChild(buildField(data[tab.path], f)); });
  }

  // ---- GitHub: publish content.js and upload photos -----------------------
  var REPO = "jarucherry/can-design-web-studio";
  var BRANCH = "main";
  var TOKEN_KEY = "can-admin-github-token";
  function token() {
    try {
      return localStorage.getItem(TOKEN_KEY) || "";
    } catch (e) {
      return "";
    }
  }
  function readAsDataURL(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }
  function utf8ToBase64(text) {
    var bytes = new TextEncoder().encode(text), bin = "";
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function base64ToUtf8(b64) {
    var bin = atob(b64.replace(/\s/g, "")), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  async function gh(method, path, body) {
    var res = await fetch("https://api.github.com/repos/" + REPO + (path ? "/contents/" + path : "") + (method === "GET" && path ? "?ref=" + BRANCH : ""), {
      method: method,
      cache: "no-store",
      headers: { Authorization: "Bearer " + token(), Accept: "application/vnd.github+json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      var why = res.status === 401 ? "รหัส (token) ไม่ถูกต้องหรือหมดอายุ" : res.status === 403 || res.status === 404 ? "รหัสนี้ไม่มีสิทธิ์เขียนเว็บนี้" : "GitHub ตอบกลับ " + res.status;
      var err = new Error(why);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }
  async function putFile(path, base64, message) {
    var sha;
    try {
      sha = (await gh("GET", path)).sha;
    } catch (err) {
      if (err.status !== 404) throw err;
    }
    return gh("PUT", path, { message: message, content: base64, branch: BRANCH, sha: sha });
  }
  // Start from the content that is really published, when we can see it.
  async function loadPublished() {
    if (!token()) return;
    try {
      var file = await gh("GET", "content.js");
      var box = {};
      new Function("window", base64ToUtf8(file.content))(box);
      if (!box.CONTENT) return;
      var hadDraft = JSON.stringify(data) !== saved;
      saved = JSON.stringify(box.CONTENT);
      if (!hadDraft) data = JSON.parse(saved);
      drawTabs();
      showStatus();
    } catch (err) {
      showStatus("โหลดข้อมูลล่าสุดจาก GitHub ไม่ได้: " + err.message);
    }
  }
  function drawPublishTab() {
    var steps = el("ol", "steps-help");
    [
      "เข้า github.com/settings/personal-access-tokens/new (ล็อกอินบัญชี jarucherry)",
      "ตั้งชื่อ เช่น can-admin และเลือกวันหมดอายุ (นานสุด 1 ปี)",
      "Repository access: เลือก Only select repositories แล้วเลือก can-design-web-studio",
      "Permissions → Repository permissions → Contents: Read and write",
      "กด Generate token แล้วคัดลอกรหัสที่ขึ้นต้นด้วย github_pat_ มาวางด้านล่าง",
    ].forEach(function (t) { steps.appendChild(el("li", "", t)); });
    var field = el("div", "field");
    var input = el("input");
    input.type = "password";
    input.placeholder = "github_pat_…";
    input.value = token();
    input.setAttribute("aria-label", "GitHub token");
    var saveBtn = el("button", "btn small", "บันทึกและทดสอบ");
    saveBtn.type = "button";
    var clearBtn = el("button", "btn danger small", "ลบรหัสออกจากเครื่องนี้");
    clearBtn.type = "button";
    var result = el("p", "hint");
    saveBtn.onclick = async function () {
      try {
        localStorage.setItem(TOKEN_KEY, input.value.trim());
      } catch (e) {}
      result.textContent = "กำลังทดสอบ…";
      try {
        var repo = await gh("GET", "");
        if (!repo.permissions || !repo.permissions.push) throw new Error("รหัสนี้อ่านได้แต่เขียนไม่ได้ — ตั้ง Contents เป็น Read and write");
        result.textContent = "ใช้ได้ ✓ ปุ่ม “เผยแพร่ขึ้นเว็บ” พร้อมใช้งาน";
        loadPublished();
      } catch (err) {
        result.textContent = "ใช้ไม่ได้: " + err.message;
      }
    };
    clearBtn.onclick = function () {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch (e) {}
      input.value = "";
      result.textContent = "ลบแล้ว";
    };
    var buttons = el("div", "row-buttons");
    buttons.append(saveBtn, clearBtn);
    field.append(el("div", "label", "รหัสสำหรับเผยแพร่ (GitHub token)"), input, buttons, result);
    panel.append(el("p", "list-title", "วิธีสร้างรหัส"), steps, field,
      el("p", "hint", "รหัสเก็บไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น ใช้บนเครื่องของคุณเอง อย่าใช้บนเครื่องสาธารณะ ถ้ารหัสหลุด ให้ลบทิ้งที่หน้า GitHub แล้วสร้างใหม่"));
  }

  // ---- buttons ------------------------------------------------------------
  function fileText() {
    return "// เนื้อหาทั้งหมดของเว็บแนะนำตัว — ไฟล์นี้สร้างและแก้จากหน้าแอดมิน (admin.html)\n" +
      "// แก้ด้วยมือได้เหมือนกัน: ข้อความแต่ละจุดมีสองภาษา { \"th\": \"ไทย\", \"en\": \"English\" }\n" +
      "window.CONTENT = " + JSON.stringify(data, null, 2) + ";\n";
  }
  function afterSave(message) {
    saved = JSON.stringify(data);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {}
    showStatus(message);
  }
  document.getElementById("save").onclick = async function () {
    var text = fileText();
    if (window.showSaveFilePicker) {
      try {
        var handle = await window.showSaveFilePicker({ suggestedName: "content.js", types: [{ description: "JavaScript", accept: { "text/javascript": [".js"] } }] });
        var writer = await handle.createWritable();
        await writer.write(text);
        await writer.close();
        afterSave("บันทึกแล้ว — ถ้าเลือกไฟล์ content.js ในโฟลเดอร์เว็บ หน้าเว็บในเครื่องนี้ใช้ข้อมูลใหม่ทันที อย่าลืมอัปโหลดไฟล์นี้ขึ้นเว็บจริงด้วย");
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return; // the owner closed the dialog
      }
    }
    var link = el("a");
    link.href = URL.createObjectURL(new Blob([text], { type: "text/javascript" }));
    link.download = "content.js";
    link.click();
    afterSave("ดาวน์โหลด content.js แล้ว — นำไปวางแทนไฟล์เดิมในโฟลเดอร์เว็บ แล้วอัปโหลดขึ้นเว็บจริง");
  };
  document.getElementById("publish").onclick = async function () {
    if (!token()) {
      current = TABS.findIndex(function (t) { return t.custom === "publish"; });
      drawTabs();
      showStatus("ตั้งค่าการเผยแพร่ก่อน (ครั้งเดียว) แล้วกดปุ่มเผยแพร่อีกครั้ง");
      return;
    }
    if (!window.confirm("เผยแพร่การแก้ไขทั้งหมดขึ้นเว็บจริงใช่ไหม?")) return;
    var btn = this;
    btn.disabled = true;
    showStatus("กำลังเผยแพร่…");
    try {
      await putFile("content.js", utf8ToBase64(fileText()), "Update site content from admin");
      afterSave("เผยแพร่แล้ว ✓ เว็บจริงจะอัปเดตภายใน 1–2 นาที (กดรีเฟรชหน้าเว็บเพื่อดู)");
    } catch (err) {
      showStatus("เผยแพร่ไม่สำเร็จ: " + err.message);
    }
    btn.disabled = false;
  };
  document.getElementById("preview").onclick = function () {
    changed();
    window.open("index.html?draft", "_blank");
  };
  document.getElementById("reset").onclick = function () {
    if (!window.confirm("ทิ้งการแก้ไขที่ยังไม่ได้บันทึก แล้วกลับไปใช้ข้อมูลในไฟล์ content.js ใช่ไหม?")) return;
    data = JSON.parse(saved);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {}
    drawTabs();
    showStatus();
  };
  drawTabs();
  showStatus();
  loadPublished();
})();
