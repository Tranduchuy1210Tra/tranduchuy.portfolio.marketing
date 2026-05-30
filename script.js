/* ============================================
   TRAN DUC HUY — Portfolio v4 REDESIGN
   Premium 3D Motion, Parallax & Animations
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initScrollProgress();
  initParticles();
  initNavbar();
  initTyping();
  initReveal();
  initCounters();
  initTabs();
  initLightbox();
  initForm();
  initCursorGlow();
  initTiltCards();
  initMagneticButtons();
  initSmoothParallax();
});

/* ========== LOADER ========== */
function initLoader() {
  const el = document.getElementById('loader');
  if (!el) return;
  setTimeout(() => {
    el.classList.add('hidden');
    setTimeout(() => el.remove(), 600);
  }, 1800);
}

/* ========== SCROLL PROGRESS BAR ========== */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ========== PARTICLES ========== */
function initParticles() {
  const c = document.getElementById('particle-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let particles = [];
  let mouse = { x: -999, y: -999 };

  function resize() {
    c.width = c.parentElement.offsetWidth;
    c.height = c.parentElement.offsetHeight;
  }
  function create() {
    particles = [];
    const n = Math.min(Math.floor((c.width * c.height) / 12000), 120);
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        o: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;
      if (p.x < 0) p.x = c.width;
      if (p.x > c.width) p.x = 0;
      if (p.y < 0) p.y = c.height;
      if (p.y > c.height) p.y = 0;

      // Mouse repulsion
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 150) {
        p.x += (mdx / md) * 1.5;
        p.y += (mdy / md) * 1.5;
      }

      const pulseR = p.r + Math.sin(p.pulse) * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34,52,245,' + (p.o * (0.8 + Math.sin(p.pulse) * 0.2)) + ')';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(34,52,245,' + (0.08 * (1 - d / 120)) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  c.addEventListener('mousemove', e => {
    const rect = c.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  c.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  resize();
  create();
  draw();
  window.addEventListener('resize', () => { resize(); create(); });
}

/* ========== NAVBAR ========== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('[data-nav]');
  if (!nav || !ham || !links) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  const sections = document.querySelectorAll('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navItems.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => obs.observe(s));

  ham.addEventListener('click', () => {
    ham.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });
  navItems.forEach(l => l.addEventListener('click', () => {
    ham.classList.remove('active');
    links.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ========== TYPING ========== */
function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const words = ['SEO Specialist', 'Growth Marketer', 'Brand Strategist', 'Data Analyst', 'Content Creator'];
  let wi = 0, ci = 0, del = false, speed = 80;
  function type() {
    const w = words[wi];
    if (del) { el.textContent = w.substring(0, --ci); speed = 40; }
    else { el.textContent = w.substring(0, ++ci); speed = 80; }
    if (!del && ci === w.length) { speed = 2200; del = true; }
    else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; speed = 400; }
    setTimeout(type, speed);
  }
  setTimeout(type, 800);
}

/* ========== REVEAL ON SCROLL ========== */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ========== COUNTERS ========== */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}
function animateCount(el) {
  const target = +el.dataset.count;
  const dur = 2000;
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - (1 - p) * (1 - p);
    el.textContent = Math.floor(eased * target) + '+';
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}



/* ========== TABS ========== */
function initTabs() {
  const tabContainers = document.querySelectorAll('.tabs');
  tabContainers.forEach(container => {
    const btns = container.querySelectorAll('.tab-btn');
    const project = container.closest('.project');
    if (!project) return;
    const panels = project.querySelectorAll('.tab-panel');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
      });
    });
  });
}

/* ========== LIGHTBOX ========== */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img) return;
  const close = lb.querySelector('.lightbox__close');

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img');
      if (src) {
        img.src = src.src;
        img.alt = src.alt;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLb() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (close) close.addEventListener('click', e => { e.stopPropagation(); closeLb(); });
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('active')) closeLb(); });
}

/* ========== FORM ========== */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Message Sent!';
    btn.style.background = '#10B981';
    btn.style.boxShadow = '0 4px 20px rgba(16,185,129,0.4)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.boxShadow = '';
      form.reset();
    }, 3000);
  });
}

/* ========== CURSOR GLOW ========== */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.innerWidth < 768) return;
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (!glow.classList.contains('visible')) glow.classList.add('visible');
  });
  document.addEventListener('mouseleave', () => glow.classList.remove('visible'));
  (function loop() {
    gx += (mx - gx) * 0.06;
    gy += (my - gy) * 0.06;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(loop);
  })();
}

/* ========== 3D TILT CARDS ========== */
function initTiltCards() {
  if (window.innerWidth < 768) return;
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  });
}

/* ========== MAGNETIC BUTTONS ========== */
function initMagneticButtons() {
  if (window.innerWidth < 768) return;
  const btns = document.querySelectorAll('.magnetic-btn');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.25) + 'px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/* ========== SMOOTH PARALLAX ========== */
function initSmoothParallax() {
  const glows = document.querySelectorAll('.hero__glow');
  const shapes = document.querySelectorAll('.floating-shape');
  const badges = document.querySelectorAll('.hero__badge');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const speed = 0.3;

    glows.forEach((g, i) => {
      const rate = (i + 1) * speed * 0.5;
      g.style.transform = 'translateY(' + (scrollY * rate) + 'px)';
    });

    shapes.forEach((s, i) => {
      const rate = (i + 1) * speed * 0.3;
      s.style.transform = 'translateY(' + (scrollY * rate) + 'px) rotate(' + (scrollY * 0.02) + 'deg)';
    });

    badges.forEach((b, i) => {
      const rate = (i + 1) * speed * 0.15;
      b.style.transform = 'translateY(' + (-scrollY * rate) + 'px)';
    });
  }, { passive: true });
}
