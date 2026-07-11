import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = (id) => document.getElementById(id);
const lines = (value) => String(value || '').split('\n').map(v => v.trim()).filter(Boolean);
const csv = (value) => String(value || '').split(',').map(v => v.trim()).filter(Boolean);
const row = (line) => line.split('|').map(v => v.trim());

function status(text, type = 'info') {
  const el = $('status');
  if (el) { el.textContent = text; el.className = `status ${type}`; }
}

function panelHtml() {
  return `
    <section id="extendedEditor" class="card full">
      <h2>แก้ไขหัวข้อและ Section อื่น ๆ</h2>
      <p class="hint">ใช้รูปแบบบรรทัดตามตัวอย่าง คั่นข้อมูลด้วยเครื่องหมาย |</p>
      <form id="sectionsForm">
        <div class="mini-grid">
          <div><label>หัวข้อทักษะ</label><input id="skillsTitle"></div>
          <div><label>คำอธิบายทักษะ</label><input id="skillsSub"></div>
          <div><label>หัวข้อประสบการณ์ทำงาน</label><input id="experienceTitle"></div>
          <div><label>คำอธิบายประสบการณ์</label><input id="experienceSub"></div>
          <div><label>หัวข้อประวัติการศึกษา</label><input id="educationTitle"></div>
          <div><label>คำอธิบายการศึกษา</label><input id="educationSub"></div>
          <div><label>หัวข้อผลงานและโครงงาน</label><input id="projectsTitle"></div>
          <div><label>คำอธิบายผลงานและโครงงาน</label><input id="projectsSub"></div>
          <div><label>หัวข้อผลงานที่สมบูรณ์</label><input id="portfolioTitle"></div>
          <div><label>คำอธิบายผลงานที่สมบูรณ์</label><input id="portfolioSub"></div>
          <div><label>หัวข้อติดต่อ</label><input id="contactTitle"></div>
          <div><label>คำอธิบายติดต่อ</label><input id="contactSub"></div>
        </div>
        <div class="actions"><button type="submit">บันทึกหัวข้อทั้งหมด</button></div>
      </form>

      <form id="educationForm">
        <h3>ประวัติการศึกษา</h3>
        <p class="hint">หนึ่งบรรทัดต่อหนึ่งรายการ: ชื่อ | รายละเอียด</p>
        <textarea id="educationRows"></textarea>
        <div class="actions"><button type="submit">บันทึกประวัติการศึกษา</button></div>
      </form>

      <form id="experienceForm">
        <h3>ประสบการณ์ทำงาน</h3>
        <p class="hint">หนึ่งบรรทัดต่อหนึ่งรายการ: ชื่องาน | รายละเอียด | วันที่ | tags คั่น comma</p>
        <textarea id="experienceRows"></textarea>
        <div class="actions"><button type="submit">บันทึกประสบการณ์ทำงาน</button></div>
      </form>

      <form id="portfolioWorksForm">
        <h3>ผลงานที่สมบูรณ์</h3>
        <p class="hint">หนึ่งบรรทัดต่อหนึ่งรายการ: ชื่อ | รายละเอียด | URL | icon/emoji | tags คั่น comma</p>
        <textarea id="portfolioRows"></textarea>
        <div class="actions"><button type="submit">บันทึกผลงานที่สมบูรณ์</button></div>
      </form>

      <form id="contactHighlightsForm">
        <h3>จุดเด่นในหน้าติดต่อ</h3>
        <p class="hint">หนึ่งบรรทัดต่อหนึ่งจุดเด่น</p>
        <textarea id="contactRows"></textarea>
        <div class="actions"><button type="submit">บันทึกจุดเด่นติดต่อ</button></div>
      </form>
    </section>`;
}

function defaults() {
  return {
    sections: {
      skillsTitle: 'ทักษะ', skillsSub: 'เครื่องมือ ภาษา และเทคโนโลยีที่ใช้งานในโปรเจกต์',
      experienceTitle: 'ประสบการณ์ทำงาน', experienceSub: 'ประสบการณ์จากงานจริง โปรเจกต์จริง และกิจกรรมพัฒนาทักษะสายเทคโนโลยี',
      educationTitle: 'ประวัติการศึกษา', educationSub: 'เส้นทางการศึกษาหลักและพื้นฐานด้านวิศวกรรมคอมพิวเตอร์',
      projectsTitle: 'ผลงานและโครงงาน', projectsSub: 'โปรเจกต์ที่สอดคล้องกับ resume',
      portfolioTitle: 'ผลงานที่สมบูรณ์', portfolioSub: 'เว็บไซต์และแอปพลิเคชันที่สำเร็จและใช้งานได้จริง',
      contactTitle: 'ติดต่อ', contactSub: 'ช่องทางติดต่อสำหรับงาน โปรเจกต์ และการร่วมพัฒนา'
    },
    education: [
      { title: 'วิศวกรรมศาสตร์ สาขาวิศวกรรมคอมพิวเตอร์', detail: 'มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น\nJun. 2023 - ปัจจุบัน\nปัจจุบันกำลังอยู่ชั้นปีที่ 3' },
      { title: 'โรงเรียนโคกโพธิ์ไชยศึกษา', detail: 'แผนการเรียนวิทย์ - คณิต\nApr. 2017 - 2022' }
    ],
    experience: [
      { title: 'NTJ Engineering Co., Ltd. — เจ้าหน้าที่ประเมินราคาระบบวิศวกรรม', meta: 'งานประเมินราคาและเอกสารระบบวิศวกรรม', date: 'Mar. 2025 - Present', tags: ['Cost Estimation','Documentation','Engineering'] },
      { title: 'Pcampus Studio — Data Dictionary', meta: 'จัดทำเอกสารข้อมูลและโครงสร้างระบบ', date: 'Project Experience', tags: ['Data Dictionary','System Design'] },
      { title: 'Bonlabofficial — Smart Healthcare Project', meta: 'โปรเจกต์ Healthcare / IoT / AI', date: 'Aug. 2026', tags: ['Healthcare','IoT','AI'] }
    ],
    portfolioWorks: [
      { title:'OtoVerse', desc:'เว็บเกมทายเพลงอนิเมะ OP/ED พร้อมคลังข้อมูลเพลง ฟีเจอร์โซเชียล ระบบจัดอันดับผู้เล่น และการแชร์ผลลัพธ์', url:'https://otoverse.games/', icon:'🎵', tags:['React','Vite','TailwindCSS','Firebase','Anime Quiz'] },
      { title:'OmyNo Cash Flow', desc:'เว็บแอปสำหรับจัดการ statement และ cash flow พร้อม deploy ใช้งานจริงผ่าน Firebase Hosting', url:'https://omynocashflow.web.app/', icon:'💸', tags:['Firebase','Cash Flow','Web App'] },
      { title:'StoreStokeSystem', desc:'ระบบจัดการสต๊อกสินค้าและข้อมูลสินค้าในร้านหรือคลังขนาดเล็ก', url:'https://store-stoke-system.vercel.app/', icon:'📦', tags:['Stock','Inventory','CRUD'] }
    ],
    contactHighlights: ['สนใจงาน Software Development, Full-Stack, IoT, AI, Cybersecurity, Network และ Web Application','มีประสบการณ์ในการออกแบบและพัฒนาระบบต้นแบบตั้งแต่แนวคิดจนถึงการใช้งานจริง','สามารถพัฒนาระบบต้นแบบ เชื่อม API จัดการฐานข้อมูล deploy และปรับปรุงจนใช้งานได้จริง','เคยทำงานร่วมกับองค์กรจริง พร้อมเรียนรู้และทำงานร่วมกับทีม']
  };
}

