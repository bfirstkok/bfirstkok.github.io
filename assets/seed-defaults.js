import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function byId(id) { return document.getElementById(id); }
function setStatus(text, type = 'info') {
  const status = byId('status');
  if (!status) return;
  status.textContent = text;
  status.className = `status ${type}`;
}

const profile = {
  name: 'Khanathippakorn Namthachak',
  subtitle: 'Computer Engineering Student · Full-Stack Web Developer · IoT & AI Builder · Cybersecurity Learner',
  lead: 'นักศึกษาวิศวกรรมคอมพิวเตอร์ มทร.อีสาน วิทยาเขตขอนแก่น โฟกัสงาน Full-Stack Web, IoT, AI, Cybersecurity และการออกแบบระบบที่เชื่อมโยงซอฟต์แวร์ ฮาร์ดแวร์ ข้อมูล และผู้ใช้งานจริงเข้าด้วยกัน',
  about1: 'ฉันชื่อ First หรือ Khanathippakorn Namthachak สนใจการพัฒนาเว็บแอป ระบบหลังบ้าน ฐานข้อมูล IoT และ AI มีประสบการณ์ทำโปรเจกต์จริง เช่น ระบบคิวโรงพยาบาล เว็บพอร์ตโฟลิโอ เว็บแอปจัดการข้อมูล IoT Dashboard รวมถึงการ deploy เว็บไซต์ด้วย GitHub Pages Firebase Vercel และ Netlify',
  about2: 'กำลังต่อยอดทักษะด้าน Cybersecurity Docker Flutter Django REST API และ Local AI Assistant จุดแข็งคือชอบลงมือทำจริง แก้ปัญหาเร็ว ทดสอบระบบเอง และพัฒนาโปรเจกต์จากไอเดียให้กลายเป็นงานที่ใช้งานได้จริง',
  phone: '0956734701',
  email: 'bfirstkok@gmail.com',
  altEmail: 'khanathippakorn@gmail.com',
  location: 'ขอนแก่น, ประเทศไทย',
  githubUrl: 'https://github.com/bfirstkok',
  websiteUrl: 'https://bfirstkok.me/',
  facebookUrl: 'https://www.facebook.com/khanathippakorn.namthachak',
  footer: '© 2026 Khanathippakorn Namthachak (First) · bfirstkok.me Portfolio',
  skills: ['Full-Stack Web', 'IoT / ESP32', 'AI Integration', 'Cybersecurity', 'Django / Python', 'React / Next.js', 'Docker', 'MySQL / MariaDB']
};

const projects = [
  { id: 'healthcare-queue-ai-triage', icon: '🏥', title: 'Healthcare Queue & AI Triage System', category: 'health', order: 1, description: 'ระบบลงทะเบียนผู้ป่วย คัดกรองอาการ และจัดคิวตามความเร่งด่วน เพื่อช่วยให้การทำงานของโรงพยาบาลเป็นระบบขึ้น', features: ['Healthcare', 'Queue', 'AI Triage', 'Dashboard'], githubUrl: '', websiteUrl: '' },
  { id: 'portfolio-bfirstkok', icon: '🌐', title: 'Personal Portfolio Website', category: 'web', order: 2, description: 'เว็บไซต์พอร์ตโฟลิโอส่วนตัวพร้อม custom domain bfirstkok.me และระบบ Admin สำหรับแก้ไขข้อมูลผ่าน Firebase', features: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'GitHub Pages'], githubUrl: 'https://github.com/bfirstkok/bfirstkok.github.io', websiteUrl: 'https://bfirstkok.me/' },
  { id: 'iot-dashboard', icon: '🔌', title: 'IoT Dashboard Project', category: 'iot', order: 3, description: 'แนวคิดระบบ dashboard สำหรับแสดงข้อมูลจาก ESP32 และ sensor แบบ real-time พร้อมเชื่อมต่อ API', features: ['IoT', 'ESP32', 'Sensor', 'REST API'], githubUrl: '', websiteUrl: '' },
  { id: 'cybersecurity-network-lab', icon: '🛡️', title: 'Cybersecurity & Network Lab', category: 'cyber', order: 4, description: 'งานแลปด้าน Linux, Docker, WSL, Nmap, Network และการเขียน write-up สำหรับการแข่งขัน/การฝึกซ้อม Cybersecurity', features: ['Linux', 'Docker', 'Nmap', 'CTF', 'Write-up'], githubUrl: '', websiteUrl: '' }
];

