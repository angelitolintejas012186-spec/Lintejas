import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { SiteConfigProvider } from './lib/SiteConfigContext'
import { SmoothScrollProvider } from './lib/SmoothScroll'

import AuroraBackground  from './components/AuroraBackground'
import TechBackground   from './components/background/TechBackground'
import NavBar           from './components/NavBar'
import Footer           from './components/Footer'
import AnnouncementBar  from './components/AnnouncementBar'
import SeoManager       from './components/SeoManager'
import Analytics        from './components/Analytics'

import Home      from './pages/Home'
import About     from './pages/About'
import Companies from './pages/Companies'
import Services  from './pages/Services'
import Contact   from './pages/Contact'

import Login          from './admin/Login'
import AdminLayout    from './admin/AdminLayout'
import Dashboard      from './admin/Dashboard'
import Branding       from './admin/Branding'
import Theme          from './admin/Theme'
import Plugins        from './admin/Plugins'
import Settings       from './admin/Settings'
import ProtectedRoute from './admin/ProtectedRoute'

/* Public shell — wraps all public routes with Lenis + aurora */
function PublicShell() {
  return (
    <SmoothScrollProvider>
      <AuroraBackground />
      <TechBackground />
      <div className="relative" style={{ zIndex: 3 }}>
        {/* Skip-to-content — visible only on keyboard focus */}
        <a href="#main-content" className="skip-link">Skip to content</a>
        <AnnouncementBar />
        <NavBar />
        <main id="main-content" tabIndex={-1} className="pt-16 outline-none">
          <Outlet />
        </main>
        <Footer />
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
        <Routes>
          {/* Public site */}
          <Route element={<PublicShell />}>
            <Route path="/"          element={<Home />} />
            <Route path="/about"     element={<About />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/services"  element={<Services />} />
            <Route path="/contact"   element={<Contact />} />
          </Route>

          {/* Admin */}
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
      </HashRouter>
      </MotionConfig>
    </SiteConfigProvider>
  )
}
