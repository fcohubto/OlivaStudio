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
