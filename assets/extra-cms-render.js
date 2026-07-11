import { firebaseConfig } from '../firebase-config.js';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const esc = (v = '') => String(v).replace(/[<>]/g, '');

async function readSite(name) {
  const snap = await getDoc(doc(db, 'site', name));
  return snap.exists() ? snap.data() : null;
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el && value) el.textContent = value;
}

async function renderSections() {
  const s = await readSite('sections');
  if (!s) return;
  setText('#skills-title', s.skillsTitle);
  setText('#skills-title + .section-sub', s.skillsSub);
  setText('#experience-title', s.experienceTitle);
  setText('#experience-title + .section-sub', s.experienceSub);
  setText('#resume-title', s.educationTitle);
  setText('#resume-title + .section-sub', s.educationSub);
  setText('#projects-title', s.projectsTitle);
  setText('#projects-title + .section-sub', s.projectsSub);
  setText('#portfolio-title', s.portfolioTitle);
  setText('#portfolio-title + .section-sub', s.portfolioSub);
  setText('#contact-title', s.contactTitle);
  setText('#contact-title + .section-sub', s.contactSub);
}

async function renderEducation() {
  const data = await readSite('education');
  const grid = document.querySelector('.education-grid');
  if (!data || !grid || !Array.isArray(data.rows)) return;
  grid.innerHTML = data.rows.map((item, i) => `<div class="r-col"><h3 class="r-heading"><i class="bi ${i === 0 ? 'bi-mortarboard' : 'bi-book'}"></i> ${esc(i === 0 ? 'ระดับอุดมศึกษา' : 'ระดับมัธยมศึกษา')}</h3><ul class="timeline"><li><span class="timeline-point" aria-hidden="true"></span><div class="item-title">${esc(item.title)}</div><div class="meta">${esc(item.detail).replaceAll('\n','<br>')}</div></li></ul></div>`).join('');
}

async function renderExperience() {
  const data = await readSite('experience');
  const grid = document.querySelector('.experience-grid');
  if (!data || !grid || !Array.isArray(data.rows)) return;
  grid.innerHTML = data.rows.map(item => `<article class="exp-card"><div class="exp-icon"><i class="bi bi-briefcase"></i></div><div class="exp-content"><div class="exp-head"><div><div class="item-title">${esc(item.title)}</div><div class="meta">${esc(item.meta)}</div></div><div class="date-badge">${esc(item.date)}</div></div><div class="exp-tags">${(item.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div></div></article>`).join('');
}

function projectCard(item) {
  return `<article class="project-card project-item" data-cat="${esc(item.category || '')}"><div class="project-head"><div><h3 class="item-title" style="margin:0;">${esc(item.title)}</h3><div class="meta">${esc(item.meta || '')}</div></div><div class="date-badge">${esc(item.badge || 'Project')}</div></div><p>${esc(item.description || '')}</p><ul class="project-list">${(item.features || []).map(f => `<li><i class="bi bi-check2-circle"></i> ${esc(f)}</li>`).join('')}</ul><div class="project-tags" style="margin-top:12px;">${(item.tags || []).map(t => `<span class="project-tag">${esc(t)}</span>`).join('')}</div><div class="actions">${item.websiteUrl ? `<a class="action-btn" href="${esc(item.websiteUrl)}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}${item.githubUrl ? `<a class="action-btn alt" href="${esc(item.githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}</div></article>`;
}

async function renderProjects() {
  const grid = document.querySelector('#projects .portfolio-grid');
  if (!grid) return;
  const snap = await getDocs(query(collection(db, 'projects'), orderBy('order', 'asc')));
  if (snap.empty) return;
  grid.innerHTML = snap.docs.map(d => projectCard(d.data())).join('');
}

async function renderPortfolioWorks() {
  const data = await readSite('portfolioWorks');
  const grid = document.querySelector('.portfolio-works-grid');
  if (!data || !grid || !Array.isArray(data.rows)) return;
  grid.innerHTML = data.rows.map(item => `<a class="portfolio-link reveal show" href="${esc(item.url || '#')}" target="_blank" rel="noopener noreferrer"><div class="portfolio-item"><div class="portfolio-arrow"><i class="bi bi-arrow-up-right"></i></div><div class="portfolio-icon">${esc(item.icon || '🌐')}</div><div class="portfolio-content"><h3 class="portfolio-title">${esc(item.title)}</h3><p class="portfolio-desc">${esc(item.desc)}</p><div class="portfolio-features">${(item.tags || []).map(t => `<span class="feature-tag">${esc(t)}</span>`).join('')}</div></div></div></a>`).join('');
}

async function renderContactHighlights() {
  const data = await readSite('contactHighlights');
  const contactCols = document.querySelectorAll('#contact .contact-grid > div');
  if (!data || !contactCols[1] || !Array.isArray(data.rows)) return;
  const list = contactCols[1].querySelector('.contact-list');
  if (!list) return;
  list.innerHTML = data.rows.map(item => `<div class="contact-item"><i class="bi bi-check2-circle"></i><div>${esc(item)}</div></div>`).join('');
}

async function main() {
  try {
    await renderSections();
    await renderEducation();
    await renderExperience();
    await renderProjects();
    await renderPortfolioWorks();
    await renderContactHighlights();
  } catch (err) {
    console.warn('extended cms skipped', err);
  }
}

main();
