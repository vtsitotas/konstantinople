/**
 * ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΗ...ΟΠΩΣ ΠΑΛΙΑ — main.js
 * type="module" is required by Vite
 */

// ─── SMOOTH SCROLL ─────────────────────────────────────────────────────────
function smoothScrollTo(targetY, duration) {
  duration = duration || 700;
  const startY = window.scrollY;
  const diff = targetY - startY;
  var startTime = null;

  function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var href = link.getAttribute('href');
    if (href === '#') return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    var headerH = document.getElementById('site-header').offsetHeight;
    var top = target.getBoundingClientRect().top + window.scrollY - headerH;
    smoothScrollTo(top);
    closeMenu();
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

// ─── HEADER SHRINK ─────────────────────────────────────────────────────────
const header = document.getElementById('site-header');

function syncHeader() {
  header.classList.toggle('scrolled', window.scrollY > 80);
}

window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

// ─── MOBILE NAV ────────────────────────────────────────────────────────────
const menuBtn = document.getElementById('menu-btn');
const mainNav = document.getElementById('main-nav');

function openMenu() {
  mainNav.classList.add('is-open');
  mainNav.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mainNav.classList.remove('is-open');
  mainNav.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', function() {
  menuBtn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
});

document.addEventListener('click', function(e) {
  if (!mainNav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeMenu();
});

mainNav.addEventListener('touchstart', function() {}, { passive: true });

// ─── REVEAL ANIMATIONS ─────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal').forEach(function(el) {
  var grid = el.closest('.specialties-grid, .reviews-grid, .gallery-grid');
  if (grid) {
    var siblings = Array.from(grid.querySelectorAll('.reveal'));
    el.style.transitionDelay = (siblings.indexOf(el) * 0.08) + 's';
  }
  revealObserver.observe(el);
});

// ─── MENU TABS ─────────────────────────────────────────────────────────────
const tabBtns   = Array.from(document.querySelectorAll('.tab-btn'));
const tabPanels = document.querySelectorAll('.menu-panel');

function activateTab(btn) {
  tabBtns.forEach(function(b) {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
    b.tabIndex = -1;
  });
  tabPanels.forEach(function(panel) {
    panel.classList.remove('active');
    panel.hidden = true;
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  btn.tabIndex = 0;
  var panel = document.getElementById('tab-' + btn.dataset.tab);
  if (panel) { panel.classList.add('active'); panel.hidden = false; }
}

tabBtns.forEach(function(btn, i) {
  btn.addEventListener('click', function() { activateTab(btn); });
  btn.addEventListener('keydown', function(e) {
    var next = null;
    if (e.key === 'ArrowRight') next = tabBtns[i + 1] || tabBtns[0];
    if (e.key === 'ArrowLeft')  next = tabBtns[i - 1] || tabBtns[tabBtns.length - 1];
    if (next) { next.focus(); activateTab(next); }
  });
});
