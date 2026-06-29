// =====================================================
// FORHAD HOSSAIN — PREMIUM ANIMATIONS
// Scroll Reveal · Stagger · Parallax · Ripple · Nav
// =====================================================

(function () {
  'use strict';

  /* -------------------------------------------------------
     Utility: clamp a value between min and max
  ------------------------------------------------------- */
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /* -------------------------------------------------------
     Utility: detect reduced-motion preference
  ------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------
     1. SCROLL REVEAL — direction-aware
        Reads  data-reveal="left|right|fade-up|fade|scale"
        Falls back to "fade-up" (translateY) when no value.
  ------------------------------------------------------- */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
      return;
    }

    const revealEls = document.querySelectorAll('[data-reveal]');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.10, rootMargin: '0px 0px -50px 0px' }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  /* -------------------------------------------------------
     2. STAGGER REVEAL — for parent containers
        Add  data-stagger  to a grid/flex parent.
        Each direct child gets staggered entrance.
  ------------------------------------------------------- */
  function initStaggerReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-stagger]').forEach(el => el.classList.add('stagger-revealed'));
      return;
    }

    const staggerEls = document.querySelectorAll('[data-stagger]');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('stagger-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    staggerEls.forEach((el) => io.observe(el));
  }

  /* -------------------------------------------------------
     3. SECTION TRANSITION SEPARATOR LINES
        Triggers a subtle gold line sweep at section tops
  ------------------------------------------------------- */
  function initSectionTransitions() {
    if (!('IntersectionObserver' in window)) return;

    const sections = document.querySelectorAll('.section');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-entered');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* -------------------------------------------------------
     4. PARALLAX — hero background image
        Gentle depth shift on scroll; disabled on mobile
  ------------------------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion) return;

    const heroImg = document.getElementById('heroImg');
    const lawBannerImgs = document.querySelectorAll('.law-banner-item img');
    const lawStripImgs  = document.querySelectorAll('.law-strip-item img');

    function onScroll() {
      const scrollY = window.scrollY;

      // Hero image: moves 25% of scroll speed
      if (heroImg) {
        const speed = 0.22;
        const offset = scrollY * speed;
        heroImg.style.transform = `scale(1.06) translateY(${offset}px)`;
      }

      // Law banner items: subtle parallax
      lawBannerImgs.forEach((img, i) => {
        const rect = img.closest('.law-banner-item').getBoundingClientRect();
        const viewMid = window.innerHeight / 2;
        const elemMid = rect.top + rect.height / 2;
        const delta   = (viewMid - elemMid) * 0.08;
        img.style.transform = `scale(1.08) translateY(${delta}px)`;
      });

      // Law strip items
      lawStripImgs.forEach((img) => {
        const rect = img.closest('.law-strip-item').getBoundingClientRect();
        const viewMid = window.innerHeight / 2;
        const elemMid = rect.top + rect.height / 2;
        const delta   = (viewMid - elemMid) * 0.06;
        img.style.transform = `scale(1.1) translateY(${delta}px)`;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* -------------------------------------------------------
     5. BUTTON RIPPLE EFFECT
        Creates a ripple from the click origin
  ------------------------------------------------------- */
  function initButtonRipple() {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect   = btn.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const size   = Math.max(rect.width, rect.height) * 1.5;

        const ripple = document.createElement('span');
        ripple.classList.add('btn-ripple');
        ripple.style.cssText = `
          width:${size}px; height:${size}px;
          top:${y - size / 2}px; left:${x - size / 2}px;
        `;
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

  /* -------------------------------------------------------
     6. ACTIVE NAV LINK HIGHLIGHT
        Highlights the nav link whose section is in view
  ------------------------------------------------------- */
  function initActiveNav() {
    if (!('IntersectionObserver' in window)) return;

    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              const match = link.getAttribute('href') === '#' + id;
              link.style.opacity = match ? '1' : '';
              if (match) link.style.setProperty('--underline', '100%');
              // Use a CSS class instead
              link.classList.toggle('nav-active', match);
            });
          }
        });
      },
      { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach((s) => io.observe(s));
  }

  /* -------------------------------------------------------
     7. GALLERY ITEM STAGGER
        Override the grid's data-stagger to handle
        the masonry-like layout individually
  ------------------------------------------------------- */
  function initGalleryReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.gallery-item').forEach(el => el.classList.add('revealed'));
      return;
    }

    const items = document.querySelectorAll('.gallery-item');

    // We rely on data-stagger on .gallery-grid (set in HTML below via JS)
    // Add individual delays based on DOM order
    items.forEach((item, i) => {
      item.style.transitionDelay = (i * 90) + 'ms';
    });
  }

  /* -------------------------------------------------------
     8. TESTIMONIAL STAGGER
        Cards slide up in sequence when section enters
  ------------------------------------------------------- */
  function initTestimonialReveal() {
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach((card, i) => {
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(32px)';
      card.style.transition = `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`;
    });

    if (!('IntersectionObserver' in window)) {
      cards.forEach(card => {
        card.style.opacity   = '1';
        card.style.transform = 'none';
      });
      return;
    }

    const wrap = document.querySelector('.testimonial-track-wrap');
    if (!wrap) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          cards.forEach((card) => {
            card.style.opacity   = '1';
            card.style.transform = 'none';
          });
          io.unobserve(wrap);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(wrap);
  }

  /* -------------------------------------------------------
     9. SMOOTH SCROLL UPGRADE
        Already handled by existing script.js.
        We extend to add a smooth fade on in-page navigation.
  ------------------------------------------------------- */
  // (No duplication — existing script.js handles smooth scroll)

  /* -------------------------------------------------------
     10. HEADER LOGO SUBTLE ENTRANCE
  ------------------------------------------------------- */
  function initHeaderEntrance() {
    const brand = document.querySelector('.brand');
    const navLinks = document.querySelectorAll('.main-nav a, .nav-actions > *');

    if (brand) {
      brand.style.opacity   = '0';
      brand.style.transform = 'translateX(-16px)';
      brand.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          brand.style.opacity   = '1';
          brand.style.transform = 'none';
        });
      });
    }

    navLinks.forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(-10px)';
      el.style.transition = `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.07}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.07}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity   = '1';
          el.style.transform = 'none';
        });
      });
    });
  }

  /* -------------------------------------------------------
     11. IMAGE SCALING ON HOVER — portrait
         Already handled by CSS; enhance with JS-driven
         smooth scale for about portrait image only.
  ------------------------------------------------------- */

  /* -------------------------------------------------------
     12. CONSULTATION FORM — field focus ripple border
  ------------------------------------------------------- */
  function initFormAnimations() {
    const fields = document.querySelectorAll('.form-field input, .form-field select, .form-field textarea');
    fields.forEach((field) => {
      field.addEventListener('focus', () => {
        const label = field.closest('.form-field')?.querySelector('label');
        if (label) {
          label.style.transition = 'color 0.3s ease, transform 0.3s ease';
          label.style.color      = 'var(--gold-600)';
          label.style.transform  = 'translateY(-1px)';
        }
      });
      field.addEventListener('blur', () => {
        const label = field.closest('.form-field')?.querySelector('label');
        if (label) {
          label.style.color     = '';
          label.style.transform = '';
        }
      });
    });
  }

  /* -------------------------------------------------------
     INIT — run all on DOMContentLoaded
  ------------------------------------------------------- */
  function init() {
    initScrollReveal();
    initStaggerReveal();
    initSectionTransitions();
    initGalleryReveal();
    initTestimonialReveal();
    initButtonRipple();
    initActiveNav();
    initHeaderEntrance();
    initFormAnimations();

    // Parallax only on desktop (not on low-power mobile)
    if (window.innerWidth >= 768 && !prefersReducedMotion) {
      initParallax();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
