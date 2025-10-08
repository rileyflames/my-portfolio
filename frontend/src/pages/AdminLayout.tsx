// Admin Layout with navigation tabs
import { Link, Outlet, useLocation } from 'react-router-dom'

/**
 * AdminLayout Component
 * - Provides consistent layout for all admin pages
 * - Navigation tabs for different admin sections
 * - Responsive design
 */
const AdminLayout = () => {
  const location = useLocation()

  /**
   * Check if a tab is active
   */
  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  /**
   * Tab configuration
   */
  const tabs = [
    { name: 'Projects', path: '/admin/projects', icon: '📁' },
    { name: 'About Me', path: '/admin/about', icon: '👤' },
    { name: 'Technologies', path: '/admin/technologies', icon: '💻' },
    { name: 'Social Media', path: '/admin/social', icon: '🔗' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your portfolio content
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(tab.path)
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout