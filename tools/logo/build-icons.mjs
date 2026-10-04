// Lintejas logo pipeline (dev tool, not shipped). One official mark everywhere:
//   • 3D still  = the hero scene (src/components/Interlock3D.tsx geometry/materials/lights) frozen at the official pose
//                 (ry −2.0, rx −0.06) → public/brand/lintejas-logo-3d-2048(.png|-navy.png), rendered by tools/logo/render.html.
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
// 4) Large icons from the 3D still — FULL-BLEED navy (no transparent/white corners), mark at a set share of the height
const STILL = path.join(PUB, 'brand/lintejas-logo-3d-2048-navy.png');
const MARK_H = 1644;   // the mark's height inside the 2048 still (measured: rows 202 … 1845)
async function onNavy(size, markShare, file, w) {
  const W = w || size, scale = (size * markShare) / MARK_H, s = Math.round(2048 * scale);
  const still = await sharp(STILL).resize(s, s).png().toBuffer();
  // still is navy + glow; centre it on a full navy canvas (crop if larger)
  const canvas = sharp({ create: { width: Math.max(W, s), height: Math.max(size, s), channels: 4, background: NAVY_RGB } })
    .composite([{ input: still, left: Math.round((Math.max(W, s) - s) / 2), top: Math.round((Math.max(size, s) - s) / 2) }]);
  let buf = await canvas.png().toBuffer();
  if (s > W || s > size) buf = await sharp(buf).extract({ left: Math.round((Math.max(W, s) - W) / 2), top: Math.round((Math.max(size, s) - size) / 2), width: W, height: size }).png().toBuffer();
  await sharp(buf).flatten({ background: NAVY }).png().toFile(path.join(PUB, file)); console.log('wrote', file);
}
await onNavy(180, 0.72, 'apple-touch-icon.png');       // iOS rounds the corners itself
await onNavy(192, 0.72, 'icon-192.png');
await onNavy(512, 0.72, 'icon-512.png');
await onNavy(512, 0.62, 'icon-maskable-512.png');      // mark half-diagonal ≈ 0.52·H ≤ 0.40·512 safe-zone radius
await onNavy(630, 0.70, 'og-image.png', 1200);         // 1200×630 share image
