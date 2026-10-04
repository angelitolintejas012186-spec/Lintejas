import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { SiteConfigProvider } from './lib/SiteConfigContext'
import { SmoothScrollProvider } from './lib/SmoothScroll'

import AuroraBackground  from './components/AuroraBackground'
import TechBackground   from './components/background/TechBackground'

const SceneJourney = lazy(() => import('./components/motion/SceneJourney'))
import NavBar           from './components/NavBar'
import Footer           from './components/Footer'
import AnnouncementBar  from './components/AnnouncementBar'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import CookieConsent    from './components/CookieConsent'
import SeoManager       from './components/SeoManager'
import Analytics        from './components/Analytics'

import Home      from './pages/Home'
import About     from './pages/About'
import Companies from './pages/Companies'
import Services  from './pages/Services'
import Contact   from './pages/Contact'
import SkillVue  from './pages/SkillVue'
import NotFound  from './pages/NotFound'

/* B2 (perf): the admin app is lazy so its chunks — notably @dnd-kit (only used by
   admin/Branding) — are code-split OUT of the public entry graph and no longer
   modulepreloaded on the homepage. Public visitors never download admin JS. */
const Login          = lazy(() => import('./admin/Login'))
const AdminLayout    = lazy(() => import('./admin/AdminLayout'))
const Dashboard      = lazy(() => import('./admin/Dashboard'))
const Branding       = lazy(() => import('./admin/Branding'))
const Theme          = lazy(() => import('./admin/Theme'))
const Plugins        = lazy(() => import('./admin/Plugins'))
const Settings       = lazy(() => import('./admin/Settings'))
const ProtectedRoute = lazy(() => import('./admin/ProtectedRoute'))

/* Public shell — wraps all public routes with Lenis + aurora */
function PublicShell() {
  return (
    <SmoothScrollProvider>
      <AuroraBackground />
      <Suspense fallback={null}><SceneJourney /></Suspense>
      <TechBackground />
      <div className="relative" style={{ zIndex: 3 }}>
        {/* Skip-to-content — visible only on keyboard focus */}
        <a href="#main-content" className="skip-link">Skip to content</a>
        <AnnouncementBar />
        <NavBar />
        <main id="main-content" tabIndex={-1} className="pt-[calc(80px+env(safe-area-inset-top))] outline-none">
          <Outlet />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <CookieConsent />
      </div>
    </SmoothScrollProvider>
  )
}

export default function App() {
  return (
    <SiteConfigProvider>
      <SeoManager />
      <Analytics />
      <MotionConfig reducedMotion="user">
      <HashRouter>
        {/* Suspense boundary for the lazy admin routes; public routes are static (never suspend). */}
        <Suspense fallback={null}>
        <Routes>
          {/* Public site */}
          <Route element={<PublicShell />}>
            <Route path="/"          element={<Home />} />
            <Route path="/about"     element={<About />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/services"  element={<Services />} />
            <Route path="/contact"   element={<Contact />} />
            <Route path="/skillvue"  element={<SkillVue />} />
            {/* Unknown public hash routes → branded 404 (keeps nav + footer) */}
            <Route path="*"          element={<NotFound />} />
          </Route>

          {/* Admin (lazy — code-split from the public bundle) */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index           element={<Dashboard />} />
            <Route path="branding" element={<Branding />} />
            <Route path="theme"    element={<Theme />} />
            <Route path="plugins"  element={<Plugins />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        </Suspense>
      </HashRouter>
      </MotionConfig>
    </SiteConfigProvider>
  )
}
