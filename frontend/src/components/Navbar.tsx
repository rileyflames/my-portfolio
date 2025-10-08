// Navigation bar component for the portfolio website
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Navbar Component
 * - Provides navigation between different pages
 * - Shows active page with different styling
 * - Displays user info and logout button when authenticated
 * - Responsive design that works on mobile and desktop
 */
const Navbar = () => {
  // useLocation hook gives us the current URL path
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  
  /**
   * Helper function to determine if a navigation link is active
   * @param path - The path to check against current location
   * @returns boolean indicating if the path matches current location
   */
  const isActive = (path: string) => location.pathname === path

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-neutral-300 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand section - Minimalist */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-xl font-bold text-primary hover:text-primary-light transition-colors tracking-tight"
            >
              AM
            </Link>
          </div>
          
          {/* Navigation links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-neutral-600 hover:text-primary'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/about')
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-neutral-600 hover:text-primary'
                }`}
              >
                About
              </Link>
              <Link
                to="/projects"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/projects')
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-neutral-600 hover:text-primary'
                }`}
              >
                Projects
              </Link>
              <Link
                to="/technologies"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/technologies')
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-neutral-600 hover:text-primary'
                }`}
              >
                Technologies
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/contact')
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-neutral-600 hover:text-primary'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* User menu / Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User info - Minimalist */}
                <div className="flex items-center space-x-3 px-4 py-2 bg-accent-cream rounded-lg border border-neutral-300">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-neutral-900">{user?.name}</p>
                    <p className="text-xs text-neutral-500">{user?.role}</p>
                  </div>
                </div>
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors"
              >
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile menu button - you can expand this later for mobile navigation */}
          <div className="md:hidden">
            <Link
              to="/contact"
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-light transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar