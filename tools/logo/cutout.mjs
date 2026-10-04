// Cut the official logo (public/brand/lintejas-logo-original.jpeg — Angie's WhatsApp JPEG with a FAKE baked-in
// checkerboard + faint white smudges) onto TRUE transparency. Logo pixels are the picture's own (not redrawn).
//  1. soft alpha from warmth: every logo face has R−B ≥ 18 (palest = the beige inner bottom face); checkerboard/smudges ≤ 11
//  2. keep only large connected shapes (frame + cube) → smudge specks gone
//  3. fill small enclosed holes (specular spots), never the big hole inside the frame
//  4. de-halo: every soft-edge pixel takes the colour of its nearest solid pixel (no grey/white contamination)
// exports cutout() → { png (trimmed, transparent RGBA), w, h }
import sharp from 'sharp'; import path from 'node:path';
export const ORIGINAL = path.resolve('public/brand/lintejas-logo-original.jpeg');
export async function cutout() {
  const { data, info } = await sharp(ORIGINAL).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H, a = new Float32Array(N);
  const ss = (v, e0, e1) => { const t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
  for (let i = 0; i < N; i++) a[i] = ss(data[i * 3] - data[i * 3 + 2], 11, 20);   // checkerboard + smudges measured R−B ≤ 11; palest logo face (inner bottom) ≥ 18
  // 2. connected components of the solid part
  const keep = new Uint8Array(N), seen = new Uint8Array(N), q = new Int32Array(N);
  const nb = (j, x, y) => [x > 0 ? j - 1 : -1, x < W - 1 ? j + 1 : -1, y > 0 ? j - W : -1, y < H - 1 ? j + W : -1];
  for (let i = 0; i < N; i++) { if (a[i] <= 0.5 || seen[i]) continue; let h = 0, t = 0; q[t++] = i; seen[i] = 1;
    while (h < t) { const j = q[h++]; for (const k of nb(j, j % W, (j / W) | 0)) if (k >= 0 && !seen[k] && a[k] > 0.5) { seen[k] = 1; q[t++] = k; } }
    if (t > 4000) for (let n = 0; n < t; n++) keep[q[n]] = 1; }
  // 3. small enclosed holes inside kept shapes → solid (regions of non-kept pixels not touching the border, < 600 px)
  const vis = new Uint8Array(N);
  for (let i = 0; i < N; i++) { if (keep[i] || vis[i]) continue; let h = 0, t = 0, border = false; q[t++] = i; vis[i] = 1;
    while (h < t) { const j = q[h++], x = j % W, y = (j / W) | 0; if (x === 0 || y === 0 || x === W - 1 || y === H - 1) border = true;
      for (const k of nb(j, x, y)) if (k >= 0 && !vis[k] && !keep[k]) { vis[k] = 1; q[t++] = k; } }
    if (!border && t < 600) for (let n = 0; n < t; n++) { keep[q[n]] = 1; a[q[n]] = 1; } }
  // alpha: solid where kept (full where the warmth says so, never below 0.5 inside), soft ring (≤2 px) outside
  const alpha = new Float32Array(N);
  for (let i = 0; i < N; i++) if (keep[i]) alpha[i] = Math.max(a[i], 0.5 + 0.5 * a[i]);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (keep[i]) continue; let near = false;
    for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H && keep[yy * W + xx]) { near = true; break; } }
    if (near) alpha[i] = a[i]; }
  // 4. de-halo by matting. CORE = solid pixels ≥ 2 px inside the shape (eroded) → trusted logo colour. Every other
  //    pixel takes the colour of its nearest CORE pixel (F); its alpha is the share of F in the blend with the
  //    checkerboard grey B: α = (C−B)·(F−B)/|F−B|² (warmth α kept where F is too close to B to tell — the beige face).
  const solid = new Uint8Array(N); for (let i = 0; i < N; i++) solid[i] = alpha[i] >= 0.97 ? 1 : 0;
  let core = solid;
  for (let it = 0; it < 2; it++) { const nx = new Uint8Array(N);
    for (let i = 0; i < N; i++) { if (!core[i]) continue; const x = i % W, y = (i / W) | 0; let ok = true;
      for (const k of nb(i, x, y)) if (k < 0 || !core[k]) { ok = false; break; } nx[i] = ok ? 1 : 0; }
    core = nx; }
  const src = new Int32Array(N).fill(-1), dist = new Uint16Array(N).fill(65535); let h = 0, t = 0;
  for (let i = 0; i < N; i++) if (core[i]) { src[i] = i; dist[i] = 0; q[t++] = i; }
  while (h < t) { const j = q[h++]; for (const k of nb(j, j % W, (j / W) | 0)) if (k >= 0 && src[k] === -1) { src[k] = src[j]; dist[k] = dist[j] + 1; q[t++] = k; } }
  const B = [242, 241, 243];
  const out = Buffer.alloc(N * 4); let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let i = 0; i < N; i++) {
    const s = src[i] < 0 ? i : src[i]; const F = [data[s * 3], data[s * 3 + 1], data[s * 3 + 2]];
    let al = alpha[i];
    if (!core[i] && (solid[i] || al > 0) && dist[i] <= 4) {
      const C = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]], fb = F.map((v, c) => v - B[c]), n2 = fb[0] * fb[0] + fb[1] * fb[1] + fb[2] * fb[2];
      if (n2 >= 1500) al = Math.min(1, Math.max(0, ((C[0] - B[0]) * fb[0] + (C[1] - B[1]) * fb[1] + (C[2] - B[2]) * fb[2]) / n2));
    }
    if (core[i]) al = 1;
    out[i * 4] = F[0]; out[i * 4 + 1] = F[1]; out[i * 4 + 2] = F[2]; out[i * 4 + 3] = Math.round(al * 255);
    if (al > 0.02) { const x = i % W, y = (i / W) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
  // 5. smooth the JPEG staircase on the edge: blur ONLY the alpha channel a touch (0.6 px); colours untouched
  const rgba = sharp(out, { raw: { width: W, height: H, channels: 4 } });
  const rgb = await rgba.clone().removeAlpha().raw().toBuffer();
  const al = await rgba.clone().extractChannel(3).blur(0.6).raw().toBuffer();
  const merged = await sharp(rgb, { raw: { width: W, height: H, channels: 3 } }).joinChannel(al, { raw: { width: W, height: H, channels: 1 } }).raw().toBuffer();
  const png = await sharp(merged, { raw: { width: W, height: H, channels: 4 } }).extract({ left: Math.max(0, x0 - 2), top: Math.max(0, y0 - 2), width: Math.min(W, x1 + 3) - Math.max(0, x0 - 2), height: Math.min(H, y1 + 3) - Math.max(0, y0 - 2) }).png().toBuffer();
  return { png, w: x1 - x0 + 1, h: y1 - y0 + 1, bbox: [x0, y0, x1, y1] };
}
