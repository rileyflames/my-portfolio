// Protected Route component for authentication guard
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * ProtectedRoute Component
 * - Wraps routes that require authentication
 * - Redirects to login if not authenticated
 * - Shows loading state while checking auth
 * - Optionally checks for specific roles
 */
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'EDITOR'
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-600 text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
            {requiredRole && ` This page requires ${requiredRole} role.`}
          </p>
          <p className="text-sm text-gray-500">
            Your role: <span className="font-medium">{user?.role}</span>
          </p>
        </div>
      </div>
    )
  }

  // User is authenticated and has required role
  return <>{children}</>
}

export default ProtectedRoute