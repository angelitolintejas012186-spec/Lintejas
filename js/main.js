/* ================================
   LINTEJAS — MAIN JAVASCRIPT
   ================================ */

// Apply admin-saved branding (logo, style, brand name) to every public page
(function applyBranding() {
  const logo   = localStorage.getItem('lintejas_logo');
  const name   = localStorage.getItem('lintejas_brand_name');
  const suffix = localStorage.getItem('lintejas_brand_suffix');
  const ls     = JSON.parse(localStorage.getItem('lintejas_logo_style')   || '{}');
  const bs     = JSON.parse(localStorage.getItem('lintejas_brand_style')  || '{}');
  const layout = JSON.parse(localStorage.getItem('lintejas_brand_layout') || '{}');

  const radius    = ls.radius    ?? 9;
  const bright    = ls.bright    ?? 100;
  const cont      = ls.cont      ?? 100;
  const sat       = ls.sat       ?? 100;
  const glowOn    = ls.glowOn    ?? false;
  const glowColor = ls.glowColor ?? '#0891B2';
  const glowSize  = ls.glowSize  ?? 12;
  const logoSize  = ls.size      ?? 38;
  const logoBg    = ls.bgColor   ?? '#0891B2';
  const logoAnim  = ls.animation ?? 'none';

  const textSize    = bs.textSize    ?? 100;
  const textBright  = bs.textBright  ?? 100;
  const textSpacing = bs.textSpacing ?? 0;
  const textColor   = bs.textColor   ?? '#E2E8F0';
  const suffixColor = bs.suffixColor ?? '#22D3EE';
  const fontFamily  = bs.fontFamily  ?? 'Space Grotesk';
  const fontWeight  = bs.fontWeight  ?? '700';
  const textAnim    = bs.animation   ?? 'none';

  const order    = layout.order    ?? ['icon', 'name'];
  const showIcon = layout.showIcon ?? true;
  const showName = layout.showName ?? true;

  // Inject animation keyframes + dynamic Google Font once
  let styleEl = document.getElementById('lt-branding-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'lt-branding-styles';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `
@keyframes lt-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes lt-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes lt-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes lt-glow{0%,100%{filter:brightness(1) drop-shadow(0 0 0 transparent)}50%{filter:brightness(1.35) drop-shadow(0 0 9px currentColor)}}
@keyframes lt-bounce{0%,100%{transform:translateY(0)}20%{transform:translateY(-7px)}40%{transform:translateY(0)}60%{transform:translateY(-3px)}80%{transform:translateY(0)}}
@keyframes lt-shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes lt-breathe{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.97)}}
@keyframes lt-slidein{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
@keyframes lt-glowtext{0%,100%{text-shadow:none}50%{text-shadow:0 0 10px currentColor,0 0 22px currentColor}}
.lt-anim-logo-float{animation:lt-float 2.8s ease-in-out infinite}
.lt-anim-logo-pulse{animation:lt-pulse 2s ease-in-out infinite}
.lt-anim-logo-spin{animation:lt-spin 8s linear infinite}
.lt-anim-logo-glow{animation:lt-glow 2.2s ease-in-out infinite}
.lt-anim-logo-bounce{animation:lt-bounce 2s ease-in-out infinite}
.lt-anim-text-shimmer{background:linear-gradient(90deg,currentColor 0%,#F59E0B 40%,#FDE68A 50%,#F59E0B 60%,currentColor 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:lt-shimmer 3s linear infinite}
.lt-anim-text-breathe{animation:lt-breathe 3s ease-in-out infinite}
.lt-anim-text-slidein{animation:lt-slidein .6s ease-out}
.lt-anim-text-glow-text{animation:lt-glowtext 2.5s ease-in-out infinite}
`;

  // Load a custom Google Font if the admin picked one beyond the site defaults
  const builtInFonts = ['Space Grotesk', 'Inter'];
  if (fontFamily && !builtInFonts.includes(fontFamily)) {
    const fid = 'lt-gf-' + fontFamily.replace(/\s+/g, '-').toLowerCase();
    if (!document.getElementById(fid)) {
      const link = document.createElement('link');
      link.id   = fid;
      link.rel  = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily).replace(/%20/g,'+')}:wght@400;500;600;700;800&display=swap`;
      document.head.appendChild(link);
    }
  }

  const setAnim = (el, prefix, animName) => {
    [...el.classList].filter(c => c.startsWith(prefix)).forEach(c => el.classList.remove(c));
    if (animName && animName !== 'none') el.classList.add(prefix + animName);
  };

  document.querySelectorAll('.nav__logo-icon').forEach(el => {
    el.style.borderRadius = radius + 'px';
    el.style.width        = logoSize + 'px';
    el.style.height       = logoSize + 'px';
    el.style.minWidth     = logoSize + 'px';
    el.style.order        = order.indexOf('icon').toString();
    el.style.display      = showIcon ? '' : 'none';
    if (glowOn) {
      el.style.boxShadow = `0 0 ${glowSize}px ${glowColor}, 0 0 ${glowSize * 2}px ${glowColor}55`;
    }
    if (logo) {
      const imgFilter = `brightness(${bright/100}) contrast(${cont/100}) saturate(${sat/100})`;
      el.innerHTML        = `<img src="${logo}" style="width:100%;height:100%;object-fit:contain;display:block;filter:${imgFilter}" />`;
      el.style.background = 'transparent';
      if (!glowOn) el.style.boxShadow = 'none';
      el.style.padding    = '0';
      el.style.overflow   = 'hidden';
    } else {
      el.style.background = `linear-gradient(135deg, ${logoBg}, ${logoBg}cc)`;
    }
    setAnim(el, 'lt-anim-logo-', logoAnim);
  });

  const wmSrc    = localStorage.getItem('lintejas_brand_wordmark');
  const wsCfg    = JSON.parse(localStorage.getItem('lintejas_wordmark_style') || '{}');
  const wmActive = wsCfg.useWordmark ?? false;
  const wmH      = wsCfg.height ?? 24;

  document.querySelectorAll('.nav__logo-text').forEach(el => {
    el.style.order   = order.indexOf('name').toString();
    el.style.display = showName ? '' : 'none';

    if (wmActive && wmSrc) {
      el.innerHTML         = `<img src="${wmSrc}" style="height:${wmH}px;max-width:200px;object-fit:contain;display:block" alt="brand" />`;
      el.style.fontSize    = '';
      el.style.letterSpacing = '';
      el.style.opacity     = '';
      el.style.color       = '';
      el.style.fontFamily  = '';
      el.style.fontWeight  = '';
    } else if (name) {
      const endsW  = suffix && name.toLowerCase().endsWith(suffix.toLowerCase());
      const prefix = endsW ? name.slice(0, name.length - suffix.length) : name;
      const sfx    = endsW ? suffix : '';
      el.innerHTML           = prefix + (sfx ? `<span>${sfx}</span>` : '');
      el.style.fontSize      = (textSize / 100) + 'em';
      el.style.opacity       = textBright / 100;
      el.style.letterSpacing = textSpacing + 'px';
      el.style.color         = textColor;
      el.style.fontFamily    = `'${fontFamily}', sans-serif`;
      el.style.fontWeight    = fontWeight;
      const sfxSpan = el.querySelector('span');
      if (sfxSpan) sfxSpan.style.color = suffixColor;
    }
    setAnim(el, 'lt-anim-text-', textAnim);
  });
})();

// Navigation scroll effect
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav?.classList.add('scrolled');
  } else {
    nav?.classList.remove('scrolled');
  }
}, { passive: true });

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav__mobile .nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
  });
});

// Active nav link
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link, .nav__mobile .nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isActive =
      (href === 'index.html' && (path.endsWith('/') || path.endsWith('index.html'))) ||
      (href !== 'index.html' && path.endsWith(href));
    link.classList.toggle('active', isActive);
  });
}
setActiveNavLink();

// Scroll reveal animation
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counter animation for stat numbers
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isDecimal
      ? (eased * target).toFixed(1)
      : Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseFloat(entry.target.dataset.target);
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, target, suffix);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// Hero particle canvas
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.45 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(8, 145, 178, ${p.alpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(8, 145, 178, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    animId = requestAnimationFrame(draw);
  }

  function handleResize() {
    resize();
    createParticles();
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', handleResize, { passive: true });

  // Pause when tab is hidden to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });
}

initParticles();

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.form__submit');
    const successMsg = document.getElementById('form-success');

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate submission (replace with actual API call)
    setTimeout(() => {
      contactForm.style.display = 'none';
      if (successMsg) {
        successMsg.classList.add('show');
      }
    }, 1200);
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
