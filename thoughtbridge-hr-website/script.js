document.addEventListener('DOMContentLoaded', () => {

  /* Scroll progress bar */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = scrolled + '%';
    const nav = document.querySelector('.site-nav');
    if (nav) nav.classList.toggle('shrink', h.scrollTop > 40);
  };
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* Parallax blobs */
  const blobs = document.querySelectorAll('[data-parallax]');
  document.addEventListener('scroll', () => {
    const y = window.scrollY;
    blobs.forEach(b => {
      const speed = parseFloat(b.dataset.parallax) || 0.15;
      b.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
  }, { passive:true });

  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links){
    toggle.addEventListener('click', () => {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '68px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = '#FBFAF5';
      links.style.padding = '18px 32px';
      links.style.gap = '10px';
      links.style.borderBottom = '1px solid rgba(11,43,46,0.12)';
      toggle.textContent = open ? '☰' : '✕';
    });
  }

  /* Active nav link */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) a.classList.add('active');
  });

  /* Scroll reveal */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Counter animation */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      function tick(now){
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target < 10 ? (target * eased).toFixed(1) : Math.round(target * eased);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cio.observe(el));

  /* Tilt cards (subtle 3D on mouse move) */
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* Bridge dot stagger */
  document.querySelectorAll('.bridge-dot').forEach((dot, i) => {
    dot.style.animationDelay = (i * 0.9) + 's';
  });

  /* Contact form -> mailto */
  const form = document.querySelector('#contact-form');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const org = form.org.value.trim();
      const message = form.message.value.trim();
      const subject = encodeURIComponent(`Executive search enquiry — ${org || name}`);
      const body = encodeURIComponent(`Name: ${name}\nOrganisation: ${org}\n\n${message}`);
      window.location.href = `mailto:kashmira.sethna@thoughtbridgehr.com?subject=${subject}&body=${body}`;
    });
  }
});
