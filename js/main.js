/**
 * Lain Dain - Interactive Landing Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initAutoMockupCarousel();
  initParallaxTilt();
  initStoreModal();
  initLegalToc();
});

/**
 * 1. Navbar elevation on scroll
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.background = 'rgba(254, 250, 241, 0.92)';
      navbar.style.boxShadow = '0 4px 20px rgba(18, 24, 20, 0.06)';
      navbar.style.padding = '0.9rem 0';
    } else {
      navbar.style.background = 'rgba(254, 250, 241, 0.75)';
      navbar.style.boxShadow = 'none';
      navbar.style.padding = '1.25rem 0';
    }
  }, { passive: true });
}

/**
 * 2. Automated Mockup Screen Carousel (Auto-rotates every 3.2s)
 */
function initAutoMockupCarousel() {
  const screenshotImg = document.getElementById('deviceScreenshot');
  const phoneFrame = document.querySelector('.smartphone-frame');
  if (!screenshotImg) return;

  const screens = [
    'assets/screenshots/screen-dashboard.png',
    'assets/screenshots/screen-smart-settle.png',
    'assets/screenshots/screen-group.png',
    'assets/screenshots/screen-expenses.png',
    'assets/screenshots/screen-payables.png'
  ];

  // Preload images into memory for instant seamless crossfades
  screens.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let currentIndex = 0;
  let intervalId = null;

  function nextScreen() {
    currentIndex = (currentIndex + 1) % screens.length;

    // Smooth crossfade transition
    screenshotImg.style.opacity = '0';
    screenshotImg.style.transform = 'scale(0.97)';

    setTimeout(() => {
      screenshotImg.src = screens[currentIndex];
      screenshotImg.style.opacity = '1';
      screenshotImg.style.transform = 'scale(1)';
    }, 180);
  }

  function startCarousel() {
    if (!intervalId) {
      intervalId = setInterval(nextScreen, 4000);
    }
  }

  function stopCarousel() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Start rotation
  startCarousel();

  // Pause on hover over phone mockup for great usability
  if (phoneFrame) {
    phoneFrame.addEventListener('mouseenter', stopCarousel);
    phoneFrame.addEventListener('mouseleave', startCarousel);
  }
}

/**
 * 3. 3D Mouse Parallax Tilt for Smartphone Mockup
 */
function initParallaxTilt() {
  const showcase = document.querySelector('.hero-showcase-column');
  const frame = document.querySelector('.smartphone-frame');
  if (!showcase || !frame) return;

  // Only apply tilt on desktop devices with hover support
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    showcase.addEventListener('mousemove', (e) => {
      const rect = showcase.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      frame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    showcase.addEventListener('mouseleave', () => {
      frame.style.transform = 'rotate(-1.5deg) rotateY(-4deg) translateY(0px)';
    });
  }
}

/**
 * 4. Store Button & Coming Soon Modal Handler
 */
function initStoreModal() {
  const storeBtns = document.querySelectorAll('.btn-store, .js-store-btn');
  const modalOverlay = document.getElementById('storeModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (!modalOverlay) return;

  storeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#')) {
        e.preventDefault();
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 5. Table of Contents Scrollspy for Legal Pages
 */
function initLegalToc() {
  const tocLinks = document.querySelectorAll('.toc-list a');
  const sections = document.querySelectorAll('.legal-content section');

  if (tocLinks.length === 0 || sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}
