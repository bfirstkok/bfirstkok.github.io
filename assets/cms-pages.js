import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const esc = (v = '') => String(v).replace(/[<>]/g, '');

function link(url, label) {
  return url ? `<a class="pill" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>` : '';
}

function newsTemplate(item) {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  return `<article class="news-card"><img class="news-img" src="${esc(item.imageUrl || 'images/dino-forum-thumb.svg')}" alt="${esc(item.title || 'news')}"><div><div class="date">▣ ${esc(item.dateText || 'อัปเดต')}</div><h2>${esc(item.title || 'ข่าวสาร')}</h2><p>${esc(item.description || '')}</p><div class="meta">${link(item.githubUrl, 'GitHub')}${link(item.websiteUrl, 'Website')}${tags.map(t => `<span class="pill">${esc(t)}</span>`).join('')}</div></div></article>`;
}

function certTemplate(item) {
  const image = item.imageUrl ? `<img class="cert-image" src="${esc(item.imageUrl)}" alt="${esc(item.title || 'certificate')}">` : '<div class="cert-icon">🏆</div>';
  return `<article class="cert-card">${image}<h2>${esc(item.title || 'Certificate')}</h2><p>${esc(item.description || '')}</p><div class="cert-footer"><span>${esc(item.category || 'Certificate')}</span><span class="cert-status">${esc(item.status || 'อัปเดต')}</span></div></article>`;
}

async function renderNewsPage() {
  const grid = document.querySelector('.news-grid');
  if (!grid) return;
  try {
    const snap = await getDocs(query(collection(db, 'news'), orderBy('createdAt', 'desc')));
    const rows = snap.docs.map(d => d.data());
    if (rows.length) grid.innerHTML = rows.map(newsTemplate).join('');
  } catch (err) { console.warn(err); }
}

async function renderCertPage() {
  const grid = document.querySelector('.cert-grid');
  if (!grid) return;
  try {
    const snap = await getDocs(query(collection(db, 'certificates'), orderBy('createdAt', 'desc')));
    const rows = snap.docs.map(d => d.data());
    if (rows.length) grid.innerHTML = rows.map(certTemplate).join('');
  } catch (err) { console.warn(err); }
}

renderNewsPage();
renderCertPage();
