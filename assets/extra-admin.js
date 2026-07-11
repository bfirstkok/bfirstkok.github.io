import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = (id) => document.getElementById(id);

function setStatus(text, type = 'info') {
  const el = $('status');
  if (el) { el.textContent = text; el.className = `status ${type}`; }
}

const defaults = {
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
  contactHighlights: [
    'สนใจงาน Software Development, Full-Stack, IoT, AI, Cybersecurity, Network และ Web Application',
    'มีประสบการณ์ในการออกแบบและพัฒนาระบบต้นแบบตั้งแต่แนวคิดจนถึงการใช้งานจริง',
    'สามารถพัฒนาระบบต้นแบบ เชื่อม API จัดการฐานข้อมูล deploy และปรับปรุงจนใช้งานได้จริง',
    'เคยทำงานร่วมกับองค์กรจริง พร้อมเรียนรู้และทำงานร่วมกับทีม'
  ]
};

function style() {
  if ($('extraAdminStyle')) return;
  const s = document.createElement('style');
  s.id = 'extraAdminStyle';
  s.textContent = `
    .easy-admin{margin-bottom:22px}.easy-tabs{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0 18px}.easy-tab{background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.12)!important}.easy-tab.active{background:linear-gradient(135deg,#00e5ff,#7c3aed)!important}.easy-panel{display:none}.easy-panel.active{display:block}.edit-box{border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:16px;margin:12px 0;background:rgba(255,255,255,.035)}.edit-box h4{margin:0 0 10px}.field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.item-list{display:grid;gap:12px}.soft-note{color:#94a3b8;font-size:13px;line-height:1.7;margin:8px 0 0}.danger-mini{background:rgba(239,68,68,.18)!important;color:#fecaca!important;border:1px solid rgba(239,68,68,.35)!important}.small-btn{padding:9px 12px!important;font-size:13px!important}@media(max-width:800px){.field-row{grid-template-columns:1fr}}`;
  document.head.appendChild(s);
}

function panelHtml() {
  return `
    <section id="extendedEditor" class="card full easy-admin">
      <h2>แก้ไขเนื้อหาหน้าเว็บแบบง่าย</h2>
      <p class="hint">เลือกแท็บที่ต้องการแก้ ไม่ต้องพิมพ์คั่นด้วย | แล้ว</p>
      <div class="easy-tabs">
        <button type="button" class="easy-tab active" data-panel="headingsPanel">หัวข้อ Section</button>
        <button type="button" class="easy-tab" data-panel="educationPanel">ประวัติการศึกษา</button>
        <button type="button" class="easy-tab" data-panel="experiencePanel">ประสบการณ์ทำงาน</button>
        <button type="button" class="easy-tab" data-panel="portfolioPanel">ผลงานที่สมบูรณ์</button>
        <button type="button" class="easy-tab" data-panel="contactPanel">ติดต่อ / จุดเด่น</button>
      </div>

      <div id="headingsPanel" class="easy-panel active">
        <form id="sectionsForm">
          <div class="mini-grid">
            <div><label>หัวข้อทักษะ</label><input id="skillsTitle"></div><div><label>คำอธิบายทักษะ</label><input id="skillsSub"></div>
            <div><label>หัวข้อประสบการณ์ทำงาน</label><input id="experienceTitle"></div><div><label>คำอธิบายประสบการณ์</label><input id="experienceSub"></div>
            <div><label>หัวข้อประวัติการศึกษา</label><input id="educationTitle"></div><div><label>คำอธิบายการศึกษา</label><input id="educationSub"></div>
            <div><label>หัวข้อผลงานและโครงงาน</label><input id="projectsTitle"></div><div><label>คำอธิบายผลงานและโครงงาน</label><input id="projectsSub"></div>
            <div><label>หัวข้อผลงานที่สมบูรณ์</label><input id="portfolioTitle"></div><div><label>คำอธิบายผลงานที่สมบูรณ์</label><input id="portfolioSub"></div>
            <div><label>หัวข้อติดต่อ</label><input id="contactTitle"></div><div><label>คำอธิบายติดต่อ</label><input id="contactSub"></div>
          </div>
          <div class="actions"><button type="submit">บันทึกหัวข้อทั้งหมด</button></div>
        </form>
      </div>

      <div id="educationPanel" class="easy-panel"><div id="educationList" class="item-list"></div><div class="actions"><button type="button" id="addEducation" class="secondary">+ เพิ่มการศึกษา</button><button type="button" id="saveEducation">บันทึกประวัติการศึกษา</button></div></div>
      <div id="experiencePanel" class="easy-panel"><div id="experienceList" class="item-list"></div><div class="actions"><button type="button" id="addExperience" class="secondary">+ เพิ่มประสบการณ์</button><button type="button" id="saveExperience">บันทึกประสบการณ์ทำงาน</button></div></div>
      <div id="portfolioPanel" class="easy-panel"><div id="portfolioList" class="item-list"></div><div class="actions"><button type="button" id="addPortfolio" class="secondary">+ เพิ่มผลงาน</button><button type="button" id="savePortfolio">บันทึกผลงานที่สมบูรณ์</button></div></div>
      <div id="contactPanel" class="easy-panel"><div id="contactList" class="item-list"></div><div class="actions"><button type="button" id="addContact" class="secondary">+ เพิ่มจุดเด่น</button><button type="button" id="saveContact">บันทึกหน้าติดต่อ</button></div></div>
    </section>`;
}

