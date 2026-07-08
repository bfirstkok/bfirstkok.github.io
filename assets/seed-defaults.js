import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, doc, setDoc, deleteDoc, collection, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

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
  {
    id: 'project-hospital-queue',
    icon: '🏥',
    title: 'ระบบติดตามผู้ป่วยและจัดการคิว',
    category: 'health,web',
    meta: 'โครงงานหลัก / โรงพยาบาล',
    badge: 'Healthcare System',
    order: 1,
    description: 'พัฒนาระบบติดตามผู้ป่วยและจัดการคิวที่เชื่อมโยงข้อมูลทางการแพทย์เบื้องต้น ระบบคัดกรอง และลำดับผู้ป่วยแบบอัตโนมัติ',
    features: ['พัฒนาเว็บแอปสำหรับติดตามและจัดการลำดับผู้ป่วยในสถานพยาบาล', 'สร้างฐานข้อมูลคนไข้ การลงทะเบียน และแสดงผลสถานะการคัดกรอง', 'ออกแบบส่วนสำหรับบันทึกอาการเบื้องต้นและเชื่อมต่อข้อมูลผู้ป่วย', 'พัฒนา Backend ฐานข้อมูล และส่วนติดต่อผู้ใช้ เพื่อรองรับการใช้งานแบบ AI/ML ในระบบ'],
    tags: ['Healthcare', 'Web Application', 'Database Design', 'AI/ML Support'],
    githubUrl: 'https://github.com/bfirstkok/Project_hospital_queue',
    websiteUrl: ''
  },
  {
    id: 'smart-medicine-storage-room',
    icon: '💊',
    title: 'Smart Medicine Storage Room',
    category: 'iot',
    meta: 'โครงงาน IoT + Digital Twin',
    badge: 'IoT Project',
    order: 2,
    description: 'พัฒนาระบบห้องเก็บยาอัจฉริยะด้วย ESP32 และเซนเซอร์สำหรับตรวจวัดสภาพแวดล้อม พร้อมแสดงผลและควบคุมผ่าน Dashboard และแนวคิด Digital Twin',
    features: ['พัฒนาระบบห้องเก็บยาจำลองด้วย ESP32 และเซนเซอร์สำหรับตรวจวัดสภาพแวดล้อม', 'เชื่อมต่อข้อมูลแบบเรียลไทม์ผ่าน API และพัฒนาแดชบอร์ดติดตามสถานะ', 'วิเคราะห์และจำลองพฤติกรรมของระบบด้วยแนวคิด Digital Twin'],
    tags: ['ESP32', 'IoT', 'Dashboard', 'Digital Twin', 'REST API'],
    githubUrl: 'https://github.com/bfirstkok/Smart-Medicine-Room-_-ESP32',
    websiteUrl: ''
  },
  {
    id: 'dino-forum-web-application',
    icon: '🦖',
    title: 'Dino Forum Web Application',
    category: 'web',
    meta: 'โครงงานพัฒนาเว็บ',
    badge: 'Web Project',
    order: 3,
    description: 'พัฒนาระบบเว็บบอร์ดด้วย Django สำหรับการตั้งกระทู้ ตอบกลับ และจัดการเนื้อหา พร้อมระบบสมาชิกและการแสดงผลแบบ Responsive',
    features: ['พัฒนาเว็บบอร์ดด้วย Django โดยมีการจัดการหมวดหมู่ผู้ใช้และการตั้งกระทู้', 'สร้างระบบล็อกอินและส่วนติดต่อผู้ใช้ที่รองรับการใช้งานบนหลายอุปกรณ์', 'พัฒนาแอปฝึกฝนและต่อยอดทักษะจาก Web Programming, Spring Boot, ESP32 และระบบเว็บโดยรวม'],
    tags: ['Django', 'Web Programming', 'Responsive UI', 'Authentication'],
    githubUrl: 'https://github.com/bfirstkok/Dino-forum',
    websiteUrl: ''
  },
  {
    id: 'omyno-cash-flow',
    icon: '💸',
    title: 'OmyNo Cash Flow',
    category: 'web',
    meta: 'Web Application / Statement & Cash Flow Management',
    badge: 'Web Project',
    order: 4,
    description: 'เว็บแอปสำหรับช่วยทำและจัดการ statement/cash flow ให้ใช้งานได้จริงบนเว็บ พร้อมจัดเก็บซอร์สโค้ดบน GitHub และ deploy ผ่าน Firebase Hosting',
    features: ['พัฒนาเว็บแอปสำหรับจัดการข้อมูล statement และ cash flow ในรูปแบบที่ใช้งานง่าย', 'ออกแบบหน้าจอสำหรับบันทึก ตรวจสอบ และสรุปข้อมูลการเงินส่วนบุคคลหรือโปรเจกต์', 'Deploy เป็นเว็บไซต์จริงเพื่อให้เปิดใช้งานและทดสอบผ่านเบราว์เซอร์ได้ทันที'],
    tags: ['Web Application', 'Cash Flow', 'Statement', 'Firebase Hosting'],
    githubUrl: 'https://github.com/bfirstkok/web_MakeStatement',
    websiteUrl: 'https://omynocashflow.web.app/'
  },
  {
    id: 'store-stoke-system',
    icon: '📦',
    title: 'StoreStokeSystem',
    category: 'web',
    meta: 'Store Stock Management System',
    badge: 'Web Project',
    order: 5,
    description: 'ระบบสำหรับจัดการสต๊อกสินค้าในร้าน ช่วยบันทึกข้อมูลสินค้า ตรวจสอบจำนวนคงเหลือ และวางโครงสร้างสำหรับการติดตามรายการรับเข้า/จ่ายออกของสินค้า',
    features: ['พัฒนาระบบจัดการข้อมูลสินค้าและจำนวนสต๊อกสำหรับงานร้านค้าหรือคลังขนาดเล็ก', 'วางโครงสร้างการทำงานสำหรับเพิ่ม แก้ไข ตรวจสอบ และติดตามสถานะสินค้า', 'ฝึกออกแบบ workflow ระบบจัดการข้อมูลที่ต่อยอดเป็น dashboard หรือระบบหลังบ้านได้'],
    tags: ['Stock Management', 'Inventory', 'Web Application', 'CRUD'],
    githubUrl: 'https://github.com/bfirstkok/StoreStokeSystem',
    websiteUrl: 'https://store-stoke-system.vercel.app/'
  },
  {
    id: 'otoverse',
    icon: '🎵',
    title: 'OtoVerse',
    category: 'web',
    meta: 'โปรเจกต์ Web Application / Anime Music Quiz Platform',
    badge: 'Web Project',
    order: 6,
    description: 'พัฒนาเว็บเกมทายเพลงอนิเมะ OP/ED พร้อมคลังข้อมูลเพลง ฟีเจอร์โซเชียล ระบบจัดอันดับผู้เล่น โปรไฟล์ผู้ใช้ และการแชร์ผลลัพธ์ โดยพัฒนาด้วย React, Vite, TailwindCSS และ Firebase',
    features: ['พัฒนาเกมทายเพลงอนิเมะที่รองรับหลายโหมด เช่น ปกติ, Daily Challenge, Favorites และเล่นกลุ่ม', 'ออกแบบระบบ Community, Chat, Profile และ Leaderboard เพื่อเพิ่มประสบการณ์ผู้ใช้', 'เชื่อมต่อ Firebase Authentication, Firestore และ Storage สำหรับจัดการข้อมูลและผู้ใช้งาน', 'Deploy ใช้งานจริงบนเว็บไซต์และเชื่อมโดเมนสำหรับโปรเจกต์'],
    tags: ['Web Application', 'React', 'Vite', 'TailwindCSS', 'Firebase', 'Game Project'],
    githubUrl: 'https://github.com/bfirstkok/OtoVerse',
    websiteUrl: 'https://otoverse.games/'
  }
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

