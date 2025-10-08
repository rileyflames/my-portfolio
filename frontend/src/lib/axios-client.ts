// Axios client configuration for GraphQL API calls
import axios from 'axios'

/**
 * Axios instance configured for GraphQL requests
 * - Base URL points to backend GraphQL endpoint
 * - Default headers set for JSON content
 * - Credentials included for authentication
 */
const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
})

/**
 * Request interceptor to add auth token to all requests
 * - Reads token from localStorage
 * - Adds Authorization header if token exists
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor to handle auth errors
 * - Redirects to login on 401 Unauthorized
 * - Clears auth data on token expiration
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

/**
 * Helper function to make GraphQL queries
 * @param query - GraphQL query string
 * @param variables - Optional variables for the query
 * @returns Promise with the response data
 */
export const graphqlQuery = async (query: string, variables?: any) => {
  try {
    const response = await axiosClient.post('', {
      query,
      variables,
    })

    // Check for GraphQL errors
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }

    return response.data.data
  } catch (error) {
    // Re-throw axios errors or GraphQL errors
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message)
    }
    throw error
  }
}

/**
 * Helper function to make GraphQL mutations
 * @param mutation - GraphQL mutation string
 * @param variables - Variables for the mutation
 * @returns Promise with the response data
 */
export const graphqlMutation = async (mutation: string, variables?: any) => {
  try {
    const response = await axiosClient.post('', {
      query: mutation,
      variables,
    })

    // Check for GraphQL errors
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }

    return response.data.data
  } catch (error) {
    // Re-throw axios errors or GraphQL errors
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message)
    }
    throw error
  }
}

export default axiosClient