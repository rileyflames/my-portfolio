// About Me admin page for managing personal information
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { graphqlQuery, graphqlMutation } from '../lib/axios-client'

/**
 * AboutMe interface
 */
interface AboutMe {
  id: string
  fullName: string
  dob: string
  startedCoding: string
  bio: string
  imageUrl?: string
  technologies?: Array<{ id: string; name: string }>
  social?: Array<{ id: string; name: string; link: string }>
}

/**
 * Form data interface
 */
interface AboutMeFormData {
  fullName: string
  dob: string
  startedCoding: string
  bio: string
  imageUrl?: string
}

/**
 * AboutMeAdmin Component
 * - Manage personal information
 * - Create or update About Me section
 * - Single record (singleton pattern)
 */
const AboutMeAdmin = () => {
  const [aboutMe, setAboutMe] = useState<AboutMe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AboutMeFormData>()

  /**
   * Fetch About Me data
   */
  const fetchAboutMe = async () => {
    setIsLoading(true)
    try {
      const result = await graphqlQuery(`
        query GetAboutMe {
          aboutMe {
            id
            fullName
            dob
            startedCoding
            bio
            imageUrl
            technologies {
              id
              name
            }
            social {
              id
              name
              link
            }
          }
        }
      `)

      if (result.aboutMe) {
        setAboutMe(result.aboutMe)
        setIsEditMode(true)
        // Populate form
        reset({
          fullName: result.aboutMe.fullName,
          dob: result.aboutMe.dob,
          startedCoding: result.aboutMe.startedCoding,
          bio: result.aboutMe.bio,
          imageUrl: result.aboutMe.imageUrl || '',
        })
      }
    } catch (error) {
      console.error('Error fetching about me:', error)
      toast.error('Failed to load about me data')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle form submission
   */
  const onSubmit = async (data: AboutMeFormData) => {
    setIsSubmitting(true)

    try {
      if (isEditMode) {
        // Update existing
        const result = await graphqlMutation(
          `
            mutation UpdateAboutMe($input: UpdateAboutMeInput!) {
              updateAboutMe(input: $input) {
                id
                fullName
                dob
                startedCoding
                bio
                imageUrl
              }
            }
          `,
          {
            input: {
              fullName: data.fullName,
              dob: data.dob,
              startedCoding: data.startedCoding,
              bio: data.bio,
              imageUrl: data.imageUrl || null,
            }
          }
        )
        setAboutMe(result.updateAboutMe)
        toast.success('About Me updated successfully!')
      } else {
        // Create new
        const result = await graphqlMutation(
          `
            mutation CreateAboutMe($input: CreateAboutMeInput!) {
              createAboutMe(input: $input) {
                id
                fullName
                dob
                startedCoding
                bio
                imageUrl
              }
            }
          `,
          {
            input: {
              fullName: data.fullName,
              dob: data.dob,
              startedCoding: data.startedCoding,
              bio: data.bio,
              imageUrl: data.imageUrl || null,
            }
          }
        )
        setAboutMe(result.createAboutMe)
        setIsEditMode(true)
        toast.success('About Me created successfully!')
      }
    } catch (error: any) {
      console.error('Error saving about me:', error)
      toast.error(error.message || 'Failed to save about me')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Delete About Me
   */
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your About Me information?')) {
      return
    }

    try {
      await graphqlMutation(`
        mutation DeleteAboutMe {
          deleteAboutMe
        }
      `)

      setAboutMe(null)
      setIsEditMode(false)
      reset({
        fullName: '',
        dob: '',
        startedCoding: '',
        bio: '',
        imageUrl: '',
      })
      toast.success('About Me deleted successfully')
    } catch (error) {
      console.error('Error deleting about me:', error)
      toast.error('Failed to delete about me')
    }
  }

  useEffect(() => {
    fetchAboutMe()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
        <p className="text-gray-600 mt-1">
          Manage your personal information and biography
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              {...register('fullName', { required: 'Full name is required' })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Anthony M M"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              id="dob"
              {...register('dob', { required: 'Date of birth is required' })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dob ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dob && (
              <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
            )}
          </div>

          {/* Started Coding */}
          <div>
            <label htmlFor="startedCoding" className="block text-sm font-medium text-gray-700 mb-2">
              Started Coding *
            </label>
            <input
              type="date"
              id="startedCoding"
              {...register('startedCoding', { required: 'Started coding date is required' })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.startedCoding ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startedCoding && (
              <p className="mt-1 text-sm text-red-600">{errors.startedCoding.message}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              {...register('imageUrl')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Biography *
            </label>
            <textarea
              id="bio"
              rows={8}
              {...register('bio', { 
                required: 'Biography is required',
                minLength: { value: 50, message: 'Bio must be at least 50 characters' }
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell your story..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
            </button>
            
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 border border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Preview */}
      {aboutMe && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="space-y-4">
            {aboutMe.imageUrl && (
              <img
                src={aboutMe.imageUrl}
                alt={aboutMe.fullName}
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-lg font-medium">{aboutMe.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Biography</p>
              <p className="text-gray-800">{aboutMe.bio}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AboutMeAdmin