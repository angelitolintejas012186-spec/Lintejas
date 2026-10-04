/* The official Lintejas logo — Angie's picture (closed gold frame, cube centred), cut onto true transparency by
   tools/logo/build-icons.mjs (public/brand/lintejas-mark-{64,128,256,512}.png: square, logo full height, centred).
   Same square box as before (size × size), so every placement keeps its layout; the browser picks the crisp
   2×/3× source for the box via srcSet + sizes. Only the browser-tab favicons use a flat redraw. */
const SRC = '/brand/lintejas-mark-'
const V = '?v=3'

export default function TheInterlockLogo({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src={`${SRC}128.png${V}`}
      srcSet={[64, 128, 256, 512].map((w) => `${SRC}${w}.png${V} ${w}w`).join(', ')}
      sizes={`${size}px`}
      width={size}
      height={size}
      alt="Lintejas"
      decoding="async"
      draggable={false}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
    />
  )
}
