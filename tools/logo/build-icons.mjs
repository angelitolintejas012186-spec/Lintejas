// Lintejas logo pipeline (dev tool, not shipped). One official mark everywhere:
//   • THE official logo = Angie's image public/brand/lintejas-logo-official.jpg (the 3D hero's closed gold frame with the
//                 cube on the inner left). Every large asset is cut from it — never re-rendered.
//   • flat mark = the same shape, front view: CLOSED frame (outer 2.28 × 2.64, bar 0.18 — the hero's units) + cube 0.52
//                 flush on the INNER LEFT bar, vertically centred, hero gold. Small sizes are pixel-snapped.
// usage (repo root): node tools/logo/build-icons.mjs
import fs from 'node:fs'; import path from 'node:path'; import sharp from 'sharp';
const PUB = path.resolve('public'), NAVY = '#0A1628', NAVY_RGB = { r: 10, g: 22, b: 40, alpha: 1 };
const GOLD = `<linearGradient id="lgF" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F0D882"/><stop offset="50%" stop-color="#C9A84C"/><stop offset="100%" stop-color="#8A6A00"/></linearGradient>`
  + `<linearGradient id="lgC" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F8E7A8"/><stop offset="55%" stop-color="#E8C766"/><stop offset="100%" stop-color="#B8862A"/></linearGradient>`;
// Hero units → proportions
const U = { W: 2.28, H: 2.64, BAR: 0.18, CUBE: 0.52 };
// Mark geometry at height H (px/units) with origin x0,y0 — optional integer snapping for tiny rasters
function markShapes(x0, y0, H, snap) {
  const r = (v) => (snap ? Math.round(v) : +v.toFixed(3));
  const s = H / U.H, W = r(U.W * s), bar = snap ? Math.max(1, Math.round(U.BAR * s)) : r(U.BAR * s), cube = snap ? Math.max(2, Math.round(U.CUBE * s)) : r(U.CUBE * s);
  const X = r(x0), Y = r(y0), HH = r(H);
  const frame = `M${X} ${Y}h${W}v${HH}h${-W}Z M${X + bar} ${Y + bar}v${HH - 2 * bar}h${W - 2 * bar}v${-(HH - 2 * bar)}Z`;
  const cy = snap ? Y + Math.round((HH - cube) / 2) : +(Y + (HH - cube) / 2).toFixed(3);
  return { W, frame, cube: { x: X + bar, y: cy, s: cube } };
}
function markSVG({ size, H, tile, rx, snap }) {
  const W = U.W * (H / U.H), x0 = (size - (snap ? Math.round(W) : W)) / 2, y0 = (size - H) / 2;
  const m = markShapes(snap ? Math.round(x0) : x0, snap ? Math.round(y0) : y0, H, snap);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"${snap ? ' shape-rendering="crispEdges"' : ''}>`
    + `<defs>${GOLD}</defs>`
    + (tile ? `<rect width="${size}" height="${size}" rx="${rx || 0}" fill="${NAVY}"/>` : '')
    + `<path d="${m.frame}" fill="url(#lgF)" fill-rule="evenodd"/>`
    + `<rect x="${m.cube.x}" y="${m.cube.y}" width="${m.cube.s}" height="${m.cube.s}" fill="url(#lgC)"/></svg>`;
}
const write = (f, s) => { fs.writeFileSync(path.join(PUB, f), s); console.log('wrote', f); };

// 1) Flat SVG masters
write('brand/lintejas-logo.svg', markSVG({ size: 80, H: 64 }));                              // transparent, 80×80
write('favicon.svg', markSVG({ size: 80, H: 62, tile: true, rx: 16 }));                       // navy rounded tile (tabs, light + dark)
// 2) Small rasters — pixel-snapped flat mark on the navy rounded tile
const small = {};
for (const n of [16, 32, 48]) {
  const H = Math.round(n * 0.8);
  small[n] = await sharp(Buffer.from(markSVG({ size: n, H, tile: true, rx: Math.round(n * 0.2), snap: true }))).png().toBuffer();
  fs.writeFileSync(path.join(PUB, `favicon-${n}.png`), small[n]); console.log('wrote', `favicon-${n}.png`);
}
// 3) favicon.ico — PNG-in-ICO container (16, 32, 48)
{ const imgs = [16, 32, 48].map((n) => small[n]); const head = Buffer.alloc(6 + 16 * imgs.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(imgs.length, 4);
  let off = head.length; imgs.forEach((b, i) => { const n = [16, 32, 48][i], o = 6 + 16 * i;
    head.writeUInt8(n, o); head.writeUInt8(n, o + 1); head.writeUInt8(0, o + 2); head.writeUInt8(0, o + 3);
    head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6); head.writeUInt32LE(b.length, o + 8); head.writeUInt32LE(off, o + 12); off += b.length; });
  fs.writeFileSync(path.join(PUB, 'favicon.ico'), Buffer.concat([head, ...imgs])); console.log('wrote favicon.ico'); }
