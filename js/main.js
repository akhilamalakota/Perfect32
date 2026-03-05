/* ===================================
   PERFECT 32 DENTAL CARE — Main JS
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ── Mobile Navigation ──
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav__list');
  
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navList.classList.toggle('open');
      document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navList.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navList.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Sticky Header Shadow ──
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      
      // Close all first
      document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
      
      // Toggle current
      if (!wasActive) item.classList.add('active');
    });
  });

  // ── Scroll Animations ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ── Testimonials Carousel ──
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel__track');
    const slides = carousel.querySelectorAll('.carousel__slide');
    const dots = carousel.querySelectorAll('.carousel__dot');
    let currentSlide = 0;
    let slidesPerView = 3;

    function getSlidesPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function updateCarousel() {
      slidesPerView = getSlidesPerView();
      const maxSlide = Math.max(0, slides.length - slidesPerView);
      if (currentSlide > maxSlide) currentSlide = maxSlide;
      const offset = currentSlide * (100 / slidesPerView);
      track.style.transform = `translateX(-${offset}%)`;
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        currentSlide = i;
        updateCarousel();
      });
    });

    // Auto-rotate
    let autoPlay = setInterval(() => {
      const maxSlide = Math.max(0, slides.length - getSlidesPerView());
      currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
      updateCarousel();
    }, 5000);

    carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carousel.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        const maxSlide = Math.max(0, slides.length - getSlidesPerView());
        currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
        updateCarousel();
      }, 5000);
    });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }

  // ── Smooth Scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Active nav link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

  console.log('Perfect 32 Dental Care — Site loaded');
});
