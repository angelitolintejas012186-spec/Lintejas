import { useState, useEffect } from 'react'

/**
 * Returns true when the browser tab is hidden (user switched tabs / minimised).
 * Use this to pause RAF loops and animations so they don't burn CPU in the background.
 */
export function useVisibilityPause(): boolean {
  const [hidden, setHidden] = useState<boolean>(
    () => typeof document !== 'undefined' ? document.hidden : false
  )

  useEffect(() => {
    const handler = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])

  return hidden
}
