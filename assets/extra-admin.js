import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = (id) => document.getElementById(id);
const text = (value = '') => String(value);
const esc = (value = '') => text(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function setStatus(message, type = 'info') {
  const el = $('status');
  if (!el) return;
  el.textContent = message;
  el.className = `status ${type}`;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

const defaults = {
  sections: {
    skillsTitle: 'ทักษะ',
    skillsSub: 'เครื่องมือ ภาษา และเทคโนโลยีที่ใช้งานในโปรเจกต์',
    softSkillsTitle: 'Soft Skill',
    softSkillsSub: 'ทักษะการทำงานร่วมกับผู้อื่น การแก้ปัญหา และแนวคิดที่ใช้พัฒนาโปรเจกต์จริง',
    experienceTitle: 'ประสบการณ์ทำงาน',
    experienceSub: 'ประสบการณ์จากงานจริง โปรเจกต์จริง และกิจกรรมพัฒนาทักษะสายเทคโนโลยี',
    educationTitle: 'ประวัติการศึกษา',
    educationSub: 'เส้นทางการศึกษาหลักและพื้นฐานด้านวิศวกรรมคอมพิวเตอร์',
    projectsTitle: 'ผลงานและโครงงาน',
    projectsSub: 'โปรเจกต์ที่สอดคล้องกับ resume',
    portfolioTitle: 'ผลงานที่สมบูรณ์',
    portfolioSub: 'เว็บไซต์และแอปพลิเคชันที่สำเร็จและใช้งานได้จริง',
    contactTitle: 'ติดต่อ',
    contactSub: 'ช่องทางติดต่อสำหรับงาน โปรเจกต์ และการร่วมพัฒนา'
  },
  education: [
    { title: 'วิศวกรรมศาสตร์ สาขาวิศวกรรมคอมพิวเตอร์', detail: 'มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น\nJun. 2023 - ปัจจุบัน' },
    { title: 'โรงเรียนโคกโพธิ์ไชยศึกษา', detail: 'แผนการเรียนวิทย์ - คณิต\nApr. 2017 - 2022' }
  ],
  experience: [
    { title: 'NTJ Engineering Co., Ltd. — เจ้าหน้าที่ประเมินราคาระบบวิศวกรรม', meta: 'งานประเมินราคาและเอกสารระบบวิศวกรรม', date: 'Mar. 2025 - Present', tags: ['Cost Estimation', 'Documentation', 'Engineering'] }
  ],
  portfolioWorks: [
    { title: 'OtoVerse', desc: 'เว็บเกมทายเพลงอนิเมะ พร้อมคลังข้อมูลเพลงและระบบจัดอันดับผู้เล่น', url: 'https://otoverse.games/', icon: '🎮', tags: ['React', 'Firebase'], categories: ['full-stack', 'web-app'] },
    { title: 'Healthcare Management System', desc: 'ระบบจัดการผู้ป่วยและคิวสำหรับโรงพยาบาลแบบเรียลไทม์', url: 'https://hospital.bfirstkok.me/', icon: '🏥', tags: ['Database', 'Web App'], categories: ['full-stack', 'web-app'] },
    { title: 'Mechanical Engineering RMUTI Website', desc: 'เว็บไซต์สาขาวิศวกรรมเครื่องกล มทร.อีสาน วิทยาเขตขอนแก่น', url: 'https://eme.eng.rmuti.ac.th/#', icon: '⚙️', tags: ['Full-Stack Web Development'], categories: ['full-stack', 'university'] },
    { title: 'Computer Engineering RMUTI Website', desc: 'เว็บไซต์สาขาวิศวกรรมคอมพิวเตอร์ มทร.อีสาน วิทยาเขตขอนแก่น', url: 'https://ecp.eng.rmuti.ac.th/#', icon: '💻', tags: ['Full-Stack Web Development'], categories: ['full-stack', 'university'] }
  ],
  softSkills: [
    { title: 'Clear Communication', category: 'communication', visualTitle: 'Stakeholder Communication', level: 'Strong', description: 'สื่อสารความต้องการและรายละเอียดงานกับทีม ผู้สอน และผู้ใช้งานให้เข้าใจตรงกัน', tag: 'Communication', color: '#0284c7' },
    { title: 'Team Collaboration', category: 'teamwork', visualTitle: 'Git Workflow', level: 'Strong', description: 'ทำงานร่วมกับทีมผ่าน Git/GitHub แบ่งงาน ติดตามความคืบหน้า และรวมงานอย่างเป็นระบบ', tag: 'Teamwork', color: '#0891b2' },
    { title: 'Problem Solving Mindset', category: 'problem-solving', visualTitle: 'Solution Architecture', level: 'Strong', description: 'แยกปัญหาเป็นส่วนย่อย ทดลองหลายแนวทาง และออกแบบวิธีแก้ที่นำไปใช้งานได้จริง', tag: 'Problem Solving', color: '#1d4ed8' },
    { title: 'Ownership & Initiative', category: 'leadership', visualTitle: 'Project Leadership', level: 'Growing', description: 'เริ่มต้นโปรเจกต์จากไอเดีย วางโครงสร้าง ตัดสินใจ และรับผิดชอบให้งานไปถึงจุดที่ใช้งานได้', tag: 'Leadership', color: '#4338ca' },
    { title: 'Adaptability', category: 'teamwork', visualTitle: 'Cross-Functional Work', level: 'Growing', description: 'ปรับตัวระหว่างงาน Web, IoT, Database และ AI พร้อมเรียนรู้เครื่องมือที่โปรเจกต์ต้องใช้', tag: 'Adaptability', color: '#06b6d4' },
    { title: 'Gaming & Creative Thinking', category: 'hobby', visualTitle: 'Strategy & Creativity', level: 'Practice', description: 'งานอดิเรกช่วยฝึกการวางแผน การตัดสินใจ และต่อยอดไอเดียสร้างสรรค์ให้กับงานออกแบบ', tag: 'Hobby', color: '#db2777' }
  ],
  contactHighlights: [
    'Full-Stack Web Development และระบบหลังบ้าน',
    'IoT Dashboard, ESP32 และการเชื่อมต่อ REST API',
    'เว็บไซต์องค์กรและการ Deploy ใช้งานจริง'
  ]
};

function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .easy-admin{margin-bottom:22px}
    .easy-admin-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:8px}
    .easy-admin-head h2{margin:0 0 6px}
    .easy-badge{padding:7px 10px;border-radius:999px;background:rgba(34,211,238,.12);color:#a5f3fc;font-size:12px;white-space:nowrap}
    .easy-tabs{position:sticky;top:10px;z-index:8;display:flex;gap:8px;flex-wrap:wrap;margin:18px 0;padding:10px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(6,11,21,.92);backdrop-filter:blur(14px)}
    .easy-tab{background:transparent!important;border:1px solid rgba(255,255,255,.12)!important;color:#cbd5e1!important;padding:10px 13px!important}
    .easy-tab.active{background:linear-gradient(135deg,#0891b2,#4f46e5)!important;border-color:transparent!important;color:#fff!important}
    .easy-panel{display:none}
    .easy-panel.active{display:block}
    .panel-intro{margin:0 0 14px;color:#94a3b8;font-size:13px;line-height:1.7}
    .edit-box{position:relative;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:17px;margin:12px 0;background:rgba(255,255,255,.035)}
    .edit-box h4{margin:0 0 12px;color:#cffafe}
    .field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .field-row.three{grid-template-columns:1fr 1fr 1fr}
    .item-list{display:grid;gap:12px}
    .soft-note{color:#94a3b8;font-size:13px;line-height:1.7;margin:8px 0 0}
    .danger-mini{background:rgba(239,68,68,.12)!important;color:#fecaca!important;border:1px solid rgba(239,68,68,.3)!important}
    .small-btn{padding:8px 11px!important;font-size:12px!important}
    .save-bar{position:sticky;bottom:12px;z-index:7;display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;padding:12px;border:1px solid rgba(255,255,255,.12);border-radius:15px;background:rgba(6,11,21,.94);backdrop-filter:blur(12px)}
    select{width:100%;padding:12px 13px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:#101827;color:#f8fafc;font:inherit}
    input[type=color]{min-height:45px;padding:5px}
    @media(max-width:800px){.field-row,.field-row.three{grid-template-columns:1fr}.easy-admin-head{flex-direction:column}.easy-tabs{position:static}}
  `;
  document.head.appendChild(style);
}

function panelHtml() {
  return `
    <section id="extendedEditor" class="card full easy-admin">
      <div class="easy-admin-head">
        <div><h2><i class="bi bi-layout-text-window-reverse"></i> จัดการเนื้อหาหน้าเว็บ</h2><p class="hint">เลือกหมวดที่ต้องการแก้ไข แล้วกดบันทึกเฉพาะหมวดนั้น</p></div>
        <span class="easy-badge">แก้ไขผ่าน Firebase CMS</span>
      </div>
      <div class="easy-tabs" role="tablist" aria-label="หมวดเนื้อหาหน้าเว็บ">
        <button type="button" class="easy-tab active" data-panel="headingsPanel"><i class="bi bi-type-h1"></i> หัวข้อหน้าเว็บ</button>
        <button type="button" class="easy-tab" data-panel="softSkillsPanel"><i class="bi bi-stars"></i> Soft Skill</button>
        <button type="button" class="easy-tab" data-panel="portfolioPanel"><i class="bi bi-grid"></i> ผลงานที่สมบูรณ์</button>
        <button type="button" class="easy-tab" data-panel="experiencePanel"><i class="bi bi-briefcase"></i> ประสบการณ์</button>
        <button type="button" class="easy-tab" data-panel="educationPanel"><i class="bi bi-mortarboard"></i> การศึกษา</button>
        <button type="button" class="easy-tab" data-panel="contactPanel"><i class="bi bi-person-lines-fill"></i> ติดต่อ</button>
      </div>

      <div id="headingsPanel" class="easy-panel active">
        <p class="panel-intro">แก้ชื่อและคำอธิบายใต้หัวข้อของแต่ละส่วนบนหน้าแรก</p>
        <form id="sectionsForm"><div class="mini-grid">
          <div><label>หัวข้อทักษะ</label><input id="skillsTitle"></div><div><label>คำอธิบายทักษะ</label><input id="skillsSub"></div>
          <div><label>หัวข้อ Soft Skill</label><input id="softSkillsTitle"></div><div><label>คำอธิบาย Soft Skill</label><input id="softSkillsSub"></div>
          <div><label>หัวข้อประสบการณ์ทำงาน</label><input id="experienceTitle"></div><div><label>คำอธิบายประสบการณ์</label><input id="experienceSub"></div>
          <div><label>หัวข้อประวัติการศึกษา</label><input id="educationTitle"></div><div><label>คำอธิบายการศึกษา</label><input id="educationSub"></div>
          <div><label>หัวข้อผลงานที่สมบูรณ์</label><input id="portfolioTitle"></div><div><label>คำอธิบายผลงาน</label><input id="portfolioSub"></div>
          <div><label>หัวข้อติดต่อ</label><input id="contactTitle"></div><div><label>คำอธิบายติดต่อ</label><input id="contactSub"></div>
        </div><div class="save-bar"><button type="submit"><i class="bi bi-save"></i> บันทึกหัวข้อทั้งหมด</button></div></form>
      </div>

      <div id="softSkillsPanel" class="easy-panel"><p class="panel-intro">เพิ่ม ลบ หรือเรียงรายการ Soft Skill ได้จากลำดับกล่องด้านล่าง</p><div id="softSkillsList" class="item-list"></div><div class="save-bar"><button type="button" id="addSoftSkill" class="secondary"><i class="bi bi-plus-lg"></i> เพิ่ม Soft Skill</button><button type="button" id="saveSoftSkills"><i class="bi bi-save"></i> บันทึก Soft Skill</button></div></div>
      <div id="portfolioPanel" class="easy-panel"><p class="panel-intro">หมวดใช้สำหรับปุ่มกรอง: full-stack, web-app, university, tools</p><div id="portfolioList" class="item-list"></div><div class="save-bar"><button type="button" id="addPortfolio" class="secondary"><i class="bi bi-plus-lg"></i> เพิ่มผลงาน</button><button type="button" id="savePortfolio"><i class="bi bi-save"></i> บันทึกผลงาน</button></div></div>
      <div id="experiencePanel" class="easy-panel"><div id="experienceList" class="item-list"></div><div class="save-bar"><button type="button" id="addExperience" class="secondary"><i class="bi bi-plus-lg"></i> เพิ่มประสบการณ์</button><button type="button" id="saveExperience"><i class="bi bi-save"></i> บันทึกประสบการณ์</button></div></div>
      <div id="educationPanel" class="easy-panel"><div id="educationList" class="item-list"></div><div class="save-bar"><button type="button" id="addEducation" class="secondary"><i class="bi bi-plus-lg"></i> เพิ่มการศึกษา</button><button type="button" id="saveEducation"><i class="bi bi-save"></i> บันทึกการศึกษา</button></div></div>
      <div id="contactPanel" class="easy-panel"><div id="contactList" class="item-list"></div><div class="save-bar"><button type="button" id="addContact" class="secondary"><i class="bi bi-plus-lg"></i> เพิ่มจุดเด่น</button><button type="button" id="saveContact"><i class="bi bi-save"></i> บันทึกข้อมูลติดต่อ</button></div></div>
    </section>`;
}

async function loadDoc(name, fallback) {
  const snap = await getDoc(doc(db, 'site', name));
  return snap.exists() ? snap.data() : fallback;
}

function switchPanel(id) {
  document.querySelectorAll('.easy-tab').forEach(button => {
    const active = button.dataset.panel === id;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.easy-panel').forEach(panel => panel.classList.toggle('active', panel.id === id));
}

function box(title, body, removeClass) {
  return `<div class="edit-box"><h4>${esc(title)}</h4>${body}<div class="actions"><button type="button" class="danger-mini small-btn ${removeClass}"><i class="bi bi-trash3"></i> ลบรายการนี้</button></div></div>`;
}

function renderEducation(rows) {
  $('educationList').innerHTML = rows.map((item, index) => box(`การศึกษา #${index + 1}`, `<label>สถานศึกษา / หลักสูตร</label><input class="edu-title" value="${esc(item.title)}"><label>รายละเอียด</label><textarea class="edu-detail">${esc(item.detail)}</textarea>`, 'remove-edu')).join('');
}

function renderExperience(rows) {
  $('experienceList').innerHTML = rows.map((item, index) => box(`ประสบการณ์ #${index + 1}`, `<div class="field-row"><div><label>ชื่องาน</label><input class="exp-title" value="${esc(item.title)}"></div><div><label>วันที่</label><input class="exp-date" value="${esc(item.date)}"></div></div><label>รายละเอียดสั้น</label><input class="exp-meta" value="${esc(item.meta)}"><label>Tags คั่นด้วย comma</label><input class="exp-tags" value="${esc((item.tags || []).join(', '))}">`, 'remove-exp')).join('');
}

function renderPortfolio(rows) {
  $('portfolioList').innerHTML = rows.map((item, index) => box(`ผลงาน #${index + 1}`, `<div class="field-row"><div><label>ชื่อผลงาน</label><input class="work-title" value="${esc(item.title)}"></div><div><label>Icon / Emoji</label><input class="work-icon" value="${esc(item.icon)}"></div></div><label>รายละเอียด</label><textarea class="work-desc">${esc(item.desc)}</textarea><label>URL</label><input class="work-url" type="url" value="${esc(item.url)}"><div class="field-row"><div><label>Tags คั่นด้วย comma</label><input class="work-tags" value="${esc((item.tags || []).join(', '))}"></div><div><label>หมวดกรอง คั่นด้วย comma</label><input class="work-categories" value="${esc((item.categories || []).join(', '))}"></div></div><label>URL รูปตัวอย่าง (เว้นว่างเพื่อใช้ Emoji)</label><input class="work-image" value="${esc(item.imageUrl)}">`, 'remove-work')).join('');
}

function renderSoftSkills(rows) {
  $('softSkillsList').innerHTML = rows.map((item, index) => box(`Soft Skill #${index + 1}`, `<div class="field-row"><div><label>ชื่อทักษะ</label><input class="soft-title" value="${esc(item.title)}"></div><div><label>ข้อความบนภาพ</label><input class="soft-visual" value="${esc(item.visualTitle)}"></div></div><div class="field-row three"><div><label>หมวด</label><select class="soft-category">${['communication','teamwork','problem-solving','leadership','hobby'].map(value => `<option value="${value}" ${item.category === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div><div><label>ระดับ</label><select class="soft-level-input">${['Strong','Growing','Practice'].map(value => `<option value="${value}" ${item.level === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div><div><label>สีการ์ด</label><input class="soft-color" type="color" value="${esc(item.color || '#0284c7')}"></div></div><label>คำอธิบาย</label><textarea class="soft-desc">${esc(item.description)}</textarea><label>Tag ด้านล่าง</label><input class="soft-tag" value="${esc(item.tag)}">`, 'remove-soft')).join('');
}

function renderContact(rows) {
  $('contactList').innerHTML = rows.map((item, index) => box(`จุดเด่น #${index + 1}`, `<label>ข้อความ</label><textarea class="contact-row">${esc(item)}</textarea>`, 'remove-contact')).join('');
}

const splitTags = (value) => value.split(',').map(item => item.trim()).filter(Boolean);
const boxes = (selector) => [...document.querySelectorAll(`${selector} .edit-box`)];

function collectEducation() {
  return boxes('#educationList').map(box => ({ title: box.querySelector('.edu-title').value.trim(), detail: box.querySelector('.edu-detail').value.trim() })).filter(item => item.title || item.detail);
}
function collectExperience() {
  return boxes('#experienceList').map(box => ({ title: box.querySelector('.exp-title').value.trim(), date: box.querySelector('.exp-date').value.trim(), meta: box.querySelector('.exp-meta').value.trim(), tags: splitTags(box.querySelector('.exp-tags').value) })).filter(item => item.title || item.meta);
}
function collectPortfolio() {
  return boxes('#portfolioList').map(box => ({ title: box.querySelector('.work-title').value.trim(), icon: box.querySelector('.work-icon').value.trim(), desc: box.querySelector('.work-desc').value.trim(), url: box.querySelector('.work-url').value.trim(), tags: splitTags(box.querySelector('.work-tags').value), categories: splitTags(box.querySelector('.work-categories').value), imageUrl: box.querySelector('.work-image').value.trim() })).filter(item => item.title || item.desc);
}
function collectSoftSkills() {
  return boxes('#softSkillsList').map(box => ({ title: box.querySelector('.soft-title').value.trim(), visualTitle: box.querySelector('.soft-visual').value.trim(), category: box.querySelector('.soft-category').value, level: box.querySelector('.soft-level-input').value, color: box.querySelector('.soft-color').value, description: box.querySelector('.soft-desc').value.trim(), tag: box.querySelector('.soft-tag').value.trim() })).filter(item => item.title || item.description);
}
function collectContact() {
  return [...document.querySelectorAll('#contactList .contact-row')].map(input => input.value.trim()).filter(Boolean);
}

async function saveSite(name, rows, message) {
  try {
    setStatus('กำลังบันทึกข้อมูล...', 'info');
    await setDoc(doc(db, 'site', name), { rows, updatedAt: serverTimestamp() }, { merge: true });
    setStatus(message, 'ok');
  } catch (error) {
    setStatus(`บันทึกไม่สำเร็จ: ${error.message}`, 'error');
  }
}

async function loadAll() {
  try {
    const sections = await loadDoc('sections', defaults.sections);
    Object.entries({ ...defaults.sections, ...sections }).forEach(([key, value]) => { if ($(key)) $(key).value = value || ''; });
    renderSoftSkills((await loadDoc('softSkills', { rows: defaults.softSkills })).rows || defaults.softSkills);
    renderPortfolio((await loadDoc('portfolioWorks', { rows: defaults.portfolioWorks })).rows || defaults.portfolioWorks);
    renderExperience((await loadDoc('experience', { rows: defaults.experience })).rows || defaults.experience);
    renderEducation((await loadDoc('education', { rows: defaults.education })).rows || defaults.education);
    renderContact((await loadDoc('contactHighlights', { rows: defaults.contactHighlights })).rows || defaults.contactHighlights);
  } catch (error) {
    setStatus(`โหลดข้อมูลส่วนขยายไม่สำเร็จ: ${error.message}`, 'error');
  }
}

function installEvents() {
  document.querySelectorAll('.easy-tab').forEach(button => button.addEventListener('click', () => switchPanel(button.dataset.panel)));
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const map = { 'remove-edu': '#educationList', 'remove-exp': '#experienceList', 'remove-work': '#portfolioList', 'remove-soft': '#softSkillsList', 'remove-contact': '#contactList' };
    const removeClass = Object.keys(map).find(className => button.classList.contains(className));
    if (removeClass) button.closest('.edit-box')?.remove();
  });

  $('addEducation').onclick = () => renderEducation([...collectEducation(), { title: '', detail: '' }]);
  $('addExperience').onclick = () => renderExperience([...collectExperience(), { title: '', meta: '', date: '', tags: [] }]);
  $('addPortfolio').onclick = () => renderPortfolio([...collectPortfolio(), { title: '', desc: '', url: '', icon: '', tags: [], categories: [], imageUrl: '' }]);
  $('addSoftSkill').onclick = () => renderSoftSkills([...collectSoftSkills(), { title: '', visualTitle: '', category: 'communication', level: 'Growing', description: '', tag: '', color: '#0284c7' }]);
  $('addContact').onclick = () => renderContact([...collectContact(), '']);

  $('sectionsForm').onsubmit = async event => {
    event.preventDefault();
    const ids = ['skillsTitle','skillsSub','softSkillsTitle','softSkillsSub','experienceTitle','experienceSub','educationTitle','educationSub','portfolioTitle','portfolioSub','contactTitle','contactSub'];
    const data = Object.fromEntries(ids.map(id => [id, $(id).value.trim()]));
    try {
      await setDoc(doc(db, 'site', 'sections'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      setStatus('บันทึกหัวข้อหน้าเว็บแล้ว', 'ok');
    } catch (error) {
      setStatus(`บันทึกไม่สำเร็จ: ${error.message}`, 'error');
    }
  };
  $('saveSoftSkills').onclick = () => saveSite('softSkills', collectSoftSkills(), 'บันทึก Soft Skill แล้ว');
  $('savePortfolio').onclick = () => saveSite('portfolioWorks', collectPortfolio(), 'บันทึกผลงานที่สมบูรณ์แล้ว');
  $('saveExperience').onclick = () => saveSite('experience', collectExperience(), 'บันทึกประสบการณ์ทำงานแล้ว');
  $('saveEducation').onclick = () => saveSite('education', collectEducation(), 'บันทึกประวัติการศึกษาแล้ว');
  $('saveContact').onclick = () => saveSite('contactHighlights', collectContact(), 'บันทึกข้อมูลติดต่อแล้ว');
}

function install() {
  if ($('extendedEditor')) return;
  const grid = document.querySelector('#adminApp .grid');
  if (!grid) return;
  addStyles();
  grid.insertAdjacentHTML('afterbegin', panelHtml());
  installEvents();
  loadAll();
}

onAuthStateChanged(auth, user => { if (user) setTimeout(install, 250); });
