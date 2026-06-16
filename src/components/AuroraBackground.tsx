/* Fixed behind the public site. Admin routes don't render this. */
export default function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none">

      {/* ── Aurora orbs ─────────────────────────────────────── */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {/* Primary gold bloom — top centre */}
        <div
          className="absolute rounded-full animate-aurora-1"
          style={{
            width: '70vw',
            height: '70vw',
            top: '-25%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle at center, rgba(212,168,67,0.13) 0%, rgba(154,122,46,0.06) 45%, transparent 70%)',
            filter: 'blur(60px)',
            animationName: 'aurora-1',
            animationDuration: '22s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />

        {/* Deep bronze — bottom left */}
        <div
          className="absolute rounded-full"
          style={{
            width: '55vw',
            height: '55vw',
            bottom: '-10%',
            left: '-15%',
            background: 'radial-gradient(circle at center, rgba(154,122,46,0.10) 0%, transparent 65%)',
            filter: 'blur(80px)',
            animationName: 'aurora-2',
            animationDuration: '28s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />

        {/* Navy-to-midnight — right side depth */}
        <div
          className="absolute rounded-full"
          style={{
            width: '50vw',
            height: '50vw',
            top: '30%',
            right: '-12%',
            background: 'radial-gradient(circle at center, rgba(22,41,74,0.60) 0%, transparent 70%)',
            filter: 'blur(70px)',
            animationName: 'aurora-3',
            animationDuration: '19s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />

        {/* Faint gold mid-page accent */}
        <div
          className="absolute rounded-full"
          style={{
            width: '35vw',
            height: '35vw',
            top: '55%',
            left: '40%',
            background: 'radial-gradient(circle at center, rgba(212,168,67,0.06) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animationName: 'aurora-1',
            animationDuration: '34s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: '-8s',
          }}
        />
      </div>

      {/* ── Film grain overlay ───────────────────────────────── */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 2,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' fill='%23fff' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.032,
          mixBlendMode: 'overlay',
          animationName: 'grain-shift',
          animationDuration: '8s',
          animationTimingFunction: 'steps(10)',
          animationIterationCount: 'infinite',
        }}
      />
    </div>
  )
}
