// เนื้อหาทั้งหมดของเว็บแนะนำตัว — ไฟล์นี้สร้างและแก้จากหน้าแอดมิน (admin.html)
// แก้ด้วยมือได้เหมือนกัน: ข้อความแต่ละจุดมีสองภาษา { "th": "ไทย", "en": "English" }
window.CONTENT = {
  "site": {
    "name": "CAN DESIGN WEB STUDIO",
    "lineId": "",
    "phone": "",
    "email": "",
    "facebook": ""
  },
  "hero": {
    "kicker": { "th": "รับทำเว็บไซต์ · ร้านค้าออนไลน์ · เว็บธุรกิจ", "en": "Web design · Online shops · Business websites" },
    "title1": { "th": "ลองใช้เว็บของคุณก่อน", "en": "Try your website first" },
    "title2": { "th": "แล้วค่อยตัดสินใจจ้าง", "en": "then decide whether to hire" },
    "lead": {
      "th": "ไม่ต้องทักมาขอดูตัวอย่าง มีเว็บตัวอย่าง 17 ธุรกิจให้กดลองใช้ได้ทันที ทั้งคิดราคา จองคิว และสั่งของผ่าน LINE สลับได้สองภาษา เลือกแบบที่ชอบ หรือให้ออกแบบใหม่ตามแบรนด์ของคุณ",
      "en": "No need to message and ask for samples. Seventeen sample sites are here to try right now — pricing, booking and ordering through LINE, in two languages. Pick the design you like, or have a new one made for your brand."
    },
    "button1": { "th": "ลองเว็บตัวอย่าง 17 แบบ", "en": "Try the 17 samples" },
    "button2": { "th": "ดูราคา", "en": "See prices" },
    "proof": [
      { "big": "17", "text": { "th": "เว็บตัวอย่างที่ลองใช้ได้จริง", "en": "working samples to try" } },
      { "big": "2", "text": { "th": "ภาษา ไทยและอังกฤษ", "en": "languages, Thai and English" } },
      { "big": "LINE", "text": { "th": "รับออเดอร์และจองคิว", "en": "for orders and bookings" } }
    ]
  },
  "work": {
    "title": { "th": "ผลงานจริง", "en": "Real work" },
    "menu": { "th": "ผลงาน", "en": "Work" },
    "items": [
      {
        "type": { "th": "ร้านค้าออนไลน์ · แฟชั่น", "en": "Online shop · Fashion" },
        "name": "CherryMing Shop",
        "desc": {
          "th": "ร้านรองเท้า เสื้อผ้า และเครื่องประดับ สำหรับลูกค้าไทยและต่างชาติ ทำทั้งหน้าร้านและระบบหลังบ้านครบในเว็บเดียว",
          "en": "A shop for shoes, clothing and accessories, for Thai and international customers. Storefront and admin system built together as one site."
        },
        "points": [
          { "th": "หน้าร้านสองภาษา ไทยและอังกฤษ", "en": "Storefront in two languages, Thai and English" },
          { "th": "ตะกร้าสินค้า เลือกไซซ์ เช็กสต็อกตามจริง", "en": "Cart with size selection and live stock checks" },
          { "th": "สั่งซื้อผ่าน LINE ระบบสร้างออเดอร์และแจ้งสถานะให้อัตโนมัติ", "en": "Ordering through LINE — orders are created and status updates sent automatically" },
          { "th": "คูปองส่วนลด ของแถม และรางวัลลูกค้าประจำ", "en": "Discount coupons, free gifts and a loyalty reward" },
          { "th": "หลังบ้านสำหรับเพิ่มสินค้า รูป วิดีโอ และจัดการออเดอร์", "en": "Admin area for products, photos, video and order handling" }
        ],
        "url": "https://cherryming.shop",
        "image": "assets/work-cherryming.jpg",
        "linkText": { "th": "เปิดดูเว็บจริง →", "en": "Visit the live site →" }
      }
    ]
  },
  "demos": {
    "title": { "th": "ตัวอย่างดีไซน์", "en": "Design samples" },
    "menu": { "th": "ตัวอย่างดีไซน์", "en": "Samples" },
    "note": {
      "th": "เว็บตัวอย่างสิบหกธุรกิจ สิบหกสไตล์ แต่ละเว็บมีฟังก์ชันที่ลองใช้ได้จริง เช่น คิดราคา จองคิว และสั่งของ มีแผนที่ Google Maps และสลับภาษาไทย/อังกฤษได้ กดเข้าไปลองได้เลย (เป็นตัวอย่าง ไม่ใช่ลูกค้าจริง)",
      "en": "Seventeen sample sites for sixteen kinds of business, each in its own style. Every one has features you can try — pricing, booking, ordering — a Google Map, and a switch between Thai and English. Open them and have a go. (These are samples, not real clients.)"
    },
    "items": [
      { "link": "demos/cafe/index.html", "image": "assets/demo-cafe.jpg", "title": { "th": "คาเฟ่และร้านอาหาร", "en": "Cafés & restaurants" }, "desc": { "th": "เลือกเมนูตามหมวด กดสั่งล่วงหน้าพร้อมยอดรวม และบอกว่าร้านเปิดอยู่ไหม", "en": "Menu by category, order ahead with a running total, and an open-now badge" } },
      { "link": "demos/hostel/index.html", "image": "assets/demo-hostel.jpg", "title": { "th": "โรงแรมและโฮสเทล", "en": "Hotels & hostels" }, "desc": { "th": "เลือกวันเข้าพักและห้อง ระบบคิดจำนวนคืน ส่วนลด และยอดรวมให้", "en": "Pick dates and a room — nights, discount and total are worked out for you" } },
      { "link": "demos/spa/index.html", "image": "assets/demo-spa.jpg", "title": { "th": "สปาและร้านนวด", "en": "Spas & massage" }, "desc": { "th": "แตะเลือกบริการ วัน เวลา จำนวนคน แล้วเห็นราคารวมทันที", "en": "Tap a treatment, day, time and number of people to see the total at once" } },
      { "link": "demos/nails/index.html", "image": "assets/demo-nails.jpg", "title": { "th": "ร้านทำเล็บ", "en": "Nail salons" }, "desc": { "th": "ติ๊กบริการ ใส่จำนวนนิ้วที่เพ้นท์ เลือกสี แล้วดูราคาประมาณ", "en": "Tick services, enter how many nails get art, pick a colour and see the estimate" } },
      { "link": "demos/clinic/index.html", "image": "assets/demo-clinic.jpg", "title": { "th": "คลินิกความงาม", "en": "Beauty clinics" }, "desc": { "th": "ฟอร์มจองคิวที่ตรวจข้อมูลให้ เลือกเวลาได้ และคำถามที่พบบ่อย", "en": "A booking form that checks itself, time slots, and an FAQ" } },
      { "link": "demos/dental/index.html", "image": "assets/demo-dental.jpg", "title": { "th": "คลินิกทำฟัน", "en": "Dental clinics" }, "desc": { "th": "ปฏิทินนัดหมาย เห็นคิวว่างและคิวเต็มของแต่ละวัน", "en": "An appointment calendar showing free and taken slots for each day" } },
      { "link": "demos/tutor/index.html", "image": "assets/demo-tutor.jpg", "title": { "th": "โรงเรียนกวดวิชา", "en": "Tutoring schools" }, "desc": { "th": "กรองคอร์สตามระดับชั้น เลือกหลายวิชาแล้วรวมค่าเรียนพร้อมส่วนลด", "en": "Filter courses by level and add up the fees, discount included" } },
      { "link": "demos/contractor/index.html", "image": "assets/demo-contractor.jpg", "title": { "th": "ช่างและงานบริการ", "en": "Builders & trades" }, "desc": { "th": "ประเมินราคาจากประเภทงาน พื้นที่ และเกรดวัสดุ กรองผลงานตามประเภท", "en": "A price estimate from job type, area and material grade, and past work by category" } },
      { "link": "demos/gym/index.html", "image": "assets/demo-gym.jpg", "title": { "th": "ฟิตเนสและโยคะ", "en": "Gyms & yoga studios" }, "desc": { "th": "ตารางคลาสรายวัน กดจองคลาส เห็นที่ว่าง และคิดค่าสมาชิกตามระยะสัญญา", "en": "A daily class timetable with places left, class booking, and membership priced by contract length" } },
      { "link": "demos/pet/index.html", "image": "assets/demo-pet.jpg", "title": { "th": "ร้านและโรงแรมสัตว์เลี้ยง", "en": "Pet grooming & hotels" }, "desc": { "th": "เลือกชนิดและขนาดตัว บริการ และจำนวนคืนฝากเลี้ยง ราคาเปลี่ยนตามทันที", "en": "Choose the pet, its size, the services and nights of boarding — the price follows" } },
      { "link": "demos/property/index.html", "image": "assets/demo-property.jpg", "title": { "th": "อสังหาริมทรัพย์", "en": "Real estate" }, "desc": { "th": "กรองและเรียงประกาศเช่า/ขาย นัดชมห้อง และคำนวณค่างวดสินเชื่อ", "en": "Filter and sort listings to rent or buy, arrange a viewing, and a mortgage calculator" } },
      { "link": "demos/photo/index.html", "image": "assets/demo-photo.jpg", "title": { "th": "สตูดิโอถ่ายภาพ", "en": "Photography studios" }, "desc": { "th": "แกลเลอรีกรองตามประเภท เปิดดูเต็มจอ และจัดแพ็กเกจพร้อมบริการเสริม", "en": "A gallery filtered by category with a full-screen viewer, and a package builder with add-ons" } },
      { "link": "demos/carrental/index.html", "image": "assets/demo-carrental.jpg", "title": { "th": "รถเช่า", "en": "Car rental" }, "desc": { "th": "เลือกวันเวลารับคืนรถ ระบบนับจำนวนวัน กรองรถตามที่นั่ง และรวมบริการเสริม", "en": "Pick-up and return times counted into rental days, cars filtered by seats, and extras added up" } },
      { "link": "demos/cake/index.html", "image": "assets/demo-cake.jpg", "title": { "th": "ร้านดอกไม้และเค้ก", "en": "Florists & cake shops" }, "desc": { "th": "ออกแบบเค้กเอง เห็นภาพเค้กเปลี่ยนตามขนาด สี ข้อความ และเทียนที่เลือก", "en": "Design your own cake and watch it change with the size, colour, message and candles you choose" } },
      { "link": "demos/accounting/index.html", "image": "assets/demo-accounting.jpg", "title": { "th": "สำนักงานบัญชี", "en": "Accounting firms" }, "desc": { "th": "ประเมินค่าบริการรายเดือนจากขนาดกิจการ และแสดงกำหนดยื่นภาษีที่ใกล้ถึง", "en": "A monthly fee estimate from the size of the business, and the tax deadlines coming up" } },
      { "link": "demos/garage/index.html", "image": "assets/demo-garage.jpg", "title": { "th": "อู่ซ่อมรถ", "en": "Car repair garages" }, "desc": { "th": "ติ๊กงานซ่อมเพื่อดูราคาและเวลา และเช็กระยะว่าถึงกำหนดเปลี่ยนอะไรบ้าง", "en": "Tick repair jobs to see cost and time, and check what is due at your car's mileage" } },
      { "link": "demos/wholesale/index.html", "image": "assets/demo-wholesale.jpg", "title": { "th": "โรงงานขายส่ง", "en": "Wholesale factories" }, "desc": { "th": "ยิ่งซื้อยิ่งถูก พิมพ์จำนวนแล้วเห็นราคาส่งแต่ละขั้น รวมใบเสนอราคา ส่งทาง LINE", "en": "Buy more, pay less: type a quantity to see each price step, build a quote, send it on LINE" } }
    ]
  },
  "why": {
    "title": { "th": "ทำไมต้องเรา", "en": "Why us" },
    "menu": { "th": "ทำไมต้องเรา", "en": "Why us" },
    "note": {
      "th": "เว็บราคาถูกหาได้ไม่ยาก สิ่งที่ต่างกันคือคุณได้อะไรกลับไป นี่คือคำถามที่ควรถามทุกเจ้าก่อนจ้าง และคำตอบของเรา",
      "en": "A cheap website is easy to find. What differs is what you get back. These are the questions worth asking anyone before you hire them — and our answers."
    },
    "items": [
      { "q": { "th": "ขอดูตัวอย่างงานได้ไหม", "en": "Can I see samples of your work?" }, "a": { "th": "ดูได้เลยตอนนี้ ไม่ต้องทักมาขอ มีเว็บตัวอย่าง 17 ธุรกิจและผลงานจริงให้เปิดลองใช้ทั้งหน้า", "en": "Yes, right now, without asking. Seventeen sample sites and a real client site are here to open and use in full." } },
      { "q": { "th": "เว็บทำอะไรได้ นอกจากมีไว้ให้ดู", "en": "What does the site do, beyond being looked at?" }, "a": { "th": "คิดราคา จองคิว เลือกเมนู แล้วส่งรายละเอียดเข้า LINE ของร้านให้ ลูกค้าของคุณกดสั่งได้เลย ไม่ต้องพิมพ์ถามทีละข้อ", "en": "It works out prices, takes bookings and menu choices, and sends the details to your LINE. Your customers order in a few taps instead of typing question after question." } },
      { "q": { "th": "ลูกค้าต่างชาติอ่านได้ไหม", "en": "Can foreign customers read it?" }, "a": { "th": "ทุกเว็บสลับภาษาไทยและอังกฤษได้ในปุ่มเดียว รวมถึงข้อความที่ส่งเข้า LINE", "en": "Every site switches between Thai and English with one button, including the message sent to LINE." } },
      { "q": { "th": "เปิดบนมือถือแล้วเป็นอย่างไร", "en": "How does it look on a phone?" }, "a": { "th": "ออกแบบและทดสอบบนจอมือถือทุกหน้า ซึ่งเป็นที่ที่ลูกค้าส่วนใหญ่เปิดดู", "en": "Every page is designed for and tested on a phone screen — where most customers will open it." } },
      { "q": { "th": "เว็บและโดเมนเป็นของใคร", "en": "Who owns the site and the domain?" }, "a": { "th": "เป็นของคุณ โดเมนจดในชื่อคุณ ไฟล์เว็บส่งมอบให้ทั้งหมด ย้ายไปที่อื่นได้ทุกเมื่อ ไม่ถูกผูกไว้กับเรา", "en": "You do. The domain is registered in your name and all the site files are handed over. You can move elsewhere at any time; nothing ties you to us." } },
      { "q": { "th": "ปีถัดไปต้องจ่ายเท่าไร", "en": "What will it cost next year?" }, "a": { "th": "บอกตั้งแต่วันแรก ค่าต่ออายุโดเมนและพื้นที่เว็บปีละ 790 บาท ไม่มีค่าใช้จ่ายที่มาบอกทีหลัง", "en": "You are told on day one. Domain and hosting renewal is 790 baht a year. No costs that turn up later." } }
    ]
  },
  "services": {
    "title": { "th": "บริการ", "en": "Services" },
    "items": [
      { "title": { "th": "เว็บร้านค้าออนไลน์", "en": "Online shops" }, "desc": { "th": "แสดงสินค้า ราคา สต็อก ตะกร้า และรับออเดอร์ รองรับทั้งขายปลีกและขายส่งตามจำนวน", "en": "Products, prices, stock, a cart and orders — for retail, or wholesale with prices by quantity." } },
      { "title": { "th": "เว็บแนะนำธุรกิจ", "en": "Business websites" }, "desc": { "th": "หน้าเดียวหรือหลายหน้า สำหรับร้านอาหาร คลินิก บริษัท หรืองานบริการ", "en": "One page or several, for restaurants, clinics, companies and service businesses." } },
      { "title": { "th": "ระบบหลังบ้าน", "en": "Admin system" }, "desc": { "th": "เพิ่มสินค้า เปลี่ยนรูป แก้ข้อความ และดูออเดอร์ได้เอง ไม่ต้องเขียนโค้ด", "en": "Add products, change photos, edit wording and see orders yourself. No code needed." } },
      { "title": { "th": "เชื่อมต่อ LINE", "en": "LINE integration" }, "desc": { "th": "ลูกค้ากดสั่งแล้วเข้าแชท LINE ของร้าน พร้อมข้อความแจ้งสถานะออเดอร์อัตโนมัติ", "en": "Customers tap to order and land in your LINE chat, with automatic order-status messages." } },
      { "title": { "th": "ใช้ได้ดีบนมือถือ", "en": "Built for phones" }, "desc": { "th": "ออกแบบให้อ่านง่ายและกดง่ายบนหน้าจอเล็ก ซึ่งเป็นที่ที่ลูกค้าส่วนใหญ่เปิดดู", "en": "Easy to read and easy to tap on a small screen — where most customers will see it." } },
      { "title": { "th": "ดูแลหลังส่งมอบ", "en": "After-launch care" }, "desc": { "th": "มีคู่มือการใช้งาน และรับแก้ไขหรือเพิ่มส่วนใหม่ภายหลัง", "en": "A user guide comes with the site, and changes or new sections can be added later." } }
    ],
    "stepsTitle": { "th": "ขั้นตอนการทำงาน", "en": "How it works" },
    "steps": [
      { "title": { "th": "คุยความต้องการ", "en": "Talk it through" }, "desc": { "th": "ธุรกิจของคุณ ลูกค้าของคุณ และสิ่งที่อยากให้เว็บทำได้", "en": "Your business, your customers, and what the site should do." } },
      { "title": { "th": "ออกแบบ", "en": "Design" }, "desc": { "th": "เสนอหน้าตาและโทนสีให้ดูก่อนลงมือทำจริง", "en": "You see the look and the colours before anything is built." } },
      { "title": { "th": "พัฒนาและทดสอบ", "en": "Build and test" }, "desc": { "th": "ทำเว็บ ลองใช้งานจริง และแก้ตามที่คุณต้องการ", "en": "The site is built, tried out for real, and adjusted to what you want." } },
      { "title": { "th": "ส่งมอบ", "en": "Hand over" }, "desc": { "th": "นำเว็บขึ้นออนไลน์ พร้อมสอนใช้ระบบหลังบ้าน", "en": "The site goes online and you are shown how to use the admin area." } }
    ]
  },
  "pricing": {
    "title": { "th": "ราคา", "en": "Pricing" },
    "menu": { "th": "ราคา", "en": "Pricing" },
    "note": {
      "th": "ราคาเริ่มต้นของแต่ละแบบ บอกชัดว่ารวมอะไรและไม่รวมอะไร ราคาสุดท้ายแจ้งให้ทราบก่อนเริ่มงานทุกครั้ง",
      "en": "Starting prices for each kind of site, with what is included spelled out. The final price is always agreed before work starts."
    },
    "button": { "th": "สอบถามแพ็กเกจนี้", "en": "Ask about this plan" },
    "plans": [
      {
        "name": { "th": "เริ่มต้น", "en": "Starter" },
        "price": 1490,
        "from": false,
        "best": false,
        "note": { "th": "เลือก 1 ใน 17 แบบ ใส่ข้อมูลร้านของคุณ", "en": "Pick one of the 17 designs, with your shop's details" },
        "items": [
          { "th": "เว็บหน้าเดียวตามแบบที่เลือก", "en": "One-page site in the design you choose" },
          { "th": "ฟังก์ชันของแบบนั้น เช่น คิดราคา จองคิว", "en": "That design's features, such as pricing and booking" },
          { "th": "โดเมน .com และพื้นที่เว็บ 1 ปี", "en": ".com domain and hosting for 1 year" },
          { "th": "ส่งงานใน 3 วัน หลังได้ข้อมูลครบ", "en": "Delivered in 3 days once we have your content" },
          { "th": "แก้ไขฟรี 14 วันหลังส่งมอบ", "en": "Free changes for 14 days after delivery" }
        ]
      },
      {
        "name": { "th": "ปรับแต่ง", "en": "Custom" },
        "price": 4900,
        "from": false,
        "best": true,
        "note": { "th": "ปรับสี โลโก้ และฟังก์ชันให้เป็นของคุณ", "en": "Colours, logo and features made your own" },
        "items": [
          { "th": "ทุกอย่างในแพ็กเกจเริ่มต้น", "en": "Everything in Starter" },
          { "th": "ปรับสี ฟอนต์ และจัดหน้าตามแบรนด์", "en": "Colours, fonts and layout to match your brand" },
          { "th": "ปรับฟังก์ชันให้ตรงกับร้าน เช่น ราคา คิว เมนู", "en": "Features fitted to your shop: prices, slots, menu" },
          { "th": "สองภาษา ไทยและอังกฤษ", "en": "Two languages, Thai and English" },
          { "th": "ส่งงานใน 7 วัน แก้ไขฟรี 30 วัน", "en": "Delivered in 7 days, free changes for 30 days" }
        ]
      },
      {
        "name": { "th": "หลายหน้า + แก้เองได้", "en": "Multi-page + admin" },
        "price": 19000,
        "from": true,
        "best": false,
        "note": { "th": "สำหรับธุรกิจที่อัปเดตเนื้อหาบ่อย", "en": "For businesses that update often" },
        "items": [
          { "th": "5–8 หน้า ออกแบบใหม่ทั้งหมด", "en": "5–8 pages, designed from scratch" },
          { "th": "ระบบหลังบ้าน แก้ข้อความ รูป ข่าวสารเอง", "en": "Admin area to edit text, photos and news yourself" },
          { "th": "สองภาษา ไทยและอังกฤษ", "en": "Two languages, Thai and English" },
          { "th": "สอนใช้งานและมีคู่มือ", "en": "Training and a user guide" }
        ]
      },
      {
        "name": { "th": "ร้านค้าเต็มระบบ", "en": "Full online shop" },
        "price": 45000,
        "from": true,
        "best": false,
        "note": { "th": "แบบเดียวกับ CherryMing Shop", "en": "The same kind of system as CherryMing Shop" },
        "items": [
          { "th": "สินค้า สต็อก ตะกร้า และออเดอร์", "en": "Products, stock, cart and orders" },
          { "th": "สั่งซื้อและแจ้งสถานะผ่าน LINE", "en": "Ordering and status updates through LINE" },
          { "th": "คูปอง ของแถม ราคาส่งตามจำนวน", "en": "Coupons, free gifts, wholesale price tiers" },
          { "th": "หลังบ้านครบ ทั้งสินค้าและออเดอร์", "en": "Full admin for products and orders" }
        ]
      }
    ]
  },
  "contact": {
    "title": { "th": "ติดต่อ", "en": "Contact" },
    "lead": {
      "th": "เล่าให้ฟังว่าธุรกิจของคุณเป็นแบบไหนและอยากได้เว็บแบบใด ปรึกษาและประเมินราคาฟรี",
      "en": "Tell me about your business and the website you have in mind. Advice and a quotation are free."
    }
  }
};
