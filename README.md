# 🐾 โมเดล ฟิกเกอร์ by แมวแชร์

เว็บสั่งซื้อฟิกเกอร์ออนไลน์ ชำระเงินผ่าน PromptPay QR Code
รองรับทั้ง **จัดส่งถึงบ้าน** (คิดค่าส่งตามสินค้า) และ **นัดรับที่ร้าน** (ตลาดนัดเซฟวันโก บางนา)

โครงสร้างระบบ: **Frontend (static HTML)** โฮสต์บน GitHub Pages ↔ **Backend (Google Apps Script)** เป็น JSON API ↔ **Google Sheets** เป็นฐานข้อมูล

---

## 📁 โครงสร้างไฟล์

```
├── code.gs               ← Backend (วางใน Google Apps Script)
├── config.js              ← ตั้งค่า API_URL (แก้ก่อน deploy)
├── index.html              ← หน้าแรก / สินค้าทั้งหมด
├── login.html              ← เข้าสู่ระบบ
├── register.html           ← สมัครสมาชิก
├── forgot-password.html    ← ลืมรหัสผ่าน
├── order.html              ← หน้าสั่งซื้อ + QR ชำระเงิน
├── orders.html             ← ประวัติออเดอร์ของลูกค้า
└── admin.html               ← หลังบ้านแอดมิน
```

---

## 🚀 ขั้นตอนติดตั้ง

### 1. สร้าง Google Sheet
สร้าง Google Sheet เปล่า 1 ไฟล์ แล้วคัดลอก **Sheet ID** จาก URL
(ส่วนที่อยู่ระหว่าง `/d/` กับ `/edit`)

ไม่ต้องสร้างชีทย่อยเอง — ระบบจะสร้าง `Products`, `Members`, `Orders`, `Settings` ให้อัตโนมัติตอนเรียกใช้งานครั้งแรก

### 2. Deploy Apps Script
1. เปิด [script.google.com](https://script.google.com) → สร้างโปรเจกต์ใหม่
2. คัดลอกโค้ดจาก `code.gs` ไปวาง
3. ไปที่ **Project Settings > Script Properties** เพิ่ม 2 ค่า:
   | Property | Value |
   |---|---|
   | `SHEET_ID` | Sheet ID ที่คัดลอกจากขั้นตอนที่ 1 |
   | `ADMIN_KEY` | รหัสผ่านแอดมิน (ตั้งเอง เช่น `MyCat2025!`) |
4. **Deploy > New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. คัดลอก URL ที่ได้ (ลงท้ายด้วย `/exec`)

### 3. ตั้งค่า Frontend
เปิดไฟล์ `config.js` แก้บรรทัดนี้เป็น URL ที่ได้จากขั้นตอนก่อนหน้า:
```js
const API_URL = "https://script.google.com/macros/s/xxxxxxxxx/exec";
```

### 4. Push ขึ้น GitHub
```bash
git init
git add .
git commit -m "init: โมเดล ฟิกเกอร์ by แมวแชร์"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

> ⚠️ แนะนำให้ตั้ง repo เป็น **Private** ก่อน เพราะมีข้อมูลธุรกิจจริงเกี่ยวข้อง (ดูหัวข้อความปลอดภัยด้านล่าง)

### 5. เปิดใช้งาน GitHub Pages
Settings → Pages → Source: `main` branch → Save
เว็บจะพร้อมใช้งานที่ `https://<username>.github.io/<repo>/`

### 6. ตั้งค่าร้านครั้งแรก
1. เข้า `admin.html` → ใส่รหัส `ADMIN_KEY` ที่ตั้งไว้
2. แท็บ **ตั้งค่าร้าน** → กรอกเบอร์ PromptPay, สถานที่รับสินค้า, เลือกวันเปิดร้าน
3. แท็บ **สินค้า** → เพิ่มสินค้าพร้อมค่าจัดส่งต่อชิ้น (เช่น 50 หรือ 70 บาท)

---

## 🔒 ความปลอดภัย

- **`SHEET_ID`** และ **`ADMIN_KEY`** เก็บไว้ใน Script Properties ฝั่ง Apps Script เท่านั้น **ไม่ปรากฏใน source code ที่ push ขึ้น GitHub**
- รหัสผ่านสมาชิกเก็บแบบ **SHA-256 hash** ไม่ใช่ plain text
- Action ของแอดมินทุกตัวตรวจสอบ `ADMIN_KEY` ที่ **ฝั่ง server** ไม่ใช่แค่เช็คฝั่ง browser
- แนะนำให้ตั้ง GitHub repo เป็น **Private** เนื่องจากยังมีชื่อร้าน/โครงสร้างธุรกิจอยู่ในโค้ด แม้จะไม่มีความลับเชิงเทคนิคอยู่ในนั้นแล้วก็ตาม

---

## 💳 การชำระเงิน (PromptPay QR)

ระบบสร้าง QR Code อัตโนมัติผ่าน [promptpay.io](https://promptpay.io) โดยไม่ต้องอัปโหลดรูป QR เอง
เพียงกรอกเบอร์โทรศัพท์หรือเลขบัตรประชาชนที่ผูกกับ PromptPay ในหน้าตั้งค่าร้าน ระบบจะคำนวณ QR ตามยอดที่ต้องชำระให้อัตโนมัติทุกออเดอร์

---

## 📦 การจัดส่ง / นัดรับ

| วิธีรับสินค้า | ค่าใช้จ่ายเพิ่ม | หมายเหตุ |
|---|---|---|
| จัดส่งถึงบ้าน | ตามค่าส่งที่ตั้งไว้ต่อสินค้า (เช่น 50 / 70 บาท) | ลูกค้ากรอกที่อยู่ + เบอร์โทร |
| รับที่ร้าน (ตลาดนัดเซฟวันโก บางนา) | ไม่มีค่าส่ง | ลูกค้าเลือกวันที่รับ — แอดมินกำหนดวันเปิดร้านได้ในแท็บตั้งค่า |
