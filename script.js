// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if(cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if(cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor scale on hover
function bindCursorHover() {
  document.querySelectorAll('a, button, .service-card, .work-item, .testi-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if(cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      if(cursorRing) {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorRing.style.borderColor = 'var(--primary)';
      }
    });
    el.addEventListener('mouseleave', () => {
      if(cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      if(cursorRing) {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.borderColor = 'var(--primary)';
      }
    });
  });
}
bindCursorHover();

// 3D Canvas Particle System
const canvas = document.getElementById('bg-canvas');
let ctx;
if (canvas) {
  ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['rgba(227,239,38,', 'rgba(7,102,83,', 'rgba(226,251,206,', 'rgba(12,52,44,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.4 + 0.05;
      this.life = Math.random() * 200 + 100;
      this.maxLife = this.life;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
      if (this.life <= 0 || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const a = this.alpha * (this.life / this.maxLife);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + a + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Draw connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          const a = (1 - dist/120) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(227,239,38,${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
}

// Scroll Reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

// Counter Animation
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const dur = 2000;
  const step = dur / (target);
  const timer = setInterval(() => {
    start++;
    el.textContent = start + suffix;
    if (start >= target) { clearInterval(timer); el.textContent = target + suffix; }
  }, step);
}

const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = true;
      const target = parseInt(e.target.dataset.target);
      const suffix = e.target.dataset.suffix || '+';
      animateCounter(e.target, target, suffix);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => { n.dataset.suffix = '+'; statObserver.observe(n); });

// Parallax on scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.orb').forEach((orb, i) => {
    const speed = (i + 1) * 0.08;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// Nav background on scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if(nav) {
    if (window.scrollY > 80) {
      nav.style.background = 'rgba(6,35,29,0.95)';
      nav.style.backdropFilter = 'blur(20px)';
    } else {
      nav.style.background = 'linear-gradient(180deg, rgba(6,35,29,0.95) 0%, transparent 100%)';
      nav.style.backdropFilter = 'blur(2px)';
    }
  }
});

// 3D tilt on service cards
function bindTilt() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${-y*8}deg) rotateY(${x*8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Work item 3D tilt
  document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `scale(1.02) perspective(800px) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
}
bindTilt();
