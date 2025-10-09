/**
 * Admin Layout Component
 * 
 * PURPOSE: Wraps all admin pages (Dashboard, Project Management)
 * 
 * SECURITY FEATURES:
 * - Only renders after authentication is verified
 * - Separate from public layout to prevent leaking admin UI
 * - Includes admin-specific navigation
 * - Shows user info and logout button
 * 
 * WHY SEPARATE LAYOUTS?
 * - Keeps admin UI completely isolated from public site
 * - Prevents accidental exposure of admin features
 * - Allows different styling/navigation for admin area
 * - Makes it easier to lazy-load admin code
 */

import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import fireGif from '../assets/icon.gif'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/') // Redirect to home after logout
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black font-montserrat">
      {/* Admin Navigation Bar - Dark theme matching public site */}
      <nav className="bg-black/20 border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm backdrop-saturate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Admin Brand */}
            <div className="flex items-center space-x-8">
              <Link 
                to="/admin/projects" 
                className="flex items-center space-x-2"
              >
                <div className="flex items-center gap-1 transition-all duration-200 hover:scale-105">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                    <img src={fireGif} alt="fire" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-2xl font-bold text-red-500">AM</span>
                </div>
                <span className="text-xl font-bold text-white">Admin Panel</span>
              </Link>

              {/* Admin Navigation Links */}
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/admin/projects"
                  className="px-4 py-2 text-base font-medium text-white hover:text-purple-400 transition-colors"
                >
                  Projects
                </Link>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              {/* User Badge */}
              <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.role}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white hover:text-red-400 font-medium transition-colors"
              >
                Logout
              </button>

              {/* View Public Site */}
              <Link
                to="/"
                className="px-5 py-2 text-base font-semibold text-white border-2 border-white/30 hover:bg-purple-600 hover:border-purple-600 rounded-lg transition-all duration-200"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Page Content - Dark background */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
