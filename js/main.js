/* ── Nav mobile ── */
const toggle    = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.nav-mobile');

if (toggle && mobileNav) {
  mobileNav.setAttribute('aria-hidden', 'true');

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    mobileNav.setAttribute('aria-hidden', !open);
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('click', e => {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMobileNav();
    }
  });
}


/* ── Modal legal ── */
const modalOverlay = document.getElementById('modal-legal');

if (modalOverlay) {
  const modalClose  = modalOverlay.querySelector('.modal-close');
  const modalTabs   = modalOverlay.querySelectorAll('.modal-tab');
  const modalPanels = modalOverlay.querySelectorAll('.modal-panel');
  let _scrollY = 0;

  function lockScroll() {
    _scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${_scrollY}px`;
    document.body.style.width    = '100%';
  }

  function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    window.scrollTo(0, _scrollY);
  }

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
    lockScroll();
  }

  function closeModal() {
    modalOverlay.classList.remove('is-open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    unlockScroll();
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
}


/* ── Formulario ── */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
  });
}
