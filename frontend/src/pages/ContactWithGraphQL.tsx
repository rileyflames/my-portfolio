// Contact page with GraphQL integration
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// Import Apollo Client hooks and gql
import { useMutation, gql } from '@apollo/client'

/**
 * GraphQL mutation to create a new message
 * This matches the Message entity structure from your backend
 */
const CREATE_MESSAGE = gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(createMessageInput: $input) {
      id
      fullName
      email
      city
      subject
      messageDescription
      createdAt
    }
  }
`

/**
 * TypeScript interface for form data
 * Matches the required fields from your Message entity
 */
interface ContactFormData {
  fullName: string
  email: string
  city: string
  subject: string
  messageDescription: string
}

/**
 * Contact Page Component with GraphQL
 * - Displays a contact form for visitors to send messages
 * - Uses React Hook Form for form validation and handling
 * - Sends data to backend via GraphQL mutation
 * - Shows success/error messages using toast notifications
 */
const ContactWithGraphQL = () => {
  // State to track if form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // React Hook Form setup with validation rules
  const {
    register, // Function to register form inputs
    handleSubmit, // Function to handle form submission
    formState: { errors }, // Object containing validation errors
    reset // Function to reset form after successful submission
  } = useForm<ContactFormData>()
  
  // Apollo GraphQL mutation hook
  const [createMessage] = useMutation(CREATE_MESSAGE, {
    // Called when mutation completes successfully
    onCompleted: (data: any) => {
      console.log('Message sent successfully:', data)
      toast.success('Message sent successfully! I\'ll get back to you soon.')
      reset() // Clear the form
      setIsSubmitting(false)
    },
    // Called when mutation fails
    onError: (error: any) => {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
      setIsSubmitting(false)
    }
  })
  
  /**
   * Form submission handler
   * @param data - Form data that matches ContactFormData interface
   */
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Execute the GraphQL mutation with form data
      await createMessage({
        variables: {
          input: {
            fullName: data.fullName,
            email: data.email,
            city: data.city,
            subject: data.subject,
            messageDescription: data.messageDescription
          }
        }
      })
    } catch (error) {
      // Error handling is done in the onError callback above
      console.error('Submission error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? 
            I'd love to hear from you. Send me a message and I'll get back to you as soon as possible.
          </p>
        </div>
        
        {/* Contact form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Full Name field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                {...register('fullName', { 
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 100, message: 'Name must be less than 100 characters' }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {/* Show validation error if exists */}
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>
            
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            {/* City field */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                {...register('city', { 
                  required: 'City is required',
                  minLength: { value: 2, message: 'City must be at least 2 characters' },
                  maxLength: { value: 100, message: 'City must be less than 100 characters' }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>
            
            {/* Subject field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                {...register('subject', { 
                  required: 'Subject is required',
                  minLength: { value: 5, message: 'Subject must be at least 5 characters' },
                  maxLength: { value: 200, message: 'Subject must be less than 200 characters' }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="What's this about?"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>
            
            {/* Message Description field */}
            <div>
              <label htmlFor="messageDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="messageDescription"
                rows={6}
                {...register('messageDescription', { 
                  required: 'Message is required',
                  minLength: { value: 10, message: 'Message must be at least 10 characters' },
                  maxLength: { value: 2000, message: 'Message must be less than 2000 characters' }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical ${
                  errors.messageDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tell me about your project, question, or just say hello..."
              />
              {errors.messageDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.messageDescription.message}</p>
              )}
            </div>
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all duration-200 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:transform hover:scale-105 shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Additional contact information */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Prefer a different way to connect?
          </p>
          <div className="flex justify-center space-x-6">
            {/* You can add actual contact links here */}
            <span className="text-blue-600 font-medium">your@example.com</span>
            <span className="text-gray-400">|</span>
            <span className="text-blue-600 font-medium">LinkedIn</span>
            <span className="text-gray-400">|</span>
            <span className="text-blue-600 font-medium">GitHub</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactWithGraphQL