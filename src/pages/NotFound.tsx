import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import MagneticButton from '../components/ui/MagneticButton'

/* Branded in-app 404 for unknown hash routes (/#/anything-unmatched). Rendered
   inside the public shell, so it keeps the nav, footer and the <main> landmark. */
export default function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    const prev = document.title
    document.title = 'Page not found — Lintejas'
    return () => { document.title = prev }
  }, [])

  return (
    <div className="min-h-screen flex items-center" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-8 py-28 text-center">
        <Reveal>
          <p
            className="font-display font-semibold leading-none select-none mb-6 text-transparent bg-clip-text bg-gold-gradient"
            style={{ fontSize: 'clamp(5rem, 18vw, 10rem)' }}
            aria-hidden="true"
          >
            404
          </p>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl mb-4" style={{ color: 'var(--cream)' }}>
            This page doesn’t exist
          </h1>
          <p className="text-base max-w-md mx-auto mb-9" style={{ color: 'var(--slate)' }}>
            The link may be broken or the page may have moved. Let’s get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton onClick={() => navigate('/')}>
              <span className="inline-flex items-center gap-2 whitespace-nowrap">Back to home <ArrowRight size={15} /></span>
            </MagneticButton>
            <Link
              to="/companies"
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: 'var(--slate)' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--slate)')}
            >
              View our ventures →
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
