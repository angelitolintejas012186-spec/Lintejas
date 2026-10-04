// Lintejas logo pipeline (dev tool, not shipped). usage (repo root): node tools/logo/build-icons.mjs
// THE official logo = Angie's picture public/brand/lintejas-logo-original.jpeg (closed gold frame, cube CENTRED), kept
// as-is. tools/logo/cutout.mjs lifts its own pixels onto true transparency (fake checkerboard + smudges removed). Every
// logo asset below is that cut-out — never redrawn — EXCEPT the browser-tab favicons (16/32/48/.ico/.svg): a flat
// redraw of the same shape (closed frame, cube centred), because a photo of this detail is unreadable at 16 px.
import fs from 'node:fs'; import path from 'node:path'; import sharp from 'sharp';
import { cutout } from './cutout.mjs';
const PUB = path.resolve('public'), NAVY = '#0A1628', NAVY_RGB = { r: 10, g: 22, b: 40, alpha: 1 }, CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
const out = (f) => { const p = path.join(PUB, f); fs.mkdirSync(path.dirname(p), { recursive: true }); return p; };
const say = (f) => console.log('wrote', f);

const C = await cutout(); const meta = await sharp(C.png).metadata(); const LW = meta.width, LH = meta.height;   // trimmed logo
// Logo of height h (px) — exact cut-out pixels, high-quality downscale
const logoAt = (h) => sharp(C.png).resize(Math.max(1, Math.round(LW * h / LH)), Math.round(h), { kernel: 'lanczos3' }).png().toBuffer();
// Canvas W×H, background, logo centred at height h
async function onCanvas(W, H, bg, h, file) {
  const lg = await logoAt(h); const m = await sharp(lg).metadata();
  const img = sharp({ create: { width: W, height: H, channels: 4, background: bg } }).composite([{ input: lg, left: Math.round((W - m.width) / 2), top: Math.round((H - m.height) / 2) }]);
  const buf = bg.alpha === 0 ? await img.png().toBuffer() : await img.flatten({ background: NAVY }).png().toBuffer();
  if (file) { fs.writeFileSync(out(file), buf); say(file); } return buf;
}

// ── Brand files: transparent PNG, navy version (original kept as-is in brand/lintejas-logo-original.jpeg) ──
fs.writeFileSync(out('brand/lintejas-logo.png'), C.png); say('brand/lintejas-logo.png');
await onCanvas(1600, 1600, NAVY_RGB, 1216, 'brand/lintejas-logo-navy.png');
// ── On-page mark (header, footer, everywhere TheInterlockLogo renders): square, transparent, logo full height ──
for (const s of [64, 128, 256, 512]) await onCanvas(s, s, CLEAR, s, `brand/lintejas-mark-${s}.png`);
// ── App icons: plain site navy, logo centred (iOS rounds its own corners; Android masks the maskable one) ──
await onCanvas(180, 180, NAVY_RGB, 126, 'apple-touch-icon.png');        // logo 70% of the height
await onCanvas(192, 192, NAVY_RGB, 134, 'icon-192.png');
await onCanvas(512, 512, NAVY_RGB, 358, 'icon-512.png');
await onCanvas(512, 512, NAVY_RGB, 296, 'icon-maskable-512.png');      // 58%: logo half-diagonal 0.61·h ≈ 180 px < safe radius 204.8 px
// ── iPhone splash (apple-touch-startup-image): portrait, logo centred, height = 42% of the screen width ──
export const IOS = [   // [css w, css h, dpr, label]
  [375, 667, 2, 'iPhone SE / 8'], [414, 736, 3, 'iPhone 8 Plus'], [375, 812, 3, 'iPhone X / XS / 11 Pro / 12-13 mini'],
  [414, 896, 2, 'iPhone XR / 11'], [414, 896, 3, 'iPhone XS Max / 11 Pro Max'], [390, 844, 3, 'iPhone 12 / 13 / 14'],
  [428, 926, 3, 'iPhone 12-13 Pro Max / 14 Plus'], [393, 852, 3, 'iPhone 14 Pro / 15 / 15 Pro / 16'], [430, 932, 3, 'iPhone 14 Pro Max / 15 Plus / 15 Pro Max / 16 Plus'],
  [402, 874, 3, 'iPhone 16 Pro'], [440, 956, 3, 'iPhone 16 Pro Max'],
];
for (const [w, h, d] of IOS) await onCanvas(w * d, h * d, NAVY_RGB, Math.round(w * d * 0.42), `splash/apple-splash-${w * d}x${h * d}.png`);
// ── Share image 1200×630: the cut-out on navy ──
await onCanvas(1200, 630, NAVY_RGB, 441, 'og-image.png');

