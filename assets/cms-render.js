import { firebaseConfig } from '../firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const configured = !firebaseConfig.apiKey.includes('PASTE_') && !firebaseConfig.projectId.includes('PASTE_');
const text = (el, value) => { if (el && value) el.textContent = value; };
const attr = (el, name, value) => { if (el && value) el.setAttribute(name, value); };

function add(el, tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value) node.textContent = value;
  el.appendChild(node);
  return node;
}

function setLink(a, url, label) {
  if (!a || !url) return;
  a.href = url;
  if (label) a.textContent = label;
}

async function renderProfile(db) {
  const snap = await getDoc(doc(db, 'site', 'profile'));
  if (!snap.exists()) return;
  const data = snap.data();

  text(document.querySelector('.title span'), data.name);
  text(document.querySelector('.subtitle'), data.subtitle);
  text(document.querySelector('#about-title + .section-sub'), data.lead);

  const aboutParagraphs = document.querySelectorAll('.about-body > p');
  text(aboutParagraphs[0], data.about1);
  text(aboutParagraphs[1], data.about2);

  const facts = document.querySelector('.about-facts');
  if (facts) {
    facts.innerHTML = '';
    const rows = [
      ['bi-telephone', `โทร: ${data.phone || ''}`, ''],
      ['bi-envelope', 'อีเมล: ', `mailto:${data.email || ''}`, data.email],
      ['bi-envelope-paper', 'อีเมลสำรอง: ', `mailto:${data.altEmail || ''}`, data.altEmail],
      ['bi-geo-alt', `ที่อยู่: ${data.location || ''}`, ''],
      ['bi-github', 'GitHub: ', data.githubUrl, 'bfirstkok'],
      ['bi-globe2', 'Website: ', data.websiteUrl, 'bfirstkok.me'],
      ['bi-facebook', 'Facebook: ', data.facebookUrl, 'Khanathippakorn Namthachak']
    ];
    rows.forEach(([icon, label, url, linkText]) => {
      const li = add(facts, 'li');
      const i = add(li, 'i', `bi ${icon}`);
      if (url && linkText) {
        li.append(document.createTextNode(label));
        const a = add(li, 'a', '', linkText);
        a.href = url;
        a.target = url.startsWith('mailto:') ? '' : '_blank';
        a.rel = 'noopener';
      } else {
        li.append(document.createTextNode(label));
      }
    });
  }

  const chips = document.querySelector('.about-skills');
  if (chips && Array.isArray(data.skills)) {
    chips.innerHTML = '';
    data.skills.forEach((skill, index) => add(chips, 'span', index === 0 ? 'chip primary' : 'chip', skill));
  }

  const socialLinks = document.querySelectorAll('.social a');
  attr(socialLinks[0], 'href', data.facebookUrl);
  attr(socialLinks[1], 'href', data.githubUrl);
  attr(socialLinks[2], 'href', data.websiteUrl);
  attr(socialLinks[3], 'href', data.email ? `mailto:${data.email}` : '');

  const contactItems = document.querySelectorAll('#contact .contact-item div');
  text(contactItems[0], data.phone);
  if (contactItems[1]) { contactItems[1].innerHTML = ''; const a = add(contactItems[1], 'a', '', data.email || ''); a.href = `mailto:${data.email || ''}`; }
  if (contactItems[2]) { contactItems[2].innerHTML = ''; const a = add(contactItems[2], 'a', '', data.altEmail || ''); a.href = `mailto:${data.altEmail || ''}`; }
  if (contactItems[3]) { contactItems[3].innerHTML = ''; const a = add(contactItems[3], 'a', '', data.githubUrl || ''); a.href = data.githubUrl || '#'; a.target = '_blank'; a.rel = 'noopener'; }
  if (contactItems[4]) { contactItems[4].innerHTML = ''; const a = add(contactItems[4], 'a', '', data.websiteUrl || ''); a.href = data.websiteUrl || '#'; a.target = '_blank'; a.rel = 'noopener'; }

  text(document.querySelector('footer'), data.footer);
}

