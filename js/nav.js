/* ================================================================
   nav.js — Scroll behavior, Active link highlighting, Mobile menu
   ================================================================ */

export function initNav() {
  const nav        = document.getElementById('nav');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('mobile-drawer');
  const sections   = document.querySelectorAll('section[id]');

  // ── Sticky shadow on scroll ───────────────────────────────────
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Active link via IntersectionObserver ──────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((s) => observer.observe(s));

  // ── Mobile hamburger menu ─────────────────────────────────────
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      drawer.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
}
