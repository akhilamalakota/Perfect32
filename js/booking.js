/* ===================================
   PERFECT 32 DENTAL CARE — Booking JS
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ── Modal Controls ──
    const modalOverlay = document.getElementById('bookingModal');
    const openModalBtns = document.querySelectorAll('[data-open-modal="booking"]');
    const closeModalBtns = document.querySelectorAll('[data-close-modal]');

    function openModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalOverlay.querySelector('input, select, textarea')?.focus();
        // Trap focus
        modalOverlay.addEventListener('keydown', trapFocus);
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        modalOverlay.removeEventListener('keydown', trapFocus);
    }

    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        const focusable = modalOverlay.querySelectorAll('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }

    openModalBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal(); });
    }

    // ── Form Validation ──
    const forms = document.querySelectorAll('.booking-form');
    forms.forEach(form => setupFormValidation(form));

    function setupFormValidation(form) {
        const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
        const fields = {
            name: { el: form.querySelector('[name="fullName"]'), validate: v => v.trim().length >= 2, msg: 'Please enter your full name (min 2 characters)' },
            phone: { el: form.querySelector('[name="phone"]'), validate: v => phoneRegex.test(v.replace(/\s|-/g, '')), msg: 'Please enter a valid Indian phone number' },
            date: { el: form.querySelector('[name="preferredDate"]'), validate: v => { if (!v) return false; const d = new Date(v); const today = new Date(); today.setHours(0, 0, 0, 0); return d >= today; }, msg: 'Please select a future date' },
            consent: { el: form.querySelector('[name="consent"]'), validate: () => form.querySelector('[name="consent"]')?.checked, msg: 'Please agree to receive confirmations' }
        };

        // Set min date for date inputs
        const dateInput = form.querySelector('[name="preferredDate"]');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        // Instant inline validation
        Object.values(fields).forEach(field => {
            if (!field.el) return;
            const event = field.el.type === 'checkbox' ? 'change' : 'blur';
            field.el.addEventListener(event, () => validateField(field));
            if (field.el.type !== 'checkbox') {
                field.el.addEventListener('input', () => {
                    if (field.el.classList.contains('error')) validateField(field);
                });
            }
        });

        // Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            Object.values(fields).forEach(field => {
                if (!validateField(field)) valid = false;
            });

            if (!valid) return;

            // Check honeypot
            const honeypot = form.querySelector('[name="website"]');
            if (honeypot && honeypot.value) return;

            // Show loading
            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span> Booking...';
            submitBtn.disabled = true;

            // Simulate booking (replace with actual API call)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Show success
                const formContainer = form.closest('.modal__body') || form.closest('.booking-form-wrap');
                if (formContainer) {
                    const confirmNum = 'P32-' + Date.now().toString(36).toUpperCase();
                    formContainer.innerHTML = `
            <div class="booking-success">
              <div class="booking-success__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3>Appointment Requested!</h3>
              <p>Your booking request <strong>${confirmNum}</strong> has been received. We'll confirm your appointment via SMS/call shortly.</p>
              <p style="margin-top: 16px; font-size: 13px; color: #718096;">If you need immediate assistance, call us at <a href="tel:+919966396497" style="color:#0E8B8B; font-weight:600;">+91 99663 96497</a></p>
            </div>`;
                }
            }, 1500);
        });
    }

    function validateField(field) {
        if (!field.el) return true;
        const value = field.el.type === 'checkbox' ? '' : field.el.value;
        const isValid = field.validate(value);

        if (field.el.type === 'checkbox') {
            const group = field.el.closest('.form-check');
            if (group) {
                const err = group.querySelector('.form-error') || createError(group, field.msg);
                err.style.display = isValid ? 'none' : 'block';
            }
        } else {
            field.el.classList.toggle('error', !isValid);
            field.el.setAttribute('aria-invalid', !isValid);
            const err = field.el.parentElement.querySelector('.form-error');
            if (err) err.style.display = isValid ? 'none' : 'block';
        }
        return isValid;
    }

    function createError(parent, msg) {
        const err = document.createElement('span');
        err.className = 'form-error';
        err.textContent = msg;
        err.style.display = 'none';
        parent.appendChild(err);
        return err;
    }
});
