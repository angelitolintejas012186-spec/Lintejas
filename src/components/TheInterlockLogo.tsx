export default function TheInterlockLogo({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="lg-gold-a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#F0D882" />
          <stop offset="50%"  stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#8A6A00" />
        </linearGradient>
        <linearGradient id="lg-gold-b" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="#E8C96C" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>

      {/* Left interlocking bracket */}
      <path
        d="M10 14 L10 66 L32 66 L32 57 L19 57 L19 23 L32 23 L32 14 Z"
        fill="url(#lg-gold-a)"
      />

      {/* Right interlocking bracket (mirrored) */}
      <path
        d="M70 66 L70 14 L48 14 L48 23 L61 23 L61 57 L48 57 L48 66 Z"
        fill="url(#lg-gold-b)"
        opacity="0.80"
      />

      {/* Central interlock bar — sits "through" both brackets */}
      <rect x="32" y="32" width="16" height="16" fill="url(#lg-gold-a)" opacity="0.95" />

      {/* Top connector — links left and right */}
      <rect x="19" y="14" width="42" height="9" fill="url(#lg-gold-a)" opacity="0.30" rx="1" />

      {/* Subtle inner highlight */}
      <rect x="19" y="23" width="9" height="34" fill="url(#lg-gold-b)" opacity="0.15" />
    </svg>
  )
}
