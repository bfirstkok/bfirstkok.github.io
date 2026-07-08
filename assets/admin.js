import { firebaseConfig, adminEmail } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, onSnapshot, serverTimestamp, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

const $ = (id) => document.getElementById(id);
const isConfigured = !firebaseConfig.apiKey.includes('PASTE_') && !firebaseConfig.projectId.includes('PASTE_');

let app, auth, db, storage;
let editing = { news: null, certs: null, projects: null };

function setStatus(text, type = 'info') {
  const el = $('status');
  el.textContent = text;
  el.className = `status ${type}`;
}

function escapeHtml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function tagsFromInput(value = '') {
  return value.split(',').map(v => v.trim()).filter(Boolean);
}

async function uploadImage(file, folder) {
  if (!file) return '';
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
  const fileRef = ref(storage, `${folder}/${safeName}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

function initFirebase() {
  if (!isConfigured) {
    setStatus('ยังไม่ได้ใส่ Firebase config ในไฟล์ firebase-config.js', 'warn');
    $('configWarning').hidden = false;
    $('loginBox').hidden = true;
    return;
  }
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      $('loginBox').hidden = true;
      $('adminApp').hidden = false;
      $('adminEmailText').textContent = user.email;
      setStatus('เข้าสู่ระบบแล้ว พร้อมแก้ไขข้อมูล', 'ok');
      loadProfile();
      listenProjects();
      listenNews();
      listenCerts();
    } else {
      $('loginBox').hidden = false;
      $('adminApp').hidden = true;
      $('email').value = adminEmail;
      setStatus('กรุณาเข้าสู่ระบบ Firebase Admin', 'info');
    }
  });
}

$('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, $('email').value.trim(), $('password').value);
  } catch (err) {
    setStatus(`เข้าสู่ระบบไม่สำเร็จ: ${err.message}`, 'error');
  }
});

$('logoutBtn').addEventListener('click', () => signOut(auth));

async function loadProfile() {
  const snap = await getDoc(doc(db, 'site', 'profile'));
  const data = snap.exists() ? snap.data() : {};
  $('profileName').value = data.name || 'Khanathippakorn Namthachak';
  $('profileSubtitle').value = data.subtitle || 'Computer Engineering Student · Full-Stack Web Developer · IoT & AI Builder · Cybersecurity Learner';
  $('profileLead').value = data.lead || 'นักศึกษาวิศวกรรมคอมพิวเตอร์ มทร.อีสาน วิทยาเขตขอนแก่น โฟกัสงาน Full-Stack Web, IoT, AI, Cybersecurity และการออกแบบระบบที่เชื่อมโยงซอฟต์แวร์ ฮาร์ดแวร์ ข้อมูล และผู้ใช้งานจริงเข้าด้วยกัน';
  $('profileAbout1').value = data.about1 || 'ฉันชื่อ First หรือ Khanathippakorn Namthachak สนใจการพัฒนาเว็บแอป ระบบหลังบ้าน ฐานข้อมูล IoT และ AI มีประสบการณ์ทำโปรเจกต์จริง เช่น ระบบคิวโรงพยาบาล, เว็บพอร์ตโฟลิโอ, เว็บแอปจัดการข้อมูล, IoT Dashboard รวมถึงการ deploy เว็บไซต์ด้วย GitHub Pages, Firebase, Vercel และ Netlify';
  $('profileAbout2').value = data.about2 || 'กำลังต่อยอดทักษะด้าน Cybersecurity, Docker, Flutter, Django, REST API และ Local AI Assistant จุดแข็งคือชอบลงมือทำจริง แก้ปัญหาเร็ว ทดสอบระบบเอง และพัฒนาโปรเจกต์จากไอเดียให้กลายเป็นงานที่ใช้งานได้จริง';
  $('profilePhone').value = data.phone || '0956734701';
  $('profileEmail').value = data.email || 'bfirstkok@gmail.com';
  $('profileAltEmail').value = data.altEmail || 'khanathippakorn@gmail.com';
  $('profileLocation').value = data.location || 'ขอนแก่น, ประเทศไทย';
  $('profileGithub').value = data.githubUrl || 'https://github.com/bfirstkok';
  $('profileWebsite').value = data.websiteUrl || 'https://bfirstkok.me/';
  $('profileFacebook').value = data.facebookUrl || 'https://www.facebook.com/khanathippakorn.namthachak';
  $('profileFooter').value = data.footer || '© 2026 Khanathippakorn Namthachak (First) · bfirstkok.me Portfolio';
  $('profileSkills').value = (data.skills || ['Full-Stack Web','IoT / ESP32','AI Integration','Cybersecurity','Django / Python','React / Next.js','Docker','MySQL / MariaDB']).join(', ');
}

$('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    setStatus('กำลังบันทึกโปรไฟล์...', 'info');
    await setDoc(doc(db, 'site', 'profile'), {
      name: $('profileName').value.trim(),
      subtitle: $('profileSubtitle').value.trim(),
      lead: $('profileLead').value.trim(),
      about1: $('profileAbout1').value.trim(),
      about2: $('profileAbout2').value.trim(),
      phone: $('profilePhone').value.trim(),
      email: $('profileEmail').value.trim(),
      altEmail: $('profileAltEmail').value.trim(),
      location: $('profileLocation').value.trim(),
      githubUrl: $('profileGithub').value.trim(),
      websiteUrl: $('profileWebsite').value.trim(),
      facebookUrl: $('profileFacebook').value.trim(),
      footer: $('profileFooter').value.trim(),
      skills: tagsFromInput($('profileSkills').value),
      updatedAt: serverTimestamp()
    }, { merge: true });
    setStatus('บันทึกโปรไฟล์แล้ว', 'ok');
  } catch (err) {
    setStatus(`บันทึกโปรไฟล์ไม่สำเร็จ: ${err.message}`, 'error');
  }
});

$('projectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    setStatus('กำลังบันทึก Project...', 'info');
    const payload = {
      title: $('projectTitle').value.trim(),
      category: $('projectCategory').value.trim(),
      description: $('projectDesc').value.trim(),
      features: tagsFromInput($('projectFeatures').value),
      githubUrl: $('projectGithub').value.trim(),
      websiteUrl: $('projectWebsite').value.trim(),
      icon: $('projectIcon').value.trim() || '🚀',
      order: Number($('projectOrder').value || 0),
      updatedAt: serverTimestamp()
    };
    if (editing.projects) {
      await updateDoc(doc(db, 'projects', editing.projects), payload);
      editing.projects = null;
    } else {
      payload.createdAt = serverTimestamp();
      await addDoc(collection(db, 'projects'), payload);
    }
    e.target.reset();
    $('projectOrder').value = 0;
    $('projectSubmit').textContent = 'บันทึก Project';
    setStatus('บันทึก Project แล้ว', 'ok');
  } catch (err) {
    setStatus(`บันทึก Project ไม่สำเร็จ: ${err.message}`, 'error');
  }
});

$('newsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    setStatus('กำลังบันทึกข่าวสาร...', 'info');
    const imageUrl = await uploadImage($('newsImage').files[0], 'news');
    const payload = {
      title: $('newsTitle').value.trim(),
      dateText: $('newsDate').value.trim(),
      description: $('newsDesc').value.trim(),
      tags: tagsFromInput($('newsTags').value),
      githubUrl: $('newsGithub').value.trim(),
      websiteUrl: $('newsWebsite').value.trim(),
      updatedAt: serverTimestamp()
    };
    if (imageUrl) payload.imageUrl = imageUrl;
    if (editing.news) {
      await updateDoc(doc(db, 'news', editing.news), payload);
      editing.news = null;
    } else {
      payload.createdAt = serverTimestamp();
      await addDoc(collection(db, 'news'), payload);
    }
    e.target.reset();
    $('newsSubmit').textContent = 'บันทึกข่าวสาร';
    setStatus('บันทึกข่าวสารแล้ว', 'ok');
  } catch (err) {
    setStatus(`บันทึกข่าวสารไม่สำเร็จ: ${err.message}`, 'error');
  }
});

$('certForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    setStatus('กำลังบันทึก Certificate...', 'info');
    const imageUrl = await uploadImage($('certImage').files[0], 'certificates');
    const payload = {
      title: $('certTitle').value.trim(),
      category: $('certCategory').value.trim(),
      status: $('certStatus').value.trim(),
      description: $('certDesc').value.trim(),
      updatedAt: serverTimestamp()
    };
    if (imageUrl) payload.imageUrl = imageUrl;
    if (editing.certs) {
      await updateDoc(doc(db, 'certificates', editing.certs), payload);
      editing.certs = null;
    } else {
      payload.createdAt = serverTimestamp();
      await addDoc(collection(db, 'certificates'), payload);
    }
    e.target.reset();
    $('certSubmit').textContent = 'บันทึก Certificate';
    setStatus('บันทึก Certificate แล้ว', 'ok');
  } catch (err) {
    setStatus(`บันทึก Certificate ไม่สำเร็จ: ${err.message}`, 'error');
  }
});

function renderCard(listId, html) {
  $(listId).insertAdjacentHTML('beforeend', html);
}

function listenProjects() {
  const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
  onSnapshot(q, (snap) => {
    $('projectList').innerHTML = '';
    snap.forEach((item) => {
      const data = item.data();
      renderCard('projectList', `<article class="admin-card"><h3>${escapeHtml(data.icon || '🚀')} ${escapeHtml(data.title)}</h3><p>${escapeHtml(data.category || '')}</p><p>${escapeHtml(data.description || '')}</p><div class="row-actions"><button data-edit-project="${item.id}">แก้ไข</button><button class="danger" data-delete-project="${item.id}">ลบ</button></div></article>`);
      document.querySelector(`[data-edit-project="${item.id}"]`).addEventListener('click', () => editProject(item.id, data));
      document.querySelector(`[data-delete-project="${item.id}"]`).addEventListener('click', async () => {
        if (confirm('ลบ Project นี้ใช่ไหม?')) await deleteDoc(doc(db, 'projects', item.id));
      });
    });
  });
}

function listenNews() {
  const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
  onSnapshot(q, (snap) => {
    $('newsList').innerHTML = '';
    snap.forEach((item) => {
      const data = item.data();
      renderCard('newsList', `<article class="admin-card">${data.imageUrl ? `<img src="${escapeHtml(data.imageUrl)}" alt="" />` : ''}<h3>${escapeHtml(data.title)}</h3><p>${escapeHtml(data.dateText || '')}</p><p>${escapeHtml(data.description || '')}</p><div class="row-actions"><button data-edit-news="${item.id}">แก้ไข</button><button class="danger" data-delete-news="${item.id}">ลบ</button></div></article>`);
      document.querySelector(`[data-edit-news="${item.id}"]`).addEventListener('click', () => editNews(item.id, data));
      document.querySelector(`[data-delete-news="${item.id}"]`).addEventListener('click', async () => {
        if (confirm('ลบข่าวนี้ใช่ไหม?')) await deleteDoc(doc(db, 'news', item.id));
      });
    });
  });
}

function listenCerts() {
  const q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
  onSnapshot(q, (snap) => {
    $('certList').innerHTML = '';
    snap.forEach((item) => {
      const data = item.data();
      renderCard('certList', `<article class="admin-card">${data.imageUrl ? `<img src="${escapeHtml(data.imageUrl)}" alt="" />` : ''}<h3>${escapeHtml(data.title)}</h3><p>${escapeHtml(data.category || '')} · ${escapeHtml(data.status || '')}</p><p>${escapeHtml(data.description || '')}</p><div class="row-actions"><button data-edit-cert="${item.id}">แก้ไข</button><button class="danger" data-delete-cert="${item.id}">ลบ</button></div></article>`);
      document.querySelector(`[data-edit-cert="${item.id}"]`).addEventListener('click', () => editCert(item.id, data));
      document.querySelector(`[data-delete-cert="${item.id}"]`).addEventListener('click', async () => {
        if (confirm('ลบ Certificate นี้ใช่ไหม?')) await deleteDoc(doc(db, 'certificates', item.id));
      });
    });
  });
}

function editProject(id, data) {
  editing.projects = id;
  $('projectTitle').value = data.title || '';
  $('projectCategory').value = data.category || '';
  $('projectDesc').value = data.description || '';
  $('projectFeatures').value = (data.features || []).join(', ');
  $('projectGithub').value = data.githubUrl || '';
  $('projectWebsite').value = data.websiteUrl || '';
  $('projectIcon').value = data.icon || '';
  $('projectOrder').value = data.order || 0;
  $('projectSubmit').textContent = 'อัปเดต Project';
  window.scrollTo({ top: $('projectForm').offsetTop - 80, behavior: 'smooth' });
}

function editNews(id, data) {
  editing.news = id;
  $('newsTitle').value = data.title || '';
  $('newsDate').value = data.dateText || '';
  $('newsDesc').value = data.description || '';
  $('newsTags').value = (data.tags || []).join(', ');
  $('newsGithub').value = data.githubUrl || '';
  $('newsWebsite').value = data.websiteUrl || '';
  $('newsSubmit').textContent = 'อัปเดตข่าวสาร';
  window.scrollTo({ top: $('newsForm').offsetTop - 80, behavior: 'smooth' });
}

function editCert(id, data) {
  editing.certs = id;
  $('certTitle').value = data.title || '';
  $('certCategory').value = data.category || '';
  $('certStatus').value = data.status || '';
  $('certDesc').value = data.description || '';
  $('certSubmit').textContent = 'อัปเดต Certificate';
  window.scrollTo({ top: $('certForm').offsetTop - 80, behavior: 'smooth' });
}

initFirebase();
