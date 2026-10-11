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
          fields: [T("title", "ชื่อ"), T("desc", "คำอธิบาย"), P("link", "ลิงก์", "เช่น demos/cafe/index.html"), P("image", "ไฟล์รูป", "เช่น assets/demo-cafe.jpg")],
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
      else if (f.kind === "plain") out[f.key] = "";
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
      ? "มีการแก้ไขที่ยังไม่ได้บันทึกเป็นไฟล์ — เก็บเป็นฉบับร่างในเบราว์เซอร์นี้แล้ว กด “ดูตัวอย่าง” เพื่อดู หรือ “บันทึกไฟล์ content.js” เพื่อใช้งานจริง"
      : "ตรงกับไฟล์ content.js ที่บันทึกไว้");
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
      wrap.append(labelFor(field), bilingual(obj, field.key, field.kind === "long"));
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
        add.onclick = function () { items.push(blankFor(field.fields)); changed(); drawList(); };
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
    if (!data[tab.path] || typeof data[tab.path] !== "object") data[tab.path] = {};
    panel.textContent = "";
    panel.appendChild(el("p", "help", tab.help));
    tab.fields.forEach(function (f) { panel.appendChild(buildField(data[tab.path], f)); });
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
  document.getElementById("preview").onclick = function () {
    changed();
    window.open("index.html", "_blank");
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
})();