// 4) Large icons — cut from THE official image (public/brand/lintejas-logo-official.jpg, Angie's reference, 1482×1704),
//    never re-rendered. Frame box in that image: x 578–985, y 247–1352 (measured). Square crops are centred on the
//    frame; where a crop runs past the picture it is extended by MIRRORING the image's own navy background (no added
//    colour, no seam). All outputs are full-bleed (no transparent/white corners).
const OFFICIAL = path.join(PUB, 'brand/lintejas-logo-official.jpg');
const FR = { x0: 578, y0: 247, x1: 985, y1: 1352 }, FCX = (FR.x0 + FR.x1) / 2, FCY = (FR.y0 + FR.y1) / 2, FH = FR.y1 - FR.y0;
async function squareCrop(markShare) {
  const S = Math.round(FH / markShare), meta = await sharp(OFFICIAL).metadata();
  const L = Math.round(FCX - S / 2), T = Math.round(FCY - S / 2);
  const pad = { left: Math.max(0, -L), top: Math.max(0, -T), right: Math.max(0, L + S - meta.width), bottom: Math.max(0, T + S - meta.height) };
  const ext = await sharp(OFFICIAL).extend({ ...pad, extendWith: 'mirror' }).png().toBuffer();
  return sharp(ext).extract({ left: L + pad.left, top: T + pad.top, width: S, height: S }).png().toBuffer();
}
async function icon(size, markShare, file) {
  const sq = await squareCrop(markShare);
  await sharp(sq).resize(size, size, { kernel: 'lanczos3' }).flatten({ background: NAVY }).png().toFile(path.join(PUB, file)); console.log('wrote', file);
}
await icon(180, 0.72, 'apple-touch-icon.png');       // iOS rounds the corners itself
await icon(192, 0.72, 'icon-192.png');
await icon(512, 0.72, 'icon-512.png');
await icon(512, 0.62, 'icon-maskable-512.png');      // frame half-diagonal ≈ 0.53·H ≤ 0.40·512 safe-zone radius
// Square master of the official logo (largest crop the image allows without upscaling: frame at 72%)
{ const sq = await squareCrop(0.72); await sharp(sq).png().toFile(path.join(PUB, 'brand/lintejas-logo-official-square.png')); console.log('wrote brand/lintejas-logo-official-square.png'); }
// 1200×630 share image: the official picture (frame at 70% of the height), centred on the site navy, sides feathered
{ const Hc = Math.round(FH / 0.70), meta = await sharp(OFFICIAL).metadata(), T = Math.round(FCY - Hc / 2);
  const pad = { top: Math.max(0, -T), bottom: Math.max(0, T + Hc - meta.height), left: 0, right: 0 };
  const strip = await sharp(await sharp(OFFICIAL).extend({ ...pad, extendWith: 'mirror' }).png().toBuffer()).extract({ left: 0, top: T + pad.top, width: meta.width, height: Hc }).png().toBuffer();
  const h = 630, w = Math.round(meta.width * h / Hc), f = Math.round(w * 0.12);
  const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="${f / w}" stop-color="#fff"/><stop offset="${1 - f / w}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`);
  const piece = await sharp(strip).resize(w, h).ensureAlpha().composite([{ input: fade, blend: 'dest-in' }]).png().toBuffer();
  // horizontal centre on the frame, not the picture
  const left = Math.round(600 - FCX * (h / Hc));
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: { r: 9, g: 21, b: 40, alpha: 1 } } }).composite([{ input: piece, left, top: 0 }]).flatten({ background: NAVY }).png().toFile(path.join(PUB, 'og-image.png'));
  console.log('wrote og-image.png'); }
