import { useState, useEffect } from 'react'

/**
 * Reactive media-query hook (SSR-safe; client-only app so window is present).
 * Seeded synchronously from matchMedia → correct on first paint (no flash / CLS),
 * and updates when the query flips (e.g. resize across the breakpoint).
 *
 * Used to render the ProductDeck exactly ONCE per breakpoint: only the active
 * slot is mounted, so the inactive layout never mounts the deck (no autoplay,
 * no timers, no second IntersectionObserver, not in the tab order).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}