async function loadDoc(path, fallback) {
  const ref = doc(db, 'site', path);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : fallback;
}

async function loadExtended() {
  const d = defaults();
  const sec = await loadDoc('sections', d.sections);
  Object.entries(sec).forEach(([k, v]) => { if ($(k)) $(k).value = v || ''; });
  const edu = await loadDoc('education', { rows: d.education });
  $('educationRows').value = (edu.rows || d.education).map(x => `${x.title} | ${String(x.detail || '').replaceAll('\n',' / ')}`).join('\n');
  const exp = await loadDoc('experience', { rows: d.experience });
  $('experienceRows').value = (exp.rows || d.experience).map(x => `${x.title} | ${x.meta || ''} | ${x.date || ''} | ${(x.tags || []).join(', ')}`).join('\n');
  const works = await loadDoc('portfolioWorks', { rows: d.portfolioWorks });
  $('portfolioRows').value = (works.rows || d.portfolioWorks).map(x => `${x.title} | ${x.desc || ''} | ${x.url || ''} | ${x.icon || ''} | ${(x.tags || []).join(', ')}`).join('\n');
  const contact = await loadDoc('contactHighlights', { rows: d.contactHighlights });
  $('contactRows').value = (contact.rows || d.contactHighlights).join('\n');
}

function install() {
  if ($('extendedEditor')) return;
  const grid = document.querySelector('#adminApp .grid');
  if (!grid) return;
  grid.insertAdjacentHTML('afterbegin', panelHtml());

  $('sectionsForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = {};
    ['skillsTitle','skillsSub','experienceTitle','experienceSub','educationTitle','educationSub','projectsTitle','projectsSub','portfolioTitle','portfolioSub','contactTitle','contactSub'].forEach(id => data[id] = $(id).value.trim());
    await setDoc(doc(db, 'site', 'sections'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
    status('บันทึกหัวข้อแล้ว', 'ok');
  });

  $('educationForm').addEventListener('submit', async e => {
    e.preventDefault();
    const rows = lines($('educationRows').value).map(l => { const r = row(l); return { title:r[0] || '', detail:(r[1] || '').replaceAll(' / ', '\n') }; });
    await setDoc(doc(db, 'site', 'education'), { rows, updatedAt: serverTimestamp() }, { merge: true });
    status('บันทึกประวัติการศึกษาแล้ว', 'ok');
  });

  $('experienceForm').addEventListener('submit', async e => {
    e.preventDefault();
    const rows = lines($('experienceRows').value).map(l => { const r = row(l); return { title:r[0] || '', meta:r[1] || '', date:r[2] || '', tags:csv(r[3] || '') }; });
    await setDoc(doc(db, 'site', 'experience'), { rows, updatedAt: serverTimestamp() }, { merge: true });
    status('บันทึกประสบการณ์ทำงานแล้ว', 'ok');
  });

  $('portfolioWorksForm').addEventListener('submit', async e => {
    e.preventDefault();
    const rows = lines($('portfolioRows').value).map(l => { const r = row(l); return { title:r[0] || '', desc:r[1] || '', url:r[2] || '', icon:r[3] || '', tags:csv(r[4] || '') }; });
    await setDoc(doc(db, 'site', 'portfolioWorks'), { rows, updatedAt: serverTimestamp() }, { merge: true });
    status('บันทึกผลงานที่สมบูรณ์แล้ว', 'ok');
  });

  $('contactHighlightsForm').addEventListener('submit', async e => {
    e.preventDefault();
    await setDoc(doc(db, 'site', 'contactHighlights'), { rows: lines($('contactRows').value), updatedAt: serverTimestamp() }, { merge: true });
    status('บันทึกหน้าติดต่อแล้ว', 'ok');
  });

  loadExtended();
}

onAuthStateChanged(auth, user => { if (user) setTimeout(install, 600); });