async function replaceCollection(name, rows) {
  const snap = await getDocs(collection(db, name));
  for (const oldDoc of snap.docs) await deleteDoc(doc(db, name, oldDoc.id));
  for (const item of rows) await setDoc(doc(db, name, item.id), { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
}

async function seedDefaults() {
  const btn = byId('seedDefaultsBtn');
  try {
    if (btn) { btn.disabled = true; btn.textContent = 'กำลังนำเข้า...'; }
    setStatus('กำลังซิงก์ข้อมูลเดิมเข้า Firebase...', 'info');

    await setDoc(doc(db, 'site', 'profile'), { ...profile, updatedAt: serverTimestamp() }, { merge: true });
    await replaceCollection('projects', projects);
    await replaceCollection('news', news);
    await replaceCollection('certificates', certificates);

    setStatus('ซิงก์ข้อมูลเดิมเข้า Firebase แล้ว กำลังรีเฟรชรายการ...', 'ok');
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
  panel.innerHTML = '<b>ต้องการให้รายการ Admin ตรงกับหน้าเว็บจริง?</b><br>กดปุ่มนี้เพื่อซิงก์ข้อมูลเดิมจากหน้าเว็บเข้า Firebase โดยเฉพาะ Projects จะถูกปรับเป็นชุดเดียวกับ Section ผลงานและโครงงานจริง<br><div class="actions"><button id="seedDefaultsBtn" type="button"><i class="bi bi-cloud-upload"></i> ซิงก์ข้อมูลเดิมเข้า Admin</button></div>';
  const tabs = adminApp.querySelector('.tabs');
  adminApp.insertBefore(panel, tabs);
  byId('seedDefaultsBtn').addEventListener('click', seedDefaults);
}

onAuthStateChanged(auth, (user) => {
  if (user) setTimeout(installSeedPanel, 500);
});
