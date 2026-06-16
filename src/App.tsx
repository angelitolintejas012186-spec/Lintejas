import { HashRouter, Routes, Route } from 'react-router-dom'
import { SiteConfigProvider } from './lib/SiteConfigContext'

import NavBar from './components/NavBar'
import Footer from './components/Footer'
import AnnouncementBar from './components/AnnouncementBar'
import SeoManager from './components/SeoManager'
import Analytics from './components/Analytics'

import Home      from './pages/Home'
import About     from './pages/About'
import Companies from './pages/Companies'
import Services  from './pages/Services'
import Contact   from './pages/Contact'

import Login       from './admin/Login'
import AdminLayout from './admin/AdminLayout'
import Dashboard   from './admin/Dashboard'
import Branding    from './admin/Branding'
import Theme       from './admin/Theme'
import Plugins     from './admin/Plugins'
import Settings    from './admin/Settings'
import ProtectedRoute from './admin/ProtectedRoute'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <NavBar />
      <div className="pt-16">{children}</div>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <SiteConfigProvider>
      <SeoManager />
      <Analytics />
      <HashRouter>
        <Routes>
          {/* Public */}
          <Route path="/"          element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about"     element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/companies" element={<PublicLayout><Companies /></PublicLayout>} />
          <Route path="/services"  element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/contact"   element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index            element={<Dashboard />} />
            <Route path="branding"  element={<Branding />} />
            <Route path="theme"     element={<Theme />} />
            <Route path="plugins"   element={<Plugins />} />
            <Route path="settings"  element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </SiteConfigProvider>
  )
}
