/* ===================================
   PERFECT 32 DENTAL CARE — Gallery JS
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const img = lightbox.querySelector('.lightbox__img');
    const caption = lightbox.querySelector('.lightbox__caption');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');

    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        galleryItems[currentIndex]?.focus();
    }

    function updateLightbox() {
        const item = galleryItems[currentIndex];
        const image = item.querySelector('img');
        if (image) {
            img.src = image.src;
            img.alt = image.alt;
            caption.textContent = image.alt;
        }
        // Preload adjacent
        [-1, 1].forEach(offset => {
            const adj = galleryItems[currentIndex + offset];
            if (adj) {
                const adjImg = adj.querySelector('img');
                if (adjImg) new Image().src = adjImg.src;
            }
        });
    }

    function navigate(dir) {
        currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
        updateLightbox();
    }

    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
        item.addEventListener('keydown', (e) => { if (e.key === 'Enter') openLightbox(i); });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
    });

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', () => navigate(-1));
    nextBtn?.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });
});
