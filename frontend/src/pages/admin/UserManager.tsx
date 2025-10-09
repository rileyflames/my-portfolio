// User Management page (Admin only)
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../../lib/axios-client'
import { useAuth } from '../../contexts/AuthContext'

/**
 * User interface
 */
interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR'
  createdAt: string
}

/**
 * User form data interface
 */
interface UserFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'ADMIN' | 'EDITOR'
}

/**
 * UserManager Component
 * - View all users
 * - Create new users (replaces public registration)
 * - Update user roles
 * - Delete users
 * - Admin only access
 */
const UserManager = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UserFormData>({
    defaultValues: {
      role: 'EDITOR'
    }
  })

  // Watch password for confirmation validation
  const password = watch('password')

  /**
   * Fetch all users
   */
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const result = await graphqlQuery(`
        query GetUsers {
          users {
            id
            name
            email
            role
            createdAt
          }
        }
      `)
      setUsers(result.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  /**
   * Handle create user form submission
   */
  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true)

    try {
      await graphqlMutation(
        `
          mutation CreateUser($input: CreateUserInput!) {
            createUser(createUserInput: $input) {
              id
              name
              email
              role
            }
          }
        `,
        {
          input: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role
          }
        }
      )

      toast.success('User created successfully!')
      setShowForm(false)
      reset()
      fetchUsers()
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast.error(error.message || 'Failed to create user')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle delete user
   */
  const handleDelete = async (userId: string, userName: string) => {
    // Prevent deleting yourself
    if (userId === currentUser?.id) {
      toast.error('You cannot delete your own account')
      return
    }

    if (!confirm(`Delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await graphqlMutation(
        `
          mutation DeleteUser($id: String!) {
            deleteUser(id: $id)
          }
        `,
        { id: userId }
      )

      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  /**
   * Get role badge color
   */
  const getRoleBadge = (role: string) => {
    return role === 'ADMIN' 
      ? 'bg-purple-600/30 text-purple-200 border border-purple-400/30' 
      : 'bg-blue-600/30 text-blue-200 border border-blue-400/30'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            reset({ name: '', email: '', password: '', confirmPassword: '', role: 'EDITOR' })
          }}
          className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all"
        >
          + Add User
        </button>
      </div>

      {/* Create User Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New User</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Minimum 8 characters"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                {...register('role', { required: 'Role is required' })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="EDITOR">Editor (Limited Access)</option>
                <option value="ADMIN">Admin (Full Access)</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Admins have full access. Editors can create and edit content.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold ${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  reset()
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:bg-gray-900 transition-colors">
                  {/* User Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                          {user.id === currentUser?.id && (
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(You)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{user.email}</div>
                  </td>

                  {/* Role Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.id !== currentUser?.id ? (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{users.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Admins</div>
          <div className="text-2xl font-bold text-purple-400">
            {users.filter(u => u.role === 'ADMIN').length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Editors</div>
          <div className="text-2xl font-bold text-blue-400">
            {users.filter(u => u.role === 'EDITOR').length}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManager
