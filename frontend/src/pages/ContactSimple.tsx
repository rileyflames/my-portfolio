// Simple contact page without Apollo Client for testing
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

/**
 * TypeScript interface for form data
 */
interface ContactFormData {
  fullName: string
  email: string
  city: string
  subject: string
  messageDescription: string
}

/**
 * Simple Contact Page Component (without GraphQL for testing)
 */
const ContactSimple = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>()
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      console.log('Form data:', data)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Message sent successfully! (This is a test)')
      reset()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get In Touch (Test Version)
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            This is a test version without GraphQL. The form validation works, 
            but it doesn't connect to the backend yet.
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
                {isSubmitting ? 'Sending Message...' : 'Send Message (Test)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactSimple