/* ============================================================
   PORTFOLIO SCRIPT — John Earl Conde
   All features functional
============================================================ */
'use strict';

/* ============================================================
   1. PAGE LOAD FADE
============================================================ */
document.documentElement.style.visibility = 'hidden';
window.addEventListener('load', () => {
  document.documentElement.style.visibility = '';
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.55s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  }));
});

/* ============================================================
   2. THEME — dark / light + localStorage
============================================================ */
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const THEME_KEY   = 'jec-theme';

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem(THEME_KEY, theme);
}

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) {
  applyTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  applyTheme('light');
} else {
  applyTheme('dark');
}

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   3. NAVBAR SCROLL EFFECT
============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ============================================================
   4. HAMBURGER MENU
============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') && !navbar.contains(e.target)) closeMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ============================================================
   5. SMOOTH SCROLL (offset for fixed navbar)
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return; // skip pure # links
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 20;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   6. ACTIVE NAV LINK ON SCROLL
============================================================ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { threshold: 0.35, rootMargin: `-${navbar.offsetHeight}px 0px 0px 0px` });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   7. SCROLL REVEAL with stagger
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement.querySelectorAll(':scope > .reveal:not(.visible)'));
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), Math.max(0, idx) * 90);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   8. SKILL BAR ANIMATION
============================================================ */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
      setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, i * 140);
    });
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.35 });

document.querySelectorAll('.skill-bars').forEach(el => skillObserver.observe(el));

/* ============================================================
   9. TYPING ANIMATION (hero role)
============================================================ */
const typedEl = document.querySelector('.typed-text');
if (typedEl) {
  const phrases = [
    'BSCS Student',
    'Web Developer',
    'Problem Solver',
    'AI Explorer',
    'Full-Stack Developer',
    'Software Engineer'
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    typedEl.textContent = deleting
      ? phrase.substring(0, ci - 1)
      : phrase.substring(0, ci + 1);

    deleting ? ci-- : ci++;

    let speed = deleting ? 48 : 88;
    if (!deleting && ci === phrase.length) { speed = 2200; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; speed = 380; }

    setTimeout(type, speed);
  }
  type();
}

/* ============================================================
   10. COUNTER ANIMATION (hero stats)
============================================================ */
function animateCounter(el, target, suffix = '', duration = 1600) {
  const isInfinity = target === '∞';
  if (isInfinity) return; // keep as-is
  const isText = isNaN(parseInt(target));
  if (isText) return;

  const num = parseInt(target);
  const start = performance.now();
  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * num) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(frame);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-value').forEach(el => {
      const raw = el.textContent.trim();
      const num = raw.replace(/[^0-9]/g, '');
      const suffix = raw.replace(/[0-9]/g, '');
      if (num) animateCounter(el, raw.includes('+') ? num : num, suffix);
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ============================================================
   11. CONTACT FORM — validation + EmailJS / mailto fallback
   Uses mailto: as a real fallback so it always works
============================================================ */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const fields = {
    name:    contactForm.querySelector('#c-name'),
    email:   contactForm.querySelector('#c-email'),
    subject: contactForm.querySelector('#c-subject'),
    message: contactForm.querySelector('#c-message'),
  };
  const submitBtn = contactForm.querySelector('#c-submit');

  function showFieldError(el, msg) {
    el.classList.add('field-error');
    let err = el.parentElement.querySelector('.err-msg');
    if (!err) {
      err = document.createElement('span');
      err.className = 'err-msg';
      el.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearFieldError(el) {
    el.classList.remove('field-error');
    const err = el.parentElement.querySelector('.err-msg');
    if (err) err.remove();
  }

  // Real-time validation on blur
  Object.values(fields).forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => clearFieldError(el));
    el.addEventListener('blur', () => validateField(el));
  });

  function validateField(el) {
    if (!el) return true;
    const val = el.value.trim();
    if (!val) { showFieldError(el, 'This field is required.'); return false; }
    if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showFieldError(el, 'Please enter a valid email address.');
      return false;
    }
    clearFieldError(el);
    return true;
  }

  function validateAll() {
    return Object.values(fields).filter(Boolean).map(validateField).every(Boolean);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateAll()) {
      showToast('Please fix the errors above.', 'error');
      return;
    }

    const name    = fields.name.value.trim();
    const email   = fields.email.value.trim();
    const subject = fields.subject.value.trim() || 'Portfolio Inquiry';
    const message = fields.message.value.trim();

    // Build mailto link as functional fallback
    const body = encodeURIComponent(
      `Hi John Earl,\n\nMy name is ${name} (${email}).\n\n${message}\n\nBest regards,\n${name}`
    );
    const mailtoLink = `mailto:johnearlconde20@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    // Animate button
    const orig = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate brief send delay then open mailto
    setTimeout(() => {
      window.location.href = mailtoLink;
      submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
      submitBtn.style.background = '#22c55e';
      submitBtn.style.color = '#fff';
      showToast('Opening your email client...', 'success');
      contactForm.reset();
      Object.values(fields).filter(Boolean).forEach(el => clearFieldError(el));
      setTimeout(() => {
        submitBtn.innerHTML = orig;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
      }, 3500);
    }, 900);
  });
}

/* ============================================================
   12. TOAST NOTIFICATION
============================================================ */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    Object.assign(container.style, {
      position: 'fixed', bottom: '28px', right: '28px',
      zIndex: '10000', display: 'flex', flexDirection: 'column', gap: '10px',
    });
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const icon  = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-circle-xmark' : 'fa-info-circle';
  const color = type === 'success' ? '#72F6C4' : type === 'error' ? '#f87171' : '#7B8CFF';

  toast.innerHTML = `<i class="fas ${icon}" style="color:${color}"></i> ${message}`;
  Object.assign(toast.style, {
    background: 'var(--surface, #0D111A)',
    border: `1px solid ${color}33`,
    borderLeft: `3px solid ${color}`,
    color: 'var(--text, #F4F7FB)',
    padding: '13px 18px',
    borderRadius: '10px',
    fontSize: '.87rem',
    fontWeight: '600',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 8px 32px rgba(0,0,0,.45)',
    display: 'flex', alignItems: 'center', gap: '10px',
    opacity: '0', transform: 'translateX(30px)',
    transition: 'opacity .3s ease, transform .3s ease',
    maxWidth: '320px',
    cursor: 'pointer',
  });

  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }));

  const dismiss = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 350);
  };

  toast.addEventListener('click', dismiss);
  setTimeout(dismiss, 4500);
}

/* ============================================================
   13. COPY EMAIL TO CLIPBOARD (click on email contact card)
============================================================ */
document.querySelectorAll('.contact-card').forEach(card => {
  const val = card.querySelector('.cc-value');
  const label = card.querySelector('.cc-label');
  if (!val || !label) return;
  if (label.textContent.toLowerCase() !== 'email') return;

  card.addEventListener('click', (e) => {
    // Let mailto still work via href — but also copy
    const email = val.textContent.trim();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied: ${email}`, 'success');
      }).catch(() => {});
    }
  });
});

/* ============================================================
   14. PROJECT MODALS
============================================================ */
const projects = [
  {
    num: '01', title: 'DivineMind',
    desc: 'AI-powered academic analytics and decision support system designed to analyze student performance and provide intelligent recommendations. Built with machine learning models that evaluate grades, attendance, and behavioral patterns.',
    tags: ['AI', 'Machine Learning', 'Analytics', 'Web App'],
    tech: 'Python · Flask · Scikit-learn · React · MySQL',
    status: 'In Development',
    github: '#',
    demo: '#',
  },
  {
    num: '02', title: 'Smart Laptop Recommendation System',
    desc: 'A Genetic Algorithm-based recommendation system that ranks laptops according to a user\'s profile, budget, and computing needs. Uses fitness functions and crossover operations to optimize multi-criteria ranking.',
    tags: ['Python', 'Genetic Algorithm', 'CSV', 'Recommendation'],
    tech: 'Python · NumPy · Pandas · CSV · CLI',
    status: 'Completed',
    github: '#',
    demo: '#',
  },
  {
    num: '03', title: 'Transportation Optimization',
    desc: 'Research project exploring Ant Colony Optimization (ACO) with adaptive local search for transportation and routing problems. Implements pheromone-based pathfinding with local improvement heuristics.',
    tags: ['ACO', 'Algorithms', 'Optimization', 'Research'],
    tech: 'Python · NetworkX · Matplotlib · Research Paper',
    status: 'Research',
    github: '#',
    demo: '#',
  },
  {
    num: '04', title: 'Smart Task Manager',
    desc: 'A task management application using scheduling and optimization algorithms including Greedy EDF, Priority Queue, Dynamic Programming, and Topological Sort for dependency-aware task ordering.',
    tags: ['Python', 'Algorithms', 'Scheduling', 'Optimization'],
    tech: 'Python · Tkinter · heapq · Graph Algorithms',
    status: 'Completed',
    github: '#',
    demo: '#',
  },
  {
    num: '05', title: 'Gym Scheduler',
    desc: 'A responsive gym scheduling and workout management application with routines, daily workout selection, progress tracking, and a clean user-friendly interface built with React and Tailwind CSS.',
    tags: ['React', 'Tailwind', 'Web App'],
    tech: 'React · Vite · Tailwind CSS · localStorage',
    status: 'Completed',
    github: '#',
    demo: '#',
  },
  {
    num: '06', title: 'Laravel E-Commerce System',
    desc: 'A full-stack e-commerce application with product catalog, shopping cart, order management, user authentication, admin dashboard, and complete CRUD operations for inventory management.',
    tags: ['Laravel', 'PHP', 'MySQL', 'CRUD'],
    tech: 'Laravel · PHP · MySQL · Blade · Bootstrap',
    status: 'Completed',
    github: '#',
    demo: '#',
  },
];

// Inject modal HTML once
const modalHTML = `
<div id="project-modal" class="pmodal-overlay" role="dialog" aria-modal="true" aria-labelledby="pmodal-title" hidden>
  <div class="pmodal-box">
    <button class="pmodal-close" id="pmodal-close" aria-label="Close modal">
      <i class="fas fa-xmark"></i>
    </button>
    <div class="pmodal-header">
      <span class="pmodal-num" id="pmodal-num"></span>
      <span class="pmodal-status" id="pmodal-status"></span>
    </div>
    <h2 class="pmodal-title" id="pmodal-title"></h2>
    <p class="pmodal-desc" id="pmodal-desc"></p>
    <div class="pmodal-tech-row">
      <span class="pmodal-tech-label">Tech Stack</span>
      <span class="pmodal-tech" id="pmodal-tech"></span>
    </div>
    <div class="pmodal-tags" id="pmodal-tags"></div>
    <div class="pmodal-actions">
      <a href="#" id="pmodal-github" target="_blank" rel="noopener noreferrer" class="btn btn-ghost pmodal-btn">
        <i class="fab fa-github"></i> View on GitHub
      </a>
      <a href="#" id="pmodal-demo" target="_blank" rel="noopener noreferrer" class="btn btn-primary pmodal-btn">
        <i class="fas fa-arrow-up-right-from-square"></i> Live Demo
      </a>
    </div>
  </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

const modal      = document.getElementById('project-modal');
const modalClose = document.getElementById('pmodal-close');

function openModal(data) {
  document.getElementById('pmodal-num').textContent    = data.num;
  document.getElementById('pmodal-title').textContent  = data.title;
  document.getElementById('pmodal-desc').textContent   = data.desc;
  document.getElementById('pmodal-tech').textContent   = data.tech;
  document.getElementById('pmodal-status').textContent = data.status;

  const statusEl = document.getElementById('pmodal-status');
  statusEl.className = 'pmodal-status';
  if (data.status === 'Completed')   statusEl.classList.add('status-done');
  if (data.status === 'In Development') statusEl.classList.add('status-wip');
  if (data.status === 'Research')    statusEl.classList.add('status-research');

  const tagsEl = document.getElementById('pmodal-tags');
  tagsEl.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');

  document.getElementById('pmodal-github').href = data.github;
  document.getElementById('pmodal-demo').href   = data.demo;

  modal.hidden = false;
  modal.classList.add('pmodal-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modalClose.focus(), 100);
}

function closeModal() {
  modal.classList.remove('pmodal-open');
  setTimeout(() => { modal.hidden = true; }, 280);
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

// Wire project buttons to modals — scoped to #projects only.
// (Algorithm cards also carry .project-btn; their own handler opens
// the algorithm modal, and including them here shifts every index.)
document.querySelectorAll('#projects .project-card .project-btn').forEach((btn, i) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (projects[i]) openModal(projects[i]);
  });
});

// Wire external link icons to modals too
document.querySelectorAll('#projects .project-links a').forEach((link, i) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (projects[i]) openModal(projects[i]);
  });
});

/* ============================================================
   15. BACK TO TOP BUTTON
============================================================ */
const btt = document.createElement('button');
btt.id = 'back-to-top';
btt.setAttribute('aria-label', 'Back to top');
btt.innerHTML = '<i class="fas fa-arrow-up"></i>';
Object.assign(btt.style, {
  position: 'fixed', bottom: '28px', left: '28px', zIndex: '999',
  width: '44px', height: '44px', borderRadius: '12px',
  background: 'var(--surface)', border: '1px solid var(--border)',
  color: 'var(--muted)', fontSize: '.9rem',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'all .3s ease',
  opacity: '0', transform: 'translateY(12px)', pointerEvents: 'none',
});
document.body.appendChild(btt);

window.addEventListener('scroll', () => {
  const show = window.scrollY > 400;
  btt.style.opacity  = show ? '1'    : '0';
  btt.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
  btt.style.pointerEvents = show ? 'auto' : 'none';
}, { passive: true });

btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
btt.addEventListener('mouseenter', () => {
  btt.style.borderColor = 'var(--accent)';
  btt.style.color = 'var(--accent)';
  btt.style.background = 'var(--accent-dim)';
});
btt.addEventListener('mouseleave', () => {
  btt.style.borderColor = 'var(--border)';
  btt.style.color = 'var(--muted)';
  btt.style.background = 'var(--surface)';
});

/* ============================================================
   16. DOWNLOAD CV — shows toast since no actual file
============================================================ */
document.querySelectorAll('a[download], .cv-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const href = btn.getAttribute('href');
    // If href is '#' or empty, prevent and toast
    if (!href || href === '#') {
      e.preventDefault();
      showToast('CV coming soon — check back later!', 'info');
    }
  });
});

/* ============================================================
   17. CUSTOM CURSOR (desktop only)
============================================================ */
if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 960) {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');

  Object.assign(dot.style, {
    position:'fixed',zIndex:'9999',
    width:'8px',height:'8px',borderRadius:'50%',
    background:'#72F6C4',pointerEvents:'none',
    transform:'translate(-50%,-50%)',
    transition:'width .18s,height .18s',
    willChange:'left,top',
  });
  Object.assign(ring.style, {
    position:'fixed',zIndex:'9998',
    width:'32px',height:'32px',borderRadius:'50%',
    border:'1.5px solid rgba(114,246,196,.45)',
    pointerEvents:'none',
    transform:'translate(-50%,-50%)',
    willChange:'left,top',
  });

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; }, { passive:true });

  (function moveCursor() {
    dot.style.left = mx+'px'; dot.style.top = my+'px';
    rx += (mx-rx)*.15; ry += (my-ry)*.15;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(moveCursor);
  })();

  const hoverEls = 'a,button,.project-card,.tech-card,.trait-card,.service-card,.contact-card';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width='12px';dot.style.height='12px';
      ring.style.width='46px';ring.style.height='46px';
      ring.style.borderColor='rgba(114,246,196,.75)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width='8px';dot.style.height='8px';
      ring.style.width='32px';ring.style.height='32px';
      ring.style.borderColor='rgba(114,246,196,.45)';
    });
  });
}

/* ============================================================
   18. SKIP TO MAIN (accessibility)
============================================================ */
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.textContent = 'Skip to main content';
Object.assign(skipLink.style, {
  position:'fixed',top:'8px',left:'8px',zIndex:'99999',
  padding:'8px 16px',background:'#72F6C4',color:'#07090F',
  borderRadius:'7px',fontWeight:'700',fontSize:'.84rem',
  transform:'translateY(-140%)',transition:'transform .2s',
  textDecoration:'none',
});
skipLink.addEventListener('focus', () => { skipLink.style.transform='translateY(0)'; });
skipLink.addEventListener('blur',  () => { skipLink.style.transform='translateY(-140%)'; });
document.body.prepend(skipLink);

/* ============================================================
   19. INJECT CONTACT FORM HTML (ids needed for validation)
   Replaces form contents so fields have proper ids
============================================================ */
(function patchContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form || form.id === 'contact-form') return; // already set
})();

/* ============================================================
   20. TECH MODAL — example code + explanation
   Clicking a card in "Technologies & Tools" opens this.
============================================================ */
const techs = [
  {
    key: 'html5', name: 'HTML5', icon: 'fab fa-html5', lang: 'HTML',
    desc: 'The structural layer of every page. Semantic elements describe what content is instead of a pile of generic divs — and that meaning is what browsers, screen readers and search crawlers use to build the accessibility tree and understand the page.',
    points: [
      'Landmark elements (header, nav, main, article, footer) describe page regions.',
      'Native form validation, details/summary and dialog replace most JS widgets.',
      'Heading order is the single biggest factor in both SEO and screen-reader navigation.',
    ],
    code: `<span class="code-kw">&lt;article</span> <span class="code-key">class</span>=<span class="code-str">"card"</span><span class="code-kw">&gt;</span>
  <span class="code-kw">&lt;h2</span><span class="code-kw">&gt;</span>Building ideas into digital experiences.<span class="code-kw">&lt;/h2&gt;</span>
  <span class="code-kw">&lt;p</span> <span class="code-key">class</span>=<span class="code-str">"card__body"</span><span class="code-kw">&gt;</span>
    Semantic markup that screen readers understand.
  <span class="code-kw">&lt;/p&gt;</span>