function projectCard(item) {
  const article = document.createElement('article');
  article.className = 'project-card project-item';
  article.dataset.cat = item.category || 'web';
  const head = add(article, 'div', 'project-head');
  const left = add(head, 'div');
  const title = add(left, 'h3', 'item-title', `${item.icon || '🚀'} ${item.title || 'Project'}`);
  title.style.margin = '0';
  add(left, 'div', 'meta', item.category || 'Project');
  add(head, 'div', 'date-badge', 'Admin Project');
  add(article, 'p', '', item.description || '');
  const tags = add(article, 'div', 'project-tags');
  tags.style.marginTop = '12px';
  (item.features || []).forEach(feature => add(tags, 'span', 'project-tag', feature));
  const actions = add(article, 'div', 'actions');
  if (item.websiteUrl) { const a = add(actions, 'a', 'action-btn', 'Website'); a.href = item.websiteUrl; a.target = '_blank'; a.rel = 'noopener'; }
  if (item.githubUrl) { const a = add(actions, 'a', 'action-btn alt', 'GitHub'); a.href = item.githubUrl; a.target = '_blank'; a.rel = 'noopener'; }
  return article;
}

async function renderProjects(db) {
  const grid = document.querySelector('#projects .portfolio-grid');
  if (!grid) return;
  const snap = await getDocs(query(collection(db, 'projects'), orderBy('order', 'asc')));
  if (snap.empty) return;
  grid.innerHTML = '';
  snap.docs.forEach(d => grid.appendChild(projectCard(d.data())));
}

function newsCard(item, active) {
  const article = document.createElement('article');
  article.className = `news-item ${active ? 'active' : ''}`;
  const date = add(article, 'div', 'news-date');
  add(date, 'strong', '', (item.dateText || '--').slice(0, 2));
  add(date, 'span', '', (item.dateText || 'อัปเดต').slice(3));
  const img = add(article, 'img', 'news-image');
  img.src = item.imageUrl || 'images/dino-forum-thumb.svg';
  img.alt = item.title || 'news';
  const body = add(article, 'div', 'news-body');
  add(body, 'h3', '', item.title || 'ข่าวสาร');
  add(body, 'p', '', item.description || '');
  const meta = add(body, 'div', 'news-meta');
  (item.tags || []).forEach(tag => add(meta, 'span', 'news-pill', tag));
  return article;
}

async function renderNews(db) {
  const list = document.querySelector('.news-list');
  if (!list) return;
  const snap = await getDocs(query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(7)));
  if (snap.empty) return;
  list.innerHTML = '';
  snap.docs.forEach((d, i) => list.appendChild(newsCard(d.data(), i === 0)));
  const count = document.getElementById('newsCount');
  if (count) count.textContent = `1 / ${snap.docs.length}`;
}

function certCard(item, active) {
  const article = document.createElement('article');
  article.className = `cert-card ${item.imageUrl ? 'cert-with-image' : ''} ${active ? 'active' : ''}`;
  if (item.imageUrl) { const img = add(article, 'img', 'cert-image'); img.src = item.imageUrl; img.alt = item.title || 'certificate'; }
  const content = add(article, 'div', 'cert-content');
  const icon = add(content, 'div', 'cert-icon');
  add(icon, 'i', 'bi bi-award');
  add(content, 'h3', '', item.title || 'Certificate');
  add(content, 'p', '', item.description || '');
  const footer = add(content, 'div', 'cert-footer');
  add(footer, 'span', '', item.category || 'Certificate');
  add(footer, 'span', 'cert-status', item.status || 'อัปเดต');
  return article;
}

async function renderCerts(db) {
  const grid = document.querySelector('.cert-grid');
  if (!grid) return;
  const snap = await getDocs(query(collection(db, 'certificates'), orderBy('createdAt', 'desc'), limit(4)));
  if (snap.empty) return;
  grid.innerHTML = '';
  snap.docs.forEach((d, i) => grid.appendChild(certCard(d.data(), i === 0)));
  const count = document.getElementById('certCount');
  if (count) count.textContent = `1 / ${snap.docs.length}`;
}

async function main() {
  if (!configured) return;
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    await renderProfile(db);
    await renderProjects(db);
    await renderNews(db);
    await renderCerts(db);
  } catch (err) {
    console.warn('CMS render skipped', err);
  }
}

main();
