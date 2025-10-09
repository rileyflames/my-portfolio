/**
 * Main App Component
 * 
 * SECURITY ARCHITECTURE:
 * 
 * 1. SEPARATE LAYOUTS:
 *    - PublicLayout: For public pages (Home, About, Projects, Contact)
 *    - AdminLayout: For admin pages (Dashboard, Project Management)
 *    - This prevents admin UI from leaking into public pages
 * 
 * 2. HIDDEN ADMIN LOGIN:
 *    - Admin login is at /admin/login (not /login)
 *    - NOT linked from any public navigation
 *    - Only accessible by typing URL directly
 *    - This reduces attack surface by hiding admin access
 * 
 * 3. ROUTE PROTECTION:
 *    - All /admin/* routes wrapped in ProtectedRoute
 *    - Verifies JWT token before rendering
 *    - Redirects to /admin/login if not authenticated
 *    - Checks user role for RBAC
 * 
 * 4. LAZY LOADING:
 *    - Admin components loaded separately from public app
 *    - Reduces initial bundle size
 *    - Admin code not downloaded by public visitors
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public Layout and Pages (loaded immediately)
import PublicLayout from './layouts/PublicLayout'
import Hero from './components/Hero'
import Contact from './pages/Contact'
import AboutPage from './pages/public/AboutPage'
import ProjectsPage from './pages/public/ProjectsPage'
import ProjectDetailPage from './pages/public/ProjectDetailPage'
import SkillsPage from './pages/public/SkillsPage'

// Admin Pages (lazy loaded - only downloaded when needed)
// This keeps admin code separate from public bundle
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboardTabs = lazy(() => import('./pages/AdminDashboardTabs'))
const ProjectForm = lazy(() => import('./pages/ProjectFormWithImages'))

/**
 * Loading component shown while lazy-loaded components are downloading
 */
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* 
              PUBLIC ROUTES - Use PublicLayout
              These pages are accessible to everyone
              No authentication required
            */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Hero />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* 
              ADMIN LOGIN ROUTE - Hidden, not linked from public pages
              SECURITY: Only accessible by typing /admin/login directly
              This is intentionally not in any layout to keep it isolated
            */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 
              PROTECTED ADMIN ROUTES - Use AdminLayout
              SECURITY: All routes wrapped in ProtectedRoute
              - Requires valid JWT token
              - Requires ADMIN role
              - Redirects to /admin/login if not authenticated
            */}
            <Route
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/projects" element={<AdminDashboardTabs />} />
              <Route path="/admin/projects/new" element={<ProjectForm />} />
              <Route path="/admin/projects/edit/:id" element={<ProjectForm />} />
            </Route>
          </Routes>
        </Suspense>

        {/* Toast notifications for success/error messages */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Router>
    </AuthProvider>
  )
}

export default App
