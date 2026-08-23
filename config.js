/**
 * ===========================================
 * ตั้งค่ากลาง — โมเดล ฟิกเกอร์ by แมวแชร์
 * ===========================================
 * แก้ไขค่า API_URL ด้านล่างเป็น URL ของ Google Apps Script
 * Web App ที่ deploy จาก code.gs (Deploy > New deployment > Web app)
 *
 * ตัวอย่าง:
 * const API_URL = "https://script.google.com/macros/s/AKfycb.../exec";
 */
const API_URL = "https://script.google.com/macros/s/AKfycbzy2f5sBhaIqWXLGiMYUcTL149F337BsOyxnMNkGq4vocQXB9cIFiI0Q7a2C7WAbVBgCA/exec";

/* เรียก API แบบ GET เสมอ (หลีกเลี่ยงปัญหา CORS preflight ตอนเรียกจากโดเมนอื่น เช่น GitHub Pages) */
async function apiCall(action, params) {
  params = params || {};
  const query = new URLSearchParams(Object.assign({ action: action }, params));
  const res = await fetch(API_URL + "?" + query.toString());
  if (!res.ok) throw new Error("API error: " + res.status);
  return res.json();
}

/* จัดการ session ผู้ใช้แบบง่าย ๆ ผ่าน localStorage */
const Session = {
  get user() { return localStorage.getItem("mf_user") || ""; },
  set user(v) { v ? localStorage.setItem("mf_user", v) : localStorage.removeItem("mf_user"); },
  get adminKey() { return sessionStorage.getItem("mf_admin_key") || ""; },
  set adminKey(v) { v ? sessionStorage.setItem("mf_admin_key", v) : sessionStorage.removeItem("mf_admin_key"); }
};