<span class="code-kw">&lt;/article&gt;</span>`,
  },
  {
    key: 'css3', name: 'CSS3', icon: 'fab fa-css3-alt', lang: 'CSS',
    desc: 'CSS3 is what turned a stylesheet into a layout engine. Flexbox and Grid let a container distribute space without a single fixed pixel value, while custom properties and transitions keep design tokens in one place.',
    points: [
      'Grid handles two-dimensional page layout, Flexbox handles one-dimensional rows.',
      'Custom properties (variables) let a theme swap without rewriting rules.',
      'clamp() and min() make type and spacing fluid without media-query breakpoints.',
    ],
    code: `<span class="code-var">.card-grid</span> {
  <span class="code-key">display</span>: <span class="code-str">grid</span>;
  <span class="code-key">grid-template-columns</span>: <span class="code-str">repeat(auto-fit, minmax(240px, 1fr))</span>;
  <span class="code-key">gap</span>: <span class="code-var">1.5rem</span>;
  <span class="code-key">padding</span>: <span class="code-var">clamp(1rem, 3vw, 2rem)</span>;
}`,
  },
  {
    key: 'javascript', name: 'JavaScript', icon: 'fab fa-js-square', lang: 'JavaScript',
    desc: 'The behaviour layer of the web. JavaScript listens for events, updates the DOM, and talks to servers — the same language runs in the browser through Node.js and on the server.',
    points: [
      'Event delegation attaches one listener to a parent instead of many to children.',
      'Async/await makes sequential network calls read like plain code.',
      'Modules (import/export) scope code without the old global-namespace problem.',
    ],
    code: `<span class="code-kw">const</span> <span class="code-var">cards</span> = <span class="code-var">document</span>.<span class="code-key">querySelectorAll</span>(<span class="code-str">'.card'</span>);

<span class="code-var">cards</span>.<span class="code-key">forEach</span>((<span class="code-var">card</span>) =&gt; {
  <span class="code-var">card</span>.<span class="code-key">addEventListener</span>(<span class="code-str">'click'</span>, () =&gt; {
    <span class="code-var">card</span>.<span class="code-var">classList</span>.<span class="code-key">toggle</span>(<span class="code-str">'is-open'</span>);
  });
});`,
  },
  {
    key: 'python', name: 'Python', icon: 'fab fa-python', lang: 'Python',
    desc: 'Python is the language behind most of the algorithm work in this portfolio — genetic algorithms, ant colony optimisation and scheduling. Its readability makes a complex model readable months later.',
    points: [
      'Batteries included: heapq, bisect and collections solve standard problems directly.',
      'Type hints and dataclasses make data shapes explicit without boilerplate.',
      'NumPy and Pandas carry the data work; Scikit-learn carries the modelling.',
    ],
    code: `<span class="code-kw">def</span> <span class="code-var">fibonacci</span>(<span class="code-var">n</span>: <span class="code-key">int</span>) -&gt; <span class="code-key">list</span>[<span class="code-key">int</span>]:
    <span class="code-var">seq</span> = [<span class="code-var">0</span>, <span class="code-var">1</span>]

    <span class="code-kw">while</span> <span class="code-key">len</span>(<span class="code-var">seq</span>) &lt; <span class="code-var">n</span>:
        <span class="code-var">seq</span>.<span class="code-key">append</span>(<span class="code-var">seq</span>[-<span class="code-var">1</span>] + <span class="code-var">seq</span>[-<span class="code-var">2</span>])

    <span class="code-kw">return</span> <span class="code-var">seq</span>`,
  },
  {
    key: 'react', name: 'React', icon: 'fab fa-react', lang: 'JSX',
    desc: 'React models the interface as a function of state. When state changes, the component re-renders and React patches only the DOM nodes that actually differ, which is why large apps stay fast.',
    points: [
      'State is the single source of truth — the DOM follows it, never the reverse.',
      'Hooks (useState, useEffect, useMemo) add capability to function components.',
      'Components compose: the same building blocks drive a button and a whole page.',
    ],
    code: `<span class="code-kw">import</span> { <span class="code-var">useState</span> } <span class="code-kw">from</span> <span class="code-str">'react'</span>;

<span class="code-kw">function</span> <span class="code-var">Counter</span>() {
  <span class="code-kw">const</span> [<span class="code-var">count</span>, <span class="code-var">setCount</span>] = <span class="code-var">useState</span>(<span class="code-var">0</span>);

  <span class="code-kw">return</span> (
    &lt;<span class="code-var">button</span> <span class="code-key">onClick</span>={() =&gt; <span class="code-var">setCount</span>(<span class="code-var">count</span> + <span class="code-var">1</span>)}&gt;
      Clicked {<span class="code-var">count</span>} times
    &lt;/<span class="code-var">button</span>&gt;
  );
}`,
  },
  {
    key: 'vite', name: 'Vite', icon: 'fas fa-bolt', lang: 'JavaScript',
    desc: 'Vite is the build tool behind both Vite projects here. In development it serves source files straight to the browser over native ESM, so start-up is measured in milliseconds instead of a full bundle rebuild.',
    points: [
      'Native ESM in dev means no bundling step before the first paint.',
      'Hot Module Replacement swaps a module without losing component state.',
      'Rollup powers the production build; plugins extend both pipelines.',
    ],
    code: `<span class="code-kw">import</span> { <span class="code-var">defineConfig</span> } <span class="code-kw">from</span> <span class="code-str">'vite'</span>;
<span class="code-kw">import</span> <span class="code-var">react</span> <span class="code-kw">from</span> <span class="code-str">'@vitejs/plugin-react'</span>;

<span class="code-kw">export default</span> <span class="code-var">defineConfig</span>({
  <span class="code-key">plugins</span>: [<span class="code-var">react</span>()],
  <span class="code-key">server</span>: { <span class="code-key">port</span>: <span class="code-var">5173</span> },
});`,
  },
  {
    key: 'laravel', name: 'Laravel', icon: 'fab fa-laravel', lang: 'PHP',
    desc: 'Laravel is the full-stack PHP framework behind the e-commerce system. It brings a router, an ORM, migrations, queues, authentication and a templating engine in a coherent package.',
    points: [
      'Eloquent gives an active-record ORM with relations and eager loading.',
      'Migrations version the database schema so every machine matches.',
      'Form requests validate input and authorisation in one place.',
    ],
    code: `<span class="code-kw">use</span> <span class="code-var">App</span>\\<span class="code-var">Models</span>\\<span class="code-var">Project</span>;

<span class="code-var">Route</span>::<span class="code-key">get</span>(<span class="code-str">'/projects'</span>, <span class="code-kw">function</span> () {
    <span class="code-kw">return</span> <span class="code-var">Project</span>::<span class="code-key">latest</span>()
        -&gt;<span class="code-key">paginate</span>(<span class="code-var">9</span>);
});`,
  },
  {
    key: 'php', name: 'PHP', icon: 'fab fa-php', lang: 'PHP',
    desc: 'PHP still powers a large share of the web, and it is what the e-commerce backend is written in. The language is deliberately simple: variables, loops and echo, executed on the server before the HTML is sent.',
    points: [
      'Runs on the server, so the source code is never exposed to the visitor.',
      'Composer gives a dependency manager and PSR standards for structure.',
      'PDO with prepared statements is the safe way to talk to MySQL.',
    ],
    code: `<span class="code-kw">&lt;?php</span>

<span class="code-var">$total</span> = <span class="code-var">0</span>;

<span class="code-kw">foreach</span> (<span class="code-var">$orders</span> <span class="code-kw">as</span> <span class="code-var">$order</span>) {
    <span class="code-var">$total</span> += <span class="code-var">$order</span>-&gt;<span class="code-key">total</span>();
}

<span class="code-kw">echo</span> <span class="code-str">'Order total: '</span> . <span class="code-key">number_format</span>(<span class="code-var">$total</span>, <span class="code-var">2</span>);`,
  },
  {
    key: 'mysql', name: 'MySQL', icon: 'fas fa-database', lang: 'SQL',
    desc: 'MySQL is the relational store behind the project and user data. Tables describe relationships, and SQL is how the application asks questions about them — with indexes deciding how fast the answer arrives.',
    points: [
      'Primary and foreign keys keep rows consistent across tables.',
      'Indexes on frequently filtered columns are what make queries fast.',
      'Joins combine tables; a good join replaces repeated queries.',
    ],
    code: `<span class="code-kw">SELECT</span> <span class="code-var">p</span>.<span class="code-key">title</span>,
       <span class="code-key">COUNT</span>(<span class="code-var">s</span>.<span class="code-key">id</span>) <span class="code-kw">AS</span> <span class="code-var">views</span>
<span class="code-kw">FROM</span>       <span class="code-var">projects</span> <span class="code-var">p</span>
<span class="code-kw">LEFT JOIN</span>  <span class="code-var">stats</span> <span class="code-var">s</span> <span class="code-kw">ON</span> <span class="code-var">s</span>.<span class="code-key">project_id</span> = <span class="code-var">p</span>.<span class="code-key">id</span>
<span class="code-kw">GROUP BY</span>   <span class="code-var">p</span>.<span class="code-key">id</span>
<span class="code-kw">ORDER BY</span>  <span class="code-var">views</span> <span class="code-kw">DESC</span>;`,
  },
  {
    key: 'git', name: 'Git', icon: 'fab fa-git-alt', lang: 'Shell',
    desc: 'Git records the history of a project as a series of snapshots. Every commit is a checkpoint you can return to, and every branch is a safe place to try something that might not work.',
    points: [
      'A commit is a snapshot, not a diff — branching stays cheap.',
      'Staging lets you group changes into one meaningful commit.',
      'git log and git blame answer "when did this change, and why".',
    ],
    code: `<span class="code-key">git</span> <span class="code-var">switch</span> -c <span class="code-str">feature/tech-modal</span>
<span class="code-key">git</span> <span class="code-var">add</span> <span class="code-str">portfolio/style.css</span>
<span class="code-key">git</span> <span class="code-var">commit</span> -m <span class="code-str">"Add tech detail modal"</span>`,
  },
  {
    key: 'github', name: 'GitHub', icon: 'fab fa-github', lang: 'Shell',
    desc: 'GitHub is where a git repository becomes a collaboration platform: pull requests, code review, issues, and CI that runs the tests on every push before anyone merges.',
    points: [
      'Pull requests attach review comments to the exact lines that changed.',
      'Actions run a workflow on every push and block a broken merge.',
      'Issues and projects track what still needs doing.',
    ],
    code: `<span class="code-key">git</span> <span class="code-var">push</span> <span class="code-str">origin feature/tech-modal</span>

<span class="code-key">gh</span> <span class="code-var">pr create</span> \\
  <span class="code-str">--title</span> <span class="code-str">"Add tech detail modal"</span> \\
  <span class="code-str">--body</span>  <span class="code-str">"Example code and explanation per technology"</span>`,
  },
  {
    key: 'tailwind', name: 'Tailwind', icon: 'fas fa-wind', lang: 'HTML',
    desc: 'Tailwind is utility-first CSS: instead of writing custom classes, you compose small single-purpose utilities directly in the markup. The result is fewer stylesheets and a design system that cannot drift out of sync.',
    points: [
      'Utilities live in the markup, so you delete unused CSS by deleting markup.',
      'Variants (hover:, md:, dark:) are built in — no preprocessor needed.',
      'Theme values are customised in one config file, not scattered in rules.',
    ],
    code: `&lt;<span class="code-var">div</span> <span class="code-key">class</span>=<span class="code-str">"flex items-center gap-3 rounded-xl border p-4 shadow-lg"</span>&gt;
  &lt;<span class="code-var">span</span> <span class="code-key">class</span>=<span class="code-str">"font-mono text-sm text-emerald-400"</span>&gt;
    Deploy
  &lt;/<span class="code-var">span</span>&gt;
&lt;/<span class="code-var">div</span>&gt;`,
  },
  {
    key: 'machine-learning', name: 'Machine Learning', icon: 'fas fa-robot', lang: 'Python',
    desc: 'Instead of writing rules by hand, a model learns the mapping from data. That is the core of DivineMind: student performance is fed in, and the model returns predictions and recommendations.',
    points: [
      'Train/test splits keep the evaluation honest.',
      'Scikit-learn keeps the model definition to a handful of readable lines.',
      'Cross-validation and confusion matrices show whether the metric can be trusted.',
    ],
    code: `<span class="code-kw">from</span> <span class="code-var">sklearn</span>.<span class="code-var">ensemble</span> <span class="code-kw">import</span> <span class="code-var">RandomForestClassifier</span>

<span class="code-var">model</span> = <span class="code-var">RandomForestClassifier</span>(
    <span class="code-key">n_estimators</span>=<span class="code-var">200</span>,
    <span class="code-key">random_state</span>=<span class="code-var">42</span>,
)
<span class="code-var">model</span>.<span class="code-key">fit</span>(<span class="code-var">X_train</span>, <span class="code-var">y_train</span>)

<span class="code-var">print</span>(<span class="code-str">f"Accuracy: {model.score(X_test, y_test):.2%}"</span>)`,
  },
];

const techModalHTML = `
<div id="tech-modal" class="tmodal-overlay" role="dialog" aria-modal="true" aria-labelledby="tmodal-title" hidden>
  <div class="tmodal-box">
    <button type="button" class="tmodal-close" id="tmodal-close" aria-label="Close modal">
      <i class="fas fa-xmark"></i>
    </button>
    <div class="tmodal-head">
      <span class="tmodal-icon" id="tmodal-icon"></span>
      <div>
        <span class="tmodal-kicker">Technology</span>
        <h2 class="tmodal-title" id="tmodal-title"></h2>
      </div>
    </div>
    <p class="tmodal-desc" id="tmodal-desc"></p>
    <ul class="tmodal-points" id="tmodal-points"></ul>
    <div class="tmodal-codewrap">
      <div class="tmodal-codebar">
        <span class="tmodal-lang" id="tmodal-lang"></span>
        <button type="button" class="tmodal-copy" id="tmodal-copy">
          <i class="fas fa-copy" aria-hidden="true"></i> Copy
        </button>
      </div>
      <pre class="tmodal-code"><code id="tmodal-code"></code></pre>
    </div>
  </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', techModalHTML);