const news = [
  { id: 'portfolio-domain-live', title: 'Portfolio เปิดใช้งานผ่าน bfirstkok.me แล้ว', dateText: '08 ก.ค. 2569', description: 'ตั้งค่า GitHub Pages และ custom domain สำเร็จ พร้อมเริ่มเชื่อมระบบ Admin สำหรับแก้ไขข้อมูลผ่าน Firebase', tags: ['GitHub Pages', 'Domain', 'Firebase'], githubUrl: 'https://github.com/bfirstkok/bfirstkok.github.io', websiteUrl: 'https://bfirstkok.me/' },
  { id: 'firebase-admin-cms', title: 'เพิ่มระบบ Admin สำหรับจัดการ Portfolio', dateText: '08 ก.ค. 2569', description: 'เพิ่มระบบจัดการข่าวสาร Certificate โปรไฟล์ และ Projects เพื่อให้แก้ไขข้อมูลได้โดยไม่ต้องแก้โค้ดโดยตรง', tags: ['Admin', 'CMS', 'Firestore'], githubUrl: '', websiteUrl: 'https://bfirstkok.me/admin.html' }
];

const certificates = [
  { id: 'cabling-contest-12', title: 'CABLING CONTEST #12', category: 'Network / Cabling', status: 'เข้าร่วมงาน', description: 'ใบรับรองการเข้าร่วมงาน CABLING CONTEST #12 อบรมเรื่องสายเคเบิ้ล network เพื่อพัฒนาทักษะด้านระบบเครือข่ายและการจัดการสายสัญญาณ', imageUrl: 'images/CABLINGCONTEST.png' },
  { id: 'web-development-certificate', title: 'Web Development Certificate', category: 'Web / Full-Stack', status: 'พร้อมเพิ่มรูปจริง', description: 'ใบรับรองหรือหลักฐานการเรียนรู้ด้าน HTML, CSS, JavaScript, React, Django หรือ Web Application Development' },
  { id: 'iot-embedded-systems', title: 'IoT & Embedded Systems', category: 'IoT / Hardware', status: 'รอแนบไฟล์', description: 'ใบรับรองด้าน ESP32, Arduino, Sensor Integration, Embedded Systems หรือการทำโปรเจกต์ IoT' },
  { id: 'cloud-database-firebase', title: 'Cloud / Database / Firebase', category: 'Backend / Data', status: 'รออัปเดต', description: 'ใบรับรองด้าน Cloud, Database, Firebase, API หรือระบบ backend ที่เกี่ยวข้องกับการจัดการข้อมูล' }
];

async function seedDefaults() {
  const btn = byId('seedDefaultsBtn');
  try {
    if (btn) { btn.disabled = true; btn.textContent = 'กำลังนำเข้า...'; }
    setStatus('กำลังนำข้อมูลเดิมเข้า Firebase...', 'info');

    await setDoc(doc(db, 'site', 'profile'), { ...profile, updatedAt: serverTimestamp() }, { merge: true });
    for (const item of projects) await setDoc(doc(db, 'projects', item.id), { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    for (const item of news) await setDoc(doc(db, 'news', item.id), { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    for (const item of certificates) await setDoc(doc(db, 'certificates', item.id), { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });

    setStatus('นำข้อมูลเดิมเข้า Firebase แล้ว กำลังรีเฟรชรายการ...', 'ok');
    setTimeout(() => window.location.reload(), 900);
  } catch (err) {
    console.error(err);
    setStatus(`นำเข้าข้อมูลไม่สำเร็จ: ${err.code || ''} ${err.message || err}`, 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'นำข้อมูลเดิมเข้า Admin'; }
  }
}

function installSeedPanel() {
  if (byId('seedDefaultsBtn')) return;
  const adminApp = byId('adminApp');
  if (!adminApp) return;
  const panel = document.createElement('div');
  panel.className = 'notice';
  panel.innerHTML = '<b>ข้อมูลเดิมยังไม่ขึ้น?</b><br>กดปุ่มนี้ 1 ครั้งเพื่อคัดลอกข้อมูลเดิมเข้า Firebase จากนั้นระบบจะรีเฟรช แล้วรายการจะขึ้นให้กดแก้ไขได้เหมือนโพสต์ Facebook<br><div class="actions"><button id="seedDefaultsBtn" type="button"><i class="bi bi-cloud-upload"></i> นำข้อมูลเดิมเข้า Admin</button></div>';
  const tabs = adminApp.querySelector('.tabs');
  adminApp.insertBefore(panel, tabs);
  byId('seedDefaultsBtn').addEventListener('click', seedDefaults);
}

onAuthStateChanged(auth, (user) => {
  if (user) setTimeout(installSeedPanel, 500);
});
