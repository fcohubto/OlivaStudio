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


/* ── Navbar — se solidifica al bajar del hero (detalle premium sutil) ── */
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  let ticking = false;
  const updateHeaderState = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 50);
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ── Nav — sección activa al hacer scroll (scrollspy) + indicador que se desliza ── */
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const navEl = document.querySelector('.nav');
const navIndicator = document.querySelector('.nav-indicator');

if (navLinks.length) {
  const sections = [...navLinks]
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  let activeLink = null;

  const positionIndicator = () => {
    if (!navIndicator || !navEl) return;
    if (!activeLink) {
      navIndicator.classList.remove('is-active');
      return;
    }
    const navRect  = navEl.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const inset = 12; // var(--sp-3), mismo inset que usaba el ::after estático
    navIndicator.style.width = `${linkRect.width - inset * 2}px`;
    navIndicator.style.transform = `translateX(${linkRect.left - navRect.left + inset}px)`;
    navIndicator.style.top = `${linkRect.bottom - navRect.top - 4}px`;
    navIndicator.classList.add('is-active');
  };

  const setActiveLink = id => {
    activeLink = null;
    navLinks.forEach(link => {
      const isActive = Boolean(id) && link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      if (isActive) activeLink = link;
    });
    positionIndicator();
  };

  // Set en vez de "primer entry que intersecta": evita que el indicador quede
  // pegado en una sección si el usuario salta rápido (click de nav, anchor) y el
  // observer no vuelve a disparar para la sección real donde termina el scroll.
  const intersectingIds = new Set();

  const spyObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) intersectingIds.add(entry.target.id);
        else intersectingIds.delete(entry.target.id);
      });
      const current = sections.find(section => intersectingIds.has(section.id));
      setActiveLink(current ? current.id : null);
    },
    { rootMargin: '-64px 0px -60% 0px' }
  );

  sections.forEach(section => spyObserver.observe(section));
  window.addEventListener('resize', positionIndicator);
}


/* ── El Framework — nodo del diagrama sincronizado con la fase en lectura ── */
const frameworkSteps = document.querySelectorAll('.framework-step[data-node]');
const frameworkNodes = document.querySelectorAll('.framework-oliva-card .framework-node');

if (frameworkSteps.length && frameworkNodes.length) {
  const setActiveNode = node => {
    frameworkNodes.forEach(el => {
      el.classList.toggle('framework-node--active', el.dataset.node === node);
    });
  };

  const frameworkObserver = new IntersectionObserver(
    entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setActiveNode(visible.target.dataset.node);
    },
    { rootMargin: '-30% 0px -50% 0px' }
  );

  frameworkSteps.forEach(step => frameworkObserver.observe(step));
}


/* ── Scroll-reveal — headers y bloques entran al alcanzar el viewport ── */
const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-group]');

