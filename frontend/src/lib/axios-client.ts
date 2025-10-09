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

    // Check for GraphQL errors - check if it's an array first
    const errors = response?.data?.errors
    if (Array.isArray(errors) && errors.length > 0) {
      const errorMessage = errors[0]?.message || 'GraphQL error occurred'
      throw new Error(errorMessage)
    }

    return response?.data?.data
  } catch (error) {
    // Log the actual error for debugging
    console.error('GraphQL Query Error:', error)
    
    // Re-throw axios errors or GraphQL errors
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || 'Network error occurred'
      throw new Error(errorMessage)
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
    // Validate variables - be defensive against null/undefined values
    if (variables && typeof variables === 'object') {
      Object.keys(variables).forEach(key => {
        const val = variables[key]
        // Warn if we expected an array/list but got null
        if ((key.includes('images') || key.includes('tags') || key.includes('Ids')) && val == null) {
          console.warn(`⚠️ Variable "${key}" is ${val}. Consider using empty array [] instead.`)
        }
        // If it's an array, we can safely inspect length
        if (Array.isArray(val)) {
          // no-op, just ensures we don't try to read .length on null
          void val.length
        }
      })
    }

    const response = await axiosClient.post('', {
      query: mutation,
      variables,
    })

    // Check for GraphQL errors - check if it's an array first
    const errors = response?.data?.errors
    if (Array.isArray(errors) && errors.length > 0) {
      const errorMessage = errors[0]?.message || 'GraphQL error occurred'
      throw new Error(errorMessage)
    }

    return response?.data?.data
  } catch (error) {
    // Log the actual error for debugging
    console.error('GraphQL Mutation Error:', error)
    
    // Re-throw axios errors or GraphQL errors
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || 'Network error occurred'
      throw new Error(errorMessage)
    }
    throw error
  }
}

/**
 * Helper function to upload files via GraphQL
 * Uses multipart/form-data format required by GraphQL Upload
 * @param mutation - GraphQL mutation string
 * @param file - File object to upload
 * @param variableName - Name of the file variable in the mutation (default: 'file')
 * @returns Promise with the response data
 */
export const graphqlFileUpload = async (
  mutation: string,
  file: File,
  variableName: string = 'file'
) => {
  try {
    const formData = new FormData()
    
    // GraphQL multipart request format
    const operations = JSON.stringify({
      query: mutation,
      variables: {
        [variableName]: null
      }
    })
    
    const map = JSON.stringify({
      '0': [`variables.${variableName}`]
    })
    
    formData.append('operations', operations)
    formData.append('map', map)
    formData.append('0', file)
    
    const token = localStorage.getItem('auth_token')
    const headers: any = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    const response = await axios.post('http://localhost:3000/graphql', formData, {
      headers,
      withCredentials: true,
    })

    // Check for GraphQL errors
    const errors = response?.data?.errors
    if (Array.isArray(errors) && errors.length > 0) {
      throw new Error(errors[0]?.message || 'Upload error occurred')
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