// ── Browser-tab favicons ONLY: flat redraw of the same shape (closed frame, cube centred), hero units ──
const GOLD = `<linearGradient id="lgF" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FCE98A"/><stop offset="50%" stop-color="#F2B640"/><stop offset="100%" stop-color="#B8761A"/></linearGradient>`
  + `<linearGradient id="lgC" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFF3B0"/><stop offset="55%" stop-color="#F5CF5A"/><stop offset="100%" stop-color="#B8761A"/></linearGradient>`;
const U = { W: 2.28, H: 2.64, BAR: 0.18, CUBE: 0.52 };
function flatSVG(size, H, rx, snap) {
  const r = (v) => (snap ? Math.round(v) : +v.toFixed(3)), s = H / U.H;
  const W = r(U.W * s), HH = r(H), bar = snap ? Math.max(1, Math.round(U.BAR * s)) : r(U.BAR * s);
  let cube = snap ? Math.max(2, Math.round(U.CUBE * s)) : r(U.CUBE * s);
  if (snap && (W - cube) % 2) cube += 1;                       // keep the cube exactly centred on whole pixels
  const X = r((size - W) / 2), Y = r((size - HH) / 2);
  const cx = snap ? X + (W - cube) / 2 : +(X + (W - cube) / 2).toFixed(3), cy = snap ? Y + Math.round((HH - cube) / 2) : +(Y + (HH - cube) / 2).toFixed(3);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"${snap ? ' shape-rendering="crispEdges"' : ''}><defs>${GOLD}</defs>`
    + `<rect width="${size}" height="${size}" rx="${rx}" fill="${NAVY}"/>`
    + `<path d="M${X} ${Y}h${W}v${HH}h${-W}Z M${X + bar} ${Y + bar}v${HH - 2 * bar}h${W - 2 * bar}v${-(HH - 2 * bar)}Z" fill="url(#lgF)" fill-rule="evenodd"/>`
    + `<rect x="${cx}" y="${cy}" width="${cube}" height="${cube}" fill="url(#lgC)"/></svg>`;
}
fs.writeFileSync(out('favicon.svg'), flatSVG(80, 62, 16)); say('favicon.svg');
const small = {};
for (const n of [16, 32, 48]) { small[n] = await sharp(Buffer.from(flatSVG(n, Math.round(n * 0.8), Math.round(n * 0.2), true))).png().toBuffer(); fs.writeFileSync(out(`favicon-${n}.png`), small[n]); say(`favicon-${n}.png`); }
{ const sizes = [16, 32, 48], imgs = sizes.map((n) => small[n]), head = Buffer.alloc(6 + 16 * imgs.length);   // PNG-in-ICO
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(imgs.length, 4); let off = head.length;
  imgs.forEach((b, i) => { const o = 6 + 16 * i; head.writeUInt8(sizes[i], o); head.writeUInt8(sizes[i], o + 1); head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6); head.writeUInt32LE(b.length, o + 8); head.writeUInt32LE(off, o + 12); off += b.length; });
  fs.writeFileSync(out('favicon.ico'), Buffer.concat([head, ...imgs])); say('favicon.ico'); }