const techModal      = document.getElementById('tech-modal');
const techModalClose = document.getElementById('tmodal-close');
const techModalCopy  = document.getElementById('tmodal-copy');
let activeTech = null;

function openTechModal(key) {
  const tech = techs.find(t => t.key === key);
  if (!tech) return;
  activeTech = tech;

  document.getElementById('tmodal-icon').innerHTML   = `<i class="${tech.icon}"></i>`;
  document.getElementById('tmodal-title').textContent = tech.name;
  document.getElementById('tmodal-desc').textContent  = tech.desc;
  document.getElementById('tmodal-lang').textContent  = tech.lang;
  document.getElementById('tmodal-code').innerHTML    = tech.code;
  document.getElementById('tmodal-points').innerHTML   = tech.points.map(p => `<li>${p}</li>`).join('');

  techModal.hidden = false;
  techModal.classList.add('tmodal-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => techModalClose.focus(), 100);
}

function closeTechModal() {
  techModal.classList.remove('tmodal-open');
  setTimeout(() => { techModal.hidden = true; }, 280);
  document.body.style.overflow = '';
  activeTech = null;
}

techModalClose.addEventListener('click', closeTechModal);
techModal.addEventListener('click', (e) => { if (e.target === techModal) closeTechModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !techModal.hidden) closeTechModal(); });

// navigator.clipboard only exists in a secure context — a LAN address
// (http://192.168.x.x) is not one — and it can still refuse a write.
// Both cases fall back to the legacy command.
function legacyCopy(text) {
  return new Promise((resolve, reject) => {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.top = '-1000px';
    document.body.appendChild(field);
    field.select();
    try {
      document.execCommand('copy') ? resolve() : reject(new Error('copy rejected'));
    } catch (err) {
      reject(err);
    } finally {
      field.remove();
    }
  });
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
  }
  return legacyCopy(text);
}

techModalCopy.addEventListener('click', () => {
  if (!activeTech) return;
  // Strip the highlight spans to get the plain source back
  const holder = document.createElement('div');
  holder.innerHTML = activeTech.code;
  const plain = holder.textContent.trim();

  copyText(plain)
    .then(() => showToast(`${activeTech.name} example copied`, 'success'))
    .catch(() => showToast('Copy failed — select the code manually', 'error'));
});

document.querySelectorAll('.tech-card').forEach(card => {
  card.addEventListener('click', () => openTechModal(card.dataset.tech));
});

/* ============================================================
   21. HERO CODE EDITOR — switch file, run it, explain it
   Click a tab or the code itself to load another file.
   "Run" types the file out and prints what it does.
============================================================ */
const editorFiles = [
  {
    file: 'developer.js',
    lang: 'js',
    code: `const developer = {
  name: "John Earl",
  degree: "BS Computer Science",
  focus: ["Web Development", "AI & ML", "Algorithms"],
  status: "Building..."
};`,
    explain: 'A plain object holding the details behind this site. Every section reads from the same shape, so the content is edited in one place instead of being hunted down in the markup.',
  },
  {
    file: 'skills.py',
    lang: 'py',
    code: `def fitness(laptop, profile):
    """Score a laptop against a user's profile."""
    score = 0
    if laptop["ram"] >= profile["ram"]:
        score += 40
    if laptop["price"] <= profile["budget"]:
        score += 35
    score += 10 * (laptop["cpu"] // profile["cpu"])
    return score`,
    explain: 'The fitness function from the Smart Laptop Recommendation System. Each candidate laptop is scored against the budget and the required specs, and the genetic algorithm keeps the highest scoring ones for the next generation.',
  },
  {
    file: 'tasks.js',
    lang: 'js',
    code: `// Smart Task Manager — dependency-aware ordering
const byPriority = (a, b) => b.priority - a.priority;

function schedule(tasks) {
  return tasks
    .filter(task => task.dependsOn.length === 0)
    .sort(byPriority)
    .map(task => ({ ...task, state: "scheduled" }));
}`,
    explain: 'The scheduler only releases tasks whose dependencies are already finished, then orders them with a priority queue. This is the greedy earliest-deadline-first step that runs before the dynamic programming pass.',
  },
  {
    file: 'model.py',
    lang: 'py',
    code: `from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
)
model.fit(X_train, y_train)

print(f"Accuracy: {model.score(X_test, y_test):.2%}")`,
    explain: 'The training step of DivineMind. A random forest learns the mapping from a student\'s history to their predicted performance, and the printed accuracy is measured on data the model never saw during training.',
  },
];

// The tech badges under the card open this same editor with a sample of that
// language, so the hero doubles as a small playground.
const editorTechs = [
  {
    key: 'html5', file: 'index.html', lang: 'html',
    code: `<article class="card">
  <h2>Building ideas into digital experiences.</h2>
  <p>Semantic markup that screen readers understand.</p>
</article>`,
    explain: 'HTML5 gives the document meaning, not just layout. Landmark and heading elements are what screen readers, search crawlers and the browser accessibility tree use to work out what the page is actually about.',
  },
  {
    key: 'css3', file: 'style.css', lang: 'css',
    code: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}`,
    explain: 'CSS3 turned a stylesheet into a layout engine. Grid distributes space without a single fixed pixel value, and the fluid minmax() means one rule covers phone, tablet and desktop widths on its own.',
  },
  {
    key: 'javascript', file: 'app.js', lang: 'js',
    code: `const cards = document.querySelectorAll('.card');

cards.forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('is-open');
  });
});`,
    explain: 'JavaScript is the behaviour layer. The listener is attached to each card, the class toggle is what the stylesheet reacts to, and none of it needs a framework to work.',
  },
  {
    key: 'python', file: 'main.py', lang: 'py',
    code: `def fibonacci(n: int) -> list[int]:
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq`,
    explain: 'Python is the language behind the algorithm work here. The type hints document what the function expects and returns, and the whole sequence is built in one pass with no recursion at all.',
  },
  {
    key: 'react', file: 'Counter.jsx', lang: 'jsx',
    code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
    explain: 'React treats the interface as a function of state. Clicking the button calls the setter, React re-renders the component, and only the text that actually changed is patched in the DOM.',
  },
  {
    key: 'laravel', file: 'web.php', lang: 'php',
    code: `Route::get('/projects', function () {
    return Project::latest()->paginate(9);
});`,
    explain: 'Laravel is the framework behind the e-commerce system. The closure returns an Eloquent query, and paginate() turns it into a page of results without pulling every row into memory.',
  },
  {
    key: 'mysql', file: 'projects.sql', lang: 'sql',
    code: `SELECT p.title, COUNT(s.id) AS views
FROM projects p
LEFT JOIN stats s ON s.project_id = p.id
GROUP BY p.id
ORDER BY views DESC;`,
    explain: 'MySQL is the relational store behind the project data. The join attaches view counts to each project, the group by collapses them into one row per project, and the order by ranks the result.',
  },
  {
    key: 'git', file: 'terminal.sh', lang: 'bash',
    code: `git switch -c feature/tech-modal
git add portfolio/style.css
git commit -m "Add tech detail modal"`,
    explain: 'Git records the project as a series of snapshots. A branch is a safe place to try a change, staging groups the edits into one meaningful commit, and the message explains why it happened.',
  },
];

const editorEntries = editorFiles.concat(editorTechs);

const editorTechIndex = {};
editorTechs.forEach((t, i) => { editorTechIndex[t.key] = editorFiles.length + i; });

// What each file prints when it runs
const editorOutput = {
  'developer.js': { cmd: 'node developer.js', out: '{ name: "John Earl", degree: "BS Computer Science" }' },
  'skills.py':    { cmd: 'python skills.py', out: 'best laptop: "ASUS TUF Gaming A15" (score 85)' },
  'tasks.js':     { cmd: 'node tasks.js',     out: '3 tasks scheduled -> design, build, deploy' },
  'model.py':     { cmd: 'python model.py',   out: 'Accuracy: 0.94' },
  'index.html':   { cmd: 'open index.html',   out: '<h2>Building ideas into digital experiences.</h2>' },
  'style.css':    { cmd: 'open style.css',    out: '.card-grid { display: grid; }' },
  'app.js':       { cmd: 'node app.js',       out: '3 cards toggled' },
  'main.py':      { cmd: 'python main.py',    out: 'fibonacci(10) -> 0, 1, 1, 2, 3, 5, 8, 13, 21, 34' },
  'Counter.jsx':  { cmd: 'npm run dev',       out: 'ready in 412 ms -> http://localhost:5173/' },
  'web.php':      { cmd: 'php artisan serve', out: 'Server running on http://127.0.0.1:8000' },
  'projects.sql': { cmd: 'mysql portfolio',   out: '6 rows in set (0.01 sec)' },
  'terminal.sh':  { cmd: 'git log --oneline', out: 'a1b2c3d Add tech detail modal' },
};

const EDITOR_KEYWORDS = {
  js: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'new',
       'import', 'from', 'export', 'class', 'await', 'async', 'this', 'null', 'true', 'false'],
  py: ['def', 'return', 'import', 'from', 'class', 'if', 'elif', 'else', 'for', 'while',
       'in', 'not', 'None', 'True', 'False', 'with', 'as', 'print', 'lambda', 'pass', 'and', 'or'],
  php: ['function', 'return', 'use', 'namespace', 'class', 'public', 'private', 'protected',
        'static', 'new', 'if', 'else', 'foreach', 'as', 'echo', 'try', 'catch', 'finally',
        'const', 'array', 'true', 'false', 'null', 'fn', 'match'],
  sql: ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP',
        'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'AND', 'OR', 'AS', 'IN', 'NOT', 'NULL',
        'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'PRIMARY',
        'KEY', 'FOREIGN', 'REFERENCES', 'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'INDEX'],
  html: [],
  css: [],
  bash: [],
};

// Some snippets are written in a dialect of the language the highlighter knows.
const EDITOR_ALIAS = { jsx: 'js' };

// Comment style differs by language: // in JavaScript, # in Python — and in
// Python "//" is floor division, not a comment. The rest of the pattern is
// shared, so it is built from a literal's .source instead of being retyped.
// "(?!)" is a pattern that can never match, for languages with no comments.
const EDITOR_COMMENT = {
  js: '\\/\\/[^\\n]*',
  py: '#[^\\n]*',
  php: '//[^\\n]*|#[^\\n]*',
  sql: '--[^\\n]*',
  bash: '#[^\\n]*',
  html: '(?!)',
  css: '(?!)',
};
const EDITOR_TOKEN_TAIL = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+|[^\sA-Za-z0-9_$])/;

function editorTokenRegex(lang) {
  return new RegExp('(' + EDITOR_COMMENT[lang] + ')|' + EDITOR_TOKEN_TAIL.source, 'g');
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCode(code, lang) {
  const base = EDITOR_ALIAS[lang] || lang;
  const kws = new Set(EDITOR_KEYWORDS[base] || []);
  const isHtml = base === 'html';

  return code.replace(editorTokenRegex(base), (match, comment, str, num, word, other, offset, full) => {
    if (comment) {
      return `<span class="code-com">${escapeHTML(comment)}</span>`;
    }
    if (str) return `<span class="code-str">${escapeHTML(str)}</span>`;
    if (num) return `<span class="code-num">${escapeHTML(num)}</span>`;
    if (word) {
      if (kws.has(word)) return `<span class="code-kw">${escapeHTML(word)}</span>`;
      // a word directly followed by ':' is an object key (or a CSS property);
      // in HTML a word followed by '=' is an attribute name
      const after = full.slice(offset + match.length);
      if (/^\s*:/.test(after) || (isHtml && /^\s*=/.test(after))) {
        return `<span class="code-key">${escapeHTML(word)}</span>`;
      }
      // a word declared right after a keyword is a variable
      const prev = (full.slice(0, offset).match(/([A-Za-z_$][\w$]*)\s*$/) || [])[1];
      if (prev && ['const', 'let', 'var', 'def', 'class'].includes(prev)) {
        return `<span class="code-var">${escapeHTML(word)}</span>`;
      }
      return escapeHTML(word);
    }
    return escapeHTML(other);
  });
}

const editorCode = document.getElementById('editor-code');
const editorTabs = document.getElementById('editor-tabs');
const editorRun  = document.getElementById('editor-run');
const editorLog  = document.getElementById('editor-console');
const editorWrap = document.getElementById('editor-code-wrap');

if (editorCode && editorTabs && editorRun && editorLog && editorWrap) {
  let current = 0;
  let timer = null;

  editorTabs.innerHTML = editorFiles.map((f, i) =>
    `<button type="button" class="editor-tab" role="tab" data-index="${i}" aria-selected="false">${f.file}</button>`
  ).join('');

  const badgeButtons = document.querySelectorAll('.tech-badge[data-tech]');

  // Console lines are written with textContent, so program output can contain
  // angle brackets without needing to be escaped.
  function setConsole(parts) {
    editorLog.textContent = '';
    parts.forEach(p => {
      const span = document.createElement('span');
      span.className = p.cls;
      span.textContent = p.text;
      editorLog.appendChild(span);
    });
  }

  // Reserve the tallest file's height so switching never resizes the card
  editorWrap.style.minHeight = '';
  editorWrap.style.visibility = 'hidden';
  let tallest = 0;
  editorEntries.forEach(f => {
    editorCode.innerHTML = highlightCode(f.code, f.lang);
    tallest = Math.max(tallest, editorWrap.getBoundingClientRect().height);
  });
  editorWrap.style.minHeight = tallest + 'px';
  editorWrap.style.visibility = '';
  editorCode.innerHTML = '';

  function markActive() {
    editorTabs.querySelectorAll('.editor-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === current);
      tab.setAttribute('aria-selected', String(i === current));
    });
    badgeButtons.forEach(badge => {
      badge.classList.toggle('active', editorTechIndex[badge.dataset.tech] === current);
    });
  }

  function runFile(index) {
    const file = editorEntries[index];
    if (!file) return;
    current = index;
    markActive();

    setConsole([{ cls: 'editor-hint', text: 'running ' + file.file + '…' }]);
    editorRun.classList.add('running');
    editorRun.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span>Running</span>';

    const result = editorOutput[file.file] || { cmd: file.file, out: '' };

    let i = 0;
    clearInterval(timer);
    timer = setInterval(() => {
      i = Math.min(file.code.length, i + 2);
      editorCode.innerHTML = highlightCode(file.code.slice(0, i), file.lang);

      if (i >= file.code.length) {
        clearInterval(timer);
        timer = null;
        editorRun.classList.remove('running');
        editorRun.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i><span>Run</span>';
        setConsole([
          { cls: 'editor-cmd',    text: '$ ' + result.cmd },
          { cls: 'editor-out',    text: result.out },
          { cls: 'editor-output', text: '✓ ' + file.explain },
          { cls: 'editor-hint',   text: 'click the code, a tab or a badge to try another file' },
        ]);
      }
    }, 16);
  }

  editorTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.editor-tab');
    if (!tab) return;
    runFile(Number(tab.dataset.index));
  });

  badgeButtons.forEach(badge => {
    badge.addEventListener('click', () => {
      const index = editorTechIndex[badge.dataset.tech];
      if (index !== undefined) runFile(index);
    });
  });

  editorRun.addEventListener('click', () => runFile(current));

  const showNext = () => runFile((current + 1) % editorEntries.length);
  editorWrap.addEventListener('click', showNext);
  editorWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showNext(); }
  });

  runFile(0);
}

/* ============================================================
   22. ALGORITHMS SECTION — open, read, run
   Each card opens a modal with the explanation and the code.
============================================================ */
const algorithms = [
  {
    key: 'ga', name: 'Genetic Algorithm', category: 'Optimization',
    lang: 'Python', cmd: 'python ga.py',
    out: 'generation 23 -> best fitness 84 (started at 35)',
    desc: 'A genetic algorithm searches by breeding instead of guessing. A population of candidate solutions is scored by a fitness function, the fittest are allowed to reproduce, and their genes are crossed over and mutated to produce the next generation.',
    points: [
      'Selection keeps the fittest; crossover and mutation create the next generation.',
      'Elitism copies the best few solutions forward so a generation nevecanr gets worse.',
      'Works on problems with no closed-form answer, at the cost of many evaluations.',
    ],
    code: `import math

