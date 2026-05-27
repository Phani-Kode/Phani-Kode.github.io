/* ─── Navbar scroll ──────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─── Mobile menu ────────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
});
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  })
);

/* ─── Scroll reveal ──────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(
  entries => entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    const delay = +(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  }),
  { threshold: 0.10 }
);
revealEls.forEach((el, i) => {
  el.dataset.delay = (i % 3) * 80;
  revealObs.observe(el);
});

/* ─── UVM coverage bar — animate on scroll ───────────────────────────────── */
const uvmFill = document.querySelector('.uvm-bar-fill');
if (uvmFill) {
  const barObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      uvmFill.style.animation = 'fillBar 1.8s cubic-bezier(.4,0,.2,1) forwards';
      barObs.disconnect();
    }
  }, { threshold: 0.5 });
  barObs.observe(uvmFill);
}

/* ─── Active nav highlight ───────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
const activeObs = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      if (!link.classList.contains('nav-cta')) {
        link.style.color = active ? 'var(--accent)' : '';
      }
    });
  }),
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => activeObs.observe(s));

/* ─── Circuit canvas particle network ───────────────────────────────────── */
const canvas = document.getElementById('circuit-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, nodes;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    const count = Math.max(20, Math.floor((W * H) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r:  Math.random() * 1.6 + .8,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth   = .7;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.globalAlpha = (1 - d / MAX_DIST) * .85;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = .9;
    ctx.fillStyle   = '#00d4ff';
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
}
