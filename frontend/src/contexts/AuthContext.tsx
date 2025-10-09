// Authentication Context for managing user state and auth operations
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { graphqlMutation } from '../lib/axios-client'
import toast from 'react-hot-toast'

/**
 * User interface matching backend User entity
 */
interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR'
}

/**
 * Auth context value interface
 */
interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

/**
 * Create the auth context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider Component
 * - Manages authentication state
 * - Provides login/logout functions
 * - Persists auth state in localStorage
 * - Automatically loads user on mount
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Load user from localStorage on mount
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error loading auth state:', error)
        // Clear invalid data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }

    setIsLoading(false)
  }, [])

  /**
   * Login function
   * - Calls backend login mutation
   * - Stores token and user in state and localStorage
   * - Shows success/error messages
   */
  const login = async (email: string, password: string) => {
    try {
      const result = await graphqlMutation(
        `
          mutation Login($input: LoginInput!) {
            login(input: $input) {
              access_token
              user {
                id
                name
                email
                role
              }
            }
          }
        `,
        {
          input: { email, password }
        }
      )

      const { access_token, user: userData } = result.login

      // Store in state
      setToken(access_token)
      setUser(userData)

      // Persist in localStorage
      localStorage.setItem('auth_token', access_token)
      localStorage.setItem('auth_user', JSON.stringify(userData))

      toast.success(`Welcome back, ${userData.name}!`)
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed. Please check your credentials.')
      throw error
    }
  }

  /**
   * Logout function
   * - Clears state and localStorage
   * - Shows success message
   */
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    toast.success('Logged out successfully')
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to use auth context
 * - Throws error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}