TARGET = 92
POPULATION = 24
GENERATIONS = 24
MUTATION = 0.06
ELITE = 4

# JS Math.round rounds .5 up; Python's round() rounds to even, so
# match the browser version explicitly with floor(x + 0.5)
def js_round(x):
    return math.floor(x + 0.5)

# the same deterministic generator the browser version uses,
# so this program prints exactly what the 3D view draws
class Rand:
    def __init__(self, seed):
        self.seed = seed

    def next(self):
        self.seed = (self.seed * 16807) % 2147483647
        return self.seed / 2147483647

rnd = Rand(7)

# a candidate is a number; fitness is how close it is to the target
def fitness(value):
    return 100 - abs(value - TARGET)

# start lower than the target so the climb is visible
population = [int(rnd.next() * 30) for _ in range(POPULATION)]

for generation in range(GENERATIONS):
    ranked = sorted(population, key=fitness, reverse=True)
    print(f"generation {generation}: best fitness {fitness(ranked[0])}")

    # elitism: the best few survive untouched
    next_gen = ranked[:ELITE]

    while len(next_gen) < POPULATION:
        a = ranked[int(rnd.next() * 8)]
        b = ranked[int(rnd.next() * 8)]
        child = js_round((a + b) / 2)
        if rnd.next() < MUTATION:
            child += int(rnd.next() * 21) - 10
        next_gen.append(max(0, min(100, child)))

    population = next_gen`,
  },
  {
    key: 'aco', name: 'Ant Colony Optimization', category: 'Swarm Intelligence',
    lang: 'Python', cmd: 'python aco.py',
    out: 'round 25 -> short route holds 60% of the pheromone',
    desc: 'Ant colony optimisation borrows its idea from real ants. An ant leaves a pheromone trail along the path it took, and because shorter paths are walked more often, the strongest trails are the ones that get reinforced.',
    points: [
      'Pheromone evaporates every round, so stale routes stop being followed.',
      'The deposit is inversely proportional to route length — shorter paths leave stronger trails.',
      'Applies to any graph: road networks, delivery routes, machine scheduling.',
    ],
    code: `ANT_COUNT = 14
ROUNDS = 26
EVAPORATION = 0.12

# two possible routes between the nest and the food
routes = [
    {"id": "short", "length": 38},
    {"id": "long", "length": 45},
]

# every route starts with the same amount of pheromone
trail = [1.0 for _ in routes]

for round_number in range(ROUNDS):
    total = sum(trail)
    share = [t / total for t in trail]
    ants = [round(s * ANT_COUNT) for s in share]

    # evaporation plus deposit: a shorter route gains more per ant
    for i, route in enumerate(routes):
        trail[i] = trail[i] * (1 - EVAPORATION) + ants[i] / route["length"]

    print(f"round {round_number}: short route holds {share[0]:.0%} of the pheromone")`,
  },
  {
    key: 'edf', name: 'Greedy Earliest Deadline First', category: 'Scheduling',
    lang: 'Python', cmd: 'python scheduler.py',
    out: 'total time 11, 2 missed deadlines (T4, T3)',
    desc: 'Greedy EDF always runs the task that is due soonest. It takes no account of what happens later — it simply keeps the deadline order — which makes it fast, predictable and optimal when the deadlines are known up front.',
    points: [
      'Sort by deadline, then run whatever is due next.',
      'Optimal when every task is unit length and every deadline is known in advance.',
      'The fast pre-pass that runs before the dynamic programming pass in the task manager.',
    ],
    code: `tasks = [
    {"name": "T1", "duration": 2, "deadline": 5},
    {"name": "T2", "duration": 1, "deadline": 3},
    {"name": "T3", "duration": 3, "deadline": 9},
    {"name": "T4", "duration": 2, "deadline": 7},
    {"name": "T5", "duration": 1, "deadline": 4},
    {"name": "T6", "duration": 2, "deadline": 6},
]

# Greedy EDF: always run whatever is due soonest
ready = sorted(tasks, key=lambda t: t["deadline"])

now = 0
missed = 0

for task in ready:
    start = now
    now += task["duration"]
    late = now > task["deadline"]
    if late:
        missed += 1

    print(f"{task['name']}: t={start}->{now}, deadline {task['deadline']}"
          + ("  MISSED" if late else ""))

print(f"total time {now}, {missed} missed")`,
  },
  {
    key: 'topo', name: 'Topological Sort', category: 'Graph Theory',
    lang: 'Python', cmd: 'python deps.py',
    out: 'valid order -> design, assets, build, test, docs, deploy',
    desc: 'A topological sort orders a dependency graph so every node comes after the ones it depends on. It is what turns a list of tangled tasks into a sequence that can actually be executed.',
    points: [
      "Kahn's algorithm: repeatedly remove the nodes with no remaining dependencies.",
      'A cycle is detected when the queue empties before every node is emitted.',
      'Gives a valid execution order for the build and task pipelines.',
    ],
    code: `from collections import deque

# adjacency list: each node points at the nodes that depend on it
graph = {
    "design": ["build", "assets"],
    "assets": ["build"],
    "build": ["test", "docs"],
    "test": ["deploy"],
    "docs": ["deploy"],
    "deploy": [],
}

# count how many prerequisites each node still has
indegree = {node: 0 for node in graph}
for node in graph:
    for next_node in graph[node]:
        indegree[next_node] += 1

# Kahn's algorithm: emit every node with nothing left to wait for
queue = deque(n for n in graph if indegree[n] == 0)
order = []

while queue:
    node = queue.popleft()
    order.append(node)
    print(f"{len(order)}. {node}")

    for next_node in graph[node]:
        indegree[next_node] -= 1
        if indegree[next_node] == 0:
            queue.append(next_node)

if len(order) != len(graph):
    print("cycle detected - this graph cannot be scheduled")
else:
    print("valid order: " + " -> ".join(order))`,
  },
  {
    key: 'dp', name: 'Dynamic Programming', category: 'Optimisation',
    lang: 'Python', cmd: 'python dp.py',
    out: 'best reward 28 with a budget of 10, chose D, B, A',
    desc: 'Dynamic programming breaks a problem into overlapping subproblems and stores the answer to each one. The second time the same subproblem is asked, the stored answer is returned instead of being recomputed.',
    points: [
      'Each state is a position plus a remaining budget, and its answer is memoised.',
      'Turns an exponential search into a polynomial one by never repeating work.',
      'The backbone of the optimal schedule calculation in the task manager.',
    ],
    code: `BUDGET = 10

# each task: what it costs and what it is worth
tasks = [
    {"name": "A", "cost": 2, "reward": 6},
    {"name": "B", "cost": 3, "reward": 8},
    {"name": "C", "cost": 4, "reward": 9},
    {"name": "D", "cost": 5, "reward": 14},
    {"name": "E", "cost": 1, "reward": 3},
]

n = len(tasks)

# memo table: table[i][b] = best reward using the first i tasks
# with a budget of b. Row 0 and column 0 start at 0.
table = [[0] * (BUDGET + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    for b in range(BUDGET + 1):
        skip = table[i - 1][b]
        task = tasks[i - 1]
        take = (table[i - 1][b - task["cost"]] + task["reward"]
                if task["cost"] <= b else float("-inf"))
        table[i][b] = max(skip, take)

print(f"best reward {table[n][BUDGET]}")

# walk the table backwards to recover which tasks were chosen
chosen = []
b = BUDGET
for i in range(n, 0, -1):
    if table[i][b] != table[i - 1][b]:
        chosen.append(tasks[i - 1]["name"])
        b -= tasks[i - 1]["cost"]

print("chosen: " + ", ".join(chosen))`,
  },
  {
    key: 'dijkstra', name: "Dijkstra's Shortest Path", category: 'Graph Theory',
    lang: 'Python', cmd: 'python route.py',
    out: 'A(0) C(2) B(4) D(9) E(12) F(14)',
    desc: 'Dijkstra grows outward from the start node and always expands the cheapest known frontier first. Because every node is settled at its true shortest distance the moment it is popped, the first time the goal is reached the answer is final.',
    points: [
      'A min-heap always expands the cheapest known node.',
      'Correct for non-negative edge weights.',
      'Forms the core of the routing side of the transportation research.',
    ],
    code: `import heapq

START = "A"

# weighted graph - every edge is non-negative
graph = {
    "A": {"B": 4, "C": 2},
    "B": {"A": 4, "D": 5},
    "C": {"A": 2, "D": 8},
    "D": {"B": 5, "C": 8, "E": 3, "F": 6},
    "E": {"D": 3, "F": 2},
    "F": {"D": 6, "E": 2},
}

dist = {node: float("inf") for node in graph}
dist[START] = 0

queue = [(0, START)]
settled = []

while queue:
    cost, node = heapq.heappop(queue)

    # a stale entry: we already found something cheaper
    if cost > dist[node]:
        continue

    settled.append(node)
    print(f"settled {node} at distance {cost}")

    for next_node, weight in graph[node].items():
        total = cost + weight
        if total < dist[next_node]:
            dist[next_node] = total
            heapq.heappush(queue, (total, next_node))

for node in graph:
    print(f"{node}: {dist[node]}")`,
  },
];

const algoModalHTML = `
<div id="algo-modal" class="tmodal-overlay" role="dialog" aria-modal="true" aria-labelledby="amodal-title" hidden>
  <div class="tmodal-box">
    <button type="button" class="tmodal-close" id="amodal-close" aria-label="Close modal">
      <i class="fas fa-xmark"></i>
    </button>
    <div class="tmodal-head">
      <span class="tmodal-icon" id="amodal-icon"><i class="fas fa-diagram-project"></i></span>
      <div>
        <span class="tmodal-kicker" id="amodal-kicker">Algorithm</span>
        <h2 class="tmodal-title" id="amodal-title"></h2>
      </div>
    </div>
    <p class="tmodal-desc" id="amodal-desc"></p>
    <ul class="tmodal-points" id="amodal-points"></ul>
    <div class="tmodal-codewrap">
      <div class="tmodal-codebar">
        <span class="tmodal-lang" id="amodal-lang"></span>
        <div class="tmodal-btns">
          <button type="button" class="tmodal-copy" id="amodal-copy">
            <i class="fas fa-copy" aria-hidden="true"></i> Copy
          </button>
          <button type="button" class="tmodal-run" id="amodal-run">
            <i class="fas fa-play" aria-hidden="true"></i> Run
          </button>
        </div>
      </div>
      <div class="amodal-tabs" role="tablist" aria-label="Code view">
        <button type="button" class="amodal-tab is-active" data-tab="py" role="tab" aria-selected="true">Reference code</button>
        <button type="button" class="amodal-tab" data-tab="js" role="tab" aria-selected="false">
          <i class="fas fa-code" aria-hidden="true"></i> Editable &amp; runnable
        </button>
      </div>
      <pre class="tmodal-code" id="amodal-py-view"><code id="amodal-code"></code></pre>
      <div class="amodal-editor" id="amodal-js-view" hidden>
        <textarea id="amodal-editor" spellcheck="false" aria-label="Editable algorithm code"></textarea>
        <p class="amodal-editor-hint">Real JavaScript. Edit anything and press <strong>Run</strong> — the 3D view redraws from your output.</p>
      </div>
    </div>

    <div class="amodal-viz" id="amodal-viz">
      <div class="amodal-vizbar">
        <span class="tmodal-lang" id="amodal-viz-label"></span>
        <span class="amodal-vizstatus" id="amodal-viz-status" aria-live="polite"></span>
      </div>

      <div class="amodal-designs" id="amodal-designs" role="group" aria-label="Simulation design"></div>

      <canvas id="amodal-canvas" aria-label="3D simulation of the algorithm"></canvas>

      <div class="amodal-steps">
        <div class="amodal-stephead">
          <span class="amodal-stepcount" id="amodal-stepcount">step 0</span>
          <span class="amodal-steptitle" id="amodal-steptitle"></span>
        </div>
        <p class="amodal-stepbody" id="amodal-stepbody" aria-live="polite"></p>
        <div class="amodal-stepnav">
          <button type="button" class="amodal-stepbtn" id="amodal-step-prev" aria-label="Previous step">
            <i class="fas fa-chevron-left" aria-hidden="true"></i> Prev
          </button>
          <button type="button" class="amodal-stepbtn" id="amodal-step-next" aria-label="Next step">
            Next <i class="fas fa-chevron-right" aria-hidden="true"></i>
          </button>
          <span class="amodal-stepnote">step through to see how it works</span>
        </div>
        <ol class="amodal-steplist" id="amodal-steplist" aria-label="All steps"></ol>
      </div>

      <div class="amodal-controls">
        <button type="button" class="amodal-ctrl" id="amodal-pause" aria-label="Pause">
          <i class="fas fa-pause" aria-hidden="true"></i>
        </button>
        <button type="button" class="amodal-ctrl" id="amodal-viz-replay" aria-label="Replay">
          <i class="fas fa-rotate-right" aria-hidden="true"></i>
        </button>
        <label class="amodal-speed">
          <i class="fas fa-gauge-high" aria-hidden="true"></i>
          <input type="range" id="amodal-speed" min="0.15" max="2" step="0.05" value="0.5" aria-label="Animation speed">
          <span class="amodal-speedval" id="amodal-speedval">0.5×</span>
        </label>

        <div class="amodal-zoom" role="group" aria-label="Zoom">
          <button type="button" class="amodal-ctrl" id="amodal-zoom-out" aria-label="Zoom out">
            <i class="fas fa-magnifying-glass-minus" aria-hidden="true"></i>
          </button>
          <span class="amodal-zoomval" id="amodal-zoomval" aria-live="polite">100%</span>
          <button type="button" class="amodal-ctrl" id="amodal-zoom-in" aria-label="Zoom in">
            <i class="fas fa-magnifying-glass-plus" aria-hidden="true"></i>
          </button>
          <button type="button" class="amodal-ctrl" id="amodal-zoom-fit" aria-label="Fit the whole design on screen">
            <i class="fas fa-expand" aria-hidden="true"></i>
          </button>
        </div>

        <span class="amodal-drag-hint">drag to rotate · scroll to zoom · double-click to reset</span>
      </div>
    </div>
    <div class="amodal-out" id="amodal-out"></div>
  </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', algoModalHTML);

const algoModal      = document.getElementById('algo-modal');
const algoModalClose = document.getElementById('amodal-close');
const algoModalRun   = document.getElementById('amodal-run');
const algoModalCopy  = document.getElementById('amodal-copy');
const algoModalCode  = document.getElementById('amodal-code');
const algoModalOut   = document.getElementById('amodal-out');
const algoEditor     = document.getElementById('amodal-editor');
const algoPvView     = document.getElementById('amodal-py-view');
const algoJsView     = document.getElementById('amodal-js-view');
const algoTabs       = document.querySelectorAll('.amodal-tab');
let activeAlgo = null;
let activeTab = 'py';

function setTab(tab) {
  activeTab = tab;
  algoPvView.hidden = tab !== 'py';
  algoJsView.hidden = tab !== 'js';
  algoTabs.forEach((t) => {
    const on = t.dataset.tab === tab;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', String(on));
  });
  if (tab === 'js') algoEditor.focus();
}

function printAlgoOut(lines) {
  algoModalOut.textContent = '';
  lines.forEach(({ cls, text }) => {
    const span = document.createElement('span');
    span.className = cls;
    span.textContent = text;
    algoModalOut.appendChild(span);
  });
}

function writeAlgoOut(algo) {
  printAlgoOut([
    { cls: 'editor-cmd', text: '$ ' + algo.cmd },
    { cls: 'editor-out', text: algo.out },
    { cls: 'editor-note', text: 'Switch to "Editable & runnable" to change the real code and run it.' },
  ]);
}

algoTabs.forEach((t) => t.addEventListener('click', () => setTab(t.dataset.tab)));

function openAlgoModal(key) {
  const algo = algorithms.find(a => a.key === key);
  if (!algo) return;
  activeAlgo = algo;

  document.getElementById('amodal-title').textContent  = algo.name;
  document.getElementById('amodal-kicker').textContent = algo.category;
  document.getElementById('amodal-desc').textContent   = algo.desc;
  document.getElementById('amodal-lang').textContent   = algo.lang;
  document.getElementById('amodal-points').innerHTML   = algo.points.map(p => `<li>${p}</li>`).join('');
  algoModalCode.innerHTML = highlightCode(algo.code, algo.lang);

  // the editor starts from the working source of this algorithm
  const pg = algoPlayground[algo.key];
  algoEditor.value = pg ? pg.code : '';
  setTab('py');
  writeAlgoOut(algo);
  startViz(algo.key);

  algoModal.hidden = false;
  algoModal.classList.add('tmodal-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => algoModalClose.focus(), 100);
}

function closeAlgoModal() {
  algoModal.classList.remove('tmodal-open');
  setTimeout(() => { algoModal.hidden = true; }, 280);
  document.body.style.overflow = '';
  stopViz();
}

algoModalClose.addEventListener('click', closeAlgoModal);
algoModal.addEventListener('click', (e) => { if (e.target === algoModal) closeAlgoModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !algoModal.hidden) closeAlgoModal(); });

algoModalRun.addEventListener('click', runPlaygroundUI);

algoModalCopy.addEventListener('click', () => {
  if (!activeAlgo) return;
  // copy whichever panel is showing
  const text = activeTab === 'js' ? algoEditor.value : activeAlgo.code;
  copyText(text)
    .then(() => showToast(`${activeAlgo.name} ${activeTab === 'js' ? 'JavaScript' : 'reference'} copied`, 'success'))
    .catch(() => showToast('Copy failed — select the code manually', 'error'));
});

// Ctrl/Cmd+Enter inside the editor runs it
algoEditor.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    runPlaygroundUI();
  }
});

