/* ═══════════════════════════════════════════════════════════
   EDDIE'S BARBER SHOP — script.js
   Features:
   - Fixed navbar with scroll effect + active link highlighting
   - Mobile hamburger menu with overlay
   - Intersection Observer scroll animations
   - Gallery lightbox
   - Back-to-top button
   - Smooth scroll for anchor links
   - Hero parallax (subtle)
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── UTILITY: DOM selector helpers ─── */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ─── WAIT FOR DOM ─── */
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initGalleryLightbox();
    initBackToTop();
    initSmoothScroll();
    initActiveNavLinks();
    initHeroParallax();
  });

  /* ═══════════════════════════════════════════════════════
     1. NAVBAR — Scroll effect
     ═══════════════════════════════════════════════════════ */
  function initNavbar() {
    const navbar = qs('#navbar');
    if (!navbar) return;

    const SCROLL_THRESHOLD = 60;

    function onScroll() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ═══════════════════════════════════════════════════════
     2. MOBILE MENU
     ═══════════════════════════════════════════════════════ */
  function initMobileMenu() {
    const hamburger = qs('#hamburger');
    const navLinks  = qs('#navLinks');
    const overlay   = qs('#navOverlay');

    if (!hamburger || !navLinks || !overlay) return;

    function openMenu() {
      hamburger.classList.add('open');
      navLinks.classList.add('open');
      overlay.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      overlay.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    // Close on nav link click
    qsa('.nav-link, .nav-cta', navLinks).forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ═══════════════════════════════════════════════════════
     3. INTERSECTION OBSERVER — Scroll Reveal
     ═══════════════════════════════════════════════════════ */
  function initScrollReveal() {
    const elements = qsa('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger sibling cards
            const siblings = qsa('.reveal', entry.target.parentElement);
            const idx = siblings.indexOf(entry.target);
            const delay = Math.min(idx * 80, 400);

            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(el => observer.observe(el));
  }

  /* ═══════════════════════════════════════════════════════
     4. GALLERY LIGHTBOX
     ═══════════════════════════════════════════════════════ */
  function initGalleryLightbox() {
    const lightbox     = qs('#lightbox');
    const lightboxImg  = qs('#lightboxImg');
    const lightboxClose = qs('#lightboxClose');
    const galleryItems = qsa('.gallery-item');

    if (!lightbox || !lightboxImg) return;

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
      }, 300);
    }

    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      if (!img) return;

      item.addEventListener('click', () => {
        openLightbox(img.src, img.alt);
      });

      // Keyboard support
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View full image: ${img.alt}`);

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img.src, img.alt);
        }
      });
    });

    // Close handlers
    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     5. BACK TO TOP BUTTON
     ═══════════════════════════════════════════════════════ */
  function initBackToTop() {
    const btn = qs('#backToTop');
    if (!btn) return;

    const SHOW_THRESHOLD = 400;

    function onScroll() {
      if (window.scrollY > SHOW_THRESHOLD) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════════════
     6. SMOOTH SCROLL — anchor links
     ═══════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    const NAVBAR_HEIGHT = 72;

    qsa('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = qs(targetId);
        if (!target) return;

        e.preventDefault();

        const targetTop = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     7. ACTIVE NAV LINKS — highlight on scroll
     ═══════════════════════════════════════════════════════ */
  function initActiveNavLinks() {
    const sections  = qsa('section[id]');
    const navLinks  = qsa('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const OFFSET = 120;

    function setActive() {
      const scrollPos = window.scrollY + OFFSET;
      let current = '';

      sections.forEach(section => {
        if (section.offsetTop <= scrollPos) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', setActive, { passive: true });
    setActive(); // run once
  }

  /* ═══════════════════════════════════════════════════════
     8. HERO PARALLAX — subtle background shift
     ═══════════════════════════════════════════════════════ */
  function initHeroParallax() {
    const heroImg = qs('.hero-img');
    if (!heroImg) return;

    // Only run on non-mobile and if reduced motion is not requested
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const isMobile = window.matchMedia('(max-width: 768px)');

    function onScroll() {
      if (isMobile.matches) return;
      const scrollY = window.scrollY;
      const shift = scrollY * 0.25;
      heroImg.style.transform = `scale(1.05) translateY(${shift}px)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════
     9. SERVICE CARD ENTRANCE STAGGER
     ═══════════════════════════════════════════════════════ */
  // Handled via CSS + Intersection Observer above.
  // Additional: add a hover "wiggle" to service icons
  document.addEventListener('DOMContentLoaded', () => {
    qsa('.service-icon-wrap').forEach(icon => {
      icon.parentElement.addEventListener('mouseenter', () => {
        icon.style.transition = 'transform 0.2s ease, background 0.3s ease';
      });
    });
  });

  /* ═══════════════════════════════════════════════════════
     10. STATS COUNTER ANIMATION — hero stats
     ═══════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    const statNums = qsa('.stat strong');

    function animateNumber(el) {
      const rawText = el.textContent.trim();
      const isNumber = /^\d+/.test(rawText);
      if (!isNumber) return;

      const target = parseInt(rawText.replace(/\D/g, ''), 10);
      const suffix = rawText.replace(/[\d,]/g, '').trim();
      const duration = 1200;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(ease * target);
        el.textContent = current + (suffix || (rawText.endsWith('+') ? '+' : ''));
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    }

    // Trigger when hero stats become visible
    const heroStats = qs('.hero-stats');
    if (!heroStats) return;

    let animated = false;
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        statNums.forEach(num => animateNumber(num));
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });

    statsObserver.observe(heroStats);
  });

  /* ═══════════════════════════════════════════════════════
     11. TRUST BAR — lazy reveal on scroll
     ═══════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    const trustItems = qsa('.trust-item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    trustItems.forEach(item => observer.observe(item));
  });

  /* ═══════════════════════════════════════════════════════
     12. NAV LINK UNDERLINE INDICATOR
         Dynamically track which section is in view
         (supplements CSS :hover with scroll-driven state)
     ═══════════════════════════════════════════════════════ */
  // Already handled in initActiveNavLinks above.

})();
