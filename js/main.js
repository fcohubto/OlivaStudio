/* ── Nav mobile ── */
const toggle    = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.nav-mobile');

toggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  mobileNav.setAttribute('aria-hidden', !open);
});

document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });
});

/* ── Modal legal ── */
const modalOverlay = document.getElementById('modal-legal');
const modalClose   = modalOverlay.querySelector('.modal-close');
const modalTabs    = modalOverlay.querySelectorAll('.modal-tab');
const modalPanels  = modalOverlay.querySelectorAll('.modal-panel');

function openModal(tabName) {
  modalTabs.forEach(t => {
    const active = t.dataset.tab === tabName;
    t.classList.toggle('modal-tab--active', active);
    t.setAttribute('aria-selected', active);
  });
  modalPanels.forEach(p => {
    p.classList.toggle('modal-panel--hidden', p.id !== `tab-${tabName}`);
  });
  modalOverlay.classList.add('is-open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('is-open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-trigger').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openModal(link.dataset.tab);
  });
});

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) closeModal();
});

modalTabs.forEach(tab => {
  tab.addEventListener('click', () => openModal(tab.dataset.tab));
});
