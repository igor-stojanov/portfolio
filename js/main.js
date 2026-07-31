document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNavHighlight();
  initContactForm();
});

/* -------------------------------------------------------------
   Mobile hamburger nav
   ------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('is-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!links.classList.contains('is-open')) return;
    if (links.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

/* -------------------------------------------------------------
   Sticky-nav active-section highlighting
   ------------------------------------------------------------- */
function initActiveNavHighlight() {
  const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  sections.forEach((section) => observer.observe(section));
}

/* -------------------------------------------------------------
   Contact form: client-side validation + Formspree submit
   ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('formStatus');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  const toastClose = document.getElementById('toastClose');
  let toastTimer = null;

  const fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    message: { input: document.getElementById('message'), error: document.getElementById('messageError') },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(field, message) {
    field.input.closest('.form-row').classList.toggle('has-error', Boolean(message));
    field.error.textContent = message || '';
  }

  function validate() {
    let isValid = true;

    if (!fields.name.input.value.trim()) {
      setFieldError(fields.name, 'Please enter your name.');
      isValid = false;
    } else {
      setFieldError(fields.name, '');
    }

    const emailValue = fields.email.input.value.trim();
    if (!emailValue) {
      setFieldError(fields.email, 'Please enter your email.');
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      setFieldError(fields.email, 'Please enter a valid email address.');
      isValid = false;
    } else {
      setFieldError(fields.email, '');
    }

    if (!fields.message.input.value.trim()) {
      setFieldError(fields.message, 'Please enter a message.');
      isValid = false;
    } else {
      setFieldError(fields.message, '');
    }

    return isValid;
  }

  function hideToast() {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    toast.classList.remove('is-visible');
    setTimeout(() => { toast.hidden = true; }, 200);
  }

  function showToast(title, message, state) {
    if (toastTimer) clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.setAttribute('data-state', state);
    toast.setAttribute('role', state === 'success' ? 'status' : 'alert');

    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    toastTimer = setTimeout(hideToast, 5000);
  }

  toastClose.addEventListener('click', hideToast);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validate()) {
      showToast('Check the form', 'Please fix the highlighted fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        showToast('Message sent', "Thanks - I'll get back to you soon.", 'success');
        form.reset();
      } else {
        showToast('Something went wrong', 'Please email me directly instead.', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'Please email me directly instead.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}
