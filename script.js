// =====================================================
// Forhad Hossain — Lawyer Portfolio — Interactions
// =====================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll progress + header state ---------- */
  const header = document.getElementById('siteHeader');
  const progressFill = document.getElementById('progressFill');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollY = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (scrollY / docH) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';

    if (header) header.classList.toggle('scrolled', scrollY > 40);
    if (backToTop) backToTop.classList.toggle('show', scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Theme toggle (dark mode) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  // Default is always light — only switch to dark if user explicitly chose it
  const savedTheme = localStorage.getItem('fh-theme');
  if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
    localStorage.setItem('fh-theme', 'light');
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('fh-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('fh-theme', 'dark');
    }
  });

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    hamburger?.setAttribute('aria-label', 'Open menu');
  }
  function openMobileMenu() {
    mobileMenu?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    hamburger?.setAttribute('aria-label', 'Close menu');
  }
  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

  /* ---------- Smooth-scroll for in-page anchors (with header offset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ---------- Animated stat counters ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && statNumbers.length) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statIO.observe(el));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all others
      document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.closest('.faq-item').querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
    });
  });

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (track && dotsWrap) {
    const cards = Array.from(track.children);
    let perView = window.innerWidth >= 760 ? 2 : 1;
    let index = 0;

    function pagesCount() {
      perView = window.innerWidth >= 760 ? 2 : 1;
      return Math.max(1, Math.ceil(cards.length / perView));
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const pages = pagesCount();
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Go to testimonial set ' + (i + 1));
        if (i === index) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(i) {
      const pages = pagesCount();
      index = (i + pages) % pages;
      const cardWidth = cards[0].getBoundingClientRect().width + 24; // gap
      track.style.transform = `translateX(-${index * perView * cardWidth}px)`;
      dotsWrap.querySelectorAll('button').forEach((d, di) => d.classList.toggle('active', di === index));
    }

    buildDots();

    let autoplay = setInterval(() => goTo(index + 1), 6000);
    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(index + 1), 6000); });

    window.addEventListener('resize', () => {
      buildDots();
      goTo(0);
    });

    // Basic swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------- Gallery lightbox ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentGalleryIndex = 0;

  function openLightbox(i) {
    currentGalleryIndex = i;
    const item = galleryItems[i];
    lightboxImg.src = item.getAttribute('data-full');
    lightboxImg.alt = item.querySelector('img')?.alt || '';
    lightboxCaption.textContent = item.getAttribute('data-caption') || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showRelative(delta) {
    currentGalleryIndex = (currentGalleryIndex + delta + galleryItems.length) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => showRelative(-1));
  lightboxNext?.addEventListener('click', () => showRelative(1));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });

  /* ---------- Consultation form validation ---------- */
  const form = document.getElementById('consultationForm');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(field) {
    const wrap = field.closest('.form-field');
    let valid = field.checkValidity();
    if (field.type === 'tel' && field.value.trim()) {
      valid = /^[0-9+\-\s]{6,15}$/.test(field.value.trim());
    }
    wrap.classList.toggle('invalid', !valid);
    return valid;
  }

  form?.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = Array.from(form.querySelectorAll('input, select, textarea'));
    const allValid = fields.map(validateField).every(Boolean);

    if (allValid) {
      formSuccess.classList.add('show');
      form.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    } else {
      const firstInvalid = form.querySelector('.form-field.invalid input, .form-field.invalid select, .form-field.invalid textarea');
      firstInvalid?.focus();
    }
  });

});