async function loadDoc(name, fallback) {
  const snap = await getDoc(doc(db, 'site', name));
  return snap.exists() ? snap.data() : fallback;
}

function switchPanel(id) {
  document.querySelectorAll('.easy-tab').forEach(b => b.classList.toggle('active', b.dataset.panel === id));
  document.querySelectorAll('.easy-panel').forEach(p => p.classList.toggle('active', p.id === id));
}

function box(title, html, removeClass) {
  return `<div class="edit-box"><h4>${title}</h4>${html}<div class="actions"><button type="button" class="danger-mini small-btn ${removeClass}">ลบรายการนี้</button></div></div>`;
}

function renderEducation(rows) {
  $('educationList').innerHTML = rows.map((x, i) => box(`การศึกษา #${i+1}`, `<label>ชื่อสถานศึกษา/หลักสูตร</label><input class="edu-title" value="${x.title || ''}"><label>รายละเอียด</label><textarea class="edu-detail">${x.detail || ''}</textarea>`, 'remove-edu')).join('');
}
function renderExperience(rows) {
  $('experienceList').innerHTML = rows.map((x, i) => box(`ประสบการณ์ #${i+1}`, `<div class="field-row"><div><label>ชื่องาน</label><input class="exp-title" value="${x.title || ''}"></div><div><label>วันที่</label><input class="exp-date" value="${x.date || ''}"></div></div><label>รายละเอียดสั้น</label><input class="exp-meta" value="${x.meta || ''}"><label>Tags คั่นด้วย comma</label><input class="exp-tags" value="${(x.tags || []).join(', ')}">`, 'remove-exp')).join('');
}
function renderPortfolio(rows) {
  $('portfolioList').innerHTML = rows.map((x, i) => box(`ผลงาน #${i+1}`, `<div class="field-row"><div><label>ชื่อผลงาน</label><input class="work-title" value="${x.title || ''}"></div><div><label>Icon / Emoji</label><input class="work-icon" value="${x.icon || ''}"></div></div><label>รายละเอียด</label><textarea class="work-desc">${x.desc || ''}</textarea><label>URL</label><input class="work-url" value="${x.url || ''}"><label>Tags คั่นด้วย comma</label><input class="work-tags" value="${(x.tags || []).join(', ')}">`, 'remove-work')).join('');
}
function renderContact(rows) {
  $('contactList').innerHTML = rows.map((x, i) => box(`จุดเด่น #${i+1}`, `<label>ข้อความ</label><textarea class="contact-row">${x || ''}</textarea>`, 'remove-contact')).join('');
}

function collectEducation() { return [...document.querySelectorAll('#educationList .edit-box')].map(b => ({ title:b.querySelector('.edu-title').value.trim(), detail:b.querySelector('.edu-detail').value.trim() })).filter(x => x.title || x.detail); }
function collectExperience() { return [...document.querySelectorAll('#experienceList .edit-box')].map(b => ({ title:b.querySelector('.exp-title').value.trim(), date:b.querySelector('.exp-date').value.trim(), meta:b.querySelector('.exp-meta').value.trim(), tags:b.querySelector('.exp-tags').value.split(',').map(v=>v.trim()).filter(Boolean) })).filter(x => x.title || x.meta); }
function collectPortfolio() { return [...document.querySelectorAll('#portfolioList .edit-box')].map(b => ({ title:b.querySelector('.work-title').value.trim(), icon:b.querySelector('.work-icon').value.trim(), desc:b.querySelector('.work-desc').value.trim(), url:b.querySelector('.work-url').value.trim(), tags:b.querySelector('.work-tags').value.split(',').map(v=>v.trim()).filter(Boolean) })).filter(x => x.title || x.desc); }
function collectContact() { return [...document.querySelectorAll('#contactList .contact-row')].map(t => t.value.trim()).filter(Boolean); }

