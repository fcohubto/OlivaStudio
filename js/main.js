/* ── Turnstile callbacks (globales, antes del DOMContentLoaded) ── */
let turnstileToken = '';
window.onTurnstileSuccess  = token => { turnstileToken = token; };
window.onTurnstileExpired  = ()    => { turnstileToken = ''; };


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


/* ── FAQ accordion ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item     = btn.closest('.faq-item');
    const isOpen   = item.classList.contains('is-open');
    const isMobile = !window.matchMedia('(min-width: 1024px)').matches;

    if (isMobile) {
      document.querySelectorAll('.faq-item.is-open').forEach(open => {
        open.classList.remove('is-open');
        open.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
    }

    item.classList.toggle('is-open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});


/* ── Formulario de contacto ── */
const contactForm    = document.getElementById('contacto-form');
const contactSuccess = document.getElementById('contacto-success');

if (contactForm) {
  const fieldNombre = contactForm.querySelector('#nombre');
  const fieldEmail  = contactForm.querySelector('#email');
  const fieldDesc   = contactForm.querySelector('#descripcion');
  const submitBtn   = contactForm.querySelector('[data-contacto-cta]');

  function setValid(el) { el.classList.add('is-valid'); el.classList.remove('is-error'); }
  function setError(el) { el.classList.add('is-error');  el.classList.remove('is-valid'); }
  function clearState(el) { el.classList.remove('is-valid', 'is-error'); }

  function validateNombre() {
    const ok = fieldNombre.value.trim().length >= 2;
    ok ? setValid(fieldNombre) : setError(fieldNombre);
    return ok;
  }

  function validateEmail() {
    const ok = fieldEmail.checkValidity() && fieldEmail.value.trim() !== '';
    ok ? setValid(fieldEmail) : setError(fieldEmail);
    return ok;
  }

  fieldNombre.addEventListener('blur',  validateNombre);
  fieldEmail.addEventListener('blur',   validateEmail);
  [fieldNombre, fieldEmail, fieldDesc].forEach(f => {
    if (f) f.addEventListener('input', () => clearState(f));
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const allValid = [validateNombre(), validateEmail()].every(Boolean);

    if (!allValid) {
      const firstError = contactForm.querySelector('.is-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!turnstileToken) {
      if (window.turnstile) window.turnstile.reset();
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.classList.add('btn--loading');
    submitBtn.setAttribute('aria-disabled', 'true');

    const formData = new FormData(contactForm);
    formData.set('cf-turnstile-response', turnstileToken);

    fetch('/send.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        turnstileToken = '';
        if (window.turnstile) window.turnstile.reset();
        submitBtn.textContent = '✓ Mensaje enviado';
        submitBtn.classList.remove('btn--loading');
        submitBtn.classList.add('btn--sent');
        setTimeout(() => {
          contactForm.reset();
          [fieldNombre, fieldEmail, fieldDesc].forEach(f => { if (f) clearState(f); });
          contactForm.hidden = true;
          if (contactSuccess) {
            contactSuccess.hidden = false;
            contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 1200);
      })
      .catch(() => {
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn--loading');
        submitBtn.removeAttribute('aria-disabled');
        turnstileToken = '';
        if (window.turnstile) window.turnstile.reset();
      });
  });
}
