/**
 * site-config.js
 * Fetches Lintejas admin config from the Laravel API (with localStorage fallback)
 * and applies branding, theme, and plugins to every public page.
 * Load this before </body> on every public page.
 */
(function () {
  'use strict';

  const _API = 'https://skillvue-app.fly.dev/api/lintejas/config';

  /* ── helpers ──────────────────────────────────── */
  function ls(key, fallback) {
    try { const v = localStorage.getItem('lintejas_' + key); return v != null ? JSON.parse(v) : fallback; }
    catch { try { return localStorage.getItem('lintejas_' + key) || fallback; } catch { return fallback; } }
  }
  function lsRaw(key) { try { return localStorage.getItem('lintejas_' + key); } catch { return null; } }

  /* ── 1. THEME CSS VARIABLES ────────────────────── */
  function applyTheme() {
    const vars = ls('theme_vars', null);
    if (!vars || typeof vars !== 'object') return;
    let css = ':root{';
    Object.entries(vars).forEach(([k, v]) => { css += `${k}:${v};`; });
    css += '}';
    let el = document.getElementById('sv-theme-vars');
    if (!el) { el = document.createElement('style'); el.id = 'sv-theme-vars'; document.head.appendChild(el); }
    el.textContent = css;
  }

  /* ── 2. LOGO ──────────────────────────────────── */
  function applyLogo() {
    const logoSrc  = lsRaw('logo');
    const style    = ls('logo_style', {});
    const layout   = ls('brand_layout', { showIcon: true, showName: true });
    const radius   = style.radius   != null ? style.radius   : 9;
    const bright   = style.bright   != null ? style.bright   : 100;
    const cont     = style.cont     != null ? style.cont     : 100;
    const sat      = style.sat      != null ? style.sat      : 100;
    const glowOn   = style.glowOn   || false;
    const glowCol  = style.glowColor || '#0891B2';
    const glowSz   = style.glowSize != null ? style.glowSize : 12;
    const size     = style.size     != null ? style.size     : 38;
    const bgColor  = style.bgColor  || '#0891B2';
    const anim     = style.anim     || 'none';

    const filter   = `brightness(${bright}%) contrast(${cont}%) saturate(${sat}%)`;
    const shadow   = glowOn ? `0 0 ${glowSz}px ${glowCol}, 0 0 ${glowSz * 2}px ${glowCol}60` : 'none';

    // Inject keyframes once
    injectLogoKeyframes();

    document.querySelectorAll('.nav__logo-icon, .footer__logo-icon').forEach(el => {
      if (!layout.showIcon) { el.style.display = 'none'; return; }
      el.style.display = '';
      el.style.width          = size + 'px';
      el.style.height         = size + 'px';
      el.style.borderRadius   = radius + 'px';
      el.style.filter         = filter;
      el.style.boxShadow      = shadow;
      el.style.background     = bgColor;
      el.style.lineHeight     = size + 'px';
      el.style.fontSize       = Math.round(size * 0.42) + 'px';
      el.style.animation      = anim !== 'none' ? `lsc-${anim} var(--lsc-dur, 3s) ease-in-out infinite` : '';

      if (logoSrc) {
        // Replace the "L" letter with uploaded logo image
        if (!el.querySelector('img.lsc-logo-img')) {
          el.innerHTML = '';
          const img = document.createElement('img');
          img.className = 'lsc-logo-img';
          img.style.cssText = 'width:100%;height:100%;object-fit:contain;border-radius:inherit;display:block';
          img.alt = 'Logo';
          el.appendChild(img);
        }
        el.querySelector('img.lsc-logo-img').src = logoSrc;
      } else {
        // Revert to letter
        if (el.querySelector('img.lsc-logo-img')) { el.innerHTML = 'L'; }
      }
    });
  }

  /* ── 3. BRAND NAME ────────────────────────────── */
  function applyBrandName() {
    const name   = lsRaw('brand_name')   || 'Lintejas';
    const suffix = lsRaw('brand_suffix') || 'jas';
    const style  = ls('brand_style', {});
    const wmSrc  = lsRaw('brand_wordmark');
    const wsCfg  = ls('wordmark_style', { useWordmark: false, height: 24 });
    const layout = ls('brand_layout', { showName: true });

    const textSz     = style.textSize    != null ? style.textSize    : 100;
    const textBr     = style.textBright  != null ? style.textBright  : 100;
    const spacing    = style.textSpacing != null ? style.textSpacing : 0;
    const textColor  = style.textColor   || '#E2E8F0';
    const suffixCol  = style.suffixColor || '#22D3EE';
    const fontWeight = style.fontWeight  || '700';
    const textAnim   = style.textAnim    || 'none';
    const fontFamily = style.fontFamily  || '';

    // Inject text animation keyframes once
    injectTextKeyframes();

    document.querySelectorAll('.nav__logo-text, .footer__logo-text').forEach(el => {
      if (!layout.showName) { el.style.display = 'none'; return; }
      el.style.display = '';

      if (wmSrc && wsCfg.useWordmark) {
        // Show wordmark image instead of text
        if (!el.querySelector('img.lsc-wm-img')) {
          el.innerHTML = '';
          const img = document.createElement('img');
          img.className = 'lsc-wm-img';
          img.alt = name;
          el.appendChild(img);
        }
        const img = el.querySelector('img.lsc-wm-img');
        img.src   = wmSrc;
        img.style.height      = (wsCfg.height || 24) + 'px';
        img.style.width       = 'auto';
        img.style.display     = 'block';
        img.style.filter      = `brightness(${textBr}%)`;
        img.style.animation   = textAnim !== 'none' ? `lsc-text-${textAnim} var(--lsc-text-dur,3s) ease-in-out infinite` : '';
      } else {
        // Text mode
        const prefix = name.endsWith(suffix) ? name.slice(0, -suffix.length) : name;
        const displaySuffix = name.endsWith(suffix) ? suffix : '';
        el.innerHTML = prefix + (displaySuffix ? `<span class="lsc-suffix">${displaySuffix}</span>` : '');
        el.style.fontSize      = (textSz / 100 * 1.15) + 'rem';
        el.style.filter        = `brightness(${textBr}%)`;
        el.style.letterSpacing = spacing + 'px';
        el.style.fontWeight    = fontWeight;
        el.style.color         = textColor;
        el.style.fontFamily    = fontFamily || 'inherit';
        el.style.animation     = textAnim !== 'none' ? `lsc-text-${textAnim} var(--lsc-text-dur,3s) ease-in-out infinite` : '';

        // Color the suffix span
        const suffixEl = el.querySelector('.lsc-suffix');
        if (suffixEl) suffixEl.style.color = suffixCol;
      }
    });
  }

  /* ── 4. ANNOUNCEMENT BAR (if plugin active) ────── */
  function applyAnnouncements() {
    const plugins = ls('plugins', []);
    const bar = plugins.find(p => p.id === 'announcement-bar' && p.active);
    if (!bar) {
      document.getElementById('lsc-announce')?.remove();
      return;
    }
    const cfg = bar.settings || {};
    if (!cfg.message) return;

    let el = document.getElementById('lsc-announce');
    if (!el) {
      el = document.createElement('div');
      el.id = 'lsc-announce';
      document.body.insertBefore(el, document.body.firstChild);
    }
    el.style.cssText = `background:${cfg.color||'#0891B2'};color:#fff;text-align:center;padding:.5rem 1rem;font-size:.85rem;font-weight:500;position:relative;z-index:9999`;
    el.innerHTML = cfg.link
      ? `${cfg.message} <a href="${cfg.link}" style="color:#fff;text-decoration:underline;margin-left:.5rem">${cfg.linkText||'Learn more'} →</a>`
      : cfg.message;
  }

  /* ── 5. SEO META TAGS (if plugin active) ─────── */
  function applySEO() {
    const plugins = ls('plugins', []);
    const seo = plugins.find(p => p.id === 'seo-manager' && p.active);
    if (!seo) return;
    const cfg = seo.settings || {};
    const path = location.pathname.split('/').pop() || 'index.html';
    const pageCfg = cfg.pages?.[path] || {};
    if (pageCfg.title)       document.title = pageCfg.title;
    if (pageCfg.description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
      meta.content = pageCfg.description;
    }
  }

  /* ── Logo animation keyframes ─────────────────── */
  function injectLogoKeyframes() {
    if (document.getElementById('lsc-logo-kf')) return;
    const style = document.createElement('style');
    style.id = 'lsc-logo-kf';
    style.textContent = `
      :root { --lsc-dur: 3s; }
      @keyframes lsc-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      @keyframes lsc-pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
      @keyframes lsc-spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes lsc-glow   { 0%,100%{filter:brightness(100%) drop-shadow(0 0 4px currentColor)} 50%{filter:brightness(130%) drop-shadow(0 0 16px currentColor)} }
      @keyframes lsc-bounce { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} 60%{transform:translateY(-4px)} }
    `;
    document.head.appendChild(style);
  }

  function injectTextKeyframes() {
    if (document.getElementById('lsc-text-kf')) return;
    const style = document.createElement('style');
    style.id = 'lsc-text-kf';
    style.textContent = `
      :root { --lsc-text-dur: 3s; }
      @keyframes lsc-text-fade   { 0%,100%{opacity:1} 50%{opacity:.6} }
      @keyframes lsc-text-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
      @keyframes lsc-text-pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
      @keyframes lsc-text-shimmer{
        0%   {background-position:-200% center}
        100% {background-position:200% center}
      }
    `;
    document.head.appendChild(style);
  }

  /* ── RUN ──────────────────────────────────────── */
  function applyAll() {
    applyTheme();
    applyLogo();
    applyBrandName();
    applyAnnouncements();
    applySEO();
  }

  function fetchAndApply() {
    // Apply from localStorage immediately (fast, no flicker)
    applyAll();
    // Then fetch fresh config from API and re-apply
    fetch(_API, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        Object.entries(data).forEach(([k, v]) => {
          localStorage.setItem('lintejas_' + k, typeof v === 'string' ? v : JSON.stringify(v));
        });
        applyAll();
      })
      .catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchAndApply);
  } else {
    fetchAndApply();
  }

  // Re-apply when admin saves changes in another tab
  window.addEventListener('storage', function (e) {
    if (e.key && e.key.startsWith('lintejas_')) applyAll();
  });
})();
