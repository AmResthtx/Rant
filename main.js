/* Texas Rigs & Roots — Main JS */

// Nav scroll effect
const header = document.querySelector('.site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  navLinks.classList.toggle('open', open);
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    navLinks.classList.remove('open');
  });
});

// Smooth active section highlight (optional UX)
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--rust-light)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// Contact form — basic client-side validation + UX
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const phone   = form.querySelector('#phone').value.trim();
    const service = form.querySelector('#service').value;

    if (!name || !phone || !service) {
      showMessage(form, 'Please fill in all required fields.', 'error');
      return;
    }

    // Replace this block with your actual form submission (Formspree, EmailJS, etc.)
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      showMessage(form, "Thank you! We'll be in touch shortly.", 'success');
      form.reset();
      btn.textContent = 'Send My Request';
      btn.disabled = false;
    }, 1000);
  });
}

function showMessage(form, text, type) {
  const existing = form.querySelector('.form-message');
  if (existing) existing.remove();

  const msg = document.createElement('p');
  msg.className = 'form-message';
  msg.textContent = text;
  msg.style.cssText = `
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    text-align: center;
    background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
    color: ${type === 'success' ? '#155724' : '#721c24'};
    border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
  `;
  form.appendChild(msg);
  setTimeout(() => msg.remove(), 6000);
}

// Animate elements on scroll (fade-in-up)
const fadeEls = document.querySelectorAll('.service-card, .feature, .step, .contact-item');
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.5s ease forwards';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.animationDelay = `${i * 0.07}s`;
  fadeObserver.observe(el);
});

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);