document.querySelectorAll('.algo-btn').forEach(btn => {
  btn.addEventListener('click', () => openAlgoModal(btn.dataset.algo));
});

/* ============================================================
   23. ALGORITHM PLAYGROUND — real JavaScript, really executed
   Each entry holds the editable source and the input it is called with.
   Pressing Run compiles the text with new Function() and feeds the
   returned data straight into the 3D view, so an edit changes what
   the simulation draws.
============================================================ */
const algoPlayground = {
  ga: {
    defaults: { target: 92, population: 24, generations: 24, mutation: 0.06 },
    code: `// Real JavaScript — edit it, then press Run.
// solve() must return { history: [...], best: number }
function solve({ target, population, generations, mutation }) {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  let pop = Array.from({ length: population },
    () => Math.floor(rnd() * 30));
  const history = [];

  for (let g = 0; g < generations; g++) {
    // score every candidate: closer to the target means fitter
    const ranked = pop
      .map(v => ({ v, f: 100 - Math.abs(v - target) }))
      .sort((a, b) => b.f - a.f);

    history.push({
      best: ranked[0].f,
      values: ranked.map(r => r.v),
    });

    // elitism: the best 4 survive untouched
    const next = ranked.slice(0, 4).map(r => r.v);
    while (next.length < population) {
      const a = ranked[Math.floor(rnd() * 8)].v;
      const b = ranked[Math.floor(rnd() * 8)].v;
      let child = Math.round((a + b) / 2);
      if (rnd() < mutation) child += Math.floor(rnd() * 21) - 10;
      next.push(Math.max(0, Math.min(100, child)));
    }
    pop = next;
  }

  return { history, best: history[history.length - 1].best };
}`,
  },

  aco: {
    defaults: { ants: 14, rounds: 26, evaporation: 0.12 },
    code: `// Real JavaScript — edit it, then press Run.
// solve() must return { routes: [...], history: [...] }
function solve({ ants, rounds, evaporation }) {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // two possible routes between nest and food
  const routes = [
    { id: 'short', length: 38 },
    { id: 'long', length: 45 },
  ];

  const trail = routes.map(() => 1);
  const history = [];

  for (let r = 0; r < rounds; r++) {
    // ants pick a route in proportion to the pheromone on it
    const total = trail.reduce((s, v) => s + v, 0);
    const share = trail.map(v => v / total);
    const counts = share.map(s => Math.round(s * ants));

    // deposit: a shorter route gains more pheromone per ant
    routes.forEach((route, i) => {
      trail[i] = trail[i] * (1 - evaporation) + counts[i] / route.length;
    });

    history.push({ round: r, trail: trail.slice(), share, counts });
  }

  return { routes, history };
}`,
  },

  edf: {
    defaults: { tasks: 6 },
    code: `// Real JavaScript — edit it, then press Run.
// solve() must return { order: [...], total: number, missed: number }
function solve({ tasks }) {
  const list = [
    { name: 'T1', duration: 2, deadline: 5 },
    { name: 'T2', duration: 1, deadline: 3 },
    { name: 'T3', duration: 3, deadline: 9 },
    { name: 'T4', duration: 2, deadline: 7 },
    { name: 'T5', duration: 1, deadline: 4 },
    { name: 'T6', duration: 2, deadline: 6 },
  ].slice(0, tasks);

  // Greedy EDF: always run whatever is due soonest
  const ready = list.slice().sort((a, b) => a.deadline - b.deadline);

  let now = 0;
  let missed = 0;
  const order = [];

  for (const task of ready) {
    const start = now;
    now += task.duration;
    const late = now > task.deadline;
    if (late) missed++;
    order.push({ ...task, start, end: now, late });
  }

  return { order, total: now, missed };
}`,
  },

  topo: {
    defaults: {},
    code: `// Real JavaScript — edit it, then press Run.
// solve() must return { order: [...], edges: [[a, b], ...] }
function solve() {
  // adjacency list: each node points at the nodes that depend on it
  const graph = {
    design: ['build', 'assets'],
    assets: ['build'],
    build: ['test', 'docs'],
    test: ['deploy'],
    docs: ['deploy'],
    deploy: [],
  };

  // count how many prerequisites each node still has
  const indegree = {};
  for (const node in graph) indegree[node] = 0;
  for (const node in graph) {
    for (const next of graph[node]) indegree[next]++;
  }

  // Kahn's algorithm: emit every node with nothing left to wait for
  const queue = Object.keys(graph).filter(n => indegree[n] === 0);
  const order = [];

  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const next of graph[node]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }

  return {
    order,
    cycle: order.length !== Object.keys(graph).length,
    edges: Object.entries(graph).flatMap(([a, list]) => list.map(b => [a, b])),
  };
}`,
  },

  dp: {
    defaults: { budget: 10 },
    code: `// Real JavaScript — edit it, then press Run.
// solve() must return { table: [[...]], best: number, chosen: [...] }
function solve({ budget }) {
  // each task: what it costs and what it is worth
  const tasks = [
    { name: 'A', cost: 2, reward: 6 },
    { name: 'B', cost: 3, reward: 8 },
    { name: 'C', cost: 4, reward: 9 },
    { name: 'D', cost: 5, reward: 14 },
    { name: 'E', cost: 1, reward: 3 },
  ];

  const n = tasks.length;
  const table = Array.from({ length: n + 1 }, () => new Array(budget + 1).fill(0));

  // fill the memo table: every cell is "best gain with this budget"
  for (let i = 1; i <= n; i++) {
    for (let b = 0; b <= budget; b++) {
      const skip = table[i - 1][b];
      const task = tasks[i - 1];
      const take = task.cost <= b
        ? table[i - 1][b - task.cost] + task.reward
        : -Infinity;
      table[i][b] = Math.max(skip, take);
    }
  }

  // walk the table backwards to recover which tasks were chosen
  const chosen = [];
  let b = budget;
  for (let i = n; i > 0; i--) {
    if (table[i][b] !== table[i - 1][b]) {
      chosen.push(tasks[i - 1].name);
      b -= tasks[i - 1].cost;
    }
  }

  return { table, best: table[n][budget], chosen, tasks, budget };
}`,
  },

  dijkstra: {
    defaults: { start: 'A' },
    code: `// Real JavaScript — edit it, then press Run.
// solve() must return { dist: {...}, settled: [...], edges: [...] }
function solve({ start }) {
  // weighted graph — every edge is non-negative
  const graph = {
    A: { B: 4, C: 2 },
    B: { A: 4, D: 5 },
    C: { A: 2, D: 8 },
    D: { B: 5, C: 8, E: 3, F: 6 },
    E: { D: 3, F: 2 },
    F: { D: 6, E: 2 },
  };

  const dist = {};
  for (const node in graph) dist[node] = Infinity;
  dist[start] = 0;

  // a plain array stands in for a min-heap here
  const queue = [{ node: start, cost: 0 }];
  const settled = [];

  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const { node, cost } = queue.shift();
    if (cost > dist[node]) continue;
    settled.push(node);

    for (const [next, weight] of Object.entries(graph[node])) {
      const total = cost + weight;
      if (total < dist[next]) {
        dist[next] = total;
        queue.push({ node: next, cost: total });
      }
    }
  }

  return {
    dist,
    settled,
    edges: Object.entries(graph).flatMap(([a, list]) =>
      Object.entries(list).map(([b, w]) => [a, b, w])
    ),
  };
}`,
  },
};

// Shape checks, so a broken edit reports something useful instead of
// leaving the 3D view reading undefined.
const algoValidate = {
  ga: (r) => {
    if (!r || !Array.isArray(r.history) || !r.history.length)
      throw new Error('solve() must return { history: [...] } with at least one generation');
    if (!r.history[0].values || !r.history[0].values.length)
      throw new Error('every history entry needs a values array');
    if (typeof r.best !== 'number') throw new Error('solve() must return a numeric best');
  },
  aco: (r) => {
    if (!r || !Array.isArray(r.history) || !r.history.length)
      throw new Error('solve() must return { history: [...] } with at least one round');
    if (!Array.isArray(r.routes) || r.routes.length < 2)
      throw new Error('solve() must return at least two routes');
    if (!r.history[0].trail) throw new Error('every round needs a trail array');
  },
  edf: (r) => {
    if (!r || !Array.isArray(r.order) || !r.order.length)
      throw new Error('solve() must return { order: [...] } with at least one task');
    if (typeof r.total !== 'number') throw new Error('solve() must return a numeric total');
  },
  topo: (r) => {
    if (!r || !Array.isArray(r.order) || !r.order.length)
      throw new Error('solve() must return { order: [...] }');
    if (!Array.isArray(r.edges)) throw new Error('solve() must return edges as [[a, b], ...]');
  },
  dp: (r) => {
    if (!r || !Array.isArray(r.table) || !r.table.length)
      throw new Error('solve() must return { table: [[...]] }');
    if (typeof r.best !== 'number') throw new Error('solve() must return a numeric best');
    if (!Array.isArray(r.chosen)) throw new Error('solve() must return a chosen array');
  },
  dijkstra: (r) => {
    if (!r || typeof r.dist !== 'object' || r.dist === null)
      throw new Error('solve() must return { dist: {...} }');
    if (!Array.isArray(r.settled)) throw new Error('solve() must return a settled order');
    if (!Array.isArray(r.edges)) throw new Error('solve() must return edges as [[a, b, w], ...]');
  },
};

const vizData = {};

function runPlayground(key, source) {
  const pg = algoPlayground[key];
  if (!pg) return { ok: false, error: new Error('no playground for ' + key) };

  const src = source === undefined ? pg.code : source;
  const t0 = performance.now();

  try {
    // The edited text is compiled fresh every run, so a syntax error is
    // reported to the user rather than crashing the page.
    const solve = new Function('"use strict";\n' + src + '\nreturn solve;')();
    if (typeof solve !== 'function') {
      throw new Error('the code must define a function called solve()');
    }

    const result = solve(pg.defaults);
    algoValidate[key](result);

    const ms = Math.max(1, Math.round(performance.now() - t0));
    vizData[key] = result;
    return { ok: true, result, ms };
  } catch (err) {
    return { ok: false, error: err };
  }
}

/* ------------------------------------------------------------
   3D engine — perspective projection onto a 2D canvas.
   Everything is drawn through a depth-sorted primitive queue so
   nearer shapes cover farther ones.
------------------------------------------------------------ */
function projectPoint(p, c) {
  const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;

  const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
  const y1 = p.y * cp - z1 * sp;
  const z2 = p.y * sp + z1 * cp + c.dist;

  const zz = Math.max(0.25, z2);
  const s = c.fov / zz;
  return { x: c.cx + x1 * s, y: c.cy + y1 * s, z: zz, s };
}

function makeScene(ctx, w, h, cam) {
  const items = [];
  const P = (p) => projectPoint(p, cam);

  return {
    dot(p, r, color, alpha) {
      const q = P(p);
      items.push({ z: q.z, draw: () => {
        ctx.globalAlpha = alpha === undefined ? 1 : alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(q.x, q.y, Math.max(0.7, r * q.s), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      } });
    },

    line(a, b, color, width, alpha) {
      const qa = P(a), qb = P(b);
      items.push({ z: (qa.z + qb.z) / 2, draw: () => {
        ctx.globalAlpha = alpha === undefined ? 1 : alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(0.5, (width || 1) * ((qa.s + qb.s) / 2));
        ctx.beginPath();
        ctx.moveTo(qa.x, qa.y);
        ctx.lineTo(qb.x, qb.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } });
    },

    poly(points, fill, stroke, alpha) {
      const qs = points.map(P);
      const z = qs.reduce((s, q) => s + q.z, 0) / qs.length;
      items.push({ z, draw: () => {
        ctx.globalAlpha = alpha === undefined ? 1 : alpha;
        ctx.beginPath();
        qs.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
        ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
        ctx.globalAlpha = 1;
      } });
    },

    text(p, str, color, size) {
      const q = P(p);
      items.push({ z: q.z, draw: () => {
        ctx.fillStyle = color;
        const fs = Math.max(7, Math.min(15, (size || 10) * q.s * 0.42));
        ctx.font = fs + 'px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(str, q.x, q.y);
        ctx.textAlign = 'left';
      } });
    },

    flush() {
      items.sort((a, b) => b.z - a.z);
      for (const item of items) item.draw();
    },
  };
}

function vizCamera(w, h, clock) {
  // zoom in means a shorter camera distance, which makes everything bigger.
  // The user's drag offsets ride on top of the slow automatic rotation.
  const zoom = vizAnim && vizAnim.zoom ? vizAnim.zoom : 1;
  return {
    yaw: 0.72 + clock * 0.26 + (vizAnim ? vizAnim.yawOffset : 0),
    pitch: 0.40 + (vizAnim ? vizAnim.pitchOffset : 0),
    dist: 5.6 / zoom,
    fov: Math.min(w * 1.15, h * 2.5),
    cx: w / 2,
    cy: h * 0.58,
  };
}

function vizCtx() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = algoVizCanvas.clientWidth || 600;
  const h = 260;
  const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
  if (algoVizCanvas.width !== pw || algoVizCanvas.height !== ph) {
    algoVizCanvas.width = pw;
    algoVizCanvas.height = ph;
  }
  const ctx = algoVizCanvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function vizGrid(S, half, step, y, color, alpha) {
  for (let i = -half; i <= half + 0.001; i += step) {
    S.line({ x: -half, y, z: i }, { x: half, y, z: i }, color, 0.8, alpha);
    S.line({ x: i, y, z: -half }, { x: i, y, z: half }, color, 0.8, alpha);
  }
}

// Places graph nodes on a ring, ordered by distance from the start. Generated
// from the node list so adding or renaming a node in the code lays it out
// automatically instead of leaving it invisible.
function vizNodeLayout(names, dist) {
  const layout = {};
  const n = Math.max(1, names.length);
  const sorted = names.slice().sort((a, b) => {
    const da = dist && Number.isFinite(dist[a]) ? dist[a] : Infinity;
    const db = dist && Number.isFinite(dist[b]) ? dist[b] : Infinity;
    return da - db;
  });

  sorted.forEach((name, i) => {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
    // spread wider for bigger graphs so labels do not collide
    const r = n <= 6 ? 1.9 : 1.7 + Math.min(1.2, n * 0.06);
    layout[name] = {
      x: Math.cos(ang) * r,
      y: 0.55 + ((i % 3) - 1) * 0.5,
      z: Math.sin(ang) * r,
    };
  });

  return layout;
}

function vizTerrain(S, half, seg, height, rgb) {
  const pts = [];
  for (let i = 0; i <= seg; i++) {
    const row = [];
    for (let j = 0; j <= seg; j++) {
      const x = -half + (2 * half * i) / seg;
      const z = -half + (2 * half * j) / seg;
      row.push({ x, y: height(x, z), z });
    }
    pts.push(row);
  }

  const rgbStr = rgb || '114,246,196';
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < seg; j++) {
      const a = pts[i][j], b = pts[i + 1][j], c = pts[i + 1][j + 1], d = pts[i][j + 1];
      const avg = (a.y + b.y + c.y + d.y) / 4;
      const t = Math.max(0, Math.min(1, avg / 2.2));
      S.poly([a, b, c, d],
        'rgba(' + rgbStr + ',' + (0.04 + t * 0.30).toFixed(3) + ')',
        'rgba(' + rgbStr + ',' + (0.10 + t * 0.22).toFixed(3) + ')',
        1);
    }
  }
  return pts;
}

