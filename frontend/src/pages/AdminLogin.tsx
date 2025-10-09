/**
 * Admin Login Page
 * 
 * SECURITY FEATURES:
 * - Hidden route: Not linked from public navigation
 * - Only accessible by typing /admin/login directly
 * - Rate limited on backend (5 attempts per 60 seconds)
 * - JWT token stored securely in localStorage
 * - Redirects to admin dashboard after successful login
 * 
 * WHY THIS IS SECURE:
 * - No public links means attackers must know the URL exists
 * - Rate limiting prevents brute-force password attacks
 * - JWT tokens expire after 24 hours
 * - Failed login attempts don't reveal if email exists
 */

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { Lock, Mail, AlertCircle } from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
}

const AdminLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get the page user was trying to access (or default to admin dashboard)
  const from = (location.state as any)?.from?.pathname || '/admin/projects'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  /**
   * Handle login form submission
   * 
   * SECURITY FLOW:
   * 1. Send credentials to backend
   * 2. Backend validates and returns JWT token
   * 3. Token stored in localStorage
   * 4. User redirected to admin area
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)

    try {
      // Call login function from AuthContext
      // This sends credentials to backend and stores JWT token
      await login(data.email, data.password)
      
      // Redirect to the page they were trying to access
      navigate(from, { replace: true })
    } catch (error) {
      // Error is already handled in AuthContext with toast
      console.error('Login failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto" style={{ maxWidth: '400px' }}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg mb-3">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Admin Access
          </h2>
          <p className="text-sm text-gray-400">
            Secure login for authorized personnel only
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-5">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-200">
              <p className="font-medium mb-0.5">Security Notice</p>
              <p className="text-yellow-300/80">
                This area is restricted. All login attempts are logged and monitored.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-5 border border-white/20" style={{ width: '100%', maxWidth: '400px' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" style={{ width: '100%' }}>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-white placeholder-gray-400 text-sm ${
                    errors.email ? 'border-red-500' : 'border-white/30'
                  }`}
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-white placeholder-gray-400 text-sm ${
                    errors.password ? 'border-red-500' : 'border-white/30'
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-6 rounded-lg text-white font-semibold text-base transition-all ${
                isSubmitting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 hover:transform hover:scale-105 shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Back to Home - subtle link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
