// ─── Sticky Header ───────────────────────────────
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ─── Mobile Nav ──────────────────────────────────
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileClose = document.getElementById('mobile-nav-close');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// ─── FAQ Accordion ───────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ─── Contact Form ────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    // Required by Netlify for AJAX submissions
    formData.append("form-name", contactForm.getAttribute("name"));

    fetch('/', {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    })
    .then(() => {
      contactForm.style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    })
    .catch(error => {
      console.error('Form submission error:', error);
      alert('There was a problem submitting your form. Please try calling us instead.');
    });
  });
}

// ─── Lightbox ────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

// Use event delegation for dynamically loaded gallery items
document.body.addEventListener('click', e => {
  const el = e.target.closest('[data-lightbox]');
  if (el) {
    const src = el.dataset.lightbox;
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── Scroll animations ────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .why-card, .review-card, .county-block').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ─── Dynamic Gallery (Lazy Loading) ────────────────────────────
const galleryContainer = document.querySelector('.gallery-page-grid');
const loadMoreBtn = document.getElementById('load-more-btn');

if (galleryContainer && loadMoreBtn && typeof portfolioImages !== 'undefined') {
  let currentBatch = 0;
  const batchSize = 12;

  function loadNextBatch() {
    const start = currentBatch * batchSize;
    const end = start + batchSize;
    const imagesToLoad = portfolioImages.slice(start, end);

    if (imagesToLoad.length === 0) return;

    imagesToLoad.forEach(imgName => {
      const item = document.createElement('div');
      item.className = 'gallery-page-item';
      item.dataset.lightbox = `images/portfolio/${imgName}`;
      
      const img = document.createElement('img');
      img.src = `images/portfolio/${imgName}`;
      img.loading = 'lazy';
      img.alt = 'Granite countertop installation Utah';

      item.appendChild(img);
      galleryContainer.appendChild(item);
      
      // Also apply scroll animation to newly added item
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(item);
    });

    currentBatch++;

    if (currentBatch * batchSize >= portfolioImages.length) {
      loadMoreBtn.style.display = 'none';
      const container = document.getElementById('load-more-container');
      if (container) {
          container.innerHTML = '<p style="color:var(--text-light); margin-top:2rem;">Browse complete! Contact us for a custom quote.</p>';
      }
    }
  }

  // Load first batch on page render
  loadNextBatch();
  loadMoreBtn.addEventListener('click', loadNextBatch);
}
