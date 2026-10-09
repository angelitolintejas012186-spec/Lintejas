import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.tsx'

/* Error monitoring — errors only (no tracing, no replay, no session pings), production builds only,
   no PII: stack traces + page URL/browser only. Uncaught errors are reported by the default global handlers. */
Sentry.init({
  dsn: 'https://d5a4dffb50a2deb68eb385b31408e2e6@o4512209713430528.ingest.de.sentry.io/4512209736958032',
  enabled: import.meta.env.PROD,
  environment: 'production',
  // SDK v11 replaced `sendDefaultPii` with per-category dataCollection (defaults collect) — all off here
  dataCollection: {
    userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false,
    stackFrameVariables: false, genAI: { inputs: false, outputs: false }, graphQL: { document: false, variables: false },
  },
  tracesSampleRate: 0,
  integrations: (defaults) => defaults.filter((i) => i.name !== 'BrowserSession'),
  ignoreErrors: [
    /ResizeObserver loop (limit exceeded|completed with undelivered notifications)/,   // benign layout warning
    /AbortError/,                                                                         // cancelled fetch/media
    /The (operation|user) aborted/,
    /^Script error\.?$/,                                                                  // opaque cross-origin script
    /Non-Error promise rejection captured/,
  ],
  denyUrls: [/^(chrome|moz|safari(-web)?)-extension:\/\//],                               // browser extensions
  // "Error creating WebGL context" that a fallback already handled (hero Guard → tag `hero`, background
  // SceneGuard → tag `webgl_fallback`) is expected on some phones/in-app browsers: still sent and counted,
  // but as a WARNING, not an error. Untagged (unhandled) WebGL errors and every other error are unchanged.
  beforeSend(event) {
    const msg = (event.exception && event.exception.values && event.exception.values[0] && event.exception.values[0].value) || ''
    const tags = event.tags || {}
    if (/Error creating WebGL context/i.test(msg) && (tags.hero || tags.webgl_fallback)) event.level = 'warning'
    return event
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