function vizCube(S, p, sx, sy, sz, fill, stroke) {
  const x0 = p.x - sx / 2, x1 = p.x + sx / 2;
  const z0 = p.z - sz / 2, z1 = p.z + sz / 2;
  const y0 = p.y, y1 = p.y + sy;

  S.poly([{ x: x0, y: y1, z: z0 }, { x: x1, y: y1, z: z0 },
          { x: x1, y: y1, z: z1 }, { x: x0, y: y1, z: z1 }], fill, stroke, 1);

  const sides = [
    [{ x: x0, y: y0, z: z0 }, { x: x1, y: y0, z: z0 }, { x: x1, y: y1, z: z0 }, { x: x0, y: y1, z: z0 }],
    [{ x: x1, y: y0, z: z1 }, { x: x0, y: y0, z: z1 }, { x: x0, y: y1, z: z1 }, { x: x1, y: y1, z: z1 }],
    [{ x: x0, y: y0, z: z1 }, { x: x0, y: y0, z: z0 }, { x: x0, y: y1, z: z0 }, { x: x0, y: y1, z: z1 }],
    [{ x: x1, y: y0, z: z0 }, { x: x1, y: y0, z: z1 }, { x: x1, y: y1, z: z1 }, { x: x1, y: y1, z: z0 }],
  ];
  for (const s of sides) S.poly(s, fill, stroke, 0.82);
}

function bezier(a, c, b, t) {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    z: u * u * a.z + 2 * u * t * c.z + t * t * b.z,
  };
}

const vizAccent = '#72F6C4';
const vizAccent2 = '#7B8CFF';
const vizDim = '#475569';
const vizWarn = '#fbbf24';