async function loadAll() {
  const sec = await loadDoc('sections', defaults.sections);
  Object.entries(sec).forEach(([k, v]) => { if ($(k)) $(k).value = v || ''; });
  renderEducation((await loadDoc('education', { rows: defaults.education })).rows || defaults.education);
  renderExperience((await loadDoc('experience', { rows: defaults.experience })).rows || defaults.experience);
  renderPortfolio((await loadDoc('portfolioWorks', { rows: defaults.portfolioWorks })).rows || defaults.portfolioWorks);
  renderContact((await loadDoc('contactHighlights', { rows: defaults.contactHighlights })).rows || defaults.contactHighlights);
}

function installEvents() {
  document.querySelectorAll('.easy-tab').forEach(btn => btn.addEventListener('click', () => switchPanel(btn.dataset.panel)));
  document.addEventListener('click', e => {
    if (e.target.classList.contains('remove-edu')) { e.target.closest('.edit-box').remove(); }
    if (e.target.classList.contains('remove-exp')) { e.target.closest('.edit-box').remove(); }
    if (e.target.classList.contains('remove-work')) { e.target.closest('.edit-box').remove(); }
    if (e.target.classList.contains('remove-contact')) { e.target.closest('.edit-box').remove(); }
  });
  $('addEducation').onclick = () => { const rows = collectEducation(); rows.push({title:'', detail:''}); renderEducation(rows); };
  $('addExperience').onclick = () => { const rows = collectExperience(); rows.push({title:'', meta:'', date:'', tags:[]}); renderExperience(rows); };
  $('addPortfolio').onclick = () => { const rows = collectPortfolio(); rows.push({title:'', desc:'', url:'', icon:'', tags:[]}); renderPortfolio(rows); };
  $('addContact').onclick = () => { const rows = collectContact(); rows.push(''); renderContact(rows); };

  $('sectionsForm').onsubmit = async e => { e.preventDefault(); const data = {}; ['skillsTitle','skillsSub','experienceTitle','experienceSub','educationTitle','educationSub','projectsTitle','projectsSub','portfolioTitle','portfolioSub','contactTitle','contactSub'].forEach(id => data[id] = $(id).value.trim()); await setDoc(doc(db, 'site', 'sections'), { ...data, updatedAt: serverTimestamp() }, { merge: true }); setStatus('บันทึกหัวข้อแล้ว', 'ok'); };
  $('saveEducation').onclick = async () => { await setDoc(doc(db, 'site', 'education'), { rows: collectEducation(), updatedAt: serverTimestamp() }, { merge:true }); setStatus('บันทึกประวัติการศึกษาแล้ว', 'ok'); };
  $('saveExperience').onclick = async () => { await setDoc(doc(db, 'site', 'experience'), { rows: collectExperience(), updatedAt: serverTimestamp() }, { merge:true }); setStatus('บันทึกประสบการณ์ทำงานแล้ว', 'ok'); };
  $('savePortfolio').onclick = async () => { await setDoc(doc(db, 'site', 'portfolioWorks'), { rows: collectPortfolio(), updatedAt: serverTimestamp() }, { merge:true }); setStatus('บันทึกผลงานที่สมบูรณ์แล้ว', 'ok'); };
  $('saveContact').onclick = async () => { await setDoc(doc(db, 'site', 'contactHighlights'), { rows: collectContact(), updatedAt: serverTimestamp() }, { merge:true }); setStatus('บันทึกหน้าติดต่อแล้ว', 'ok'); };
}

function install() {
  if ($('extendedEditor')) return;
  style();
  const grid = document.querySelector('#adminApp .grid');
  if (!grid) return;
  grid.insertAdjacentHTML('afterbegin', panelHtml());
  installEvents();
  loadAll();
}

onAuthStateChanged(auth, user => { if (user) setTimeout(install, 600); });
