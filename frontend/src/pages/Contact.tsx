// Contact page - The Odin Project Style
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlMutation } from '../lib/axios-client'
import { Mail, MapPin, Send } from 'lucide-react'

interface ContactFormData {
  fullName: string
  email: string
  city: string
  subject: string
  messageDescription: string
}

const Contact = () => {
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
      await graphqlMutation(
        `
          mutation CreateMessage($input: CreateMessageInput!) {
            createMessage(input: $input) {
              id
              fullName
              email
              city
              subject
              messageDescription
              createdAt
            }
          }
        `,
        {
          input: {
            fullName: data.fullName,
            email: data.email,
            city: data.city,
            subject: data.subject,
            messageDescription: data.messageDescription
          }
        }
      )
      
      toast.success('Message sent successfully! I\'ll get back to you soon.')
      reset()
      
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question or want to work together? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                Email Me
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Send me a message and I'll respond as soon as possible.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                Location
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Available for remote opportunities worldwide.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      {...register('fullName', { required: 'Name is required', minLength: 2 })}
                      className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-500">{String(errors.fullName.message)}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email', { required: 'Email is required', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                      className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{String(errors.email.message)}</p>}
                  </div>
                </div>

                {/* City */}
                <div className="mt-6">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    {...register('city', { required: 'City is required', minLength: 2 })}
                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                    placeholder="New York"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{String(errors.city.message)}</p>}
                </div>

                {/* Subject */}
                <div className="mt-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register('subject', { required: 'Subject is required', minLength: 5 })}
                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent ${errors.subject ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                    placeholder="Project Inquiry"
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-500">{String(errors.subject.message)}</p>}
                </div>

                {/* Message */}
                <div className="mt-6">
                  <label htmlFor="messageDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="messageDescription"
                    rows={6}
                    {...register('messageDescription', { required: 'Message is required', minLength: 10 })}
                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent resize-y ${errors.messageDescription ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                    placeholder="Tell me about your project..."
                  />
                  {errors.messageDescription && <p className="mt-1 text-sm text-red-500">{String(errors.messageDescription.message)}</p>}
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-8 py-4 rounded-lg text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Fields marked with <span className="text-red-500">*</span> are required.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