/* ------------------------------------------------------------
   Views — three designs per algorithm, all drawn in 3D.
   draw(scene, w, h, clock, step, data) -> status string
------------------------------------------------------------ */
const algoViews = {
  /* ---------------- GENETIC ALGORITHM ---------------- */
  ga: [
    {
      name: 'Fitness landscape', label: 'population climbing a fitness landscape', steps: (d) => d.history.length - 1,
      draw(S, w, h, clock, step, data) {
        const hist = data.history;
        const gen = Math.min(step, hist.length - 1);
        const prog = hist.length > 1 ? gen / (hist.length - 1) : 1;

        const peak = (x, z) =>
          1.9 * Math.exp(-(x * x + z * z) * 1.05) +
          0.18 * Math.sin(x * 2.2) * Math.cos(z * 2.2) + 0.25;

        vizTerrain(S, 2.6, 15, peak);
        vizGrid(S, 2.6, 0.65, 0, 'rgba(255,255,255,.055)', 1);

        const values = hist[gen].values;
        const n = Math.min(values.length, 16);
        for (let i = 0; i < n; i++) {
          const ang = (i / n) * Math.PI * 2 + clock * 0.45;
          const spread = (1 - prog) * 2.1 + 0.22;
          const x = Math.cos(ang) * spread;
          const z = Math.sin(ang) * spread;
          const y = peak(x, z) + 0.07;
          const elite = i < 3;
          S.dot({ x, y, z }, elite ? 0.08 : 0.05, elite ? vizAccent : vizAccent2, elite ? 1 : 0.75);
        }
        return 'generation ' + gen + ' — best fitness ' + hist[gen].best.toFixed(0);
      },
    },
    {
      name: 'Population bars', label: 'every candidate as a 3D bar, elite in front', steps: (d) => d.history.length - 1,
      draw(S, w, h, clock, step, data) {
        const hist = data.history;
        const gen = Math.min(step, hist.length - 1);
        const values = hist[gen].values.slice(0, 18);
        const max = Math.max.apply(null, values.concat([1]));

        vizGrid(S, 2.5, 0.85, 0, 'rgba(255,255,255,.05)', 1);

        values.forEach((v, i) => {
          const x = -2.1 + (i / Math.max(1, values.length - 1)) * 4.2;
          const hgt = Math.max(0.04, (v / max) * 2.4);
          const elite = i < 4;
          vizCube(S, { x, y: 0, z: 0 }, 0.17, hgt, 0.17,
            elite ? 'rgba(114,246,196,.8)' : 'rgba(123,140,255,.35)',
            elite ? 'rgba(114,246,196,.95)' : 'rgba(123,140,255,.55)');
        });
        return 'generation ' + gen + ' — spread ' + (max - Math.min.apply(null, values));
      },
    },
    {
      name: 'Chromosome helix', label: 'two gene strands, mutated each generation', steps: (d) => d.history.length - 1,
      draw(S, w, h, clock, step, data) {
        const hist = data.history;
        const gen = Math.min(step, hist.length - 1);
        const prog = hist.length > 1 ? gen / (hist.length - 1) : 1;

        // The strand is the actual population for this generation: each
        // candidate is a gene, and its height is its real value.
        const values = hist[gen].values.slice(0, 24);
        const max = Math.max.apply(null, values.concat([1])) || 1;
        const N = Math.max(2, values.length);

        for (let i = 0; i < N; i++) {
          const t = i / (N - 1);
          const ang = t * Math.PI * 4.2 + clock * 0.7;
          const y = -1.4 + t * 2.9;
          const r = 0.75;
          const a = { x: Math.cos(ang) * r, y, z: Math.sin(ang) * r };
          const b = { x: Math.cos(ang + Math.PI) * r, y, z: Math.sin(ang + Math.PI) * r };
          const v = values[i] / max;

          // the bar between the strands is the gene's value
          S.dot(a, 0.035 + v * 0.055, vizAccent, 0.55 + v * 0.45);
          S.dot(b, 0.035 + v * 0.055, vizAccent2, 0.55 + v * 0.45);
          if (i % 2 === 0) S.line(a, b, 'rgba(255,255,255,.13)', 0.7, 0.4 + v * 0.6);
        }
        return 'generation ' + gen + ' — best ' + hist[gen].best.toFixed(0) + ', spread ' + (1 - prog).toFixed(2);
      },
    },
  ],

  /* ---------------- ANT COLONY ---------------- */
  aco: [
    {
      name: 'Pheromone trails', label: 'two routes over 3D ground, pheromone thickening', steps: (d) => d.history.length - 1,
      draw(S, w, h, clock, step, data) {
        const hist = data.history;
        const r = Math.min(step, hist.length - 1);
        const rec = hist[r];
        const total = rec.trail.reduce((s, v) => s + v, 0) || 1;
        const shortShare = rec.trail[0] / total;

        vizTerrain(S, 2.5, 12, (x, z) =>
          0.32 * Math.sin(x * 1.5) * Math.cos(z * 1.5) + 0.3, '123,140,255');

        const nest = { x: -2.1, y: 0.5, z: 0 };
        const food = { x: 2.1, y: 0.5, z: 0 };

        const routes = [
          { ctrl: { x: 0, y: 1.7, z: -1.7 }, w: shortShare, color: vizAccent },
          { ctrl: { x: 0, y: 1.0, z: 2.0 }, w: 1 - shortShare, color: vizDim },
        ];

        routes.forEach((route) => {
          const N = 28;
          let prev = null;
          for (let i = 0; i <= N; i++) {
            const p = bezier(nest, route.ctrl, food, i / N);
            if (prev) {
              S.line(prev, p, route.color, 0.5 + route.w * 6, 0.2 + route.w * 0.8);
            }
            prev = p;
          }

          const count = Math.round(route.w * 12);
          for (let i = 0; i < count; i++) {
            const t = (clock * 0.3 + i / Math.max(1, count)) % 1;
            S.dot(bezier(nest, route.ctrl, food, t), 0.045, route.color, 1);
          }
        });

        S.dot(nest, 0.11, vizAccent, 1);
        S.dot(food, 0.11, vizWarn, 1);
        return 'round ' + r + ' — short route holds ' + Math.round(shortShare * 100) + '% of the pheromone';
      },
    },
    {
      name: 'City graph', label: 'cities as nodes, pheromone as edge thickness', steps: (d) => d.history.length - 1,
      draw(S, w, h, clock, step, data) {
        const hist = data.history;
        const r = Math.min(step, hist.length - 1);
        const rec = hist[r];
        const total = rec.trail.reduce((s, v) => s + v, 0) || 1;

        // Routes come from the code's own return value. Add a third route to
        // solve() and it appears here without touching this drawing code.
        const routes = data.routes && data.routes.length ? data.routes : [{ id: 'short', length: 38 }];
        const n = routes.length;

        vizGrid(S, 2.6, 0.9, -0.4, 'rgba(255,255,255,.045)', 1);
        S.line({ x: -2.2, y: 0.25, z: 0 }, { x: 2.2, y: 0.25, z: 0 }, vizDim, 1, 0.35);

        routes.forEach((route, i) => {
          const share = rec.trail[i] / total;
          const z = n === 1 ? 0 : -1.5 + (i / (n - 1)) * 3.0;
          // longer routes bow further out, straight from route.length
          const bow = 0.35 + (route.length / 60) * 1.1;
          const mid = { x: 0, y: 0.5 + bow, z };

          let prev = null;
          const N = 26;
          for (let k = 0; k <= N; k++) {
            const p = bezier(
              { x: -2.1, y: 0.4, z }, mid, { x: 2.1, y: 0.4, z }, k / N);
            if (prev) S.line(prev, p, share > 0.34 ? vizAccent : vizAccent2, 0.5 + share * 7, 0.2 + share * 0.8);
            prev = p;
          }

          S.dot({ x: -2.1, y: 0.4, z }, 0.09, vizAccent, 1);
          S.dot({ x: 2.1, y: 0.4, z }, 0.09, vizWarn, 1);
          S.text({ x: 0, y: 0.5 + bow + 0.4, z }, route.id + ' ' + route.length,
            share > 0.34 ? vizAccent : vizAccent2, 10);
        });

        const parts = routes.map((route, i) =>
          route.id + ' ' + Math.round((rec.trail[i] / total) * 100) + '%');
        return 'round ' + r + ' — ' + parts.join('  ');
      },
    },
    {
      name: 'Convergence ribbon', label: 'pheromone share over rounds, as a 3D ribbon', steps: (d) => d.history.length - 1,
      draw(S, w, h, clock, step, data) {
        const hist = data.history;
        const r = Math.min(step, hist.length - 1);

        vizGrid(S, 2.4, 0.8, 0, 'rgba(255,255,255,.05)', 1);

        const pts = hist.map((rec, i) => {
          const total = rec.trail.reduce((s, v) => s + v, 0) || 1;
          const share = rec.trail[0] / total;
          const x = -2.2 + (i / Math.max(1, hist.length - 1)) * 4.4;
          return { x, y: share * 2.2, z: 0, share };
        });

        for (let i = 1; i < pts.length; i++) {
          const live = i <= r;
          S.line(pts[i - 1], pts[i], live ? vizAccent : vizDim, live ? 2.6 : 1, live ? 1 : 0.28);
        }

        pts.forEach((p, i) => {
          if (i > r) return;
          S.dot(p, i === r ? 0.1 : 0.045, i === r ? vizWarn : vizAccent, 1);
        });
        return 'round ' + r + ' — short-route share ' + Math.round(pts[r].share * 100) + '%';
      },
    },
  ],

  /* ---------------- EDF ---------------- */
  edf: [
    {
      name: 'Time axis', label: 'tasks laid along a 3D time axis', steps: (d) => d.total,
      draw(S, w, h, clock, step, data) {
        const order = data.order;
        const unit = 4.4 / Math.max(1, data.total);
        const now = Math.min(step, data.total);

        vizGrid(S, 2.4, 0.8, 0, 'rgba(255,255,255,.045)', 1);
        S.line({ x: -2.2, y: 0.02, z: 0 }, { x: 2.2, y: 0.02, z: 0 }, vizDim, 1.2, 0.7);

        order.forEach((task) => {
          const x = -2.2 + task.start * unit;
          const width = Math.max(0.05, task.duration * unit);
          const done = now > task.start;
          const fill = task.late ? 'rgba(248,113,113,.55)'
            : done ? 'rgba(114,246,196,.7)' : 'rgba(123,140,255,.28)';
          const stroke = task.late ? 'rgba(248,113,113,.9)'
            : done ? 'rgba(114,246,196,.95)' : 'rgba(123,140,255,.5)';

          vizCube(S, { x, y: 0, z: 0 }, width * 0.92, 0.34, 0.34, fill, stroke);

          // deadline marker behind the block
          const dx = -2.2 + task.deadline * unit;
          S.line({ x: dx, y: 0, z: -0.45 }, { x: dx, y: 0.62, z: -0.45 }, vizDim, 1, 0.55);
        });

        // moving time cursor
        const cx = -2.2 + now * unit;
        S.line({ x: cx, y: 0, z: -0.55 }, { x: cx, y: 0.8, z: -0.55 }, vizWarn, 2, 0.95);

        return 't=' + now + '/' + data.total + ' — ' + data.missed + ' missed deadline' + (data.missed === 1 ? '' : 's');
      },
    },
    {
      name: 'Deadline towers', label: 'each task as a tower, height is duration', steps: (d) => d.total,
      draw(S, w, h, clock, step, data) {
        const order = data.order;
        const now = Math.min(step, data.total);

        vizGrid(S, 2.5, 0.85, 0, 'rgba(255,255,255,.05)', 1);

        order.forEach((task, i) => {
          const x = -2.0 + (i / Math.max(1, order.length - 1)) * 4.0;
          const done = now > task.start;
          const hgt = 0.3 + task.duration * 0.45;

          vizCube(S, { x, y: 0, z: 0 }, 0.34, hgt, 0.34,
            task.late ? 'rgba(248,113,113,.55)' : done ? 'rgba(114,246,196,.7)' : 'rgba(123,140,255,.3)',
            task.late ? 'rgba(248,113,113,.9)' : done ? 'rgba(114,246,196,.95)' : 'rgba(123,140,255,.55)');

          S.text({ x, y: hgt + 0.28, z: 0 }, task.name, done ? vizAccent : vizDim, 11);
        });
        return 'deadline order — ' + order.map(t => t.name).join(' → ');
      },
    },
    {
      name: 'Clock dial', label: 'the schedule wrapped around a 3D dial', steps: (d) => d.total,
      draw(S, w, h, clock, step, data) {
        const order = data.order;
        const now = Math.min(step, data.total);
        const R = 1.9;

        // dial ring
        for (let i = 0; i < 64; i++) {
          const a1 = (i / 64) * Math.PI * 2;
          const a2 = ((i + 1) / 64) * Math.PI * 2;
          S.line(
            { x: Math.cos(a1) * R, y: 0, z: Math.sin(a1) * R },
            { x: Math.cos(a2) * R, y: 0, z: Math.sin(a2) * R },
            'rgba(255,255,255,.10)', 1, 1);
        }

        order.forEach((task, i) => {
          const a1 = ((task.start / data.total) * Math.PI * 2) - Math.PI / 2;
          const a2 = ((task.end / data.total) * Math.PI * 2) - Math.PI / 2;
          const done = now > task.start;
          const mid = (a1 + a2) / 2;

          for (let k = 0; k < 6; k++) {
            const t1 = a1 + ((a2 - a1) * k) / 6;
            const t2 = a1 + ((a2 - a1) * (k + 1)) / 6;
            S.line(
              { x: Math.cos(t1) * R, y: 0.12, z: Math.sin(t1) * R },
              { x: Math.cos(t2) * R, y: 0.12, z: Math.sin(t2) * R },
              task.late ? '#f87171' : done ? vizAccent : vizAccent2,
              5, done ? 0.95 : 0.3);
          }

          S.text({ x: Math.cos(mid) * (R + 0.42), y: 0.1, z: Math.sin(mid) * (R + 0.42) },
            task.name, done ? vizAccent : vizDim, 10);
        });

        // hand
        const ang = (now / data.total) * Math.PI * 2 - Math.PI / 2;
        S.line({ x: 0, y: 0.2, z: 0 },
          { x: Math.cos(ang) * R, y: 0.2, z: Math.sin(ang) * R }, vizWarn, 2.4, 1);
        S.dot({ x: 0, y: 0.2, z: 0 }, 0.09, vizWarn, 1);

        return 'dial t=' + now + '/' + data.total;
      },
    },
  ],

  /* ---------------- TOPOLOGICAL SORT ---------------- */
  topo: [
    {
      name: 'Layered DAG', label: 'dependencies peeled layer by layer', steps: (d) => d.order.length - 1,
      draw(S, w, h, clock, step, data) {
        const order = data.order;
        const emitted = Math.min(step + 1, order.length);

        // depth of each node = its position in the emitted order
        const depth = {};
        order.forEach((n, i) => (depth[n] = i));

        const posOf = (name) => {
          const d = depth[name];
          const ang = (d / Math.max(1, order.length)) * Math.PI * 1.6 - 0.8;
          const r = 1.5;
          return { x: Math.cos(ang) * r, y: 0.35 + (d % 3) * 0.5, z: Math.sin(ang) * r - d * 0.22 };
        };

        data.edges.forEach(([a, b]) => {
          const live = depth[a] < emitted;
          S.line(posOf(a), posOf(b), live ? vizAccent : vizDim, live ? 2 : 1, live ? 0.85 : 0.22);
        });

        order.forEach((name, i) => {
          const p = posOf(name);
          const out = i < emitted;
          S.dot(p, out ? 0.13 : 0.09, out ? vizAccent : vizDim, out ? 1 : 0.45);
          S.text({ x: p.x, y: p.y + 0.3, z: p.z }, name, out ? vizAccent : vizDim, 10);
        });

        return emitted + '/' + order.length + ' — ' + order.slice(0, emitted).join(' → ');
      },
    },
    {
      name: 'Free DAG', label: 'the same graph rotating freely in space', steps: (d) => d.order.length - 1,
      draw(S, w, h, clock, step, data) {
        const order = data.order;
        const emitted = Math.min(step + 1, order.length);
        const depth = {};
        order.forEach((n, i) => (depth[n] = i));

        const posOf = (name) => {
          const i = depth[name];
          const ang = (i / order.length) * Math.PI * 2;
          const r = 1.7;
          return { x: Math.cos(ang) * r, y: 0.4 + (i % 2) * 1.0, z: Math.sin(ang) * r };
        };

        vizGrid(S, 2.6, 0.9, 0, 'rgba(255,255,255,.045)', 1);

        data.edges.forEach(([a, b]) => {
          const live = depth[a] < emitted;
          S.line(posOf(a), posOf(b), live ? vizAccent : vizDim, live ? 2.2 : 1, live ? 0.9 : 0.25);
        });

        order.forEach((name, i) => {
          const p = posOf(name);
          const out = i < emitted;
          S.dot(p, out ? 0.14 : 0.09, out ? vizAccent : vizDim, 1);
          S.text({ x: p.x, y: p.y + 0.32, z: p.z }, name, out ? vizAccent : vizDim, 10);
        });

        return 'emitted ' + emitted + ' of ' + order.length;
      },
    },
    {
      name: 'Cascade', label: 'nodes dropping into execution order', steps: (d) => d.order.length - 1,
      draw(S, w, h, clock, step, data) {
        const order = data.order;
        const emitted = Math.min(step + 1, order.length);

        vizGrid(S, 2.4, 0.8, 0, 'rgba(255,255,255,.045)', 1);

        order.forEach((name, i) => {
          const y = 0.25 + i * 0.42;
          const settled = i < emitted;
          const drop = settled ? 0 : Math.max(0, 1 - (i - emitted) * 0.18);

          vizCube(S, { x: -1.9, y: y - (settled ? 0 : drop * 0.4), z: 0 },
            1.1, 0.26, 0.26,
            settled ? 'rgba(114,246,196,.6)' : 'rgba(123,140,255,.2)',
            settled ? 'rgba(114,246,196,.9)' : 'rgba(123,140,255,.35)');

          S.text({ x: -1.2, y: y + 0.13, z: 0 }, name, settled ? vizAccent : vizDim, 10);
        });

        return 'order — ' + order.slice(0, emitted).join(' → ');
      },
    },
  ],

  /* ---------------- DYNAMIC PROGRAMMING ---------------- */
  dp: [
    {
      name: 'Memo grid', label: 'the memo table filling one cube at a time', steps: (d) => d.table.length * d.table[0].length - 1,
      draw(S, w, h, clock, step, data) {
        const table = data.table;
        const rows = table.length;
        const cols = table[0].length;
        const max = Math.max(1, data.best);
        const total = rows * cols;
        const filled = Math.min(step + 1, total);

        const cw = 3.4 / cols, cd = 2.2 / rows;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const on = idx < filled;
            const v = table[r][c];
            const hgt = on ? 0.08 + (v / max) * 0.75 : 0.03;

            vizCube(S,
              { x: -1.7 + c * cw, y: 0, z: -1.1 + r * cd },
              cw * 0.82, hgt, cd * 0.82,
              on ? 'rgba(114,246,196,' + (0.18 + (v / max) * 0.55).toFixed(2) + ')' : 'rgba(123,140,255,.10)',
              on ? 'rgba(114,246,196,.55)' : 'rgba(123,140,255,.22)');
          }
        }
        return filled + '/' + total + ' subproblems solved — best ' + data.best;
      },
    },
    {
      name: 'Value surface', label: 'memo values as a 3D surface', steps: (d) => d.table.length * d.table[0].length - 1,
      draw(S, w, h, clock, step, data) {
        const table = data.table;
        const rows = table.length;
        const cols = table[0].length;
        const max = Math.max(1, data.best);
        const filled = Math.min(step + 1, rows * cols);

        const height = (x, z) => {
          const c = Math.round(((x + 1.7) / 3.4) * (cols - 1));
          const r = Math.round(((z + 1.1) / 2.2) * (rows - 1));
          if (r < 0 || c < 0 || r >= rows || c >= cols) return 0;
          if (r * cols + c >= filled) return 0.05;
          return 0.12 + (table[r][c] / max) * 1.9;
        };

        vizTerrain(S, 1.9, 16, height);
        return 'memo values rendered as height — best ' + data.best;
      },
    },
    {
      name: 'Chosen path', label: 'the optimal walk back through the table', steps: (d) => d.table.length * d.table[0].length - 1,
      draw(S, w, h, clock, step, data) {
        const table = data.table;
        const rows = table.length;
        const cols = table[0].length;
        const max = Math.max(1, data.best);
        const cw = 3.4 / cols, cd = 2.2 / rows;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const v = table[r][c];
            vizCube(S, { x: -1.7 + c * cw, y: 0, z: -1.1 + r * cd },
              cw * 0.78, 0.06 + (v / max) * 0.6, cd * 0.78,
              'rgba(123,140,255,' + (0.08 + (v / max) * 0.3).toFixed(2) + ')',
              'rgba(123,140,255,.28)');
          }
        }

        // walk from the far corner back toward the origin
        let b = data.budget;
        let r = rows - 1;
        const path = [];
        while (r > 0) {
          path.push({ x: -1.7 + b * cw, y: 0.9, z: -1.1 + r * cd });
          if (table[r][b] !== table[r - 1][b]) {
            const cost = data.tasks && data.tasks[r - 1] ? data.tasks[r - 1].cost : 1;
            b = Math.max(0, b - cost);
          }
          r--;
        }
        path.push({ x: -1.7 + b * cw, y: 0.9, z: -1.1 });

        for (let i = 1; i < path.length; i++) {
          S.line(path[i - 1], path[i], vizWarn, 3, 1);
        }
        path.forEach(p => S.dot(p, 0.09, vizWarn, 1));

        return 'chosen: ' + (data.chosen.join(', ') || 'none') + ' — reward ' + data.best;
      },
    },
  ],

  /* ---------------- DIJKSTRA ---------------- */
  dijkstra: [
    {
      name: 'Graph wavefront', label: 'settled nodes spreading from the start', steps: (d) => d.settled.length - 1,
      draw(S, w, h, clock, step, data) {
        const names = Object.keys(data.dist);
        const settledCount = Math.min(step + 1, data.settled.length);
        const settled = new Set(data.settled.slice(0, settledCount));

        // Positions are generated from the node list, so editing the graph in
        // the code (adding a node, renaming one) lays the new nodes out
        // automatically instead of leaving them invisible.
        const layout = vizNodeLayout(names, data.dist);

        vizGrid(S, 2.6, 0.9, -0.2, 'rgba(255,255,255,.045)', 1);

        data.edges.forEach(([a, b, w]) => {
          if (!layout[a] || !layout[b]) return;
          const live = settled.has(a) && settled.has(b);
          S.line(layout[a], layout[b], live ? vizAccent : vizDim, live ? 2.2 : 1, live ? 0.9 : 0.24);
          if (live) {
            S.text({
              x: (layout[a].x + layout[b].x) / 2,
              y: (layout[a].y + layout[b].y) / 2 + 0.18,
              z: (layout[a].z + layout[b].z) / 2,
            }, String(w), vizAccent, 9);
          }
        });

        names.forEach((n) => {
          if (!layout[n]) return;
          const out = settled.has(n);
          S.dot(layout[n], out ? 0.14 : 0.09, out ? vizAccent : vizDim, out ? 1 : 0.5);
          S.text({ x: layout[n].x, y: layout[n].y + 0.34, z: layout[n].z }, n, out ? vizAccent : vizDim, 11);
        });

        return 'settled ' + settledCount + '/' + names.length + ' — ' + data.settled.slice(0, settledCount).join(' → ');
      },
    },
    {
      name: 'Cost terrain', label: 'distance as height over a 3D surface', steps: (d) => d.settled.length - 1,
      draw(S, w, h, clock, step, data) {
        const names = Object.keys(data.dist);
        const max = Math.max.apply(null, names.map(n => data.dist[n]).filter(Number.isFinite).concat([1]));

        const height = (x, z) => {
          let acc = 0;
          names.forEach((n, i) => {
            const d = data.dist[n];
            if (!Number.isFinite(d)) return;
            const nx = Math.cos((i / names.length) * Math.PI * 2) * 1.3;
            const nz = Math.sin((i / names.length) * Math.PI * 2) * 1.3;
            const dist2 = (x - nx) * (x - nx) + (z - nz) * (z - nz);
            acc += (d / max) * Math.exp(-dist2 * 1.6);
          });
          return 0.15 + acc * 0.9;
        };

        vizTerrain(S, 2.3, 16, height);

        const settledCount = Math.min(step + 1, data.settled.length);
        data.settled.slice(0, settledCount).forEach((n, i) => {
          const ang = (i / names.length) * Math.PI * 2;
          S.dot({ x: Math.cos(ang) * 1.3, y: height(Math.cos(ang) * 1.3, Math.sin(ang) * 1.3) + 0.12, z: Math.sin(ang) * 1.3 },
            0.09, vizAccent, 1);
        });

        return 'cost surface — max distance ' + max;
      },
    },
    {
      name: 'Expanding rings', label: 'the frontier expanding outward in 3D', steps: (d) => d.settled.length - 1,
      draw(S, w, h, clock, step, data) {
        const names = Object.keys(data.dist);
        const max = Math.max.apply(null, names.map(n => data.dist[n]).filter(Number.isFinite).concat([1]));
        const settledCount = Math.min(step + 1, data.settled.length);

        for (let ring = 0; ring < 4; ring++) {
          const radius = 0.5 + ring * 0.55;
          const alpha = Math.max(0.06, 0.5 - ring * 0.11);
          for (let i = 0; i < 40; i++) {
            const a1 = (i / 40) * Math.PI * 2;
            const a2 = ((i + 1) / 40) * Math.PI * 2;
            S.line(
              { x: Math.cos(a1) * radius, y: 0.05 + ring * 0.1, z: Math.sin(a1) * radius },
              { x: Math.cos(a2) * radius, y: 0.05 + ring * 0.1, z: Math.sin(a2) * radius },
              vizAccent, 1.6, alpha);
          }
        }

        names.forEach((n, i) => {
          const d = data.dist[n];
          if (!Number.isFinite(d)) return;
          const ang = (i / names.length) * Math.PI * 2 + clock * 0.12;
          const r = 0.6 + (d / max) * 1.9;
          const out = i < settledCount;
          S.dot({ x: Math.cos(ang) * r, y: 0.1 + (d / max) * 0.9, z: Math.sin(ang) * r },
            out ? 0.1 : 0.06, out ? vizAccent : vizDim, out ? 1 : 0.45);
          S.text({ x: Math.cos(ang) * (r + 0.25), y: 0.1 + (d / max) * 0.9, z: Math.sin(ang) * (r + 0.25) },
            n, out ? vizAccent : vizDim, 10);
        });

        return 'rings of equal distance — ' + settledCount + '/' + names.length + ' settled';
      },
    },
  ],
};

/* ------------------------------------------------------------
   Animation loop — one requestAnimationFrame, speed-scaled clock.
------------------------------------------------------------ */
const algoVizCanvas = document.getElementById('amodal-canvas');
const algoVizStatus = document.getElementById('amodal-viz-status');
const algoVizLabel  = document.getElementById('amodal-viz-label');
const algoVizReplay = document.getElementById('amodal-viz-replay');
const algoDesigns   = document.getElementById('amodal-designs');
const algoSpeed     = document.getElementById('amodal-speed');
const algoSpeedVal  = document.getElementById('amodal-speedval');
const algoPause     = document.getElementById('amodal-pause');
const algoZoomIn    = document.getElementById('amodal-zoom-in');
const algoZoomOut   = document.getElementById('amodal-zoom-out');
const algoZoomFit   = document.getElementById('amodal-zoom-fit');
const algoZoomVal   = document.getElementById('amodal-zoomval');
const algoStepCount = document.getElementById('amodal-stepcount');
const algoStepTitle = document.getElementById('amodal-steptitle');
const algoStepBody  = document.getElementById('amodal-stepbody');
const algoStepPrev  = document.getElementById('amodal-step-prev');
const algoStepNext  = document.getElementById('amodal-step-next');
const algoStepList  = document.getElementById('amodal-steplist');

const VIZ_STEP_SECONDS = 0.35;

const vizAnim = {
  key: null, view: 0, clock: 0, speed: 0.5,
  paused: false, last: 0, raf: null,
  // Camera the user controls. zoom multiplies the camera distance:
  // smaller distance means closer, so zoom > 1 shows more of the design.
  zoom: 1, yawOffset: 0, pitchOffset: 0,
};

const VIZ_ZOOM_MIN = 0.35;
const VIZ_ZOOM_MAX = 4;

function setZoom(z) {
  // A wheel/touch event with a missing value would put NaN into the camera
  // distance and blank the canvas, so reject it and keep the current zoom.
  if (!Number.isFinite(z)) return;
  vizAnim.zoom = Math.min(VIZ_ZOOM_MAX, Math.max(VIZ_ZOOM_MIN, z));
  if (algoZoomVal) algoZoomVal.textContent = Math.round(vizAnim.zoom * 100) + '%';
  drawVizFrame();
}

function resetCamera() {
  vizAnim.zoom = 1;
  vizAnim.yawOffset = 0;
  vizAnim.pitchOffset = 0;
  if (algoZoomVal) algoZoomVal.textContent = '100%';
  drawVizFrame();
}