if (revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach(el => revealObserver.observe(el));
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


/* ── Demo interactivo GATO (self-contained — no depende del proyecto real, valores portados una sola vez) ── */
const gatoEmbed = document.querySelector('.gato-embed');

if (gatoEmbed) {
  // Botón "Encargar por WhatsApp" decorativo a propósito: es una demo ilustrativa
  // de UI/UX, no un canal de venta real. Queda inactivo por CSS (pointer-events:none)
  // + fuera del tab order (tabindex="-1") — no requiere lógica de click.

  const GATO_SIZES = {
    small:  { name: 'Árbol Pequeño', platforms: 1, heightCm: 60,  price: 99000  },
    medium: { name: 'Árbol Mediano', platforms: 2, heightCm: 80,  price: 149000 },
    large:  { name: 'Árbol Grande',  platforms: 3, heightCm: 100, price: 199000 }
  };

  const GATO_EXTRAS = {
    house:   { price: 45000, label: 'Casa' },
    ramp:    { price: 25000, label: 'Rampa' },
    bigbase: { price: 15000, label: 'Base grande' }
  };

  const gatoState = { size: 'medium', house: false, ramp: false, bigbase: false };

  const gatoFmt = n => '$' + n.toLocaleString('es-CL');

  function gatoTotal() {
    let p = GATO_SIZES[gatoState.size].price;
    Object.keys(GATO_EXTRAS).forEach(k => { if (gatoState[k]) p += GATO_EXTRAS[k].price; });
    return p;
  }

  function gatoDrawTree() {
    const svg = document.getElementById('gato-tree-svg');
    if (!svg) return;

    const W = 220, H = 320;
    const { platforms, heightCm } = GATO_SIZES[gatoState.size];
    const baseY = H - 20;
    const baseW = gatoState.bigbase ? 190 : 158;
    const baseX = (W - baseW) / 2;
    const postW = 22, postX = (W - postW) / 2;
    const postH = { 60: 186, 80: 244, 100: 294 }[heightCm];
    const postTop = baseY - postH;
    const fracs = { 1: [0.72], 2: [0.46, 0.78], 3: [0.34, 0.58, 0.80] }[platforms];
    const pWidths = [138, 110, 84];

    let h = '';
    h += `<ellipse cx="${W / 2}" cy="${H - 12}" rx="${baseW / 2 - 8}" ry="5" fill="rgba(28, 61, 45, 0.05)"/>`;
    h += `<rect x="${baseX}" y="${baseY}" width="${baseW}" height="18" rx="4" fill="#d4a96a" stroke="#1C3D2D" stroke-width="1.5"/>`;
    h += `<rect x="${postX}" y="${postTop}" width="${postW}" height="${postH}" fill="#b87d48" rx="2" stroke="#1C3D2D" stroke-width="0.5"/>`;
    h += `<rect x="${postX}" y="${postTop}" width="6" height="${postH}" rx="1" fill="rgba(255,255,255,0.18)"/>`;

    for (let i = 1; i <= 3; i++) {
      const lx = postX + (postW / 4) * i;
      h += `<line x1="${lx}" y1="${postTop + 4}" x2="${lx}" y2="${baseY - 2}" stroke="#7a4e22" stroke-width="1.2" stroke-dasharray="3,5" opacity="0.6"/>`;
    }

    if (gatoState.ramp && platforms >= 2) {
      const y1 = baseY - fracs[0] * postH - 12;
      const y2 = baseY - fracs[1] * postH;
      const rx1 = postX + postW + 2, ry1 = y1 + 5;
      const rx2 = postX + postW + 48, ry2 = y2 + 12;
      const len = Math.sqrt(Math.pow(rx2 - rx1, 2) + Math.pow(ry2 - ry1, 2));
      const ang = Math.atan2(ry2 - ry1, rx2 - rx1) * 180 / Math.PI + 90;
      h += `<rect x="${rx1 - 5}" y="${ry1}" width="10" height="${len}" rx="3" fill="#d4a96a" stroke="#1C3D2D" stroke-width="1.2" transform="rotate(${ang},${rx1},${ry1})" opacity="0.9"/>`;
    }

    fracs.forEach((frac, i) => {
      const pw = pWidths[i] || 80;
      const py = baseY - frac * postH - 12;
      const px = (W - pw) / 2;
      h += `<rect x="${px}" y="${py}" width="${pw}" height="12" rx="3" fill="#1C3D2D" stroke="#132A1F" stroke-width="1"/>`;
      h += `<rect x="${px + 4}" y="${py + 2}" width="${pw - 12}" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>`;
    });

    if (gatoState.house) {
      const topFrac = fracs[fracs.length - 1];
      const topY = baseY - topFrac * postH - 12;
      const hW = 62, bodyH = 30, roofH = 22;
      const hX = (W - hW) / 2, roofTop = topY - bodyH - roofH;
      h += `<rect x="${hX}" y="${roofTop + roofH}" width="${hW}" height="${bodyH + 2}" fill="#d4a96a" stroke="#1C3D2D" stroke-width="1.5" rx="2"/>`;
      h += `<polygon points="${hX - 6},${roofTop + roofH} ${hX + hW + 6},${roofTop + roofH} ${W / 2},${roofTop}" fill="#1C3D2D" stroke="#132A1F" stroke-width="1.5"/>`;
      const dR = 10;
      h += `<path d="M${W / 2 - dR},${roofTop + roofH + bodyH} a${dR},${dR} 0 0,1 ${dR * 2},0" fill="#FAF9F6" stroke="#1C3D2D" stroke-width="1.5"/>`;
    }

    svg.innerHTML = h;
  }

  function gatoRender() {
    const s = GATO_SIZES[gatoState.size];

    document.getElementById('gato-preview-name').textContent = s.name;

    document.querySelectorAll('.gato-size-card').forEach(card => {
      card.classList.toggle('gato-size-card--active', card.dataset.size === gatoState.size);
    });
    document.querySelectorAll('.gato-extra-card').forEach(card => {
      card.classList.toggle('gato-extra-card--active', !!gatoState[card.dataset.extra]);
    });

    const tags = [`${s.platforms} plataforma${s.platforms > 1 ? 's' : ''}`, `${s.heightCm} cm`];
    if (gatoState.bigbase) tags.push('Base grande');
    if (gatoState.house)   tags.push('Casa');
    if (gatoState.ramp)    tags.push('Rampa');
    document.getElementById('gato-preview-tags').innerHTML =
      tags.map(t => `<span class="gato-preview__tag">${t}</span>`).join('');

    document.getElementById('gato-base-price').textContent = gatoFmt(s.price);

    let addonPrice = 0;
    Object.keys(GATO_EXTRAS).forEach(k => { if (gatoState[k]) addonPrice += GATO_EXTRAS[k].price; });
    const addonsRow = document.getElementById('gato-addons-row');
    if (addonPrice > 0) {
      addonsRow.style.display = 'flex';
      document.getElementById('gato-addons-price').textContent = `+${gatoFmt(addonPrice)}`;
    } else {
      addonsRow.style.display = 'none';
    }

    document.getElementById('gato-total-price').textContent = gatoFmt(gatoTotal());

    gatoDrawTree();
  }

  document.querySelectorAll('.gato-size-card').forEach(card => {
    card.addEventListener('click', () => {
      gatoState.size = card.dataset.size;
      gatoRender();
    });
  });

  document.querySelectorAll('.gato-extra-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.extra;
      gatoState[key] = !gatoState[key];
      gatoRender();
    });
  });

  gatoRender();
}
