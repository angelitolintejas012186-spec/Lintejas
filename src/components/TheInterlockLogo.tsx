/* The official Lintejas mark — flat version of the 3D hero (src/components/Interlock3D.tsx):
   a CLOSED gold frame with a gold cube flush on the inner LEFT bar, vertically centred, on a 0 0 80 80 box.
   Proportions are the hero's units (frame 2.28 × 2.64, bar 0.18, cube 0.52) scaled to a 64-unit height.
   Same geometry as public/favicon.svg + public/brand/lintejas-logo.svg (tools/logo/build-icons.mjs). */
export default function TheInterlockLogo({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Lintejas"
    >
      <defs>
        <linearGradient id="lg-gold-frame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#F0D882" />
          <stop offset="50%"  stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#8A6A00" />
        </linearGradient>
        <linearGradient id="lg-gold-cube" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#F8E7A8" />
          <stop offset="55%"  stopColor="#E8C766" />
          <stop offset="100%" stopColor="#B8862A" />
        </linearGradient>
      </defs>

      {/* Closed frame (outer 55.27 × 64, bar 4.36) */}
      <path
        d="M12.364 8h55.273v64H12.364Z M16.727 12.364v55.273h46.545V12.364Z"
        fill="url(#lg-gold-frame)"
        fillRule="evenodd"
      />

      {/* Cube — flush on the inner left bar, vertically centred */}
      <rect x="16.727" y="33.697" width="12.606" height="12.606" fill="url(#lg-gold-cube)" />
    </svg>
  )
}