function renderDesignButtons(key) {
  if (!algoDesigns) return;
  const views = algoViews[key] || [];
  algoDesigns.textContent = '';
  views.forEach((view, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'amodal-design' + (i === vizAnim.view ? ' is-active' : '');
    btn.textContent = view.name;
    btn.setAttribute('aria-pressed', String(i === vizAnim.view));
    btn.addEventListener('click', () => {
      vizAnim.view = i;
      vizAnim.clock = 0;
      buildStepList(key);
      renderDesignButtons(key);
    });
    algoDesigns.appendChild(btn);
  });
}

// A design's step count comes from the code's own result, so editing the code
// (more generations, more rounds, a bigger budget) extends the animation
// instead of being cut off at a fixed number.
function viewSteps(view, data) {
  if (typeof view.steps === 'function') {
    try {
      const n = Math.floor(view.steps(data));
      return Number.isFinite(n) ? Math.max(1, n) : 1;
    } catch (err) {
      return 1;
    }
  }
  return Math.max(1, view.steps || 1);
}

/* ------------------------------------------------------------
   Step-by-step explanation.
   Every design returns a status string describing the current
   step; we pair it with a sentence explaining what that number
   means for this algorithm, so each move of the animation is
   both visible and explained.
------------------------------------------------------------ */
function stepExplanation(key, step, total, data, status) {
  const last = Math.max(1, total);
  const pct = Math.round((step / Math.max(1, last)) * 100);

  switch (key) {
    case 'ga': {
      const hist = data && data.history ? data.history : [];
      const gen = Math.min(step, hist.length - 1);
      const rec = hist[gen] || { best: 0, values: [] };
      const first = hist[0] ? hist[0].best : rec.best;
      const gain = Math.round(rec.best - first);
      return {
        title: 'Generation ' + gen + ' of ' + (hist.length - 1),
        body: 'The population is scored, the best few are copied forward untouched (elitism), '
          + 'and the rest breed from the top 8 performers by averaging two parents. '
          + 'Best fitness is ' + Math.round(rec.best) + ', up ' + gain + ' from the first generation ('
          + Math.round(first) + '). A number closer to the target scores higher, so the climb '
          + 'is the search converging.',
      };
    }
    case 'aco': {
      const hist = data && data.history ? data.history : [];
      const r = Math.min(step, hist.length - 1);
      const rec = hist[r] || { trail: [1, 1] };
      const sum = rec.trail.reduce((s, v) => s + v, 0) || 1;
      const share = Math.round((rec.trail[0] / sum) * 100);
      return {
        title: 'Round ' + r + ' of ' + (hist.length - 1),
        body: 'Every round all pheromone evaporates a little, then ants deposit more on the routes '
          + 'they walked — and a shorter route collects more deposit per ant. The short route now holds '
          + share + '% of the trail, so ants pick it more often next round. That feedback loop is why '
          + 'the colony converges without any ant seeing the whole map.',
      };
    }
    case 'edf': {
      const order = data && data.order ? data.order : [];
      const done = order.filter(t => step >= t.end);
      const late = order.filter(t => t.late && step >= t.end);
      const current = order.find(t => step >= t.start && step < t.end);
      return {
        title: 't = ' + Math.min(step, data.total) + ' of ' + data.total,
        body: 'Tasks run in deadline order — whichever is due soonest goes first. So far ' + done.length
          + ' of ' + order.length + ' tasks finished'
          + (current ? ', now running ' + current.name : '')
          + (late.length ? ', and ' + late.length + ' missed their deadline (' + late.map(t => t.name).join(', ') + ')'
            : ', none late so far')
          + '. EDF is optimal for unit-length tasks: any scheduler that finishes more of them would contradict this order.',
      };
    }
    case 'topo': {
      const order = data && data.order ? data.order : [];
      const emitted = Math.min(step + 1, order.length);
      const node = order[Math.min(step, order.length - 1)];
      return {
        title: 'Emitting node ' + emitted + ' of ' + order.length,
        body: 'Kahn\'s algorithm only emits a node once every prerequisite has been emitted, so '
          + '"' + node + '" is safe to start now. Its dependents lose one requirement each; the ones '
          + 'that reach zero join the ready queue. If the queue empties before every node is out, the '
          + 'graph contains a cycle and no valid order exists.',
      };
    }
    case 'dp': {
      const table = data && data.table ? data.table : [[0]];
      const rows = table.length;
      const cols = table[0].length;
      const filled = Math.min(step + 1, rows * cols);
      const row = Math.floor((filled - 1) / cols);
      const col = (filled - 1) % cols;
      return {
        title: 'Filling cell ' + filled + ' of ' + (rows * cols),
        body: 'Each cell asks one question: with the first ' + row + ' tasks and a budget of ' + col
          + ', what is the best reward? It is the better of skipping task ' + row
          + ' (the cell above) or taking it (this task\'s reward plus the cell from the earlier budget). '
          + 'Because every answer is stored, the same subproblem is never solved twice — best so far is '
          + data.best + '.',
      };
    }
    case 'dijkstra': {
      const settled = data && data.settled ? data.settled : [];
      const names = data && data.dist ? Object.keys(data.dist) : [];
      const count = Math.min(step + 1, settled.length);
      const node = settled[count - 1];
      const d = data.dist ? data.dist[node] : 0;
      return {
        title: 'Settling ' + count + ' of ' + names.length + ' nodes',
        body: 'The min-heap pops the cheapest known node, and because all edge weights are '
          + 'non-negative that node\'s distance is final the moment it pops — nothing found later can be '
          + 'shorter. "' + node + '" is settled at distance ' + d + '. Its neighbours now relax: '
          + 'each one keeps whichever is smaller, its current best or this distance plus the edge weight.',
      };
    }
    default:
      return { title: 'Step ' + step + ' of ' + last, body: status || '' };
  }
}

function renderStepPanel(step, total) {
  if (!algoStepBody) return;
  const key = vizAnim.key;
  const data = vizData[key];
  const info = stepExplanation(key, step, total, data, '');
  const shown = Math.min(step, total);

  algoStepCount.textContent = 'step ' + shown + ' / ' + total;
  algoStepTitle.textContent = info.title;
  algoStepBody.textContent = info.body;

  if (algoStepPrev) algoStepPrev.disabled = false;
  if (algoStepNext) algoStepNext.disabled = false;

  // highlight the current entry in the full step list
  if (algoStepList && algoStepList.children.length) {
    const kids = algoStepList.children;
    if (vizAnim.listStep !== shown) {
      if (kids[vizAnim.listStep]) kids[vizAnim.listStep].classList.remove('is-current');
      if (kids[shown]) {
        kids[shown].classList.add('is-current');
        kids[shown].scrollIntoView({ block: 'nearest' });
      }
      vizAnim.listStep = shown;
    }
  }
}

function buildStepList(total) {
  if (!algoStepList) return;
  algoStepList.textContent = '';
  const key = vizAnim.key;
  const data = vizData[key];
  // the list would be enormous for DP, so cap it and keep it readable
  const shown = Math.min(total, 80);
  for (let i = 0; i <= shown; i++) {
    const li = document.createElement('li');
    li.className = 'amodal-stepitem';
    const info = stepExplanation(key, i, total, data, '');
    li.textContent = info.title;
    li.title = info.body;
    li.addEventListener('click', () => {
      vizAnim.clock = i * VIZ_STEP_SECONDS;
      vizAnim.paused = true;
      updatePauseButton();
      drawVizFrame();
    });
    algoStepList.appendChild(li);
  }
  vizAnim.listStep = -1;
}

function stepBy(delta) {
  const key = vizAnim.key;
  const views = algoViews[key];
  if (!views) return;
  const data = vizData[key];
  const view = views[Math.min(vizAnim.view, views.length - 1)];
  const total = viewSteps(view, data);
  const current = Math.floor(vizAnim.clock / VIZ_STEP_SECONDS) % (total + 1);
  let next = current + delta;
  if (next < 0) next = total;
  if (next > total) next = 0;
  vizAnim.clock = next * VIZ_STEP_SECONDS;
  vizAnim.paused = true;
  updatePauseButton();
  drawVizFrame();
}

function drawVizFrame() {
  const key = vizAnim.key;
  const views = algoViews[key];
  if (!views) return;

  const view = views[Math.min(vizAnim.view, views.length - 1)];
  const data = vizData[key];
  if (!data) return;

  const { ctx, w, h } = vizCtx();
  const totalSteps = viewSteps(view, data);
  const step = Math.floor(vizAnim.clock / VIZ_STEP_SECONDS) % (totalSteps + 1);
  const cam = vizCamera(w, h, vizAnim.clock);

  ctx.clearRect(0, 0, w, h);
  const S = makeScene(ctx, w, h, cam);

  let status = '';
  try {
    status = view.draw(S, w, h, vizAnim.clock, step, data) || '';
  } catch (err) {
    status = 'view error: ' + err.message;
  }
  S.flush();

  algoVizStatus.textContent = status;
  algoVizLabel.textContent = view.label;
  renderStepPanel(step, totalSteps);
}

function vizLoop(ts) {
  if (!vizAnim.key) return;
  if (!vizAnim.last) vizAnim.last = ts;

  const dt = Math.min(0.06, (ts - vizAnim.last) / 1000);
  vizAnim.last = ts;

  if (!vizAnim.paused) vizAnim.clock += dt * vizAnim.speed;

  drawVizFrame();
  vizAnim.raf = requestAnimationFrame(vizLoop);
}

function startViz(key, viewIndex) {
  stopViz();
  if (!algoViews[key]) return;

  vizAnim.key = key;
  vizAnim.view = viewIndex || 0;
  vizAnim.clock = 0;
  vizAnim.last = 0;
  vizAnim.paused = false;
  updatePauseButton();

  if (!vizData[key]) runPlayground(key, algoPlayground[key].code);

  renderDesignButtons(key);
  buildStepList(key);
  vizAnim.raf = requestAnimationFrame(vizLoop);
}

function stopViz() {
  if (vizAnim.raf) cancelAnimationFrame(vizAnim.raf);
  vizAnim.raf = null;
  vizAnim.key = null;
  vizAnim.last = 0;
}

function updatePauseButton() {
  if (!algoPause) return;
  algoPause.innerHTML = vizAnim.paused
    ? '<i class="fas fa-play" aria-hidden="true"></i>'
    : '<i class="fas fa-pause" aria-hidden="true"></i>';
  algoPause.setAttribute('aria-label', vizAnim.paused ? 'Play' : 'Pause');
}

/* ------------------------------------------------------------
   Run button — compiles the edited source and feeds the view.
------------------------------------------------------------ */
function runPlaygroundUI() {
  if (!activeAlgo) return;
  const key = activeAlgo.key;

  // Running always means running the JavaScript, so switch there first.
  if (activeTab !== 'js') setTab('js');

  const res = runPlayground(key, algoEditor.value);
  const algo = activeAlgo;

  if (!res.ok) {
    printAlgoOut([
      { cls: 'editor-cmd', text: '$ node ' + key + '.js' },
      { cls: 'editor-err', text: res.error.name + ': ' + res.error.message },
      { cls: 'editor-note', text: 'The 3D view keeps the last working result.' },
    ]);
    showToast('Run failed — ' + res.error.name, 'error');
    return;
  }

  const r = res.result;
  let summary = '';

  if (key === 'ga') {
    summary = 'best fitness ' + r.best + ' after ' + r.history.length + ' generations';
  } else if (key === 'aco') {
    const last = r.history[r.history.length - 1];
    const total = last.trail.reduce((s, v) => s + v, 0) || 1;
    summary = 'short route holds ' + Math.round((last.trail[0] / total) * 100) + '% after ' + r.history.length + ' rounds';
  } else if (key === 'edf') {
    summary = r.order.length + ' tasks, total time ' + r.total + ', ' + r.missed + ' missed';
  } else if (key === 'topo') {
    summary = (r.cycle ? 'cycle detected — ' : 'valid order — ') + r.order.join(' → ');
  } else if (key === 'dp') {
    summary = 'best reward ' + r.best + ' — chose ' + (r.chosen.join(', ') || 'nothing');
  } else if (key === 'dijkstra') {
    const parts = Object.keys(r.dist).map(n => n + '=' + (Number.isFinite(r.dist[n]) ? r.dist[n] : '∞'));
    summary = parts.join('  ');
  }

  printAlgoOut([
    { cls: 'editor-cmd', text: '$ node ' + key + '.js' },
    { cls: 'editor-ok', text: 'compiled and ran in ' + res.ms + ' ms' },
    { cls: 'editor-out', text: summary },
    { cls: 'editor-note', text: 'The 3D view is now drawing this result.' },
  ]);

  // restart the animation so the new result plays from the beginning
  vizAnim.clock = 0;
  renderDesignButtons(key);
  showToast(algo.name + ' ran — ' + res.ms + ' ms', 'success');
}

/* ------------------------------------------------------------
   Controls
------------------------------------------------------------ */
if (algoSpeed) {
  algoSpeed.addEventListener('input', () => {
    vizAnim.speed = parseFloat(algoSpeed.value) || 0.5;
    algoSpeedVal.textContent = vizAnim.speed.toFixed(2).replace(/0$/, '') + '×';
  });
}

if (algoPause) {
  algoPause.addEventListener('click', () => {
    vizAnim.paused = !vizAnim.paused;
    vizAnim.last = 0;
    updatePauseButton();
  });
}

if (algoVizReplay) {
  algoVizReplay.addEventListener('click', () => {
    vizAnim.clock = 0;
    vizAnim.paused = false;
    updatePauseButton();
  });
}

/* ---- zoom ---- */
if (algoZoomIn)  algoZoomIn.addEventListener('click', () => setZoom(vizAnim.zoom * 1.2));
if (algoZoomOut) algoZoomOut.addEventListener('click', () => setZoom(vizAnim.zoom / 1.2));
if (algoZoomFit) algoZoomFit.addEventListener('click', resetCamera);

/* ---- step-by-step ---- */
if (algoStepPrev) algoStepPrev.addEventListener('click', () => stepBy(-1));
if (algoStepNext) algoStepNext.addEventListener('click', () => stepBy(1));

if (algoVizCanvas) {
  // scroll wheel zooms. preventDefault keeps the modal from scrolling
  // underneath the cursor while the pointer is over the canvas.
  algoVizCanvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0015);
    setZoom(vizAnim.zoom * factor);
  }, { passive: false });

  // drag to rotate
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  algoVizCanvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    if (algoVizCanvas.setPointerCapture) algoVizCanvas.setPointerCapture(e.pointerId);
  });

  algoVizCanvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    vizAnim.yawOffset += (e.clientX - lastX) * 0.008;
    // clamp pitch so the camera never flips over the pole
    vizAnim.pitchOffset = Math.max(-1.1, Math.min(1.1,
      vizAnim.pitchOffset + (e.clientY - lastY) * 0.006));
    lastX = e.clientX;
    lastY = e.clientY;
    drawVizFrame();
  });

  const endDrag = (e) => {
    dragging = false;
    if (algoVizCanvas.releasePointerCapture && e.pointerId !== undefined) {
      try { algoVizCanvas.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
    }
  };
  algoVizCanvas.addEventListener('pointerup', endDrag);
  algoVizCanvas.addEventListener('pointercancel', endDrag);

  // double-click zooms in a step; a double-click when already zoomed resets
  algoVizCanvas.addEventListener('dblclick', () => {
    if (vizAnim.zoom > 1.05) resetCamera();
    else setZoom(2);
  });

  // pinch-to-zoom on touch screens
  let pinchStart = null;
  const distance = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  algoVizCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) pinchStart = { d: distance(e.touches), z: vizAnim.zoom };
  }, { passive: true });
  algoVizCanvas.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 2 || !pinchStart) return;
    const d = distance(e.touches);
    if (pinchStart.d > 0) setZoom(pinchStart.z * (d / pinchStart.d));
    if (e.cancelable) e.preventDefault();
  }, { passive: false });
  algoVizCanvas.addEventListener('touchend', () => { pinchStart = null; });
}

window.addEventListener('resize', () => {
  if (vizAnim.key) drawVizFrame();
});
