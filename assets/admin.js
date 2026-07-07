import { firebaseConfig, adminEmail } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

const $ = (id) => document.getElementById(id);
const isConfigured = !firebaseConfig.apiKey.includes('PASTE_') && !firebaseConfig.projectId.includes('PASTE_');

let app, auth, db, storage;
let editing = { news: null, certs: null };

function setStatus(text, type = 'info') {
  const el = $('status');
  el.textContent = text;
  el.className = `status ${type}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function tagsFromInput(value) {
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

function listenNews() {
  const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
  onSnapshot(q, (snap) => {
    $('newsList').innerHTML = '';
    snap.forEach((item) => {
      const data = item.data();
      $('newsList').insertAdjacentHTML('beforeend', `
        <article class="admin-card">
          ${data.imageUrl ? `<img src="${escapeHtml(data.imageUrl)}" alt="" />` : ''}
          <h3>${escapeHtml(data.title)}</h3>
          <p>${escapeHtml(data.dateText || '')}</p>
          <p>${escapeHtml(data.description || '')}</p>
          <div class="row-actions">
            <button data-edit-news="${item.id}">แก้ไข</button>
            <button class="danger" data-delete-news="${item.id}">ลบ</button>
          </div>
        </article>
      `);
      const editBtn = document.querySelector(`[data-edit-news="${item.id}"]`);
      const delBtn = document.querySelector(`[data-delete-news="${item.id}"]`);
      editBtn.addEventListener('click', () => editNews(item.id, data));
      delBtn.addEventListener('click', async () => {
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
      $('certList').insertAdjacentHTML('beforeend', `
        <article class="admin-card">
          ${data.imageUrl ? `<img src="${escapeHtml(data.imageUrl)}" alt="" />` : ''}
          <h3>${escapeHtml(data.title)}</h3>
          <p>${escapeHtml(data.category || '')} · ${escapeHtml(data.status || '')}</p>
          <p>${escapeHtml(data.description || '')}</p>
          <div class="row-actions">
            <button data-edit-cert="${item.id}">แก้ไข</button>
            <button class="danger" data-delete-cert="${item.id}">ลบ</button>
          </div>
        </article>
      `);
      const editBtn = document.querySelector(`[data-edit-cert="${item.id}"]`);
      const delBtn = document.querySelector(`[data-delete-cert="${item.id}"]`);
      editBtn.addEventListener('click', () => editCert(item.id, data));
      delBtn.addEventListener('click', async () => {
        if (confirm('ลบ Certificate นี้ใช่ไหม?')) await deleteDoc(doc(db, 'certificates', item.id));
      });
    });
  });
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
