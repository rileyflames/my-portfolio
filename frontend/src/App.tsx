// Main App component that sets up routing for our portfolio website
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboardTabs from './pages/AdminDashboardTabs'
import ProjectForm from './pages/ProjectForm'
import AboutPage from './pages/public/AboutPage'
import ProjectsPage from './pages/public/ProjectsPage'
import TechnologiesPage from './pages/public/TechnologiesPage'

/**
 * Main App Component
 * - Configures React Router for navigation between pages
 * - Wraps app in AuthProvider for authentication
 * - Protects admin routes with authentication
 * - Includes toast notifications for user feedback
 * - Provides consistent layout with navigation bar
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-montserrat flex flex-col">
          {/* Navigation bar appears on all pages */}
          <Navbar />
          
          {/* Routes define which component to show for each URL path */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/technologies" element={<TechnologiesPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected admin routes - require authentication */}
            <Route 
              path="/admin/projects" 
              element={
                <ProtectedRoute>
                  <AdminDashboardTabs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/projects/new" 
              element={
                <ProtectedRoute>
                  <ProjectForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/projects/edit/:id" 
              element={
                <ProtectedRoute>
                  <ProjectForm />
                </ProtectedRoute>
              } 
            />
          </Routes>
          
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
          
          {/* Footer appears on all pages */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
